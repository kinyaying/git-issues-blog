const program = require('commander')
const chalk = require('chalk')
const path = require('path')
const { Octokit } = require("@octokit/rest")
// var promise = require('bluebird')
const fs = require('fs')
const octokit = new Octokit({
    auth: '668cd21174ae3397cbc87e279c219b09a8d21361'
})
const FILE_MAP = 'map.json'

const actionsMap = {
    'create <textName>': {
        alias: 'c',
        description: 'create a markdown file',
        examples: [
            'shero-cli create <project-name>',
        ],
    },
    'publish [textName]': {
        alias: 'c',
        description: 'create a markdown file',
        examples: [
            'shero-cli create <project-name>',
        ],
    },
    '*': {
        alias: 'create',
        description: 'command is not found',
        examples: [],
    },
}

const chalkSuccess = (...argv) => console.log(chalk.green(argv.reduce((prev, next) => (prev + next) , '')))
const chalkError = (...argv) => console.log(chalk.red(argv.reduce((prev, next) => (prev + next) , '')))


const create = function (textName) {
    fs.stat(FILE_MAP,function(error,stats){
        if (stats && stats.isFile()) {
            // 存在map.json配置文件
            fs.readFile(path.resolve(FILE_MAP),'utf8', (err, data) => {
                if(error){
                    chalkError(error)
                    return false
                }
                let map = JSON.parse(data)
                if (map[textName]) {
                    // 存在此文件的索引
                    return chalkError('This file is already exits, please change the name!')
                } else {
                    // 不存在此文件索引，认为文件不存在，新建文件
                    fs.writeFile(textName,'','utf8',function(error){
                        if(error){
                            chalkError(error)
                            return false
                        }
                        chalkSuccess(`Create the file ${textName} succeed!`)
                    })
                }
                map[textName] = ""
                fs.writeFile(FILE_MAP,JSON.stringify(map),'utf8',function(error){
                    if(error){
                        chalkError(error)
                        return false
                    }
                })
            })
        } else {
            // 不存在map.json配置文件
            fs.writeFile(FILE_MAP,`{"${textName}":""}`,'utf8',function(error){
                if(error){
                    chalkError(error)
                    return false
                }
                create(textName)
            })
        }
    })
}


Reflect.ownKeys(actionsMap).forEach(action => {
    program.command(action)
        .alias(actionsMap[action].alias)
        .description(actionsMap[action].description)
        .action(function (textName) {
            if (action === '*') {
                chalkError('Invalid command, please use shero-cli --help')
            } else {
                console.log('create')
                if (textName.indexOf('.') === -1) {
                    textName += '.md'
                } 
                // 创建md文件
                if (action === 'create <textName>') {
                    create(textName)
                } 
                // 读取md文件，上传github生成新的issue
                else if (action === 'publish [textName]') {
                    fs.readFile(path.resolve(FILE_MAP),'utf8', (err, data) => {
                        if (err) {
                            chalkError(err)
                        }
                        let map = JSON.parse(data)
                        if (map[textName] !== '') {
                            // 修改issue
                            let number = map[textName]
                            fs.readFile(path.resolve(textName),'utf8', (err, data) => {
                                console.log('data:', typeof data)
                                octokit.issues.update({
                                    owner: 'kinyaying',
                                    repo: 'Blog',
                                    issue_number: number,
                                    body: data
                                });
                            })
                            
                        } else {
                            // 创建issue
                            fs.readFile(path.resolve(textName),'utf8', (err, data) => {
                                octokit.issues.create({
                                    owner: 'kinyaying',
                                    repo: 'Blog',
                                    title: textName,
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
                                        console.log('data:', data)
                                        data += `[${textName}](https://github.com/kinyaying/Blog/issues/${number})`
                                        fs.writeFile('README.md', data, 'utf8',function(error){
                                            if(error){
                                                chalkError(error)
                                                return false
                                            }
                                        })
                                    })
                                }).catch(err => {
                                    chalkError('publish failed, error: ', err.name)
                                })
                            })
                        }
                      });
                    
                }
            }
        })
})



// 解析用户传过来的参数
program.version('1.0.0').parse(process.argv)