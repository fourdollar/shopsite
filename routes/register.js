var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var models = require('../models');
var crypto = require('crypto');

/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: '注册' });
});

router.post('/adduser', function(req, res) {
    // 获取前台页面传过来的参数
    var params = req.body;
    var md5 = crypto.createHash('md5');
    // 密码加密
    params.password = md5.update(req.body.password).digest('hex');

    // 用户名检查
    models.user.findAll({
      where: {
        username:params.username
      }
    }).then(function (users) {
      if (users.length>0) {
        console.log('用户名存在',params.username);
        res.send('用户名存在');
      } else {
        models.user.create(params)
        .then(function (p) {
           console.log('created.' + JSON.stringify(p));
           console.log('创建用户成功：'+params.username);
           res.send('创建成功');
        }).catch(function (err) {
           console.log('failed: ' + err);
        });
      }
    }).catch(function (err) {
       // error
       console.log('failed: ' + err);
    });
});

module.exports = router;
