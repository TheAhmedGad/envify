#!/usr/bin/env node
import output from './utils/output.js'
import { envify } from './envify.js'

if (process.env.USER !== 'root') {
  output().error('You must run app as root!').log()
  process.exit(1)
}

envify.run()
