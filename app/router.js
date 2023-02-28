'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/join', controller.home.join);
  router.get('/waitlist', controller.home.getWaitList);
  router.get('/oauth/connect', controller.oauth.connect);
  router.post('/oauth/connect', controller.oauth.connected);

  router.post('/api/user', controller.home.getUser);
};
