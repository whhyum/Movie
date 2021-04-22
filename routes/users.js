let express = require('express');
let router = express.Router();
let user = require('../src/models/user');
let comment = require('../src/models/comment');
let movie = require('../src/models/movie');
let mail = require('../src/models/mail');
let crypto = require('crypto');
const init_token = 'TKL02o';
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
//login
router.post('/login', function (req, res, next) {
    if (!req.body.username) {
        res.json({status: 1, message: "用户名为空"})
    }
    if (!req.body.password) {
        res.json({status: 1, message: "密码为空"})
    }
    user.findUserLogin(req.body.username, req.body.password, function (err, userSave) {
        if (userSave.length != 0) {
            if(userSave[0].userStop == true) {
                res.json({status: 1, message: "该账户已被封停"});
            }
            else{
            //通过MD5查看密码
            let token_after = getMD5Password(userSave[0]._id)
            res.json({status: 0, data: {token: token_after, user: userSave}, message: "用户登录成功"})
            }
        } else {
            res.json({status: 1, message: "用户名或者密码错误"})
        }
    })
});
let code = "";
//测试邮箱
router.post('/mail', function (req, res, next) {

    code = Math.random().toString().substring(2, 7);

    let regEmail = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
    if (!req.body.userMail) {
        res.json({status: 1, message: "用户邮箱为空"})
    } else if (!regEmail.test(req.body.userMail)) {
        res.json({status: 1, message: "邮箱格式不正确"})
    } else {
        mail.send(req.body.userMail, code, function (data) {
            if (data == 1) {
                res.json({status: 1, msg: '验证码发送失败'})
            } else {
                res.json({status: 0, msg: '验证码发送成功'})
            }
        })
    }
})

//register
router.post('/register', function (req, res, next) {
    if (!req.body.username) {
        res.json({status: 1, message: "用户名为空"})
    }
    if (!req.body.password) {
        res.json({status: 1, message: "密码为空"})
    }
    let regEmail = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
    if (!req.body.userMail) {
        res.json({status: 1, message: "用户邮箱为空"})
    } else if (!regEmail.test(req.body.userMail)) {
        res.json({status: 1, message: "邮箱格式不正确"})
    } else if (req.body.num != code) {
        res.json({status: 1, message: '验证码错误' + code})
    } else {
        user.findByUsername(req.body.username, function (err, userSave) {
            if (userSave.length != 0) {//error
                res.json({status: 1, message: '用户名已被注册'})
            } else {
                let registerUser = new user({
                    username: req.body.username,
                    password: req.body.password,
                    userMail: req.body.userMail,
                    userAdmin: 0,
                    userPower: 0,
                    userStop: 0,
                    userAvatar: req.body.userAvatar   //默认头像

                })
                registerUser.save(function () {
                    res.json({status: 0, message: "注册成功"})
                })
            }
        })
    }

});

//获取用户详细信息
router.post('/showUser', function (req, res, next) {
    if (!req.body.user_id){
        res.json({status: 1, message: "用户id为空"});
        return;
    }
    user.findByUserId(req.body.user_id, function (err, getUserInfo) {
        res.json({status: 0, message: "获取用户身份信息成功", data: getUserInfo});
    })
});

//postComment评价
router.post('/postComment', function (req, res, next) {
    if (!req.body.username) {
        let uname = "匿名用户"
    }
    if (!req.body.movie_id) {
        res.json({status: 1, message: "电影为空"})
    }
    if (!req.body.context) {
        res.json({status: 1, message: "评论内容为空"})
    }
    //建立评论数据内容
    let saveComment = new comment({
        movie_id: req.body.movie_id,
        username: req.body.username ? req.body.username : "匿名用户",
        userAvatar: req.body.userAvatar? req.body.userAvatar : "https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar",
        context: req.body.context,
        check: 0
    })
    //保存评论
    saveComment.save(function (err) {
        if (err) {
            res.json({status: 1, message: err})
        } else {
            res.json({status: 0, message: "评论成功"})
        }
    })
});
//获取相关电影的点赞和下载数(更改后)
router.post('/showNumber', function (req, res, next) {
    if(req.body.movie_id) {
        movie.findById(req.body.movie_id,function (err, getMovie) {
            res.json({status: 0, message: '获取成功', data: {movieNumDownload: getMovie[0].movieNumDownload,movieNumSuppose:getMovie[0].movieNumSuppose}})
        })
    }else{
        res.json({status:1,message:'获取失败'})
    }
});

//support点赞
router.post('/support', function (req, res, next) {
    if (!req.body.movie_id) {
        res.json({status: 1, message: "电影id传递失败"})
    }
    movie.findById(req.body.movie_id, function(err, getMovie) {
        //更新操作
        movie.update({_id: req.body.movie_id}, {movieNumSuppose: getMovie[0].movieNumSuppose+1},
            function (err) {
                if (err) {
                    res.json({status: 1, message: "点赞失败", data: err,Num:getMovie[0].movieNumSuppose})
                }
                res.json({status: 0, message: "点赞成功"})
            })
    })
});
//find
router.post('/findPassword', function (req, res, next) {
//需要输入正确的用户邮箱
    if (!req.body.username) {
        res.json({status: 1, message: "请输入用户名"})
    }
    if (!req.body.userMail) {
        res.json({status: 1, message: "请输入用户邮箱"})
    }
    if(!req.body.userNewPassword){
        res.json({status: 1, message: "请输入新密码"})
    }else if(!req.body.userRePassword){
        res.json({status: 1, message: "请再次输入新密码"})
    }else if(req.body.userRePassword != req.body.userNewPassword){
        res.json({status: 1, message: "请确认两次输入的密码是否一致"})
    }else{
        user.findUserPassword(req.body.username, req.body.userMail, function (err, userFound) {
            if (userFound.length != 0) {
                user.update({_id: userFound[0].id}, {password: req.body.userRePassword}, function (err, userUpdate) {
                    if (err) {
                        res.json({status: 1, message: "更改错误", data: err})
                    }
                    res.json({status: 0, message: "更改成功", data: userUpdate})
                })
            } else {
                res.json({status: 1, message: "请检查信息是否填写正确"})
            }
        })
    }
});

router.post('/changeInfo',function (req,res,next){
    if (!req.body.username) {
        res.json({status: 1, message: "请输入用户名"})
    }
    user.update({_id:req.body.user_id}, {username: req.body.username,userAvatar:req.body.userAvatar}, function (err, userUpdate) {
        if (err) {
            res.json({status: 1, message: "更改错误", data: err})
        }
        res.json({status: 0, message: "更改成功", data: userUpdate})
    })
})


//查找、更改密码
router.post('/Password', function (req, res, next) {
//需要输入正确的用户邮箱
    if (req.body.repassword) {
        //存在repassword，需要验证登录情况或者验证code
        if (req.body.token) {
            //验证登录状态，当存在code登录状态时,用户输入用户名，旧密码，新密码
            if (!req.body.user_id) {
                res.json({status: 1, message: "用户登录错误"})
            }
            if (!req.body.password) {
                res.json({status: 1, message: "用户旧密码错误"})
            }
            if (req.body.token == getMD5Password(req.body.user_id)) {
                user.findOne({_id: req.body.user_id, password: req.body.password}, function (err, checkUser) {
                    if (checkUser) {
                        user.update({_id: req.body.user_id}, {password: req.body.repassword}, function (err, userUpdate) {
                            if (err) {
                                res.json({status: 1, message: "更改错误", data: err})
                            }
                            res.json({status: 0, message: "更改成功", data: userUpdate})
                        })
                    } else {
                        res.json({status: 1, message: "用户旧密码错误"})
                    }
                })
            } else {
                res.json({status: 1, message: "用户登录错误"})
            }
        } else {
            //不存在code时，输入邮箱验证邮箱是否正确
            user.findUserPassword(req.body.username, req.body.userMail, function (err, userFound) {
                if (userFound.length != 0) {
                    user.update({_id: userFound[0].id}, {password: req.body.repassword}, function (err, userUpdate) {
                        if (err) {
                            res.json({status: 1, message: "更改错误", data: err})
                        }
                        res.json({status: 0, message: "更改成功", data: userUpdate})
                    })
                } else {
                    res.json({status: 1, message: "信息错误"})
                }
            })

        }
    } else {
        //验证mail
        if (!req.body.username) {
            res.json({status: 1, message: "用户名为空"})
        }
        if (!req.body.userMail) {
            res.json({status: 1, message: "用户邮箱为空"})
        }
        user.findUserPassword(req.body.username, req.body.userMail, function (err, userFound) {
            if (userFound.length != 0) {
                res.json({
                    status: 0,
                    message: "验证成功，请修改密码",
                    data: {username: req.body.username, userMail: req.body.userMail}
                })
            } else {
                res.json({status: 1, message: "信息错误"})
            }
        })
    }

});
//download
router.post('/download', function (req, res, next) {
    if (!req.body.movie_id) {
        res.json({status: 1, message: "电影id传递失败"})
    }
    movie.findById(req.body.movie_id, function (err, supportMovie) {
        movie.update({_id: req.body.movie_id}, {movieNumDownload: supportMovie.movieDownload + 1}, function (err) {
            if (err) {
                res.json({status: 1, message: "点赞失败", data: err})
            }
            res.json({status: 0, message: "下载成功", data: supportMovie.movieDownload})
        })
    })
});

//发表影评
router.post('/postArticle', function (req, res, next) {
    if (!req.body.context) {
        res.json({status: 1, message: "内容为空"})
    }
    if (!req.body.title) {
        res.json({status: 1, message: "标题为空"})
    }
    //建立评论数据内容
    let saveArticle = new article({
        username: req.body.username ? req.body.username : "匿名用户",
        userAvatar: req.body.userAvatar? req.body.userAvatar : "https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar",
        time:req.body.time,
        num:0,
        img:req.body.img,
        description:req.body.description,
        context: req.body.context,
        title: req.body.title
    })
    //保存评论
    saveArticle.save(function (err) {
        if (err) {
            res.json({status: 1, message: err})
        } else {
            res.json({status: 0, message: "发表成功"})
        }
    })
});

//show
router.post('/showArticle', function (req, res, next) {
    let num = 1
    article.findNum(function (err, getMovieNum) {
        num = getMovieNum;
    })
    article.findByPage(req.body.start,req.body.limit, function (err, getData) {
        res.json({status: 0, message: '获取成功', data:getData,totalNum:num})
        console.log(getData)
    })

});
router.post('/showArticleDetail', function (req, res, next) {
    if(!req.body.article_id){
        res.json({status: 1, message: '获取失败'})
    }
    article.findById(req.body.article_id, function (err, getData) {
        res.json({status: 0, message: '获取成功', data:getData})
    })

});

router.post('/articleNum', function (req, res, next) {

    article.findNum( function (err, getNum) {
        res.json({status: 0, message: '获取成功', data:getNum})
    })
});

//support点赞
router.post('/supportA', function (req, res, next) {
    if (!req.body.article_id) {
        res.json({status: 1, message: "影评id传递失败"})
    }
    article.findById(req.body.article_id, function(err, getData) {
        //更新操作
        article.update({_id: req.body.article_id}, {num: getData[0].num+1},
            function (err) {
                if (err) {
                    res.json({status: 1, message: "点赞失败", data: err,Num:getData[0].num+1})
                }
                console.log("shishi"+getData[0])
                res.json({status: 0, message: "点赞成功",data:getData[0].num+1})
            })
    })
});


function getMD5Password(id) { //获取md5
    let md5 = crypto.createHash('md5');
    let token_before = id + init_token //返回token值作为登录状态
    return md5.update(token_before).digest('hex')
}

module.exports = router;
