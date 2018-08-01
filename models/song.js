'use strict';
module.exports = (sequelize, DataTypes) => {
    var Song = sequelize.define('Song', {
        name: DataTypes.STRING,
        artist: DataTypes.STRING,
        preview: DataTypes.STRING,
        album_name: DataTypes.STRING,
        album_image: DataTypes.STRING,
        uri: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }, {});
    Song.associate = function(models) {
        Song.belongsToMany(models.Room, { through: 'Candidates', foreignKey: 'songId', as: 'room' })
    };

    // define instance methods
    // Song.prototype.getUri = function() {
    //   return this.url;
    // };

    return Song;
};
