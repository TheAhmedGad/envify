import inquirer from 'inquirer';
import chalk from "chalk";
import runner from "../utils/runner.js";

const node = {
    selected_version: '8.3',

    async ask() {
        await inquirer.prompt([
            {
                type: 'list',
                name: 'node_version',
                message: 'Select Node.js version (LTS Only)',
                choices: ['20.12.2', '18.20.2', '16.20.2', '14.21.3', '12.22.12', '10.24.1', '8.17.0', '6.17.1'],
                filter(val) {
                    return val.toLowerCase();
                },
            },
        ]).then((answer) => {
            this.selected_version = answer.node_version;
        });
        return this;
    },

    async handle() {
        try {
            //Set user to current user first
            process.setgid(parseInt(process.env.SUDO_UID || process.getuid(), 10));
            process.setuid(parseInt(process.env.SUDO_UID || process.getuid(), 10));

            process.env.HOME = `/home/${process.env.SUDO_USER}`;

            console.log(chalk.dim(`Installing Node.js ${this.selected_version} LTS`));

            await runner.run(`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash && source $HOME/.nvm/nvm.sh && nvm install ${this.selected_version} && nvm use ${this.selected_version}`);


            console.log(chalk.green(`Node ${this.selected_version} installed`));
        } catch (error) {
            process.stdout.write(chalk.red(error + "\r\n"));
            process.exit(error.code)
        }
    }
};

export {node};