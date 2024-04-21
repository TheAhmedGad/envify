import inquirer from 'inquirer';
import chalk from "chalk";
import runner from "../utils/runner.js";

const mysql = {
    mysql_password: '8.0',

    async ask() {
        await inquirer.prompt([
            {
                type: 'input',
                name: 'mysql_password',
                message: 'Enter MySQL password',
                default: 'root'
            },
        ]).then((answer) => {
            this.mysql_password = answer.mysql_password;
        });
        return this;
    },

    async handle() {
        try {
            console.log(chalk.green('Installing Mysql'));

            await runner.run('sudo apt-get -y install mysql-server');


            console.log(chalk.green(`Setting root password`));
            await runner.run(`sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${this.mysql_password}'; FLUSH PRIVILEGES;"`);
            console.log(chalk.green(`Mysql root password set to: ${this.mysql_password}`));

            console.log(chalk.green('Mysql installed'));
        } catch (error) {
            process.stdout.write(error + "\r\n")
            process.exit(error.code)
        }
    },
};

export {mysql};