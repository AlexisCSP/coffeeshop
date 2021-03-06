'use strict';
module.exports = (sequelize, DataTypes) => {
    var Song = sequelize.define('Song', {
        name: DataTypes.STRING,
        artist: DataTypes.STRING,
        duration_ms: DataTypes.INTEGER,
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
        Song.belongsToMany(models.Room, { through: 'Candidate', foreignKey: 'songId', as: 'room' })
    };

    // define instance methods
    // Song.prototype.getUri = function() {
    //   return this.url;
    // };

    return Song;
};
