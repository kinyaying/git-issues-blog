'use strict';

/**
 * shero-cli init
 * 项目初始化, 写入配置文件username, project, token
 */
var fs = require('fs');
var inquirer = require('inquirer');

var _require = require('./config'),
    readConfig = _require.readConfig,
    writeConfig = _require.writeConfig;

var _require2 = require('./util'),
    chalkSuccess = _require2.chalkSuccess,
    chalkError = _require2.chalkError;

var prompt = function prompt() {
    var promptList = [{
        type: 'input',
        message: 'please enter the username of github',
        name: 'name'
    }, {
        type: 'input',
        message: 'please enter the projectName',
        name: 'projectName'
    }, {
        type: 'input',
        message: 'please enter the token',
        name: 'token'
    }];
    // 用户交互，选择模板
    inquirer.prompt(promptList).then(function (answers) {
        writeConfig(answers).then(function () {
            chalkSuccess('Initialization shero-cli succeed!');
        });
    });
};
var init = function init() {
    var obj = readConfig();
    if (!obj.token) {
        prompt();
    } else {
        inquirer.prompt({
            type: 'confirm',
            message: 'The config has already exist, are you sure to reset the config?',
            name: 'resetConfig'
        }).then(function (answers) {
            if (answers) {
                prompt();
            }
        });
    }
};
module.exports = init;