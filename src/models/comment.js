let mongoose = require ('../common/db');
//评论数据集
let comment = new mongoose.Schema({
  movie_id:String,
  username:String,
  userAvatar:String,
  context:String,
  check:Boolean
})
//option
comment.statics.findByMovieId = function (m_id,callBack){
  this.find({movie_id:m_id},callBack);
};

comment.statics.findAll = function (callBack){
  this.find({},callBack);
};

//实现分页展示评论
comment.statics.findByPage = function (nStart,nLimit,m_id,callBack){
  this.find({movie_id:m_id},callBack).skip((nStart-1)*nLimit).limit(Number(nLimit))
}

comment.statics.findNum = function (m_id,callBack){
  this.find({movie_id:m_id},callBack).count()
}

let commentModel = mongoose.model('comment',comment);
module.exports = commentModel
