export let registerForm = '<div class="container"> \
  <form action="" class="form-app"> \
    <ul class="nav"> \
      <li class="nav-item active"><a href="#">Sign in</a></li> \
      <li class="nav-item"><a href="#">Sign Up</a></li> \
    </ul> \
    <label for="login-user" class="form-label">Email</label> \
    <input id="login-user" class="form-input-text" type="text" /> \
    <label for="login-pass" class="form-label">Password</label> \
    <input id="login-pass" class="form-input-text" type="text" /> \
    <label for="login-checkbox" class="form-checkbox-label"> \
      <input id="login-checkbox" class="form-input-checkbox" type="checkbox"> Keep me logged in  \
    </label> \
   <button id = "login-button" class="login-button" > Sign in </button> \
   <span id = "error-msg-reg" class="myError" ></span> \
   </form> \
   <button id="forgotPassword" class="link" > Forgot Password ? </button> \
< /div>';
