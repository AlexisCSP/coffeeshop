'use strict';
module.exports = (sequelize, DataTypes) => {
  var Room = sequelize.define('Room', {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});

  Room.associate = function(models) {
      Room.belongsToMany(models.Song, { through: 'Candidates', foreignKey: 'roomId', as: 'song' });
  };

  // define instance methods
  // Contact.prototype.getFullName = function() {
  //   return [this.firstName, this.lastName].join(', ');
  // };

  Room.prototype.getUrl = function() {
    return '/rooms/' + this.id;
  };

  return Room;
};
