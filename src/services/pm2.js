import runner from '../utils/runner.js'
import { spinner, username } from '../utils/helpers.js'
import output from '../utils/output.js'

const pm2 = {
  name: 'PM2',
  async prepare() {
    return this
  },

  async handle() {
    await spinner(
      'Installing PM2',
      'PM2 installed',
      'Failed to install PM2',
      async () => {
        await runner
          .as(username)
          .run('source /home/ubuntu/.nvm/nvm.sh && npm install pm2 -g')
          .catch(err => output().error(err).log())
        return Promise.resolve()
      },
      async error => {
        return Promise.reject(error)
      }
    )
  },

  async afterInstall() {}
}

export { pm2 }
