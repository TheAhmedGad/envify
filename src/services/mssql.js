import runner from '../utils/runner.js'
import { spinner, username } from '../utils/helpers.js'
import inquirer from 'inquirer'
import output from '../utils/output.js'

const mssql = {
  license: 'developer',
  sa_password: 'Ro@t2Ro@t',

  async prepare() {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'sa_password',
        message: 'Enter SA password',
        default: this.sa_password,
        validate(answer) {
          //8 chars, uppercase letters, lowercase letters, numbers, and symbols.
          if (answer.length < 8) return 'Password must be at least 8 characters'

          const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          if (!regex.test(answer))
            return 'Password must contains uppercase letters, lowercase letters, numbers, and symbols.'

          return true
        }
      }
    ])
    this.sa_password = answer.sa_password
    return this
  },

  async handle() {
    await spinner(
      'Installing Sql Server',
      'Sql Server installed',
      'Failed to install Sql Server',
      async () => {
        const commands = [
          {
            command: `curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | sudo gpg --batch --yes --dearmor -o /usr/share/keyrings/microsoft-prod.gpg`,
            asRoot: true
          },
          {
            command: `curl https://packages.microsoft.com/keys/microsoft.asc | sudo tee /etc/apt/trusted.gpg.d/microsoft.asc`,
            asRoot: true
          },
          {
            command: `curl -fsSL https://packages.microsoft.com/config/ubuntu/22.04/mssql-server-2022.list | sudo tee /etc/apt/sources.list.d/mssql-server-2022.list`,
            asRoot: true
          },
          {
            command: `curl https://packages.microsoft.com/config/ubuntu/22.04/prod.list | sudo tee /etc/apt/sources.list.d/mssql-release.list`,
            asRoot: true
          },
          {
            command: `apt-get update -y`,
            asRoot: true
          },
          {
            //install
            command: `sudo env ACCEPT_EULA=Y apt-get install -y mssql-server mssql-tools unixodbc-dev mssql-server-fts`,
            asRoot: true
          },
          {
            command: `systemctl stop mssql-server`,
            asRoot: true
          },
          {
            command: `MSSQL_SA_PASSWORD=${this.sa_password} MSSQL_PID=${this.license} /opt/mssql/bin/mssql-conf -n setup accept-eula`,
            asRoot: true
          },
          {
            command: `echo PATH="$PATH:/opt/mssql-tools/bin" >> ~/.bash_profile`,
            asRoot: false
          },
          {
            command: `echo export PATH="$PATH:/opt/mssql-tools/bin" >> ~/.bashrc`,
            asRoot: false
          },
          {
            command: `source ~/.bashrc`,
            asRoot: false
          },
          {
            command: `/opt/mssql/bin/mssql-conf set sqlagent.enabled true`,
            asRoot: true
          },
          {
            command: `systemctl restart mssql-server.service`,
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

  async afterInstall() {}
}

export { mssql }
