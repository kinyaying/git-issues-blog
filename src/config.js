const fs = require('fs')
const { encode, decode } = require('ini')
const { configFile } = require('./constants')
const readConfig = () => {
    const flag = fs.existsSync(configFile)
    const obj = {}
    if(flag) {
        const content = fs.readFileSync(configFile).toString()
        const contentDecoded = decode(content);// 将文件解析成对象
        Object.assign(obj, contentDecoded)
    }
    return obj
}
const writeConfig = (obj) => {
    return new Promise((resolve) => {
        fs.writeFileSync(configFile, encode(obj))
        resolve()
    })
}
module.exports = {
    readConfig,
    writeConfig
}