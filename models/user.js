'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        spotify_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }
    });

    User.associate = function(models) {
        User.hasMany(models.Room, { foreignKey: 'owner', sourceKey: 'spotify_id' })
    };

    return User;
}
