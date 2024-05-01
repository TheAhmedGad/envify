import { git } from '../services/git.js'
import { nginx } from '../services/nginx.js'
import { mysql } from '../services/mysql.js'
import { php } from '../services/php.js'
import { redis } from '../services/redis.js'

const laravelStack = {
  name: 'laravel-stack',
  services: [git, nginx, mysql, php, redis],
  async collectStackServices() {}
}

export { laravelStack }
