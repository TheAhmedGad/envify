import runner from '../utils/runner.js'
import { spinner } from '../utils/helpers.js'

const nginx = {
  async prepare() {
    return this
  },

  async handle() {
    await spinner(
      'Installing Nginx',
      'Nginx installed',
      'Failed to install Nginx',
      async () => {
        await runner.run('sudo apt-get install -y nginx')
        return Promise.resolve()
      },
      async error => {
        return Promise.reject(error)
      }
    )
  },

  async afterInstall() {}
}

export { nginx }
