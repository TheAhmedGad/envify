import runner from '../utils/runner.js'
import { Spinner } from '@topcli/spinner'

const redis = {
  async prepare() {
    return this
  },

  async handle() {
    const spinner = new Spinner().start('Installing Redis')

    try {
      await runner.run('sudo apt-get install -y redis-server')
      spinner.succeed(`Redis installed ${formatElapsedTime(spinner)}`)
      return Promise.resolve()
    } catch (error) {
      spinner.failed('Failed to install Redis')
      return Promise.reject(error)
    }
  },

  async afterInstall() {}
}

export { redis }
