
module.exports = {

  /**
   * getConfirmationEmail simple returns local html in literal style.
   * No need for now to complicate with complicated plugins.
   * Keep it simple.
   * @param {string} userName
   * @param {string} token
   */
  getConfirmationEmail: function(token, userName) {
    return "<div \
      style='background:#000000;color:#0ea8d8;height: 550px;font-size: large;  \
      -webkit-box-shadow: inset 0 0px 55px 9px #3A8EFF; \
      box-shadow: inset 10px 10px 25px 10px #3A8EFF; \
      padding: 20px;' > \
      <h2> Welcome to Crypto Game War dear " + userName + ". </h2><br/> \
      You will need to confirm you email address: <br/> \
      Copy/Paste in your SignUp form. <br/> \
      CODE : <p>" + token + "</p>  <br/><br/><br/> \
      <img style='width:80px;' src='https://github.com/zlatnaspirala/visual-ts-game-engine/blob/master/logo.png?raw=true' /> \
      Powered by <small>Visual ts game engine.</small> \
      </div>";
  }

}
