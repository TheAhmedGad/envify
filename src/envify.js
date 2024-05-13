import inquirer from 'inquirer'
import chalk from 'chalk'
import { stacks } from './stacks.js'
import { Spinner } from '@topcli/spinner'
import output from './utils/output.js'
import { formatElapsedTime } from './utils/helpers.js'

const envify = {
  run() {
    inquirer
      .prompt([
        {
          type: 'list',
          message: output().primary('Please Select Your Stack:').string(),
          name: 'stack',
          loop: false,
          choices: Object.keys(stacks.stacks).map(s => s),
          validate(answer) {
            if (answer.length < 1) return 'You must choose stack.'
            return true
          }
        }
      ])
      .then(async answer => {
        const stack = stacks.stacks[answer.stack]
        await stack.collectStackServices()

        for (let index = 0; index < stack.services.length; index++)
          await stack.services[index].prepare().catch(err => {
            stack.services.splice(index, 1)
          })

        if (!stack.services.length) {
          process.exit(0)
        }

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
                chalk.blue(` Installing ${stack.name} ...`)
              )

              for (const service of stack.services)
                await service
                  .handle()
                  .then()
                  .catch(err => {})

              spinner.succeed(
                `Process Completed ${formatElapsedTime(spinner)} \n`
              )

              for (const service of stack.services) await service.afterInstall()
            }
          })
      })
  }
}

export { envify }
