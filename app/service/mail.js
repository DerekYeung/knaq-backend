const nodemailer = require('nodemailer');
const fs = require('fs');
const Service = require('egg').Service;
const html = '<div><br></div><div style="position: relative;"><includetail><div dir="ltr"><div style="text-align:center"><font face="tahoma, sans-serif"><font size="6">Welcome to our Waitlist!&nbsp;</font></font></div><div style="text-align:center"><br></div><div style="text-align:center"><font face="tahoma, sans-serif" size="4">You\'re just a few steps away from joining our awesome community of fans and content creators, with access to unforgettable rewards and experiences.&nbsp;</font></div><div style="text-align:center"><font face="tahoma, sans-serif" size="4"><br></font></div><div style="text-align:center"><font face="tahoma, sans-serif" size="4">Follow the links below to stay turned for our weekly announcements with product updates, upcoming events, and early adopter incentives!&nbsp;</font></div><div style="text-align:center"><font face="tahoma, sans-serif" size="4"><br></font></div><div style="text-align:center"><font face="tahoma, sans-serif" size="4"><a href="https://discord.gg/GRSHWBCH">Discord</a>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</font><a href="https://twitter.com/KnaqApp" style="font-size:large">Twitter</a>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<font size="4"><a href="https://medium.com/@KnaqApp">Medium</a></font></div><div style="text-align:center"><br></div><div style="text-align:center"><br></div><div style="text-align:center"><font face="tahoma, sans-serif" size="4">Have a question?</font></div><div style="text-align:center"><font face="tahoma, sans-serif" size="4"><br></font></div><div style="text-align:center"><font face="tahoma, sans-serif" size="4">Ping us in Discord or send an email to <a href="mailto:hello@knaqapp.com">hello@knaqapp.com</a> with any questions about Knaq, your rewards, or feedback/comments.&nbsp;</font></div><div style="text-align:center"><font face="tahoma, sans-serif" size="4"><br></font></div><div style="text-align:center"><font face="tahoma, sans-serif" size="4"><br></font></div><div style="text-align:center"><font face="tahoma, sans-serif" size="4">We are excited to bring you the Black Card loyalty program for the Creator Economy.&nbsp;</font></div><div style="text-align:center"><font face="tahoma, sans-serif" size="4"><br></font></div><div style="text-align:center"><font face="tahoma, sans-serif" size="4"><br></font></div><div style="text-align:center"><font face="tahoma, sans-serif" size="4">- The Knaq Team</font></div></div><br><div class="gmail_quote"><div dir="ltr" class="gmail_attr"><br></div></div></includetail></div>';

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
    const list = fs.readFileSync('./waitlist.txt');
    if (!list) {
      return [];
    }
    return JSON.parse(list.toString());
  }

  logAndSend(mail = '') {
    if (/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(\w+)$/.test(mail)) {
      throw new Error('Invalid email');
    }
    const list = this.getList();
    const set = new Set(list);
    set.push(mail);
    const waitlist = Array.from(set);
    fs.writeFileSync('./waitlist.txt', JSON.stringify(waitlist));
  }

  sendWelcome(to = '') {
    const mailOptions = {
      from: 'developer@knaqapp.com', // sender address mailfrom must be same with the user
      to, // list of receivers
      subject: 'Welcome to Knaq!', // Subject line
      text: 'Welcome to Knaq!', // plaintext body
      html, // html body
    };
    return this.transporter.sendMail(mailOptions);

  }
}

module.exports = MailService;
