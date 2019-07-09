
module.exports = {

  resolveURL: function(url) {
    const isWin = !!process.platform.match(/^win/);
    if (!isWin) { return url; }
    return url.replace(/\//g, "\\");
  },

  // Register list for user network response's.
  serverHandlerRegister: function() {},
  serverHandlerRegValidation: function() {},
  serverHandlerLoginValidation: function() {},
  serverHandlerGetUserData: function() {},
  serverHandlerSetNewNickname: function() {},
  serverHandlerFastLogin: function() {},
  serverHandlerGamePlayStart: function() {},
  serverHandlerSessionLogOut: function() { },
  serverHandlerOutOfGame: function() { },

  validateEmail: function(email) {
    // tslint:disable-next-line:max-line-length
    const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regexp.test(email) === false) {
      return "Email is not valid !";
    }
    return null;
  },

  validatePassword: function(pass) {
    if (pass.length < 8) {
      return false;
    }
    return true;
  },

  myBase: {},

  generateToken: function() {
    let localToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return localToken;
  },

  formatUserKeyLiteral(userEmail) {
    let local = userEmail;
    local = local.replace("@", "_alpha_");
    let encoded = new Buffer(local).toString('base64');
    encoded = encoded.replace(/=/g, "ab");
    return encoded;
  },

  getDefaultNickName() {
    return Math.random() * 1234 * Math.random();
  }

};
