let mongoose = require ('../common/db');
//评论数据集
let movie = new mongoose.Schema({
  // _id:String,
  movieName:String,
  movieImg:String,
  movieVideo:String,
  movieDownload:String,
  moviePreVideo:String,
  movieInfo:String,
  movieTime:String,
  movieNumSuppose: Number,
  movieNumDownload:Number,
  movieMainPage:Boolean, //显示主页
  movieTag: String,
  movieGrade: Number
})
//option
movie.statics.findById = function(movie_id,callBack){
  this.find({_id:movie_id},callBack);
};
movie.statics.findAll = function(callBack){
  this.find({},callBack);
};
movie.statics.findByMovieName = function(movieName,callBack){
  this.find({"movieName":{ $regex:movieName }},callBack);
};
movie.statics.findByMovieTag = function(nStart,nLimit,movieTag,callBack){
  this.find({movieTag:movieTag},callBack).skip((nStart-1)*nLimit).limit(Number(nLimit));
};

movie.statics.findByMovieTagNum = function(movieTag,callBack){
  this.find({movieTag:movieTag},callBack).count();
};

//实现分页展示电影
movie.statics.findByPage = function (nStart,nLimit,callBack){
  this.find({},callBack).skip((nStart-1)*nLimit).limit(Number(nLimit))
}

movie.statics.findNum = function (callBack){
  this.find({},callBack).count()
}

let movieModel = mongoose.model('movie',movie);
module.exports = movieModel
