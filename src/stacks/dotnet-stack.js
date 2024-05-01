import { git } from '../services/git.js'
import { nginx } from '../services/nginx.js'
import { mssql } from '../services/mssql.js'
import { node } from '../services/node.js'
import { pm2 } from '../services/pm2.js'
import { dotnet } from '../services/dotnet.js'

const dotnetStack = {
  name: 'dotnet-stack',
  services: [git, nginx, dotnet, mssql, node, pm2],
  async collectStackServices() {}
}

export { dotnetStack }
