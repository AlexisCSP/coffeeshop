'use strict';
module.exports = (sequelize, DataTypes) => {
  var Room = sequelize.define('Room', {
    key: DataTypes.STRING,
    title: DataTypes.STRING
  }, {});
  Room.associate = function(models) {
    // associations can be defined here
  };
  return Room;
};