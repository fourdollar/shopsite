var express = require('express');
var request = require('request');
var router = express.Router();
var models = require('../models');
var braintree = require('braintree');


router.get("/:id", function(req, res) {
  // 提取选择的商品信息
  models.product.findAll({
    where: {
      id:req.params.id
    }
  }).then(function (data) {
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
      res.render('ecbt', { title: 'ecbt支付页面',products:products });
    }
  })
});

//======================支付部分===========================
router.post("/clienttoken/", function(req, res) {
    // 2. Set up a gateway using your Braintree access token
    var gateway = braintree.connect({
        accessToken : 'access_token$sandbox$s5df3fpzxtk7rn9f$d5c6b78a75e50ab4eab4695cfc4bc617'
    });

    gateway.clientToken.generate({}, function (err, response) {
        if (err) {
          console.log(err);
        }
        res.json(response.clientToken);
    });
});

router.post('/execute-payment/', function (req, res) {
    // 2. Get the nonce from the request body
    var nonce = req.body.nonce;
    console.log("reqbody:");
    console.log(req.body);
    
    // 3. Set up the parameters to execute the payment
    var saleRequest = {
      amount: '13.37',
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true
      }
    };
    // 4. Call the Braintree gateway to execute the payment
    gateway.transaction.sale(saleRequest, function (err, result) {
      if (err || !result.success) {
        return res.status(500).json({ status: 'error' });
      }
      // 5. Return a success response to the client
      return res.status(200)
        .json({ status: 'success', id: result.transaction.id });
    });
  })


module.exports = router;
