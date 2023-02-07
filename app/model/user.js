'use strict';

module.exports = app => {
  const {
    STRING,
    INTEGER,
    DATE,
    TEXT,
  } = app.Sequelize;
  const User = app.model.define('knaq_user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    email: STRING(128),
    name: STRING(128),
    tokens: TEXT,
    created_at: DATE,
    updated_at: DATE,
  }, {
    timestamps: true,
    indexes: [{
      unique: true,
      fields: [ 'email' ],
    }],
  });
  return User;
};
