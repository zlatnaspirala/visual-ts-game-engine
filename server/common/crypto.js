
class CryptoHandler {

  constructor() {

    this.crypto = require('crypto');
    this.algorithm = 'aes-256-cbc';
    this.key = this.crypto.randomBytes(32);
    this.iv = this.crypto.randomBytes(16);

  }

  encrypt(text) {

    let root = this;
    let cipher = this.crypto.createCipheriv('aes-256-cbc', Buffer.from(root.key), root.iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: this.iv.toString('hex'), encryptedData: encrypted.toString('hex') };

  }

  decrypt(text) {

    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = this.crypto.createDecipheriv('aes-256-cbc', Buffer.from(root.key), root.iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();

  }

}
module.exports = CryptoHandler;
