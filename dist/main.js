'use strict';

var program = require('commander');
var path = require('path');

var _require = require("@octokit/rest"),
    Octokit = _require.Octokit;

var fs = require('fs');
var create = require('./create');
var init = require('./init');
var FILE_MAP = 'map.json';

var _require2 = require('./util'),
    chalkSuccess = _require2.chalkSuccess,
    chalkError = _require2.chalkError;

var _require3 = require('./config'),
    readConfig = _require3.readConfig;

var _require4 = require('./constants'),
    version = _require4.version;
// 设置github的token


var config = readConfig();
var octokit = new Octokit({
    auth: config.token || null
});

var actionsMap = {
    'init': {
        alias: 'i',
        description: 'init github info, includes authname, project name and token',
        examples: ['shero-cli init']
    },
    'config': {
        alias: 'c',
        description: 'set the config',
        examples: ['shero-cli config']
    },
    'create <textName>': {
        alias: 'c',
        description: 'create a markdown file',
        examples: ['shero-cli create <project-name>']
    },
    'publish <textName>': {
        alias: 'c',
        description: 'publish a markdown file',
        examples: ['shero-cli publish <project-name>']
    },
    '*': {
        alias: 'create',
        description: 'command is not found',
        examples: []
    }
};

Reflect.ownKeys(actionsMap).forEach(function (action) {
    program.command(action).alias(actionsMap[action].alias).description(actionsMap[action].description).action(function (textName) {
        if (action === '*') {
            chalkError('Invalid command, please use shero-cli --help');
        } else {
            if (typeof textName === 'string' && textName.indexOf('.') === -1) {
                textName += '.md';
            }
            if (action === 'init') {
                init();
            }
            // 创建md文件
            else if (action === 'create <textName>') {
                    create(textName);
                }
                // 读取md文件，上传github生成新的issue
                else if (action === 'publish <textName>') {
                        fs.readFile(path.resolve(FILE_MAP), 'utf8', function (err, data) {
                            if (err) {
                                chalkError(err);
                            }
                            var map = JSON.parse(data);
                            if (map[textName] !== '') {
                                // 修改issue
                                var number = map[textName];
                                fs.readFile(path.resolve(textName), 'utf8', function (err, data) {
                                    octokit.issues.update({
                                        owner: config.name,
                                        repo: config.projectName,
                                        issue_number: number,
                                        body: data
                                    }).then(function (res) {
                                        chalkSuccess('publish succeed');
                                    }).catch(function (err) {
                                        chalkError('publish failed, error info: ', err.name);
                                    });
                                });
                            } else {
                                // 创建issue
                                fs.readFile(path.resolve(textName), 'utf8', function (err, data) {
                                    if (err) {
                                        return chalkError('publish failed, error info: ', err);
                                    }
                                    octokit.issues.create({
                                        owner: config.name,
                                        repo: config.projectName,
                                        title: textName.split('.')[0],
                                        body: data
                                    }).then(function (res) {
                                        chalkSuccess('publish succeed');
                                        var number = res.data.number;
                                        map[textName] = number;
                                        // 获取问题number，写入map.json
                                        fs.writeFile(FILE_MAP, JSON.stringify(map), 'utf8', function (error) {
                                            if (error) {
                                                chalkError(error);
                                                return false;
                                            }
                                        });
                                        fs.readFile(path.resolve('README.md'), 'utf8', function (err, data) {
                                            data += '  [' + textName + '](https://github.com/' + config.name + '/' + config.projectName + '/issues/' + number + ')';
                                            fs.writeFile('README.md', data, 'utf8', function (error) {
                                                if (error) {
                                                    chalkError(error);
                                                    return false;
                                                }
                                            });
                                        });
                                    }).catch(function (err) {
                                        chalkError('publish failed, error info: ', err);
                                    });
                                });
                            }
                        });
                    }
        }
    });
});

// 解析用户传过来的参数
program.version(version).parse(process.argv);