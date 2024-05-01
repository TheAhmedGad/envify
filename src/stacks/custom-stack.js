import { git } from '../services/git.js'
import { nginx } from '../services/nginx.js'
import { mysql } from '../services/mysql.js'
import { php } from '../services/php.js'
import { dotnet } from '../services/dotnet.js'
import { redis } from '../services/redis.js'
import { mssql } from '../services/mssql.js'
import { composer } from '../services/composer.js'
import { node } from '../services/node.js'
import inquirer from 'inquirer'

const services = {
  Nginx: nginx,
  MySQL: mysql,
  MsSQL: mssql,
  GIT: git,
  PHP: php,
  DotNetCore: dotnet,
  Composer: composer,
  Redis: redis,
  'Node.js': node
}

const customStack = {
  name: 'custom-stack',
  services: [],

  async collectStackServices() {
    const answer = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'services',
        message: 'Select Your services',
        choices: Object.keys(services),
        loop: false,
        validate(answer) {
          if (answer.length < 1) return 'You must choose at least 1 service.'
          return true
        }
      }
    ])
    for (const service of answer.services) this.services.push(services[service])
    return this
  }
}

export { customStack }
