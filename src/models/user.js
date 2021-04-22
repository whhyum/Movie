let mongoose = require ('../common/db');
//用户数据集
let user = new mongoose.Schema({
  username:String,
  password:String,
  userMail:String,
  userAdmin:Boolean,
  userPower:Number,
  userStop:Boolean,
  userAvatar:String
})
//用户查找方式
user.statics.findAll = function (callBack){
  this.find({},callBack);
};
//id
user.statics.findByUserId = function (id, callBack) {
  this.find({_id:id}, callBack);
};

//使用用户名查找用户
user.statics.findByUsername = function (name,callBack){
  this.find({username:name},callBack)
};
//登录匹配
user.statics.findUserLogin = function (name,password,callBack){
  this.find({username:name,password:password},callBack)
};
//验证邮箱、用户名查找用户密码
user.statics.findUserPassword = function (name,mail,callBack){
  this.find({username:name,userMail:mail},callBack)
};
let userModel = mongoose.model('user',user);
module.exports = userModel;

