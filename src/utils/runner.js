import chalk from 'chalk';
import {spawn} from 'node:child_process';

const runner = {

    async run(command, args = [], logOutput = false) {
        return new Promise((resolve, reject) => {
            const proc = spawn(command, args, {
                shell: '/bin/bash',
            });

            proc.stdout.on('data', (data) => {
                if(logOutput)
                    process.stdout.write(data.toString().trim() + "\r\n")
            });

            proc.stderr.on('data', (data) => {
                if(logOutput)
                    process.stdout.write(data.toString().trim() + "\r\n")
            });

            proc.on('error', (err) => {
                console.log("\r" + chalk.red(err));
            });

            proc.on('close', (code) => {
                (code === 0) ? resolve(0) : reject(code);
            });
        });
    }
};

export default runner;
