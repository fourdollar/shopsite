$(function() {
    //检查是否登录
    var r = document.cookie.split(';');
    var userid="";
    var buyerInfo = {};
    var sandbox;
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
        braintree: braintree,
        env: 'sandbox',
        // Add your credentials:
        // 1. Call your server to generate Braintree client tokens for each env
        client: {
          sandbox: paypal.request.post('/ecbt/clienttoken'),
        //   production: paypal.request.get('/ecbt/client-token?env=production')
        },
        // Set up the payment:
        // 1. Add a payment callback
        payment: function (data, actions) {
            // 2. Call actions.payment.create
            return actions.payment.create({
                payment: {
                    transactions: [{
                        amount: {
                            total: parseInt($(".productprice span").text()),
                            currency: 'USD'
                        },
                        payment_options: {
                            allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
                        },
                        item_list: {
                            items: [{
                                name: productname,
                                description: description,
                                quantity: parseInt($('.spinner .purchasenum').text()),
                                price:  price
                            }],
                            shipping_address: {
                                recipient_name: 'Brian Robinson',
                                line1: '4th Floor',
                                line2: 'Unit #34',
                                city: 'San Jose',
                                country_code: 'US',
                                postal_code: '95131',
                                phone: '011862212345678',
                                state: 'CA'
                            }
                        }
                    }],
                    note_to_payer: 'Contact us for any questions on your order.'
                }
            });
        },
        // Execute the payment:
        // 1. Add an onAuthorize callback
        onAuthorize: function (data, actions) {
          // 2. Call Braintree to tokenize the payment
          return actions.payment.tokenize()
            .then(function (data) {
                console.log("nonce: "+data.nonce);
              // 3. Call your server to execute the payment
              return paypal.request.post('/ecbt/execute', {
                nonce: data.nonce
              });
            });
        }
    }, '#paypal-button');
});
  