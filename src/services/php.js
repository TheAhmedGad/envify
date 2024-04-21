import inquirer from 'inquirer';
import chalk from "chalk";
import runner from "../utils/runner.js";

const php = {
    selected_version: '8.3',

    extensions: [
        'fpm',
        'mbstring',
        'bcmath',
        'curl',
        'json',
        'mysql',
        'tokenizer',
        'xml',
        'zip'
    ],

    async ask() {
        await inquirer.prompt([
            {
                type: 'list',
                name: 'php_version',
                message: 'Select PHP version',
                choices: ['8.3', '8.2', '8.1', '7.4', '7.3', '7.2', '7.1', '7.0'],
                filter(val) {
                    return val.toLowerCase();
                },
            },
        ]).then((answer) => {
            this.selected_version = answer.php_version;
        });
        return this;
    },

    async handle() {
        try {
            console.log(chalk.green(`installing PHP ${this.selected_version}`));

            await runner.run(`sudo add-apt-repository -y ppa:ondrej/php`);
            await runner.run(`sudo apt update -y`);
            await runner.run(`sudo apt upgrade -y`);

            await runner.run(`sudo apt-get -y install php${this.selected_version}`);
            console.log(chalk.green(`PHP ${this.selected_version} installed`));


            console.log(chalk.green(`installing PHP extensions`));


            for (const extension of this.extensions)
                await runner.run(`sudo apt-get -y install php${this.selected_version}-${extension}`, [], false).then(()=>{
                    console.log(chalk.green(`php-${extension} installed successfully`));
                }).catch((err)=>{
                    console.log(chalk.red(`PHP extensions (${extension}) was not found`));
                });

            console.log(chalk.green(`PHP extensions installed`));

        } catch (error) {
            process.stdout.write(error + "\r\n")
            process.exit(error.code)
        }

    }
};

export {php};