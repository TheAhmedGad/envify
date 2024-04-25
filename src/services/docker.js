import runner from '../utils/runner.js'
import { Spinner } from '@topcli/spinner'
import { formatElapsedTime } from '../utils/helpers.js'
import chalk from 'chalk'

const docker = {
  async prepare() {
    return this
  },

  async handle() {
    const spinner = new Spinner().start('Installing Docker')

    try {
      // Download Docker installer script
      await runner.run('curl -fsSL https://get.docker.com -o get-docker.sh')
      chalk.blue(`Docker installer script downloaded successfully`)

      await runner.run('rm get-docker.sh')
      // await runner.run(`usermod -aG docker ${$USER}`)
      await runner.run('newgrp docker')

      spinner.succeed(
        `Docker CLI installed successfully ${formatElapsedTime(spinner)}`
      )
      return Promise.resolve()
    } catch (error) {
      spinner.failed('Failed to install Docker')
      return Promise.reject(error)
    }
  },

  async afterInstall() {}
}

export { docker }
