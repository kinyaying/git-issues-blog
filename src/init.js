/**
 * shero-cli init
 * 项目初始化, 写入配置文件username, project, token
 */
const fs = require('fs')
const inquirer = require('inquirer')
const {readConfig, writeConfig} = require('./config')
const {chalkSuccess, chalkError} = require('./util')

const prompt = function () {
    const promptList = [{
        type: 'input',
        message: 'please enter the username of github',
        name: 'name'
    },{
        type: 'input',
        message: 'please enter the projectName',
        name: 'projectName',
    },{
        type: 'input',
        message: 'please enter the token',
        name: 'token',
    }];
    // 用户交互，选择模板
    inquirer.prompt(promptList).then(answers => {
        writeConfig(answers).then(() => {
            chalkSuccess('Initialization shero-cli succeed!')
        })
    })
}
const init = function() {
    const obj = readConfig()
    if (!obj.token) {
        prompt()
    } else {
        inquirer.prompt({
            type: 'confirm',
            message: 'The config has already exist, are you sure to reset the config?',
            name: 'resetConfig'
        }).then(answers => {
            if (answers) {
                prompt()
            }
        })
    }
}
module.exports = init