let mongoose = require ('../common/db');
//评论数据集
let article = new mongoose.Schema({
    username:String,
    userAvatar:String,
    context:String,
    time:String,
    title:String,
    description:String,
    img:String,
    num:Number
})

article.statics.findByPage = function (nStart,nLimit,callBack){
    this.find({},callBack).skip((nStart-1)*nLimit).limit(Number(nLimit))
}
article.statics.findById = function (article_id,callBack){
    this.find({_id:article_id},callBack);
};
article.statics.findNum = function (callBack){
    this.find({},callBack).count()
}
let articleModel = mongoose.model('article',article);
module.exports = articleModel
