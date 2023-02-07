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
  config.middleware = [
    'api',
  ];

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
  userConfig.sequelize = {
    dialect: 'mysql',
    host: process.env.DB_HOST || '43.135.87.203',
    port: process.env.DB_PORT || 6033,
    username: process.env.DB_USER || 'knaq',
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE || 'knaq',
    define: {
      underscored: true,
      freezeTableName: true,
    },
    logging: false,
  };

  return {
    ...config,
    ...userConfig,
  };
};
