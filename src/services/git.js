import inquirer from "inquirer";
import chalk from "chalk";
import runner from "../utils/runner.js";

const git = {
    async ask() {
        return this;
    },

    async handle() {
        try {
            console.log(chalk.green('Installing Git'));

            await runner.run('sudo apt-get install -y git', [], false)

            console.log(chalk.green('Git installed\n'));
        } catch (error) {
            process.stdout.write(error + "\r\n")
            process.exit(error.code)
        }
    },
};

export {git};