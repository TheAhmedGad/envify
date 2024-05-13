import runner from '../utils/runner.js'
import { spinner, username } from '../utils/helpers.js'
import output from '../utils/output.js'

const AngularCli = {
  name: 'Angular CLI',
  async prepare() {
    return this
  },

  async handle() {
    await spinner(
      'Installing Angular CLI',
      'Angular CLI installed',
      'Failed to install Angular CLI',
      async () => {
        await runner
          .as(username)
          .run(
            `source /home/${username}/.nvm/nvm.sh && npm install -g @angular/cli --loglevel verbose`
          )
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

export { AngularCli }
