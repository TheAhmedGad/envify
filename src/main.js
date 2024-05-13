#!/usr/bin/env node
import output from './utils/output.js'
import { envify } from './envify.js'
import { silentEnvify } from './envify.silent.js'

if (process.env.USER !== 'root') {
  output().error('You must run app as root!').log()
  process.exit(1)
}

if (process.argv.length > 2) {
  silentEnvify.run()
} else {
  envify.run()
}
