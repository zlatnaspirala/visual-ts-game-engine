
class CryptoHandler {

  constructor() {

    this.crypto = require('crypto');
    this.algorithm = 'aes-256-cbc';
    this.key = this.crypto.randomBytes(32);
    // let iv = Buffer.from(textParts.shift(), 'hex');
    this.iv = "nikola";

  }

  encrypt(text) {

    const password = text;
    const cipher = this.crypto.createDecipheriv('aes128', "a password");
    var encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;

  }

  decrypt(text) {

    const encrypt_password = text;
    const decipher = this.crypto.createDecipheriv('aes128','a password');
    var decrypted = decipher.update(encrypt_password,'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;

  }

  /**
   *
   * const crypto = require('crypto')
const {algorithm, iv} = require('config').crypto

module.exports = {
	decrypt({cipherText, key}) {
		const decipher = crypto.createDecipheriv(algorithm, key, iv)
		return decipher.update(cipherText, 'hex', 'utf8') + decipher.final('utf8')
	}
	, encrypt({text, key}) {
		const cipher = crypto.createCipheriv(algorithm, key, iv)
		return cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
	}
}
   */

}
module.exports = CryptoHandler;
