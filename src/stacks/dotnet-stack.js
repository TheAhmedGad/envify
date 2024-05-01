import { git } from '../services/git.js'
import { nginx } from '../services/nginx.js'
import { mssql } from '../services/mssql.js'
import { node } from '../services/node.js'

const dotnetStack = {
  name: 'dotnet-stack',
  services: [git, nginx, mssql, node],
  async collectStackServices() {}
}

export { dotnetStack }
