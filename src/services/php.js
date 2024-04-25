import inquirer from 'inquirer'
import chalk from 'chalk'
import runner from '../utils/runner.js'
import { Spinner } from '@topcli/spinner'
import { formatElapsedTime } from '../utils/helpers.js'

const php = {
  selectedVersion: '8.3',
  extensions: {
    common: false,
    fpm: false,
    mbstring: false,
    bcmath: false,
    curl: false,
    mysql: false,
    tokenizer: false,
    xml: false,
    zip: false,
    gd: false,
    intl: false,
    xsl: false,
    sqlite3: false,
    pdo: false,
    redis: false,
    memcached: false,
    imagick: false,
    apcu: false,
    opcache: false,
    dom: false,
    simplexml: false
  },

  async prepare() {
    const { phpVersion } = await inquirer.prompt([
      {
        type: 'list',
        name: 'phpVersion',
        message: 'Select PHP version',
        choices: [
          '8.3',
          '8.2',
          '8.1',
          '8.0',
          '7.4',
          '7.3',
          '7.2',
          '7.1',
          '7.0'
        ],
        filter(val) {
          return val.toLowerCase()
        },
        loop: false // Disable looping
      }
    ])
    this.selectedVersion = phpVersion
    return this
  },

  async handle() {
    const spinner = new Spinner().start('Installing PHP')
    try {
      await runner.run('sudo add-apt-repository -y ppa:ondrej/php')
      await runner.run('sudo apt update -y')
      await runner.run('sudo apt upgrade -y')
      await runner.run(`sudo apt-get -y install php${this.selectedVersion}`)

      spinner.succeed(
        chalk.bold.green(`PHP installed ${formatElapsedTime(spinner)}`)
      )

      for (const extension of Object.keys(this.extensions)) {
        const extensionSpinner = new Spinner().start(
          `Installing php-${extension}`,
          { withPrefix: ' - ' }
        )
        try {
          await runner.run(
            `sudo apt-get -y install php${this.selectedVersion}-${extension}`
          )
          this.extensions[extension] = true
          extensionSpinner.succeed(
            chalk.greenBright(
              `php-${extension} installed ${formatElapsedTime(extensionSpinner)}`
            )
          )
        } catch (err) {
          extensionSpinner.failed(
            chalk.red(`php-${extension} Failed to install!`)
          )
        }
      }
      return Promise.resolve()
    } catch (err) {
      spinner.failed('Failed to install PHP')
      return Promise.reject(err)
    }
  },

  async afterInstall() {
    console.log(
      chalk.bold.green('\n PHP Version:') +
        chalk.green(
          `${this.selectedVersion} has been installed with all common Extensions.`
        )
    )
  }
}

export { php }
