import chalk from 'chalk';
import runner from '../utils/runner.js';

const redis = {
    async ask() {
        return this;
    },

    async handle() {
        try {
            console.log(chalk.dim('Installing Redis'));

            await runner.run('sudo apt-get install -y redis-server', [], false)

            console.log(chalk.green('Redis installed\n'));
        } catch (error) {
            process.stdout.write(error + "\r\n")
            process.exit(error.code)
        }
    },
};

export {redis};
