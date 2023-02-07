/* eslint valid-jsdoc: "off" */

'use strict';
require('dotenv').config();

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1675051831786_9837';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  userConfig.MAIL_USER = process.env.MAIL_USER || '';
  userConfig.MAIL_PASS = process.env.MAIL_PASS || '';
  userConfig.GOOGLE_CLIENT_KEY = process.env.GOOGLE_CLIENT_KEY || '';
  userConfig.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [ '*' ],
  };
  userConfig.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };


  return {
    ...config,
    ...userConfig,
  };
};
