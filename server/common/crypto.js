
class CryptoHandler {

  constructor() {

    this.crypto = require('crypto');
    this.algorithm = 'aes-256-cbc';
    this.key = this.crypto.randomBytes(32);
    this.iv = this.crypto.randomBytes(16);

  }

  encrypt(text) {

    const password = text;
    const cipher = this.crypto.createCipher('aes128', "a password");
    var encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;

  }

  decrypt(text) {

    const encrypt_password = text;
    const decipher = this.crypto.createDecipher('aes128','a password');
    var decrypted = decipher.update(encrypt_password,'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;

  }

}
module.exports = CryptoHandler;
