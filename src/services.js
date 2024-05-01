//TODO::Deprecate this file it's not needed anymore, as it will be replaced with custom-stack.js

import { git } from './services/git.js'
import { nginx } from './services/nginx.js'
import { mysql } from './services/mysql.js'
import { mssql } from './services/mssql.js'
import { php } from './services/php.js'
import { composer } from './services/composer.js'
import { redis } from './services/redis.js'
import { node } from './services/node.js'

const services = {
  Nginx: nginx,
  MySQL: mysql,
  MsSQL: mssql,
  GIT: git,
  PHP: php,
  Composer: composer,
  Redis: redis,
  'Node.js': node
}

export { services }
