'use strict';

var chalk = require('chalk');
module.exports = {
    chalkSuccess: function chalkSuccess() {
        for (var _len = arguments.length, argv = Array(_len), _key = 0; _key < _len; _key++) {
            argv[_key] = arguments[_key];
        }

        return console.log(chalk.green(argv.reduce(function (prev, next) {
            return prev + next;
        }, '')));
    },
    chalkError: function chalkError() {
        for (var _len2 = arguments.length, argv = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            argv[_key2] = arguments[_key2];
        }

        return console.log(chalk.red(argv.reduce(function (prev, next) {
            return prev + next;
        }, '')));
    }
};