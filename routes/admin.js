let express = require('express');
let router = express.Router();
let user = require('../src/models/user');
let movie = require('../src/models/movie');
let comment = require('../src/models/comment');
let recommend = require('../src/models/recommend');
let article = require('../src/models/article');
let crypto = require('crypto');
const init_token = 'TKL02o';

//添加电影
router.post('/movieAdd', function (req, res, next) {
    if (!req.body.username) {
        res.json({status: 1, message: "用户名为空"})
    }
    if (!req.body.token) {
        res.json({status: 1, message: "登录出错"})
    }
    if (!req.body.user_id) {
        res.json({status: 1, message: "用户传递出错"})
    }
    if (!req.body.movieName) {
        res.json({status: 1, message: "电影名称为空"})
    }
    // if (!req.body.movieImg) {
    //     res.json({ status: 1, message: "电影图片为空"})
    // }
    // if (!req.body.movieDownload) {// 考虑
    //     res.json({ status: 1, message: "电影下载地址为空"})
    // }
    // if(!req.body.movieMainPage) {
    //     var movieMainPage = false
    // }
    //验证
    let check = checkAdminPower(req.body.username, req.body.token, req.body.user_id)
    if (check.error == 0) {
        //验证用户情况
        user.findByUsername(req.body.username, function (err, findUser) {
            if (findUser[0].userAdmin && !findUser[0].userStop) {
                //判断其为管理员，根据数据集建立需要存入数据库的内容
                let saveMovie = new movie({
                    movieName: req.body.movieName,
                    movieImg: req.body.movieImg ? req.body.movieImg : '',
                    movieVideo: req.body.movieVideo ? req.body.movieVideo : '',
                    moviePreVideo: req.body.moviePreVideo ? req.body.moviePreVideo : '',
                    movieDownload: req.body.movieDownload ? req.body.movieDownload : '',
                    movieTime: req.body.movieTime ? req.body.movieTime : '',
                    movieNumSuppose: 0,
                    movieNumDownload: 0,
                    movieMainPage: req.body.movieMainPage ? req.body.movieMainPage : false,
                    movieTag: req.body.movieTag ? req.body.movieTag : '',
                    movieInfo: req.body.movieInfo ? req.body.movieInfo : '',
                    movieGrade: req.body.movieGrade ? req.body.movieGrade : 0,
                })
                saveMovie.save(function (err) {
                    if (err) {
                        res.json({status: 1, message: "电影保存失败：" + err})
                    } else {
                        res.json({status: 0, message: "电影添加成功"})
                    }
                })
            } else {
                res.json({status: 1, message: "用户没有获得权限或者已经被停用"})
            }
        })
    } else {
        res.json({error: 1, message: check.message})
    }
})

//删除电影
router.post('/movieDel', function (req, res, next) {
    if (!req.body.movie_id) {
        res.json({status: 1, message: "电影id传递失败"})
    }
    if (!req.body.username) {
        res.json({status: 1, message: "用户名为空"})
    }
    if (!req.body.token) {
        res.json({status: 1, message: "登录出错"})
    }
    if (!req.body.user_id) {
        res.json({status: 1, message: "用户传递出错"})
    }
    //验证
    let check = checkAdminPower(req.body.username, req.body.token, req.body.user_id)
    if (check.error == 0) {
        //验证用户情况
        user.findByUsername(req.body.username, function (err, findUser) {
            if (findUser[0].userAdmin && !findUser[0].userStop) {
                movie.remove({_id: req.body.movie_id}, function (err, delMovie) {
                    res.json({status: 0, message: '删除成功', data: delMovie})
                })
            } else {
                res.json({status: 1, message: "用户没有获得权限或者已经被停用"})
            }
        })
    } else {
        res.json({status: 1, message: check.message})
    }
})
//修改后台电影
router.post('/movieUpdate', function (req, res, next) {
    if (!req.body.movieData.movie_id) {
        res.json({status: 1, message: "电影id传递失败"})
    }
    if (!req.body.movieData.username) {
        res.json({status: 1, message: "用户名为空"})
    }
    if (!req.body.movieData.token) {
        res.json({status: 1, message: "登录出错"})
    }
    if (!req.body.movieData.user_id) {
        res.json({status: 1, message: "用户传递错误"})
    }
    //前台打包一个电影对象全部发送至后台存储
    let saveData = req.body.movieData
    // let saveData = {
    //     movieInfo:req.body.movieInfo
    // }
    //验证
    let check = checkAdminPower(req.body.movieData.username, req.body.movieData.token, req.body.movieData.user_id)
    if (check.error == 0) {
        user.findByUsername(req.body.movieData.username, function (err, findUser) {
            if (findUser[0].userAdmin && !findUser[0].userStop) {
                movie.update({_id: req.body.movieData.movie_id}, saveData, function (err, updataMovie) {
                    res.json({status: 0, message: '更新成功', data: updataMovie})
                })
            } else {
                res.json({error: 1, message: "用户没有获得权限或者已经停用"})
            }

        })
    } else {
        res.json({status: 1, message: check.message})
    }
});

// 显示所有电影
router.get('/movie', function (req, res, next) {
    movie.findAll(function (err, allMovie) {
        res.json({status: 0, message: '获取成功', data: allMovie})
    })
});

// //获取指定电影
// router.get('/movie', function (req, res, next) {
//     movie.findAll(function (err, allMovie) {
//         res.json({status: 0, message: '获取成功', data: allMovie})
//     })
// });

//显示后台的所有评论
router.get('/commentsList', function (req, res, next) {
    comment.findAll(function (err, allComment) {
        res.json({status: 0, message: '获取成功', data: allComment})
    })
});
//将评论进行审核
router.post('/checkComment', function (req, res, next) {
    if (!req.body.commentId) {
        res.json({status: 1, message: "评论id传递失败"})
    }
    if (!req.body.username) {
        res.json({status: 1, message: "用户名为空"})
    }
    if (!req.body.token) {
        res.json({status: 1, message: "登录出错"})
    }
    if (!req.body.id) {
        res.json({status: 1, message: "用户传递错误"})
    }
    let check = checkAdminPower(req.body.username, req.body.token, req.body.id)
    if (check.error == 0) {
        user.findByUsername(req.body.username, function (err, findUser) {
            if (findUser[0].userAdmin && !findUser[0].userStop) {
                comment.update({_id: req.body.commentId}, {check: true}, function (err, updateComment) {
                    res.json({status: 0, message: '审核成功', data: updateComment})
                })
            } else {
                res.json({error: 1, message: "用户没有获得权限或者已经停用"})
            }
        })
    } else {
        res.json({status: 1, message: check.message})
    }
});
//对于用户的评论删除
router.post('/delComment', function (req, res, next) {
    if (!req.body.commentId) {
        res.json({status: 1, message: "评论id传递失败"})
    }
    if (!req.body.username) {
        res.json({status: 1, message: "用户名为空"})
    }
    if (!req.body.token) {
        res.json({status: 1, message: "登录出错"})
    }
    if (!req.body.id) {
        res.json({status: 1, message: "用户传递错误"})
    }
    let check = checkAdminPower(req.body.username, req.body.token, req.body.id)
    if (check.error == 0) {
        user.findByUsername(req.body.username, function (err, findUser) {
            if (findUser[0].userAdmin && !findUser[0].userStop) {
                comment.remove({_id: req.body.commentId}, function (err, delComment) {
                    res.json({status: 0, message: '管理员' + req.body.username + '删除评论成功', data: delComment})
                })
            } else {
                res.json({error: 1, message: "用户没有获得权限或者已经停用"})
            }
        })
    } else {
        res.json({status: 1, message: check.message})
    }
});

// 封停用户
// 封停用户
router.post('/stopUser', function (req, res, next) {
    if (!req.body.username)
        res.json({status: 1, message: "用户名为空"});
    if (req.body.token != getMD5Password(req.body.user_id))
        res.json({status: 1, message: "用户登录出错"});
    if (!req.body.user_id)
        res.json({status: 1, message: "用户id为空"});
    if (!req.body.stopUser_id)
        res.json({status: 1, message: "需要封停的id为空"});
    user.findByUsername(req.body.username, function (err, getUser) {
        if (getUser[0].userAdmin && !getUser[0].userStop) {
            user.update({_id: req.body.stopUser_id}, {userStop: true}, function (err, stopUser) {
                if (stopUser.nModified == 0)
                    res.json({status: 1, message: "用户已被封停或用户id不存在"});
                else
                    res.json({status: 0, message: "用户封停成功", data: stopUser});
            })
        } else {
            res.json({status: 1, message: "用户不是管理员或账号已被停用"});
        }
    });
});

// 解封用户
router.post('/cancelStopUser', function (req, res, next) {
    if (!req.body.username)
        res.json({status: 1, message: "用户名为空"});
    if (req.body.token != getMD5Password(req.body.user_id))
        res.json({status: 1, message: "用户登录出错"});
    if (!req.body.user_id)
        res.json({status: 1, message: "用户id为空"});
    if (!req.body.cancelStopUser_id)
        res.json({status: 1, message: "需要解封的id为空"});
    user.findByUsername(req.body.username, function (err, getUser) {
        if (getUser[0].userAdmin && !getUser[0].userStop) {
            user.update({_id: req.body.cancelStopUser_id}, {userStop: false}, function (err, stopUser) {
                if (stopUser.nModified == 0)
                    res.json({status: 1, message: "用户已被解封或用户id不存在"});
                else
                    res.json({status: 0, message: "用户解封成功", data: stopUser});
            })
        } else {
            res.json({status: 1, message: "用户不是管理员或账号已被停用"});
        }
    });
});

//用户密码更改（管理员）
router.post('/changeUser', function (req, res, next) {
    if (!req.body.userId) {
        res.json({status: 1, message: "用户id传递失败"})
    }
    if (!req.body.username) {
        res.json({status: 1, message: "用户名为空"})
    }
    if (!req.body.token) {
        res.json({status: 1, message: "登录出错"})
    }
    if (!req.body.id) {
        res.json({status: 1, message: "用户传递错误"})
    }
    if (!req.body.newPassword) {
        res.json({status: 1, message: "用户新密码错误"})
    }
    let check = checkAdminPower(req.body.username, req.body.token, req.body.id)
    if (check.error == 0) {
        user.findByUsername(req.body.username, function (err, findUser) {
            if (findUser[0].userAdmin && !findUser[0].userStop) {
                user.update({_id: req.body.userId}, {password: req.body.newPassword}, function (err, updateUser) {
                    res.json({status: 0, message: '修改成功', data: updateUser})
                })
            } else {
                res.json({error: 1, message: "用户没有获得权限或者已经停用"})
            }
        })
    } else {
        res.json({status: 1, message: check.message})
    }
});

//后端所有用户的资料显示(列表)
router.post('/showUser', function (req, res, next) {
    if (!req.body.username) {
        res.json({status: 1, message: "用户名为空"})
    }
    if (!req.body.token) {
        res.json({status: 1, message: "登录出错"})
    }
    if (!req.body.user_id) {
        res.json({status: 1, message: "用户传递错误"})
    }
    let check = checkAdminPower(req.body.username, req.body.token, req.body.user_id)
    if (check.error == 0) {
        user.findByUsername(req.body.username, function (err, findUser) {
            if (findUser[0].userAdmin && !findUser[0].userStop) {
                user.findAll(function (err, alluser) {
                    res.json({status: 0, message: '获取成功', data: alluser})
                })
            } else {
                res.json({error: 1, message: "用户没有获得权限或者已经停用"})
            }
        })
    } else {
        res.json({status: 1, message: check.message})
    }
});
//管理员升级
router.post('/updateAdmin', function (req, res, next) {
    if (!req.body.username)
        res.json({status: 1, message: "用户名为空"});
    if (req.body.token != getMD5Password(req.body.user_id))
        res.json({status: 1, message: "用户登录出错"});
    if (!req.body.user_id)
        res.json({status: 1, message: "用户id为空"});
    if (!req.body.updateUser_id)
        res.json({status: 1, message: "需要管理权限的id为空"});
    user.findByUsername(req.body.username, function (err, getUser) {
        if (getUser[0].userAdmin && !getUser[0].userStop) {
            user.update({_id: req.body.updateUser_id}, {userAdmin: req.body.userAdmin}, function (err, updateUser) {
                if (updateUser.nModified == 0)
                    res.json({status: 1, message: "用户已经是管理员或用户id不存在"});
                else
                    res.json({status: 0, message: "用户权限修改成功", data: updateUser});
            })
        } else {
            res.json({status: 1, message: "用户不是管理员或账号已被停用"});
        }
    });
});

//后台权限的管理
router.post('/powerUpdate', function (req, res, next) {
    if (!req.body.userId) {
        res.json({status: 1, message: "用户id传递失败"})
    }
    if (!req.body.username) {
        res.json({status: 1, message: "用户名为空"})
    }
    if (!req.body.token) {
        res.json({status: 1, message: "登录出错"})
    }
    if (!req.body.id) {
        res.json({status: 1, message: "用户传递错误"})
    }
    var check = checkAdminPower(req.body.username, req.body.token, req.body.id)
    if (check.error == 0) {
        user.findByUsername(req.body.username, function (err, findUser) {
            if (findUser[0].userAdmin && !findUser[0].userStop) {
                user.update({_id: req.body.userId}, {userAdmin: true}, function (err, updateUser) {
                    res.json({status: 0, message: '修改成功', data: updateUser})
                })
            } else {
                res.json({error: 1, message: "用户没有获得权限或者已经停用"})
            }
        })
    } else {
        res.json({status: 1, message: check.message})
    }
});

//主页推荐修改
router.post('/recommendUpdate', function (req, res, next) {
    if (!req.body.recommendData.username)
        res.json({status: 1, message: "用户名为空"});
    if (req.body.recommendData.token != getMD5Password(req.body.recommendData.user_id))
        res.json({status: 1, message: "用户登录出错"});
    if (!req.body.recommendData.user_id)
        res.json({status: 1, message: "用户id为空"});
    if (!req.body.recommendData.recommend_id)
        res.json({status: 1, message: "电影id为空"});
    if (!req.body.recommendData.recommendImg)
        res.json({status: 1, message: "电影海报为空"});
    if (!req.body.recommendData.recommendTitle)
        res.json({status: 1, message: "电影标题为空"});
    // var movieMainPage = req.body.movieMainPage ?  req.body.movieMainPage : false;
    user.findByUsername(req.body.recommendData.username, function (err, getUser) {
        if (getUser[0].userAdmin && !getUser[0].userStop) {
            recommend.findById(req.body.recommendData.recommend_id, function (err, getRecommond) {
                if (getRecommond.length == 0)
                    res.json({status: 1, message: "该电影ID不存在"});
                else {
                    var updateContent = {
                        recommendTitle: req.body.recommendData.recommendTitle,
                        recommendImg: req.body.recommendData.recommendImg,
                        recommendSrc: req.body.recommendData.recommendSrc,
                    };
                    console.log(updateContent)
                    recommend.update({_id: req.body.recommendData.recommend_id}, updateContent, function (err, recommendUpdate) {
                        console.log(recommendUpdate)
                        if (recommendUpdate.nModified == 0 || err)
                            res.json({status: 1, message: "电影信息没有改变"});
                        else
                            res.json({status: 0, message: "电影信息修改成功", data: recommendUpdate});
                    })
                }
            })
        } else {
            res.json({status: 1, message: "用户不是管理员或账号已被停用"});
        }
    });
});


//主页推荐新增
router.post('/addRecommend', function (req, res, next) {
    if (!req.body.recommendData.token) {
        res.json({status: 1, message: "登录出错"})
    }
    if (!req.body.recommendData.user_id) {
        res.json({status: 1, message: "用户传递错误"})
    }
    if (!req.body.recommendData.recommendImg) {
        res.json({status: 1, message: "推荐电影海报为空"})
    }
    // if (!req.body.recommendData.recommendSrc) {
    //     res.json({status: 1, message: "推荐电影资源为空"})
    // }
    if (!req.body.recommendData.recommendTitle) {
        res.json({status: 1, message: "推荐电影标题为空"})
    }
    //验证
    let check = checkAdminPower(req.body.recommendData.username, req.body.recommendData.token, req.body.recommendData.user_id)
    if (check.error == 0) {
        //    有权限的情况下
        user.findByUsername(req.body.recommendData.username, function (err, findUser) {
            if (findUser[0].userAdmin && !findUser[0].userStop) {
                let saveRecommend = new recommend({
                    recommendImg: req.body.recommendData.recommendImg,
                    recommendSrc: req.body.recommendData.recommendSrc,
                    recommendTitle: req.body.recommendData.recommendTitle
                })
                saveRecommend.save(function (err) {
                    if (err) {
                        res.json({status: 1, message: err})
                    } else {
                        res.json({status: 0, message: '添加成功'})
                    }
                })
            } else {
                res.json({error: 1, message: "用户没有获得权限或者已经停用"})
            }
        })
    } else {
        res.json({status: 1, message: check.message})
    }
});

//删除主页推荐
router.post('/delRecommend', function (req, res, next) {
    if (!req.body.recommend_id) {
        res.json({status: 1, message: "评论id传递失败"})
    }
    if (!req.body.username) {
        res.json({status: 1, message: "用户名为空"})
    }
    if (!req.body.token) {
        res.json({status: 1, message: "登录出错"})
    }
    if (!req.body.user_id) {
        res.json({status: 1, message: "用户传递错误"})
    }
    let check = checkAdminPower(req.body.username, req.body.token, req.body.user_id)
    if (check.error == 0) {
        user.findByUsername(req.body.username, function (err, findUser) {
            if (findUser[0].userAdmin && !findUser[0].userStop) {
                recommend.remove({_id: req.body.recommend_id}, function (err, delRecommend) {
                    res.json({status: 0, message: '删除成功', data: delRecommend})
                })
            } else {
                res.json({error: 1, message: "用户没有获得权限或者已经停用"})
            }
        })
    } else {
        res.json({status: 1, message: check.message})
    }
});

// 删除用户
router.post('/delUser', function (req, res, next) {
    if (!req.body.username)
        res.json({status: 1, message: "用户名为空"});
    if (req.body.token != getMD5Password(req.body.user_id))
        res.json({status: 1, message: "用户登录出错"});
    if (!req.body.user_id)
        res.json({status: 1, message: "用户id为空"});
    if (!req.body.deleteUser_id)
        res.json({status: 1, message: "需要删除的用户id为空"});
    user.findByUsername(req.body.username, function (err, getUser) {
        if (getUser[0].userAdmin && !getUser[0].userStop) {
            user.remove({_id: req.body.deleteUser_id}, function (err, delUser) {
                if (delUser.deletedCount == 0)
                    res.json({status: 1, message: "需要删除的用户id不存在"});
                else
                    res.json({status: 0, message: "用户删除成功", data: delUser});
            })
        } else {
            res.json({status: 1, message: "用户不是管理员或账号已被停用"});
        }
    });
});

router.post('/delArticle', function (req, res, next) {
    if (!req.body.article_id) {
        res.json({status: 1, message: "影评id传递失败"})
    }
    if (!req.body.username) {
        res.json({status: 1, message: "用户名为空"})
    }
    if (!req.body.token) {
        res.json({status: 1, message: "登录出错"})
    }
    if (!req.body.user_id) {
        res.json({status: 1, message: "用户传递错误"})
    }
    let check = checkAdminPower(req.body.username, req.body.token, req.body.user_id)
    if (check.error == 0) {
        user.findByUsername(req.body.username, function (err, findUser) {
            if (findUser[0].userAdmin && !findUser[0].userStop) {
                article.remove({_id: req.body.article_id}, function (err, delRecommend) {
                    res.json({status: 0, message: '删除成功', data: delRecommend})
                })
            } else {
                res.json({error: 1, message: "用户没有获得权限或者已经停用"})
            }
        })
    } else {
        res.json({status: 1, message: check.message})
    }
});


//验证用户的后台管理权限
//验证用户的token和登录状态
function checkAdminPower(name, token, id) {
    if (token == getMD5Password(id)) {
        return {error: 0, message: "用户登录成功"}
    } else {
        return {error: 1, message: "用户登录错误"}
    }
}

//获取md5值
function getMD5Password(id) {
    let md5 = crypto.createHash('md5');
    let token_before = id + init_token
    return md5.update(token_before).digest('hex')
}

module.exports = router;
