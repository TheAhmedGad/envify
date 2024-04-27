import {spawn} from 'node:child_process'
import output from "./output.js";

const runner = {
    logOutput: false,
    username: null,

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
            // whenever need to run as custom user set the user
            // otherwise run as current process user.

            // su -c "ssh-keygen -t ed25519 -f /home/vmbox/.ssh/envify -C "Envify" -q -N """ vmbox
            const cmd = this.username
                ? `su -c '${command}' ${this.username}`
                : command

            const proc = spawn(cmd, args, {
                shell: '/bin/bash'
            })

            proc.stdout.on('data', data => {
                if (this.logOutput) {
                    process.stdout.write(data.toString().trim() + '\r\n')
                }
            })

            proc.on('error', err => {
                if (this.logOutput) {
                    output().error('\r' + err);
                }

                reject(err)
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
