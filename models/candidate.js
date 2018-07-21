'use strict';
module.exports = (sequelize, DataTypes) => {
    const Candidate = sequelize.define('Candidate', {
        SongId: {
            type: DataTypes.INTEGER,
            unique: true // cannot be unique
        }
    });

    Candidate.associate = (models) => {
        Candidate.belongsTo(models.Room);
        Candidate.belongsTo(models.User);
    };

    return Candidate;
}