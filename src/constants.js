const { name, version } = require('../package.json')
// 配置文件的路径
const configFile = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.sherorc`

module.exports = {
    name, 
    version,
    configFile
}