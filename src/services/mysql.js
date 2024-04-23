import inquirer from 'inquirer';
import chalk from "chalk";
import runner from "../utils/runner.js";
import {Spinner} from "@topcli/spinner";

const mysql = {
    mysql_password: '8.0',

    async prepare() {
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
        return new Promise((resolve, reject) => {
            const spinner = new Spinner().start(` Installing MySQL`);
            runner.run('sudo apt-get -y install mysql-server').then(() => {
                runner.run(`sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${this.mysql_password}'; FLUSH PRIVILEGES;"`).then(() => {
                    spinner.succeed(` MySQL installed  (${spinner.elapsedTime.toFixed(2)}ms)`);
                    resolve();
                }).catch((err) => {
                    spinner.failed(`MySQL installed but failed to set root password`);
                    reject(err);
                })
            }).catch(() => {
                spinner.failed(`failed to install MySQL`);
                reject();
            });
        });
    },

    async afterInstall() {
        console.log(
            chalk.dim('Mysql root password set to: ') +
            chalk.green(`${this.mysql_password}`)
        );
    }
};

export {mysql};