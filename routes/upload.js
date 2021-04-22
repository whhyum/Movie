//七牛云上传
const express = require('express');
const router = express.Router();
const qiniu = require("qiniu");

router.get('/token', (req, res, next) => {
    // console.log(uploadToken)
    const accessKey = '7gjSeiprn8Z3ZL_Y9CyD_9dt2GE_lXZIx5Q-SnCI';
    const secretKey = 'b3pj-uq0dLQ-xrRCBvlPU2atuO2GMWgbhNaakL0Q';
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    // res.status(200).send(uploadToken)
    const options = {
        scope: 'exp-whh'
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    res.json({status:0,data:{token:uploadToken}})
})

// const bodyparse = require('body-parser')
// //要上传的空间名
// // const bucket = 'exp-whh';
// // const imageUrl = ''; // 域名名称
// const accessKey = '7gjSeiprn8Z3ZL_Y9CyD_9dt2GE_lXZIx5Q-SnCI';
// const secretKey = 'b3pj-uq0dLQ-xrRCBvlPU2atuO2GMWgbhNaakL0Q';
// const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
//
// const options = {
//     scope: 'exp-whh',
//     expires: 7200
// };
// const putPolicy = new qiniu.rs.PutPolicy(options);
// const uploadToken = putPolicy.uploadToken(mac);
//
// const config = new qiniu.conf.Config();
// config.zone = qiniu.zone.Zone_z2;
//
// router.use(bodyparse.json());
//
// router.get('/token', (req, res, next) => {
//     // console.log(uploadToken)
//     res.status(200).send(uploadToken)
// })
//
// // 图片上传
// router.post('/img', function(req, res, next){
//     // 图片数据流
//     var imgData = req.body.imgData;
//     // 构建图片名
//     var fileName = Date.now() + '.png';
//     // 构建图片路径
//     var filePath = './public/tmp/' + fileName;
//     //过滤data:URL
//     var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
//     var dataBuffer = new Buffer(base64Data, 'base64');
//     fs.writeFile(filePath, dataBuffer, function(err) {
//         // res.header('Access-Control-Allow-Origin', '*');
//         if(err){
//             res.end(JSON.stringify({status:'102',msg:err}));
//         }else{
//             var localFile = filePath;
//             var formUploader = new qiniu.form_up.FormUploader(config);
//             var putExtra = new qiniu.form_up.PutExtra();
//             var key = fileName;
//             // 文件上传
//             formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
//                                                                                  respBody, respInfo) {
//                 if (respErr) {
//                     res.end(JSON.stringify({status:'-1',msg:'上传失败',error:respErr}));
//                 }
//                 if (respInfo.statusCode == 200) {
//                     var imageSrc = imageUrl + respBody.key;
//                     res.end(JSON.stringify({status:'200',msg:'上传成功',imageUrl:imageSrc}));
//                 } else {
//                     res.end(JSON.stringify({status:'-1',msg:'上传失败',error:JSON.stringify(respBody)}));
//                 }
//                 // 上传之后删除本地文件
//                 fs.unlinkSync(filePath);
//             });
//         }
//     });
// })
//
module.exports = router;
