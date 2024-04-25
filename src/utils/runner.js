import chalk from 'chalk'
import { spawn } from 'node:child_process'

const runner = {
  logOutput: false,

  withOutput() {
    return this
  },
  async run(command, args = []) {
    return new Promise((resolve, reject) => {
      const proc = spawn(command, args, {
        shell: '/bin/bash'
      })

      proc.stdout.on('data', data => {
        if (this.logOutput) {
          process.stdout.write(data.toString().trim() + '\r\n')
        }
      })

      proc.stderr.on('data', data => {
        if (this.logOutput) {
          process.stdout.write(data.toString().trim() + '\r\n')
        }
      })

      proc.on('error', err => {
        if (this.logOutput) {
          console.log('\r' + chalk.red(err))
        }

        reject(err)
      })

      proc.on('close', code => {
        code === 0 ? resolve(0) : reject(code)
      })
    })
  }
}

export default runner
