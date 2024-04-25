import inquirer from 'inquirer';
import chalk from 'chalk';
import runner from '../utils/runner.js';
import { Spinner } from '@topcli/spinner';

const php = {
  selectedVersion: '8.3',
  extensions: {
    fpm: false,
    mbstring: false,
    bcmath: false,
    curl: false,
    json: false,
    mysql: false,
    tokenizer: false,
    xml: false,
    zip: false
  },

  async prepare() {

    const { phpVersion } = await inquirer.prompt([
      {
        type: 'list',
        name: 'phpVersion',
        message: 'Select PHP version',
        choices: ['8.3', '8.2', '8.1', '7.4', '7.3', '7.2', '7.1', '7.0'],
        filter(val) {
          return val.toLowerCase();
        }
      }
    ]);
    this.selectedVersion = phpVersion;
    return this;
  },

  async handle() {
    const spinner = new Spinner().start('Installing PHP');
    try {
      await runner.run('sudo add-apt-repository -y ppa:ondrej/php');
      await runner.run('sudo apt update -y');
      await runner.run('sudo apt upgrade -y');
      await runner.run(`sudo apt-get -y install php${this.selectedVersion}`);
      spinner.succeed(`PHP installed (${spinner.elapsedTime.toFixed(2)}ms)`);
      for (const extension of Object.keys(this.extensions)) {
        const extensionSpinner = new Spinner().start(`Installing php-${extension}`, { withPrefix: ' - ' });
        try {
          await runner.run(`sudo apt-get -y install php${this.selectedVersion}-${extension}`);
          this.extensions[extension] = true;
          extensionSpinner.succeed(`php-${extension} installed (${extensionSpinner.elapsedTime.toFixed(2)}ms)`);
        } catch (err) {
          extensionSpinner.failed(`php-${extension} was not found`);
        }
      }
      return Promise.resolve();
    } catch (err) {
      spinner.failed('Failed to install PHP');
      return Promise.reject(err);
    }
  },

  async afterInstall() {
    console.log(chalk.dim('PHP Version: ') + chalk.green(`${this.selectedVersion}`));

    const installedExtensions = Object.entries(this.extensions)
      .filter(([_, installed]) => installed)
      .map(([extension]) => extension)
      .join(', ');

    console.log(chalk.dim('Installed PHP extensions: ') + chalk.green(`[${installedExtensions}]`));
  }
};

export { php };
