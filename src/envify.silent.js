import { Option, program } from 'commander'
import { stacks } from './stacks.js'
import { services, customStack } from './stacks/custom-stack.js'
import { Spinner } from '@topcli/spinner'
import chalk from 'chalk'
import { objectWithoutKey } from './utils/helpers.js'

const appInfo = require('../package.json')

const silentEnvify = {
  run() {
    program
      .name('envify')
      .description('Environment installer')
      .version(appInfo.version)
      .addOption(
        new Option('-s, --stack <stack>', 'Choose a stack to install').choices(
          Object.keys(objectWithoutKey(stacks.stacks, 'Custom'))
        )
      )
      .addOption(
        new Option('--services <selectedServices...>', 'specify services')
          .choices(Object.keys(services))
          .implies({ stack: 'Custom' })
      )

      .action(async args => {
        const stack = stacks.stacks[args.stack]

        if (args.stack === 'Custom') {
          const selectedServices = args.services

          for (const service of selectedServices)
            stack.services.push(services[service])
        }

        const spinner = new Spinner().start(
          chalk.blue(` Installing ${stack.name} ...`)
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
      })
      .parse()
  }
}

export { silentEnvify }
