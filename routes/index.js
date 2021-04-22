let express = require('express');
let router = express.Router();
// let mongoose = require('mongoose');
let user = require('../src/models/user');
let recommend = require('../src/models/recommend');
// let comment = require('../src/models/comment');
let movie = require('../src/models/movie');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//显示主页的推荐大图
router.get('/showIndex', function (req, res, next){
  recommend.findAll(function (err, getRecommend) {
    res.json({status: 0, message:"获取推荐",data: getRecommend})
  })
});
//显示排行榜,电影列表
router.get('/showMovie', function (req, res, next){
  movie.findAll(function (err, getMovies){
    res.json({status: 0, message:"获取电影",data: getMovies})
  })
});

//分类查看电影
router.post('/showTag',function (req, res, next){
    if(!req.body.movieTag){
        res.json({status: 1, message: "电影标签传递失败"})
    }
    let num = 1
    movie.findByMovieTagNum(function (err, getMovieNum) {
        num = getMovieNum;
    })
    movie.findByMovieTag(req.body.start,req.body.limit,req.body.movieTag, function (err, getMovie) {
        res.json({status: 0, message:"获取电影",data: getMovie,totalNum:num})
    })
});

//获取主页电影推荐
router.get('/getIndexMovie', function (req, res, next) {
    // if(req.body.id) {
        movie.find({movieMainPage:true}, function (err, allMovie) {
            res.json({status: 0, message: '获取成功', data:allMovie})
        })
    // }else{
    //     res.json({status:1,message:'获取失败'})
    // }
});

//搜索电影
router.post('/showName',function (req, res, next){
    if(!req.body.movieName){
        res.json({status: 1, message: "请输入电影名称"})
    }
    movie.findByMovieName(req.body.movieName, function (err, getMovie) {
        res.json({status: 0, message:"获取电影",data: getMovie})
    })
});


//显示用户个人信息的内容
router.post('/showUser', function (req, res, next){
  if(!req.body.user_id){
    res.json({status: 1, message: "用户状态出错"})
  }
  user.findById(req.body.user_id, function (err, getUser) {
    res.json ({status: 0, message: "获取成功",data:{
        user_id:getUser._id,
        username:getUser.username,
        userMail:getUser.userMail,
        userStop:getUser.userStop
      }})
  })
});
module.exports = router;
