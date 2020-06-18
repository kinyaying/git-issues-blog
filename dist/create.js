'use strict';

/**
 * shero-cli create的后续操作
 * 创建md文件
 */
var fs = require('fs');
var path = require('path');

var _require = require('./util'),
    chalkSuccess = _require.chalkSuccess,
    chalkError = _require.chalkError;

var FILE_MAP = 'map.json';

var create = function create(textName) {
    fs.stat(FILE_MAP, function (error, stats) {
        if (stats && stats.isFile()) {
            // 存在map.json配置文件
            fs.readFile(path.resolve(FILE_MAP), 'utf8', function (err, data) {
                if (error) {
                    chalkError(error);
                    return false;
                }
                var map = JSON.parse(data);
                if (map[textName]) {
                    // 存在此文件的索引
                    return chalkError('This file is already exits, please change the name!');
                } else {
                    // 不存在此文件索引，认为文件不存在，新建文件
                    fs.writeFile(textName, '', 'utf8', function (error) {
                        if (error) {
                            chalkError(error);
                            return false;
                        }
                        chalkSuccess('Create the file ' + textName + ' succeed!');
                    });
                }
                map[textName] = "";
                fs.writeFile(FILE_MAP, JSON.stringify(map), 'utf8', function (error) {
                    if (error) {
                        chalkError(error);
                        return false;
                    }
                });
            });
        } else {
            // 不存在map.json配置文件
            fs.writeFile(FILE_MAP, '{"' + textName + '":""}', 'utf8', function (error) {
                if (error) {
                    chalkError(error);
                    return false;
                }
                create(textName);
            });
        }
    });
};

module.exports = create;