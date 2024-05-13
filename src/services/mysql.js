import inquirer from 'inquirer'
import runner from '../utils/runner.js'
import output from '../utils/output.js'
import { spinner } from '../utils/helpers.js'

const mysql = {
  name: 'MySql',
  mysql_password: (Math.random() + 1).toString(36).substring(2),
  installation_success: true,

  async prepare() {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'mysql_password',
        message: output().primary('Enter MySQL Root Password').string(),
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
      'MySQL already installed',
      async () => {
        await runner.run('sudo apt-get -y install mysql-server')
        await runner.run(
          `sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${this.mysql_password}'; FLUSH PRIVILEGES;"`
        )
      },
      async error => {
        this.installation_success = false
      }
    )
      .then(() => {
        return Promise.resolve()
      })
      .catch(err => {
        return Promise.reject(err)
      })
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
