import runner from '../utils/runner.js'
import { Spinner } from '@topcli/spinner'
import { formatElapsedTime } from '../utils/helpers.js'

const composer = {
  async prepare() {
    return this
  },

  async handle() {
    const spinner = new Spinner().start('Installing Composer')

    try {
      await runner.run('sudo apt-get -y install curl wget')
      await runner.run(
        'curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer'
      )
      spinner.succeed(`Composer installed ${formatElapsedTime(spinner)}`)
      return Promise.resolve()
    } catch (error) {
      spinner.fail('Failed to install Composer')
      return Promise.reject(error)
    }
  },

  async afterInstall() {}
}

export { composer }
