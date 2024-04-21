import runner from "../utils/runner.js";
import chalk from "chalk";

const composer = {
    async ask() {
        return this;
    },

    async handle() {
        console.log(chalk.green("Installing Composer"));
        await runner.run(`sudo apt-get -y install curl wget`, [], false);
        await runner.run(`curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer`, [], false);
        console.log(chalk.green("Composer installed"));
    },
};

export {composer};