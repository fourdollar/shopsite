var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var models = require('../models');
var crypto = require('crypto');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: '登录' });
});


router.post('/getuser', function(req, res) {
    // 获取前台页面传过来的参数
    var params = req.body;
    var md5 = crypto.createHash('md5');
    // 密码解密
    params.password = md5.update(req.body.password).digest('hex');


    models.user.findAll({
        where: {
          username:params.username
        }
    }).then(function (users) {
        if (users.length == 0) {
          // 用户名检查
            console.log('用户不存在',params.username);
            res.send('用户不存在');
        } else {
            if (users[0].dataValues.password !== params.password) {
              // 密码检查
                console.log(params.username,'  密码错误');
                res.send('密码错误');
            } else {
                console.log(users[0].dataValues.username,'  登陆成功');
                res.cookie('userid', params.username);
                res.send('登陆成功');
            }
      }
    }).catch(function (err) {
       // error
       console.log('failed: ' + err);
    });
});

module.exports = router;
