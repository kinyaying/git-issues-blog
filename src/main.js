const program = require('commander')
const path = require('path')
const { Octokit } = require("@octokit/rest")
const fs = require('fs')
const create = require('./create')
const init = require('./init')
const FILE_MAP = 'map.json'
const {chalkSuccess, chalkError} = require('./util')
const {readConfig} = require('./config')
const {version} = require('./constants')
// 设置github的token
const config = readConfig()
const octokit = new Octokit({
    auth: config.token || null
})

const actionsMap = {
    'init': {
        alias: 'i',
        description: 'init github info, includes authname, project name and token',
        examples: [
            'shero-cli init',
        ],
    },
    'config': {
        alias: 'c',
        description: 'set the config',
        examples: [
            'shero-cli config',
        ],
    },
    'create <textName>': {
        alias: 'c',
        description: 'create a markdown file',
        examples: [
            'shero-cli create <project-name>',
        ],
    },
    'publish <textName>': {
        alias: 'c',
        description: 'publish a markdown file',
        examples: [
            'shero-cli publish <project-name>',
        ],
    },
    '*': {
        alias: 'create',
        description: 'command is not found',
        examples: [],
    },
}


Reflect.ownKeys(actionsMap).forEach(action => {
    program.command(action)
        .alias(actionsMap[action].alias)
        .description(actionsMap[action].description)
        .action(function (textName) {
            if (action === '*') {
                chalkError('Invalid command, please use shero-cli --help')
            } else {
                if (typeof textName === 'string' && textName.indexOf('.') === -1) {
                    textName += '.md'
                } 
                if (action === 'init') {
                    init()
                }
                // 创建md文件
                else if (action === 'create <textName>') {
                    create(textName)
                } 
                // 读取md文件，上传github生成新的issue
                else if (action === 'publish <textName>') {
                    fs.readFile(path.resolve(FILE_MAP),'utf8', (err, data) => {
                        if (err) {
                            chalkError(err)
                        }
                        let map = JSON.parse(data)
                        if (map[textName] !== '') {
                            // 修改issue
                            let number = map[textName]
                            fs.readFile(path.resolve(textName),'utf8', (err, data) => {
                                octokit.issues.update({
                                    owner: config.name,
                                    repo: config.projectName,
                                    issue_number: number,
                                    body: data
                                }).then(res => {
                                    chalkSuccess('publish succeed')
                                }).catch(err => {
                                    chalkError('publish failed, error info: ', err.name)
                                });
                            })
                        } else {
                            // 创建issue
                            fs.readFile(path.resolve(textName),'utf8', (err, data) => {
                                if (err) {
                                    return chalkError('publish failed, error info: ', err)
                                }
                                octokit.issues.create({
                                    owner: config.name,
                                    repo: config.projectName,
                                    title: textName.split('.')[0],
                                    body: data
                                }).then(res => {
                                    chalkSuccess('publish succeed')
                                    const number = res.data.number
                                    map[textName] = number
                                    // 获取问题number，写入map.json
                                    fs.writeFile(FILE_MAP, JSON.stringify(map), 'utf8',function(error){
                                        if(error){
                                            chalkError(error)
                                            return false
                                        }
                                    })
                                    fs.readFile(path.resolve('README.md'),'utf8', (err, data) => {
                                        data += `  [${textName}](https://github.com/${config.name}/${config.projectName}/issues/${number})`
                                        fs.writeFile('README.md', data, 'utf8',function(error){
                                            if(error){
                                                chalkError(error)
                                                return false
                                            }
                                        })
                                    })
                                }).catch(err => {
                                    chalkError('publish failed, error info: ', err.name)
                                })
                            })
                        }
                    });
                }
            }
        })
})

// 解析用户传过来的参数
program.version(version).parse(process.argv)