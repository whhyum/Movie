let mongoose = require('../common/db');
let recommend = new mongoose.Schema({
  recommendImg:String,
  recommendSrc:String,
  recommendTitle:String
})
//通过id获得主页推荐
recommend.statics.findByIndexId = function (m_id,callBack){
  this.find({findByIndexId: m_id},callBack);
};

recommend.statics.findById = function (recommend_id,callBack){
  this.find({_id: recommend_id},callBack);
};

recommend.statics.findAll = function (callBack){
  this.find({},callBack);
};
let recommendModel = mongoose.model('recommend',recommend);
module.exports = recommendModel
