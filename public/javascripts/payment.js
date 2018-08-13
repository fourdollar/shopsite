$(function() {
  //检查是否登录
  var r = document.cookie.split(';');
  var userid="";
  var buyerInfo = {};
  r.forEach(function(value) {
    var content = value.split('=');
    if (content[0].match('userid')) {
      userid = content[1].trim();
      $('.userid').text(content[1].trim());
    };
  });

  if (userid!=="") {
    // 取得用户信息
    $.post('/userinfo/getuser', {username: userid})
    .done(function onSucess(res) {
      if (res == '用户不存在') {
        console.log("用户不存在");
        } else {
          $('.lastname').val(res[0].lastname);
          $('.firstname').val(res[0].firstname);
          $('.email').val(res[0].email);
          $('.phone').val(res[0].phone);
          $('.address1').val(res[0].address1);
          $('.address2').val(res[0].address2);
          $('.postal_code').val(res[0].postal_code);
          $('.state').val(res[0].state);
          $('.city').val(res[0].city);
        }
    });
  }else {
    // 没有登录的话前往登录页面
    window.location.href = "/login";
  }

  var price = parseInt($(".productprice span").text());
  var purchasenum = parseInt($('.spinner .purchasenum').text());
  var productname = $(".productname").text();
  var description = $(".description").text();

  // 修改商品数量
  $('.spinner .btn:first-of-type').on('click', function() {
    $('.spinner .purchasenum').text( parseInt($('.spinner .purchasenum').text()) + 1);
    purchasenum = parseInt($('.spinner .purchasenum').text());
    $(".productprice span").text(price*purchasenum);
  });
  $('.spinner .btn:last-of-type').on('click', function() {
    if (purchasenum>1) {
      $('.spinner .purchasenum').text( parseInt($('.spinner .purchasenum').text()) - 1);
      purchasenum = parseInt($('.spinner .purchasenum').text());
      $(".productprice span").text(purchasenum*price);
    }
  });

  // 渲染支付按钮
  paypal.Button.render({
  env: 'sandbox', // 使用sandbox
  // Set up the payment:
  // 1. Add a payment callback
  client: {
    sandbox: 'AUKFPPhADQDxBRU4KO5pwQZRTI2_UBv9vgCkRT9aL_H2vor210bLCChuJwP--uoPeWSu1abJbtEfhymY',
    production: 'demo_production_client_id'
  },
  locale: 'en_US',
  style:{
    label:"buynow",
    color:"black",
    size:"medium"
  },
  payment: function(data, actions) {
    // 2. Make a request to your server
    // 取得需要的商品以及用户信息
    var payparams = {
      totalprice: parseInt($(".productprice span").text()),
      price: price,
      name: productname,
      description: description,
      quantity: parseInt($('.spinner .purchasenum').text()),
      recipient_name: $('.firstname').val()+" "+$('.lastname').val(),
      line1: $('.address1').val(),
      line2: $('.address2').val(),
      city: $('.city').val(),
      country_code: 'US',
      postal_code: $('.postal_code').val(),
      phone: $('.phone').val(),
      state: $('.state').val()
    }

    return actions.request.post('/payment/create-payment/',payparams)
        .then(function(res) {
          // 3. Return res.id from the response
          return res.id;
        });
  },
  // Execute the payment:
  // 1. Add an onAuthorize callback
  onAuthorize: function(data, actions) {
    // 2. Make a request to your server
    return actions.request.post('/payment/execute-payment/', {
        paymentID: data.paymentID,
        payerID:   data.payerID
      })
        .then(function(res) {
          // 3. Show the buyer a confirmation message.
          // 从response里取得transactionID并转向购买成功画面
          console.log(res.body.transactions[0].related_resources[0].sale.id);
          window.location.href = "/success/"+res.body.transactions[0].related_resources[0].sale.id;

        });
  }
}, '#paypal-button');

});
