'use strict';

module.exports = app => {
  const {
    STRING,
    INTEGER,
    DATE,
  } = app.Sequelize;
  const Video = app.model.define('knaq_video', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    sn: STRING(128),
    created_at: DATE,
    updated_at: DATE,
  }, {
    timestamps: true,
    indexes: [{
      unique: true,
      fields: [ 'sn' ],
    }],
  });
  return Video;
};
