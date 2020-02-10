
  // Prevent
  if (location.href.indexOf("localhost") !== -1 || location.href.indexOf("127.0.0.1") !== -1) {
    console.log("Addson facebook is disabled for locahost");
  } else {

    function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
      console.log('statusChangeCallback');
      console.log(response);                   // The current login status of the person.
      if (response.status === 'connected') {   // Logged into your webpage and Facebook.
        testAPI();
      } else {                                 // Not logged into your webpage or we are unable to tell.
        document.getElementById('status').innerHTML = 'Please log ' +
          'into this webpage.';
      }
    }

    function checkLoginState() {               // Called when a person is finished with the Login Button.
      FB.getLoginStatus(function(response) {   // See the onlogin handler
        statusChangeCallback(response);
      });
    }

    window.fbAsyncInit = function() {
    FB.init({
        appId      : '2348068488826735',
        xfbml      : true,
        version    : 'v6.0'
      });
      FB.AppEvents.logPageView();

      FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
        statusChangeCallback(response);        // Returns the login status.
      });
    };

    (function(d, s, id) {                      // Load the SDK asynchronously
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        document.getElementById('status').innerHTML =
          'Thanks for logging in, ' + response.name + '!';
      });

      // Addons facebook  depend on HTMLElement with id `fbInviteBtn`
      // Put it anywhere on active page.
      window.FB = FB;

    }

  }
