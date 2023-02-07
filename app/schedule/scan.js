'use strict';
const Subscription = require('egg').Subscription;

class Scan extends Subscription {
  static get schedule() {
    return {
      type: 'custom',
      // interval: 0,
      // type: 'worker',
      // immediate: true,
      // disable: true,
    };
  }

  async subscribe() {
    try {
      await this.ctx.service.scaner.startScan();
    } catch (e) {
      console.error('Failed to scan', e);
    }
  }
}

module.exports = Scan;
