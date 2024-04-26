import chalk from 'chalk'
import { exec } from 'child_process'

const formatElapsedTime = spinner => {
  return `(` + chalk.yellow(`${spinner.elapsedTime.toFixed(2)}ms`) + `)`
}

const username = process.env.SUDO_USER || process.env.USER

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

export { formatElapsedTime, isPackageInstalled, username }
