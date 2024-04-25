import inquirer from 'inquirer'
import chalk from 'chalk'
import runner from '../utils/runner.js'
import { Spinner } from '@topcli/spinner'

const php = {
  selected_version: '8.3',

  extensions: {
    fpm: false,
    mbstring: false,
    bcmath: false,
    curl: false,
    json: false,
    mysql: false,
    tokenizer: false,
    xml: false,
    zip: false
  },

  async prepare() {
    await inquirer
      .prompt([
        {
          type: 'list',
          name: 'php_version',
          message: 'Select PHP version',
          choices: ['8.3', '8.2', '8.1', '7.4', '7.3', '7.2', '7.1', '7.0'],
          filter(val) {
            return val.toLowerCase()
          }
        }
      ])
      .then(answer => {
        this.selected_version = answer.php_version
      })
    return this
  },

  async handle() {
    return new Promise((resolve, reject) => {
      const spinner = new Spinner().start(' Installing PHP')
      runner
        .run('sudo add-apt-repository -y ppa:ondrej/php')
        .then(() => {
          runner
            .run('sudo apt update -y')
            .then(() => {
              runner
                .run('sudo apt upgrade -y')
                .then(() => {
                  runner
                    .run(`sudo apt-get -y install php${this.selected_version}`)
                    .then(async () => {
                      spinner.succeed(
                        ` PHP installed (${spinner.elapsedTime.toFixed(2)}ms)`
                      )
                      for (const extension of Object.keys(this.extensions)) {
                        const spinner = new Spinner().start(
                          `   Installing php-${extension} `,
                          { withPrefix: ' - ' }
                        )
                        await runner
                          .run(
                            `sudo apt-get -y install php${this.selected_version}-${extension}`
                          )
                          .then(() => {
                            this.extensions[extension] = true
                            spinner.succeed(
                              `   php-${extension} installed (${spinner.elapsedTime.toFixed(2)}ms)`
                            )
                          })
                          .catch(err => {
                            spinner.failed(`   php-${extension} was not found`)
                          })
                      }
                      resolve()
                    })
                    .catch(err => {
                      spinner.failed('failed to install PHP')
                      reject(err)
                    })
                })
                .catch(err => {
                  spinner.failed('failed to Upgrade ubuntu repos.')
                  reject(err)
                })
            })
            .catch(err => {
              spinner.failed('failed to Update ubuntu repos.')
              reject(err)
            })
        })
        .catch(err => {
          spinner.failed('failed to Add PHP repo.')
          reject(err)
        })
    })
  },
  async afterInstall() {
    console.log(
      chalk.dim('PHP Version: ') + chalk.green(`${this.selected_version}`)
    )

    console.log(
      chalk.dim('installed PHP extensions : ') +
        chalk.green(
          `[${Object.entries(this.extensions)
            .filter(o => o[1] === true)
            .map(o => o[0])
            .join(', ')}]`
        )
    )
  }
}

export { php }
