const nodemailer = require('nodemailer');
const fs = require('fs');
const Service = require('egg').Service;
const html = fs.readFileSync('./mail.html');
class MailService extends Service {
  constructor(app) {
    super(app);
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secureConnection: true, // use SSL, the port is 465
      auth: {
        user: this.app.config.MAIL_USER, // user name
        pass: this.app.config.MAIL_PASS, // password
      },
    });
  }

  getList() {
    const exists = fs.existsSync('./waitlist.txt');
    if (!exists) {
      return [];
    }
    const list = fs.readFileSync('./waitlist.txt');
    if (!list) {
      return [];
    }
    return JSON.parse(list.toString());
  }

  async logAndSend(email = '') {
    if (!(/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(\w+)$/.test(email))) {
      throw new Error('Invalid email');
    }
    const list = this.getList();
    list.push(email);
    const set = new Set(list);
    const waitlist = Array.from(set);
    fs.writeFileSync('./waitlist.txt', JSON.stringify(waitlist));
    await this.sendWelcome(email);
  }

  sendWelcome(to = '') {
    const mailOptions = {
      from: 'developer@knaqapp.com', // sender address mailfrom must be same with the user
      sender: 'Knaq Team',
      to, // list of receivers
      subject: 'Welcome to Knaq!', // Subject line
      text: 'Welcome to Knaq!', // plaintext body
      html, // html body
    };
    return this.transporter.sendMail(mailOptions);

  }
}

module.exports = MailService;
