import inquirer from 'inquirer'
import runner from '../utils/runner.js'
import { Spinner } from '@topcli/spinner'
import { formatElapsedTime } from '../utils/helpers.js'
import output from '../utils/output.js'

const mysql = {
  mysql_password: '8.0',

  async prepare() {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'mysql_password',
        message: 'Enter MySQL password',
        default: 'root'
      }
    ])
    this.mysql_password = answer.mysql_password
    return this
  },

  async handle() {
    const spinner = new Spinner().start('Installing MySQL')

    try {
      await runner.run('sudo apt-get -y install mysql-server')
      await runner.run(
        `sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${this.mysql_password}'; FLUSH PRIVILEGES;"`
      )
      spinner.succeed(`MySQL installed ${formatElapsedTime(spinner)}`)
      return Promise.resolve()
    } catch (error) {
      console.error(error)
      spinner.failed('Failed to install MySQL')
      return Promise.reject(error)
    }
  },

  async afterInstall() {
    output()
      .info('MySQL root password set to: ')
      .success(this.mysql_password)
      .log()
  }
}

export { mysql }
