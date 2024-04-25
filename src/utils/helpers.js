import chalk from 'chalk'

const formatElapsedTime = spinner => {
  return `(` + chalk.yellow(`${spinner.elapsedTime.toFixed(2)}ms`) + `)`
}

export { formatElapsedTime }
