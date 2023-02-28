'use strict';
const Service = require('egg').Service;
const jwt = require('jsonwebtoken');

class AppService extends Service {
  constructor(ctx) {
    super(ctx);
    this.User = this.ctx.model.user;
  }

  get token() {
    return this.ctx.get('authorization') || '';
  }

  async authentication() {
    if (!this.token) {
      return false;
    }
    const verify = await jwt.verify(this.token, 'knaq-jwt-key');
    return {
      user: verify,
    };
  }

}

module.exports = AppService;
