const qiniu = require('qiniu')
// 创建上传凭证
const accessKey = '7gjSeiprn8Z3ZL_Y9CyD_9dt2GE_lXZIx5Q-SnCI'
const secretKey = 'b3pj-uq0dLQ-xrRCBvlPU2atuO2GMWgbhNaakL0Q'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const options = {
    scope: 'exp-whh',
    expires: 7200
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)
module.exports = {
    uploadToken
}
