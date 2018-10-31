
module.exports = {

  /**
   * getConfirmationEmail simple returns local html in literal style.
   * No need for now to complicate with complicated plugins.
   * Keep it simple.
   * @param {string} userName
   * @param {string} token
   */
  getConfirmationEmail: function(userName, token) {
    return "<div \
      style='background:#000000;color:#0ea8d8;height: 400px;font-size: x-large;'> \
      Welcome to Crypto Game War dear " + userName + ". <br/> \
      You will need to confirm you email address: <br/> \
      Copy/Paste in your SignUp form. <br/> \
      CODE:  " + token + "  \
      </div>";
  }

}
