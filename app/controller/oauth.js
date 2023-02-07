'use strict';

const { Controller } = require('egg');

class OauthController extends Controller {

  async connect() {
    return this.ctx.service.google.requestAuth();
  }

}

module.exports = OauthController;
