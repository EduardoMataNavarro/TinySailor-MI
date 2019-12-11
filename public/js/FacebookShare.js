window.fbAsyncInit = function() {
    FB.init({
      appId      : '451524728879167',
      xfbml      : true,
      version    : 'v4.0'
    });
    FB.AppEvents.logPageView();
  };
  
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk')); 
  
  
  function ShareScore() {
    FB.ui({
      method:'send',
      link:'https://www.tinysailor.herokuapp.com/'
    },function(respuesta){
  
    });
  }