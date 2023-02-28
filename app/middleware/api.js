'use strict';
module.exports = () => {
  return async function error(ctx, next) {
    const isProd = ctx.app.config.env === 'prod';
    try {
      const passport = ctx.service.passport;
      const authentication = await passport.authentication();
      if (!authentication) {
        ctx.isAuthentication = false;
        ctx.User = {};
      } else {
        ctx.User = authentication.user;
      }

      const response = await next();
      if (ctx.pure) {
        ctx.body = ctx.body || response;
        return;
      }
      if (response) {
        ctx.body = {
          code: 0,
          data: response,
        };
      }
    } catch (e) {
      if (isProd) {
        ctx.body = {
          code: -1,
          error: e.message || e.error || 'Unknow error, try again later',
          stack: isProd ? undefined : e.stack,
        };
        console.error(ctx.url, e);
      } else {
        throw e;
      }
    }
  };
};
