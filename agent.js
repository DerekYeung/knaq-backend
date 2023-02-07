'use strict';

class Agent {
  constructor(app) {
    this.app = app;
    class CustomStrategy extends app.ScheduleStrategy {
      async start() {
        this.sendOne();
      }
      async onJobFinish() {
        await new Promise(r => {
          setTimeout(() => {
            r(true);
          }, 60 * 1000);
        });
        this.sendOne();
      }
    }
    app.schedule.use('custom', CustomStrategy);
  }

}


module.exports = Agent;
