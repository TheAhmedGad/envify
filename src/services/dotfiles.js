import { existsSync, rmSync } from 'node:fs'
import inquirer from 'inquirer'
import runner from '../utils/runner.js'
import output from '../utils/output.js'
import { URL } from 'url'
import { spinner, username } from '../utils/helpers.js'
const { homedir } = require('os')

const dotfiles = {
  name: 'Dotfiles',
  repositoryType: 'Public',
  dotfilesRepositoryUrl: null,
  linkFiles: false,
  overwriteDirectory: false,
  testConnectionRetries: 3,
  repository: {
    vcsProvider: 'github.com',
    owner: '',
    repo: ''
  },

  async prepare() {
    await this.askForRepositoryType()
    await this.askForRepositoryUrl()
    await this.checkRepositoryDirectory()
    await this.askForLinkDotFilesFilesToHome()

    if (this.repositoryType === 'Private') {
      await this.handlePrivateRepository()
      await this.testConnection()
    }

    return this
  },

  async checkRepositoryDirectory() {
    let cloningPath = `/home/${username}/${this.repository.repo}`

    // Just to handle what shall we do if the cloning path is already exists.
    if (!existsSync(cloningPath)) {
      return
    }

    await inquirer
      .prompt([
        {
          type: 'confirm',
          message: `The ${cloningPath} is already exists, Overwrite?`,
          name: 'overwrite_directory',
          default: false
        }
      ])
      .then(async answer => {
        if (!answer.overwrite_directory) {
          await Promise.reject('Skipped')
        } else {
          this.overwriteDirectory = true
        }
      })
  },

  async handle() {
    await spinner(
      'Installing Dotfiles ...',
      'Dotfiles installed',
      'Failed to install dotfiles',
      async () => {
        await this.cloneRepository()
        return Promise.resolve()
      },
      async error => {
        return Promise.reject(error)
      }
    )
  },

  async askForRepositoryType() {
    const { repositoryType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'repositoryType',
        message: 'Is your dotfiles repository Public or Private?',
        choices: ['Public', 'Private'],
        loop: false,
        default: this.repositoryType
      }
    ])

    this.repositoryType = repositoryType
    return this
  },

  async askForLinkDotFilesFilesToHome() {
    const { linkFiles } = await inquirer.prompt([
      {
        type: 'confirm',
        message:
          'Do you want to link the dotfiles to your home directory after cloning the Repo?',
        name: 'linkFiles',
        default: false
      }
    ])

    if (!linkFiles) {
      return
    }

    this.linkFiles = true
    return this
  },
  async askForRepositoryUrl() {
    const { repositoryUrl } = await inquirer.prompt([
      {
        type: 'input',
        name: 'repositoryUrl',
        message: `Please enter the Git SSH URL of your ${this.repositoryType} dotfiles repository`,
        default: 'git@github.com:theizekry/dotfiles.git',
        validate: value => {
          if (value.trim() === '') {
            return 'Please enter a valid repository URL.'
          }

          // Use regular expressions to validate if input is a valid Git SSH or HTTP URL

          if (this.repositoryType === 'Private') {
            const sshUrlRegex = /^git@github\.com:.+\.git$/

            if (!sshUrlRegex.test(value)) {
              return 'Please enter a valid Git SSH URL (e.g., git@github.com:username/repo.git) as your Repo type is a Private Repo.'
            }
          } else {
            const httpUrlRegex = /^(http|https):\/\/[^ "]+\.git$/

            if (!httpUrlRegex.test(value)) {
              return 'Please enter a valid HTTP URL (e.g., https://github.com/username/repo.git) as your Repo type is a Public Repo.'
            }
          }

          return true
        }
      }
    ])

    this.dotfilesRepositoryUrl = repositoryUrl
    await this.parseUrl()
    return this
  },

  async cloneRepository() {
    let cloningPath = `/home/${username}/${this.repository.repo}`

    if (this.overwriteDirectory && existsSync(cloningPath)) {
      rmSync(cloningPath, { recursive: true, force: true })
    }

    const url = await this.buildUrl()
    await runner
      .as(username)
      .run(
        `GIT_SSH_COMMAND="ssh -i ~/.ssh/envify" git clone ${url} ${cloningPath}`
      )

    if (this.linkFiles) {
      await this.linkFilesToHomeDirectory()
    }
  },

  async linkFilesToHomeDirectory() {
    output().print('Linking Files...')
    output().print(homedir)

    // const command = isFile ? 'ln -s' : 'ln -sT';
    // execSync(`${command} ${source} ${target}`, { stdio: 'inherit' });
  },

  async parseUrl() {
    const url = this.dotfilesRepositoryUrl.startsWith('git@')
      ? 'https://' +
        this.dotfilesRepositoryUrl.replace(':', '/').replace('git@', '')
      : this.dotfilesRepositoryUrl

    const parsedUrl = new URL(url)
    const pathComponents = parsedUrl.pathname.split('/')

    this.repository = {
      vcsProvider: parsedUrl.hostname,
      owner: pathComponents[1],
      repo: pathComponents[2].replace('.git', '')
    }
  },

  async testConnection() {
    await inquirer
      .prompt([
        {
          type: 'confirm',
          message: 'Did you added SSH key in your Dotfiles Repository?',
          name: 'ssh_added',
          default: true
        }
      ])
      .then(async answer => {
        if (!answer.ssh_added) {
          await Promise.reject('Skipped')
        }

        const url = await this.buildUrl()

        // while user answered that he added ssh in his Private repository
        // as this user I can ls-remote repository by the envify ssh key
        // once this command respond successfully this means user machine can talk the git vendor with no issue
        // and the next step we can clone the repository normally.
        await runner
          .as(username)
          .run(`GIT_SSH_COMMAND="ssh -i ~/.ssh/envify" git ls-remote ${url}`)
          .then(() => {})
          .catch(async () => {
            output()
              .error(
                'Could not connect to the repository, please make sure that you added The SSH Correctly and try again.'
              )
              .log()

            if (this.testConnectionRetries > 0) {
              this.testConnectionRetries--
              await this.testConnection()
            } else {
              await Promise.reject('Maximum retries exceeded.')
            }
          })
      })
  },

  async handlePrivateRepository() {
    try {
      // whenever the user select that his dotfiles repository is a Private repo
      // we've to generate ssh key to allow envify to communicate with the git provider.

      // Temp ssh key path.
      let sshPath = `/home/${username}/.ssh/envify`

      // Dumping the path
      output()
        .primary('Generating Temp SSH key [ ')
        .warning(sshPath)
        .primary(' ]')
        .log()

      // handle if the key already exists
      if (!existsSync(sshPath)) {
        await runner
          .as(username)
          .run(`ssh-keygen -t ed25519 -f ${sshPath} -C "Envify" -q -N ""`)
      }

      // Dump the ssh public key to allowing user to take a copy to his dotfiles repository
      const publicKey = await runner.as(username).run(`cat ${sshPath}.pub`)

      output().success(publicKey).log()

      output()
        .bold(
          `Please add this public key to your dotfiles Repository keys to allow Envify to Clone it.`
        )
        .log()
    } catch (error) {
      await Promise.reject(error)
    }
  },

  async buildUrl() {
    // while the clone command depends on the repo type
    // we've to build the url based on the type.

    if (this.repositoryType === 'Private')
      return `git@${this.repository.vcsProvider}:${this.repository.owner}/${this.repository.repo}.git`

    return `https://${this.repository.vcsProvider}/${this.repository.owner}/${this.repository.repo}.git`
  },

  async afterInstall() {}
}

export { dotfiles }
