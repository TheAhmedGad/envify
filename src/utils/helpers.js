import chalk from 'chalk'
import { exec } from 'child_process'
import { Spinner } from '@topcli/spinner'
import output from './output.js'

const username = process.env.SUDO_USER || process.env.USER

const spinner = async (startMsg, successMsg, failMsg, callback, onFail) => {
  const spinner = new Spinner().start(' ' + startMsg)

  try {
    await callback()
    await spinner.succeed(
      ' ' +
        output()
          .success(`${successMsg} ${formatElapsedTime(spinner)}`)
          .string()
    )
    return Promise.resolve()
  } catch (error) {
    await spinner.failed(' ' + output().error(failMsg).string())
    await onFail(error)
    return Promise.reject(error)
  }
}

const formatElapsedTime = spinner => {
  return `(` + chalk.yellow(`${spinner.elapsedTime.toFixed(2)}ms`) + `)`
}

const isPackageInstalled = async packageName => {
  try {
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec(`dpkg-query -l ${packageName}`, (error, stdout, stderr) => {
        if (error) {
          reject(error)
          return
        }
        resolve({ stdout, stderr })
      })
    })

    return stdout.includes(packageName)
  } catch (error) {
    console.error(
      'An error occurred while checking package installation:',
      error
    )
    return false
  }
}

const objectWithoutKey = (object, key) => {
  const { [key]: deletedKey, ...otherKeys } = object
  return otherKeys
}

export {
  formatElapsedTime,
  isPackageInstalled,
  username,
  spinner,
  objectWithoutKey
}
