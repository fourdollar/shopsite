$( function() {
// ***************************用户信息修改部分***************************
  var r = document.cookie.split(';');
  var userid="";
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
          $('.lastname').text(res[0].lastname);
          $('.firstname').text(res[0].firstname);
          $('.email').text(res[0].email);
          $('.phone').text(res[0].phone);
          $('.address1').text(res[0].address1);
          $('.address2').text(res[0].address2);
          $('.postal_code').text(res[0].postal_code);
          $('.state').text(res[0].state);
          $('.city').text(res[0].city);
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
    window.location.href = "/login";
  }

  $("#change").click(function(){
    //修改按钮按下后，用户信息可编辑
    $(".form-control-static").addClass("hidden");
    $('.form-control').removeClass("hidden");
    $('#save').removeClass("hidden");
  })

  $("form").submit(function(e){
    // 修改用户信息
    var params = {
      username : userid,
      lastname: $('.lastname').val(),
      firstname: $('.firstname').val(),
      email: $('.email').val(),
      phone: $('.phone').val(),
      address1: $('.address1').val(),
      address2: $('.address2').val(),
      postal_code: $('.postal_code').val(),
      city: $('.city').val(),
      state: $('.state').val()
    }
    $.post('/userinfo/changeuserinfo', params)
    .done(function onSucess(res) {
      console.log("修改成功");
    })
  });

});
