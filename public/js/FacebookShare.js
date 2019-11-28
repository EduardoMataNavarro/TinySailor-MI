window.fbAsyncInit = function() {
    FB.init({
      appId      : '2442176882691598',
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
  
  
  function shareScore(_score0, _score1) {
    FB.ui({
      method:'send',
      link:'https://tinysailor.herokuapp.com/'
    },function(respuesta){
  
    });

    $.ajax({
        url: '/setscore',
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        data: {
            'gameId' : localStorage.getItem('gameIds'),
            'playerId' : 1,
            'score' : _score0
        }
    });

    $.ajax({
        url: '/setscore',
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        data: {
            'gameId' : localStorage.getItem('gameIds'),
            'playerId' : 2,
            'score' : _score1
        }
    });
  }