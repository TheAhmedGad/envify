import chalk from 'chalk';
import runner from '../utils/runner.js';
import {Spinner} from "@topcli/spinner";

const nginx = {
    async prepare() {
        return this;
    },

    async handle() {
        return new Promise((resolve, reject) => {
            const spinner = new Spinner().start(` Installing nginx`);
            runner.run('sudo apt-get install -y nginx').then((res) => {
                spinner.succeed(` Nginx installed  (${spinner.elapsedTime.toFixed(2)}ms)`);
                resolve();
            }).catch((err) => {
                spinner.failed(`failed to install nginx`);
                reject(err);
            });
        });
    },

    async afterInstall() {
    }
};

export {nginx};
