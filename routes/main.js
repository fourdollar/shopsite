var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET main page. */
router.get('/', function(req, res, next) {
  // 提取商品信息
  models.product.findAll().then(function (data) {
    var products = [];
    if (data.length > 0) {
      for (var i in data) {
        products.push({
          id:data[i].dataValues.id,
          name:data[i].dataValues.name,
          num:data[i].dataValues.num,
          description:data[i].dataValues.description,
          price:data[i].dataValues.price
        })
      }
      console.log(products);
      res.render('main', { title: '购物页面',products:products });
    }

  }).catch(function (err) {
     // error
     console.log('failed: ' + err);
     res.render('main', { title: '购物页面' });
  });
});


module.exports = router;
