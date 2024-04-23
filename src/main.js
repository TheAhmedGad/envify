#!/usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';


import {git} from "./services/git.js";
import {nginx} from "./services/nginx.js";
import {mysql} from "./services/mysql.js";
import {php} from "./services/php.js";
import {composer} from "./services/composer.js";
import {redis} from "./services/redis.js";
import {node} from "./services/node.js";

if(process.env.USER !== 'root'){
    console.error(chalk.red('You must run app as root'));
    process.exit(1);
}

const services = {
    'Nginx': nginx,
    'MySQL': mysql,
    'GIT': git,
    'PHP': php,
    'Composer': composer,
    'Redis': redis,
    'Node.js': node,
};

inquirer.prompt([{
    type: 'checkbox',
    message: 'Select services',
    name: 'services',
    choices: Object.keys(services).map((s) => ({name: s})),
    validate(answer) {
        if (answer.length < 1)
            return 'You must choose at least one service.';
        return true;
    },
}]).then(async (answers) => {
    for (const service of answers.services)
        await services[service].ask();

    inquirer.prompt([{
        type: 'confirm',
        message: 'Are you sure to continue ? ',
        name: 'confirm',
        default: false
    }]).then(async (answer) => {
        if(answer.confirm)
            for (const service of answers.services)
                await services[service].handle();
    })
});
