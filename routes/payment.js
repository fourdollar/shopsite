var express = require('express');
var request = require('request');
var router = express.Router();
var mysql = require('mysql');
var models = require('../models');


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
      res.render('payment', { title: '支付页面',products:products });
    }
  })
});

//======================支付部分===========================
// Add your credentials:
// Add your client ID and secret
// sandbox里注册的商户账号tcfengsiyuan@gmail.com的ID和secret
var CLIENT = 'AdLky7pvHZiIvEKJ5V1LfxzJ4cg5zz_Jgp8DVz2g5SYP6HtSPM4KtI9pIZah6cwrq-JwvBiI2VyJAoha';
var SECRET = 'ELmkQ0o7SNrJdJo_UQpKK01I1PFcO5SZ7hvMUf4MwbUI1a9h_6lzMzSOJp1Nk21P-iNTKpE8zHyMM60a';

var PAYPAL_API = 'https://api.sandbox.paypal.com';

router.post('/create-payment', function(req, res) {
    // 获取前台页面传过来的参数
    var params = req.body;
    console.log("======购买信息======");
    console.log(params);

    request.post(PAYPAL_API + '/v1/payments/payment', {
      auth: {
        user: CLIENT,
        pass: SECRET
      },
      body: {
        intent: 'sale',
        payer: {
          payment_method: 'paypal'
        },
        transactions: [{
          amount: {
            total: params.totalprice,
            currency: 'USD'
          },
          item_list: {
            items: [
              {
                name: params.name,
                description: params.description,
                quantity: params.quantity,
                price:params.price,
                currency: 'USD'
              }
            ],
            shipping_address: {
              recipient_name: params.recipient_name,
              line1: params.line1,
              line2: params.line2,
              city: params.city,
              country_code: 'US',
              postal_code: params.postal_code,
              phone: params.phone,
              state: params.state
            }
          }
        }],
        redirect_urls: {
          return_url: 'http://localhost:3000/success',
          cancel_url: 'http://localhost:3000/'
        }
      },
      json: true
    }, function (err, response) {
        if (err) {
          console.error(err);
          return res.sendStatus(500);
        }
        console.log("======response信息======");
        console.log(response.body);
        // 3. Return the payment ID to the client
        res.json({
          id: response.body.id
        });
    });
});

router.post('/execute-payment', function(req, res) {
    var paymentID = req.body.paymentID;
    var payerID   = req.body.payerID;

    // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
    request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID + '/execute', {
      auth: {
        user: CLIENT,
        pass: SECRET
      },
      body: {
        payer_id: payerID
      },
      json: true
    }, function (err, response) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }

      // 4. Return a success response to the client
      console.log("======response信息======");
      console.log(response.body);
      res.json({
        status: 'success',
        body:response.body
      });
    });

});


module.exports = router;
