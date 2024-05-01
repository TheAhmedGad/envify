import inquirer from 'inquirer'
import runner from '../utils/runner.js'
import { spinner } from '../utils/helpers.js'
import output from '../utils/output.js'

const php = {
  name: 'PHP',
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
    json: false,
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
    await spinner(
      'Installing PHP',
      'PHP installed',
      'Failed to install PHP',
      async () => {
        await runner.run('sudo add-apt-repository -y ppa:ondrej/php')
        await runner.run('sudo apt update -y')
        await runner.run('sudo apt upgrade -y')
        await runner.run(`sudo apt-get -y install php${this.selectedVersion}`)

        for (const extension of Object.keys(this.extensions)) {
          await spinner(
            ` - Installing php-${extension}`,
            ` - php-${extension} installed`,
            ` - php-${extension} Failed to install! (skipped)`,
            async () => {
              await runner.run(
                `sudo apt-get -y install php${this.selectedVersion}-${extension}`
              )
              this.extensions[extension] = true
            }
          ).catch(error => {})
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
      .success('\n PHP Version: ')
      .info(this.selectedVersion)
      .success(' has been installed with all common Extensions.')
      .log()
  }
}

export { php }
