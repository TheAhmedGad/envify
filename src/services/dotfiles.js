import { existsSync, rmSync } from 'node:fs'
import inquirer from 'inquirer'
import runner from '../utils/runner.js'
import output from '../utils/output.js'
import { URL } from 'url'
import { spinner, username } from '../utils/helpers.js'

const dotfiles = {
  name: 'Dotfiles',
  repositoryType: 'Public',
  dotfilesRepositoryUrl: null,
  moveFilesToHomeDirectoryDirectory: false,
  overwriteDirectory: false,
  repository: {
    vcsProvider: 'github.com',
    owner: '',
    repo: ''
  },

  async prepare() {
    await this.askForRepositoryType()
    await this.askForRepositoryUrl()
    await this.checkRepositoryDirectory()

    // TODO :: Asking for link the downloaded files to the home dir

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

    // TODO :: linking the files or resolve promise
    // .then()
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
        if (answer.ssh_added) {
          const url = await this.buildUrl()
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
              await this.testConnection() // recall
            })
        } else {
          await Promise.reject('Skipped')
        }
      })
  },
  //
  // async moveFilesToHomeDirectory() {
  //   // Link
  //   // if yes move
  //   try {
  //     await runner.run(`git clone ${url} ~/dotfiles`)
  //     return Promise.resolve()
  //   } catch (error) {
  //     return Promise.reject(error)
  //   }
  // },

  async handlePrivateRepository() {
    try {
      let sshPath = `/home/${username}/.ssh/envify`

      output()
        .primary('Generating Temp SSH key [ ')
        .warning(sshPath)
        .primary(' ]')
        .log()

      if (!existsSync(sshPath)) {
        await runner
          .as(username)
          .run(`ssh-keygen -t ed25519 -f ${sshPath} -C "Envify" -q -N ""`)
      }

      const publicKey = await runner.as(username).run(`cat ${sshPath}.pub`)

      output().success(publicKey).log()

      output()
        .bold(
          `Please add this public key to your dotfiles Repository keys to allow Envify to Clone it.`
        )
        .log()
    } catch (error) {
      //spinner.failed('Failed to clone dotfiles repository')
      return Promise.reject(error)
    }
  },

  async buildUrl() {
    if (this.repositoryType === 'Private')
      return `git@${this.repository.vcsProvider}:${this.repository.owner}/${this.repository.repo}.git`

    return `https://${this.repository.vcsProvider}/${this.repository.owner}/${this.repository.repo}.git`
  },

  async afterInstall() {}
}

export { dotfiles }