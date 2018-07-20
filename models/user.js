'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        Username: {
            type: DataTypes.STRING,
            defaultValue: null
        }
    });

    return User;
}