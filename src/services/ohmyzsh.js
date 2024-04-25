import runner from '../utils/runner.js'
import { Spinner } from '@topcli/spinner'
import { formatElapsedTime } from '../utils/helpers.js'

const ohmyzsh = {
  async prepare() {
    return this
  },

  async handle() {
    const spinner = new Spinner().start('Installing Zsh & Oh-my-zsh')

    try {
      // Install Zsh
      await runner.run('sudo apt-get install -y zsh')

      // Set Zsh as the default shell for the current user
      await runner.run('chsh -s $(which zsh)')

      // Install Oh My Zsh
      await runner.run(
        'sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"'
      )

      spinner.succeed(
        `Zsh and Oh My Zsh installed ${formatElapsedTime(spinner)}`
      )
      return Promise.resolve()
    } catch (error) {
      spinner.failed('Failed to install Zsh and Oh My Zsh')
      return Promise.reject(error)
    }
  },

  async afterInstall() {}
}

export { ohmyzsh }
