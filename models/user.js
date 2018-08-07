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
        
    };

    return User;
}
