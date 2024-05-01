import inquirer from 'inquirer'
import chalk from 'chalk'
import { stacks } from './stacks.js'
import { Spinner } from '@topcli/spinner'
import output from './utils/output.js'

const envify = {
  run() {
    inquirer
      .prompt([
        {
          type: 'list',
          message: 'Select services',
          name: 'stack',
          loop: false,
          choices: Object.keys(stacks).map(s => s),
          validate(answer) {
            if (answer.length < 1) return 'You must choose stack.'
            return true
          }
        }
      ])
      .then(async answer => {
        const stack = stacks[answer.stack]
        await stack.collectStackServices()

        for (const service of stack.services) await service.prepare()

        output()
          .success(
            `[${stack.services.map(s => s.name).join(', ')}] will be installed `
          )
          .log()

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
                chalk.blue(`Installing ${stack.name} ...`)
              )

              for (const service of stack.services)
                await service
                  .handle()
                  .then()
                  .catch(err => {})

              spinner.succeed(
                ` All services installed  (${spinner.elapsedTime.toFixed(2)}ms)`
              )

              for (const service of stack.services) await service.afterInstall()
            }
          })
      })
  }
}

export { envify }
