import runner from '../utils/runner.js'
import { Spinner } from '@topcli/spinner'

const nginx = {
  async prepare() {
    return this
  },

  async handle() {
    const spinner = new Spinner().start('Installing Nginx')

    try {
      await runner.run('sudo apt-get install -y nginx')
      spinner.succeed(`Nginx installed ${formatElapsedTime(spinner)}`)
      return Promise.resolve()
    } catch (error) {
      spinner.failed('Failed to install Nginx')
      return Promise.reject(error)
    }
  },

  async afterInstall() {}
}

export { nginx }
