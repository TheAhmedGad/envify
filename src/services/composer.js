import runner from '../utils/runner.js'
import { spinner } from '../utils/helpers.js'

const composer = {
  name: 'PHP Composer',
  async prepare() {
    return this
  },

  async handle() {
    await spinner(
      'Installing Composer',
      'Composer installed',
      'Failed to install Composer',
      async () => {
        await runner.run('sudo apt-get -y install curl wget')
        await runner.run(
          'curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer'
        )
        return Promise.resolve()
      },
      async error => {
        return Promise.reject(error)
      }
    )
  },

  async afterInstall() {}
}

export { composer }
