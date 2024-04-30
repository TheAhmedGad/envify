import runner from '../utils/runner.js'
import { spinner, username } from '../utils/helpers.js'
import inquirer from 'inquirer'

const mssql = {
  license: 'developer',
  sa_password: 'root',

  async prepare() {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'sa_password',
        message: 'Enter SA password',
        default: this.sa_password,
        validate
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
        //Add Repos to install mssql
        await runner
          .withOutput()
          .run(
            'curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | sudo gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg'
          )

        await runner
          .withOutput()
          .run(
            'curl https://packages.microsoft.com/keys/microsoft.asc | sudo tee /etc/apt/trusted.gpg.d/microsoft.asc'
          )

        await runner
          .withOutput()
          .run(
            'curl -fsSL https://packages.microsoft.com/config/ubuntu/22.04/mssql-server-2022.list | sudo tee /etc/apt/sources.list.d/mssql-server-2022.list'
          )

        await runner.withOutput().run('apt-get update -y')
        await runner.withOutput().run('apt-get install -y mssql-server')

        //Set Mssql License type And SA password
        await runner
          .withOutput()
          .run(
            `MSSQL_SA_PASSWORD=${this.sa_password} MSSQL_PID=${this.license} /opt/mssql/bin/mssql-conf -n setup accept-eula`
          )
        await runner
          .withOutput()
          .run('ACCEPT_EULA=Y apt-get install -y mssql-tools unixodbc-dev')
        await runner
          .as(username)
          .withOutput()
          .run('echo PATH="$PATH:/opt/mssql-tools/bin" >> ~/.bash_profile')
        await runner
          .as(username)
          .withOutput()
          .run(`echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc`)
        await runner.as(username).withOutput().run(`source ~/.bashrc`)
        await runner
          .withOutput()
          .run(`/opt/mssql/bin/mssql-conf set sqlagent.enabled true`)
        await runner.withOutput().run(`apt-get install -y mssql-server-fts`)

        return Promise.resolve()
      },
      async error => {
        console.log(error)
        return Promise.reject(error)
      }
    )
  },

  async afterInstall() {}
}

export { mssql }
