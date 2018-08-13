var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('userinfo', { title: '用户资料' });
});

router.post('/getuser', function(req, res) {
    // 获取前台页面传过来的参数
    var params = req.body;

    // 用户信息查找
    models.user.findAll({
        where: {
          username:params.username
        }
    }).then(function (users) {
      var userinfo = [];
      if (users.length > 0) {
        for (var i in users) {
          userinfo.push({
            id:users[i].dataValues.id,
            username:users[i].dataValues.username,
            lastname:users[i].dataValues.lastname,
            firstname:users[i].dataValues.firstname,
            email:users[i].dataValues.email,
            phone:users[i].dataValues.phone,
            address1:users[i].dataValues.address1,
            address2:users[i].dataValues.address2,
            postal_code:users[i].dataValues.postal_code,
            state:users[i].dataValues.state,
            city:users[i].dataValues.city
          })
          console.log(users[i].dataValues);
        }
        res.send(userinfo);
      } else {
        console.log(users);
      }
    }).catch(function (err) {
       // error
       console.log('failed: ' + err);
    });
});

router.post('/changeuserinfo', function(req, res) {
    // 获取前台页面传过来的参数
    var params = req.body;

    // 用户信息查找
    models.user.update({
      lastname:params.lastname,
      firstname:params.firstname,
      email:params.email,
      phone:params.phone,
      address1:params.address1,
      address2:params.address2,
      postal_code:params.postal_code,
      city:params.city,
      state:params.state
    },{
      where: {
        username:params.username
      }
    }).then(function (user) {
      console.log(user);
    }).catch(function (err) {
       // error
       console.log('failed: ' + err);
    });
});

module.exports = router;
