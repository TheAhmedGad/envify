import inquirer from 'inquirer'
import chalk from 'chalk'
import { services } from './services.js'
import { Spinner } from '@topcli/spinner'

const envify = {
  run() {
    inquirer
      .prompt([
        {
          type: 'checkbox',
          message: 'Select services',
          name: 'services',
          loop: false,
          choices: Object.keys(services).map(s => ({ name: s })),
          validate(answer) {
            if (answer.length < 1)
              return 'You must choose at least one service.'
            return true
          }
        }
      ])
      .then(async answers => {
        for (const service of answers.services)
          await services[service].prepare()

        inquirer
          .prompt([
            {
              type: 'confirm',
              message: 'Are you sure to continue ?',
              name: 'confirm',
              default: false
            }
          ])
          .then(async answer => {
            if (answer.confirm) {
              const spinner = new Spinner().start(
                chalk.blue('Installing services...')
              )

              for (const service of answers.services)
                await services[service]
                  .handle()
                  .then()
                  .catch(err => {})

              spinner.succeed(
                ` All services installed  (${spinner.elapsedTime.toFixed(2)}ms)`
              )
            }
          })
          .then(async () => {
            for (const service of answers.services)
              await services[service].afterInstall()
          })
      })
  }
}

export { envify }
