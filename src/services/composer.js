import runner from "../utils/runner.js";
import chalk from "chalk";
import {Spinner} from "@topcli/spinner";

const composer = {
    async prepare() {
        return this;
    },

    async handle() {
        return new Promise((resolve, reject) => {
            const spinner = new Spinner().start(` Installing Composer`);
            runner.run(`sudo apt-get -y install curl wget`).then((res)=>{
                runner.run(`curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer`).then(()=>{
                    spinner.succeed(` Composer installed  (${spinner.elapsedTime.toFixed(2)}ms)`);
                    resolve();
                }).catch(()=>{
                    spinner.succeed(` Failed to install composer`);
                    reject();
                })
            }).catch(()=>{
                spinner.succeed(` Failed to install curl & wget`);
                reject();
            })
        });
    },

    async afterInstall() {
    }
};

export {composer};