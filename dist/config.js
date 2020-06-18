'use strict';

var fs = require('fs');

var _require = require('ini'),
    encode = _require.encode,
    decode = _require.decode;

var _require2 = require('./constants'),
    configFile = _require2.configFile;

var readConfig = function readConfig() {
    var flag = fs.existsSync(configFile);
    var obj = {};
    if (flag) {
        var content = fs.readFileSync(configFile).toString();
        var contentDecoded = decode(content); // 将文件解析成对象
        Object.assign(obj, contentDecoded);
    }
    return obj;
};
var writeConfig = function writeConfig(obj) {
    return new Promise(function (resolve) {
        fs.writeFileSync(configFile, encode(obj));
        resolve();
    });
};
module.exports = {
    readConfig: readConfig,
    writeConfig: writeConfig
};