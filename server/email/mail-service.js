const shared = require("../common/shared");
const nodemailer = require('nodemailer')
/**
 * @description Only objective for this class is
 * sending emails.
 */
class Sender {

  constructor(to, subject, content) {
    this.userId = shared.formatUserKeyLiteral(to);
    this.subject = subject;
    this.to = to;
    this.content = content;
  }

  async SEND(subject) {
    const transporter = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",
      port: 587,
      tls: {
        secure: false,
        ignoreTLS: true,
        rejectUnauthorized: false
      },
      auth: {
        user: "api",
        pass: "*********",
      }
    });

    transporter.verify(function(error, success) {
      if(error) {
        console.log("EMAIL SERVICE FAILED" + error);
      } else {
        console.log('Server validation done and ready for messages.')
      }
    });

    const email = {
      from: 'mailtrap@maximumroulette.com',
      to: this.to,
      subject: this.subject,
      text: this.content
    };

    transporter.sendMail(email, function(error, success) {
      if(error) {
        console.log('Nodemailer Email failed: ' + error);
      } else {
        console.log('Nodemailer Email sent: ' + success.response);
      }
    })
  }
}
module.exports = (to, subject, content) => {return new Sender(to, subject, content)}
