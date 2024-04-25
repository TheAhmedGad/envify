import runner from '../utils/runner.js'
import { Spinner } from '@topcli/spinner'

const git = {
  async prepare() {
    return this
  },

  async handle() {
    const spinner = new Spinner().start('Installing Git')

    try {
      await runner.run('sudo apt-get install -y git', [])
      spinner.succeed(`GIT installed ${formatElapsedTime(spinner)}`)
      return Promise.resolve()
    } catch (error) {
      spinner.failed('Failed to install Git')
      return Promise.reject(error)
    }
  },

  async afterInstall() {}
}

export { git }
