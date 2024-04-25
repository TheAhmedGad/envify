import runner from '../utils/runner.js'
import { Spinner } from '@topcli/spinner'

const git = {
  async prepare() {
    return this
  },

  async handle() {
    return new Promise((resolve, reject) => {
      const spinner = new Spinner().start(' Installing Git')

      runner
        .run('sudo apt-get install -y git', [])
        .then(res => {
          spinner.succeed(
            ` GIT installed  (${spinner.elapsedTime.toFixed(2)}ms)`
          )
          resolve()
        })
        .catch(err => {
          spinner.failed('failed to install Git')
          reject(err)
        })
    })
  },

  async afterInstall() {}
}

export { git }
