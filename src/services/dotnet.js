import runner from '../utils/runner.js'
import { spinner, username } from '../utils/helpers.js'
import inquirer from 'inquirer'
import output from '../utils/output.js'

const dotnet = {
  name: '.Net Core',
  dotnet_version: '8.0',

  async prepare() {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'dotnet_version',
        message: 'Select dotnet version',
        choices: ['8.0', '7.0', '6.0'],
        default: this.dotnet_version
      }
    ])
    this.dotnet_version = answer.dotnet_version
    return this
  },

  async handle() {
    await spinner(
      'Installing .Net Core',
      '.Net Core installed',
      'Failed to install .Net Core',
      async () => {
        const commands = [
          {
            command: `sudo apt-get update`,
            asRoot: true
          },
          {
            command: `sudo apt-get install -y dotnet-sdk-${this.dotnet_version}`,
            asRoot: true
          },
          {
            command: `sudo apt-get install -y aspnetcore-runtime-${this.dotnet_version}`,
            asRoot: true
          }
        ]

        for (const command of commands) {
          command.asRoot
            ? await runner.run(command.command)
            : await runner.as(username).run(command.command)
        }

        return Promise.resolve()
      },
      async error => {
        return Promise.reject(error)
      }
    )
  },

  async afterInstall() {
    output()
      .info('.Net Core installed version: ')
      .success(this.dotnet_version)
      .log()
  }
}

export { dotnet }
