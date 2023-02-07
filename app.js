'use strict';
class App {
  constructor(app) {
    this.app = app;
  }

  async didLoad() {
    const app = this.app;
    if (app.config.env === 'unittest') {
      return;
    }
    if (app.config.env === 'local') {
      await app.model.sync({
        alter: true,
        // force: true,
      });
    }
  }

}

module.exports = App;

