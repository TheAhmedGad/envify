import runner from '../utils/runner.js'
import { spinner } from '../utils/helpers.js'

const redis = {
  name: 'Redis',
  async prepare() {
    return this
  },

  async handle() {
    await spinner(
      'Installing Redis',
      'Redis installed',
      'Failed to install Redis',
      async () => {
        await runner.run('sudo apt-get install -y redis-server')
        return Promise.resolve()
      },
      async error => {
        this.installation_success = false
        return Promise.reject(error)
      }
    )
  },

  async afterInstall() {}
}

export { redis }
