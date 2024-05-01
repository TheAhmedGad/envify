import { git } from '../services/git.js'
import { nginx } from '../services/nginx.js'
import { mysql } from '../services/mysql.js'
import { php } from '../services/php.js'
import { redis } from '../services/redis.js'
import { composer } from '../services/composer.js'

const laravelStack = {
  name: 'laravel-stack',
  services: [git, nginx, mysql, php, composer, redis],
  async collectStackServices() {}
}

export { laravelStack }
