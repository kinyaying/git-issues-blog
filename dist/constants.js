'use strict';

var _require = require('../package.json'),
    name = _require.name,
    version = _require.version;
// 配置文件的路径


var configFile = process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE'] + '/.sherorc';

module.exports = {
    name: name,
    version: version,
    configFile: configFile
};