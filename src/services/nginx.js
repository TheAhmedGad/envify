import chalk from 'chalk';
import runner from '../utils/runner.js';

const nginx = {
    async ask() {
        return this;
    },

    async handle() {
        try {
            console.log(chalk.green('Installing Nginx'));

            await runner.run('sudo apt-get install -y nginx', [], false)

            console.log(chalk.green('Nginx installed\n'));
        } catch (error) {
            process.stdout.write(error + "\r\n")
            process.exit(error.code)
        }
    },
};

export {nginx};
