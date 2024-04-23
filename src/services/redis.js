import chalk from 'chalk';
import runner from '../utils/runner.js';
import {Spinner} from "@topcli/spinner";

const redis = {
    async prepare() {
        return this;
    },

    async handle() {

        return new Promise((resolve, reject) => {
            const spinner = new Spinner().start(` Installing Redis`);
            runner.run(`sudo apt-get install -y redis-server`).then((res) => {
                spinner.succeed(` Redis installed  (${spinner.elapsedTime.toFixed(2)}ms)`);
                resolve();
            }).catch((err) => {
                spinner.succeed(` Failed to install composer`);
                reject();
            });
        });
    },

    async afterInstall() {
    }
};

export {redis};
