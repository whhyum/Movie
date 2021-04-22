let mongoose = require('mongoose');
let url = 'mongodb://localhost/movieService';
let MONGODB_URI = 'mongodb://root:4uaDdKSu6579ilMroGkbkqd89CTHcBLiK2voQYzO@krqkyjvprcrb.mongodb.sae.sina.com.cn:10041,hpeofolntwmp.mongodb.sae.sina.com.cn:10041/admin?replicaSet=rs90943';

mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true},function (err,db){
    if (err) throw err;
    console.log('数据库已经建立连接');
    // db.close();
});
module.exports = mongoose;
