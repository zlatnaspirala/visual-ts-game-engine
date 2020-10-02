/*

  Old class in future can be used for resolving database key reading.

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
}
*/

const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
//const ENCRYPTION_KEY = 'Iamtunderbuttheresnorainprodigy-';
// or generate sample key Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
// const ENCRYPTION_KEY = 'Put_Your_Password_Here';
 // or generate sample key Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');

const ENCRYPTION_KEY = Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');

const IV_LENGTH = 16;

class CryptoHandler {

  constructor() {
  }

  encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

  decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

}

module.exports = CryptoHandler;
