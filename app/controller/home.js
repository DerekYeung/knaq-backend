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

}

module.exports = HomeController;
