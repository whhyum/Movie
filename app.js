var createError = require('http-errors');
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes');
var usersRouter = require('./routes/users');
let admin = require('./routes/admin');
let movie = require('./routes/movie');
let upload = require('./routes/upload');
// const bodyparse = require('body-parser');
const cors = require("cors");

var app = express();

app.use(cors({
  origin:[ //允许跨域的客户端源头有哪些
    'http://localhost:8080', //vue脚手架
    "http://127.0.0.1:5050", //live server
    "http://whh1movie.applinzi.com/" //新浪云上的vue项目
  ],
  credentials:true //要求允许携带cookie
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

process.env.PORT = 5050;

app.listen(5050,()=>{
  console.log('服务器创建成功！')
})

app.all('*',function (req, res, next) {
  //跨域请求
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  // res.header("X-Powered-By", ' 3.2.1')
  // res.header("Content-Type", "application/json;charset=utf-8");
  // next();

  if (req.method == 'OPTIONS') {
    res.send(200);  /*请求快速返回*/
  }
  else {
    next();
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', admin);
app.use('/movie', movie);
app.use('/upload', upload);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
