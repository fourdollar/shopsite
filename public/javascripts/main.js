  $(function() {
    //检查是否登录
    var r = document.cookie.split(';');
    var userid="";
    r.forEach(function(value) {
      var content = value.split('=');
      if (content[0].match('userid')) {
        userid = content[1].trim();
        $('.userid').text(content[1].trim());
        $('.havelogin').removeClass('hidden');
        $('.nologin').addClass('hidden');
      };
    });
  });

  function setcookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }else{
        var expires = "";
    }
    document.cookie = name+"="+value+expires+"; path=/";
  }

  // 登出
  function logout(){
    // 删除cookie
    setcookie("userid",1,-1);
    console.log("logout");
    location.reload();
  }
