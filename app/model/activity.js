'use strict';

module.exports = app => {
  const {
    STRING,
    INTEGER,
    DATE,
  } = app.Sequelize;
  const Activity = app.model.define('knaq_activity', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    userid: INTEGER(10),
    type: STRING(64),
    target: STRING(128),
    score: INTEGER(10),
    created_at: DATE,
    updated_at: DATE,
  }, {
    timestamps: true,
    indexes: [{
      unique: true,
      fields: [ 'userid', 'type', 'target' ],
    }],
  });
  return Activity;
};
