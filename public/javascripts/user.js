$( function() {
  // ***************************登录部分***************************
  $('#login').click(function(){
    var username = $('#username').val();
    var pw = $('#pw').val();
    $.post('/login/getuser', {username: username ,password: pw})
    .done(function onSucess(res) {
      if (res == '用户不存在') {
        $('.message.username').text("用户不存在");
        } else {
          if (res == '登陆成功') {
            console.log('登陆成功');
            // 登录成功前往主页
            window.location.href="/";
          } else if (res == '密码错误') {
            $('.message.password').text("密码错误");
          }
        }
    });
  });

  // ***************************注册部分***************************
  $('#regist').click(function(){
    var username = $('#username').val();
    var pw = $('#pw').val();
    var pwconfirm = $('#pwconfirm').val();
    var lastname = $('#lastname').val();
    var firstname = $('#firstname').val();
    var email = $('#email').val();
    var phone = $('#phone').val();

    $('.message.username').text('');
    $('.message.confirmation').text('');
    $('.message.password').text('');

    if (!pwdChecker(pw)) {
      $('.message.password').text("请输入6位以上半角英数字");
      return false;
    } else if (pw !== pwconfirm) {
      $('.message.confirmation').text("密码不一致");
      return false;
    } else {
      var params = {
        username : username,
        password: pw,
        lastname: lastname,
        firstname: firstname,
        email: email,
        phone: phone,
        postal_code: "",
        address1: "",
        address2: "",
        city: "",
        state: ""
      }

      $.post('/register/adduser', params)
      .done(function onSucess(res) {
        // 用户名存在的时候出错警告
        if (res.data == '用户名存在') {
          $('.message.username').text('用户名存在');
        }else {
          //用户名没有重名时，注册成功
          console.log('用户注册成功');
          window.location.href = "/login";
        }
      })
    }
  });
});

// 检查密码规范
function pwdChecker(str) {
  return typeof str === "string" &&
         str.trim(' ') !== '' &&
         str.length >= 6 &&
         str.match(/^[A-Za-z0-9]*$/);
}
