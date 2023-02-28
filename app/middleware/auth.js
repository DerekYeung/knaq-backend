'use strict';
module.exports = () => {
  return async function auth(ctx, next) {
    if (!ctx.User.id) {
      ctx.status = 403;
      ctx.body = {
        error: 1,
        type: 'auth-error',
      };
      return;
    }
    await next();
  };
};
