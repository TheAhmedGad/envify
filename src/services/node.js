import inquirer from 'inquirer'
import runner from '../utils/runner.js'
import output from '../utils/output.js'
import { spinner, username } from '../utils/helpers.js'

const node = {
  name: 'Node.js',
  selected_version: '8.3',

  async prepare() {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'node_version',
        message: 'Select Node.js version (LTS Only)',
        choices: [
          '20.12.2',
          '18.20.2',
          '16.20.2',
          '14.21.3',
          '12.22.12',
          '10.24.1',
          '8.17.0',
          '6.17.1'
        ],
        filter(val) {
          return val.toLowerCase()
        },
        loop: false
      }
    ])
    this.selected_version = answer.node_version
    return this
  },

  async handle() {
    await spinner(
      'Installing Node.js & npm',
      'Node.js & npm installed',
      'Failed to install Node.js',
      async () => {
        await runner
          .as(username)
          .run(
            `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash && source $HOME/.nvm/nvm.sh && nvm install ${this.selected_version} && nvm use ${this.selected_version}`
          )
        return Promise.resolve()
      },
      async error => {
        return Promise.reject(error)
      }
    )
  },

  async afterInstall() {
    output().info('Node Version: ').success(this.selected_version).log()
  }
}

export { node }
