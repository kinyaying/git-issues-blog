const chalk = require('chalk')
module.exports = {
    chalkSuccess: (...argv) => console.log(chalk.green(argv.reduce((prev, next) => (prev + next) , ''))),
    chalkError: (...argv) => console.log(chalk.red(argv.reduce((prev, next) => (prev + next) , '')))
}