
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
      padding: 20px;' > \
      <h2> Welcome to Crypto Game War dear " + userName + ". </h2><br/> \
      <p>You will need to confirm you email address: <br/> \
      Copy/Paste in your SignUp form.</p> <br/> \
      CODE : <p>" + token + "</p>  <br/><br/><br/> \
      <img style='width:80px;' src='https://github.com/zlatnaspirala/visual-ts-game-engine/blob/master/logo.png?raw=true' /> \
      Powered by <small>Visual ts game engine.</small> \
      </div>";
  }

}
