import inquirer from 'inquirer'
import runner from '../utils/runner.js'
import output from '../utils/output.js'
import { spinner } from '../utils/helpers.js'

const mysql = {
  mysql_password: 'root',
  installation_success: true,

  async prepare() {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'mysql_password',
        message: 'Enter MySQL password',
        default: this.mysql_password
      }
    ])
    this.mysql_password = answer.mysql_password
    return this
  },

  async handle() {
    await spinner(
      'Installing MySQL',
      'MySQL installed',
      'Failed to install MySQL',
      async () => {
        await runner.run('sudo apt-get -y install mysql-server')
        await runner.run(
          `sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${this.mysql_password}'; FLUSH PRIVILEGES;"`
        )
        return Promise.resolve()
      },
      async error => {
        this.installation_success = false
        return Promise.reject(error)
      }
    )
  },

  async afterInstall() {
    if (this.installation_success)
      output()
        .info('MySQL root password set to: ')
        .success(this.mysql_password)
        .log()
  }
}

export { mysql }
