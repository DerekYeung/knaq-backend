'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async join() {
    const email = this.ctx.request.body.email || '';
    await this.ctx.service.mail.logAndSend(email);
    this.ctx.body = {
      email,
    };
  }

  async getWaitList() {
    const list = this.ctx.service.mail.getList();
    this.ctx.body = list.join('\n');
  }

  async getUser() {
    const user = this.ctx.User;
    const activity = await this.ctx.model.Activity.findAll({
      where: {
        userid: user.userid,
      },
    });
    const score = activity.reduce((b, u) => {
      return b + (u.score || 0);
    }, 0);
    return {
      user,
      score,
    };
  }

}

module.exports = HomeController;
