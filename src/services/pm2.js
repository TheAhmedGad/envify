import runner from '../utils/runner.js'
import { spinner } from '../utils/helpers.js'

const git = {
  name: 'Git',
  async prepare() {
    return this
  },

  async handle() {
    await spinner(
      'Installing Git',
      'GIT installed',
      'Failed to install Git',
      async () => {
        await runner.run('sudo apt-get install -y git', [])
        return Promise.resolve()
      },
      async error => {
        return Promise.reject(error)
      }
    )
  },

  async afterInstall() {}
}

export { git }
