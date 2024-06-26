import { spawn } from 'node:child_process'
import output from './output.js'
import fs from 'node:fs'
import { username as uname } from './helpers.js'

const runner = {
  logOutput: false,
  username: null,
  logPath: '/var/log/envify',

  withOutput() {
    this.logOutput = true
    return this
  },

  as(username) {
    this.username = username
    return this
  },

  async run(command, args = [], username = null) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(this.logPath)) {
        fs.mkdirSync(this.logPath)
      }

      const outLogFile = fs.createWriteStream(`${this.logPath}/out.log`, {
        flags: 'a'
      })
      const errLogFile = fs.createWriteStream(`${this.logPath}/error.log`, {
        flags: 'a'
      })

      // whenever need to run as custom user set the user
      // otherwise run as current process user.
      const cmd = this.username
        ? `su -c '${command}' ${this.username}`
        : command

      const proc = spawn(cmd, args, {
        shell: '/bin/bash'
      })

      proc.stdout.pipe(outLogFile)
      proc.stderr.pipe(errLogFile)

      proc.stdout.on('data', data => {
        if (this.logOutput) {
          output().info(data.toString().trim()).log()
        }
      })

      proc.on('error', err => {
        if (this.logOutput) {
          output()
            .error('\r' + err)
            .log()
        }

        // reject(err)
      })

      proc.on('close', code => {
        code === 0 ? resolve(0) : reject(code)
      })

      // Reset user back to the root
      this.username = null
    })
  }
}

export default runner
