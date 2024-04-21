import inquirer from 'inquirer';

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
        console.log(`installing Node.js ${this.selected_version}`);
    }
};

export {node};