'use strict';
module.exports = (sequelize, DataTypes) => {
    const Candidate = sequelize.define('Candidate', {
        name: DataTypes.STRING,
        artist: DataTypes.STRING,
        SongId: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        preview: DataTypes.STRING,
        album: DataTypes.STRING,
        vote_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });

    Candidate.associate = (models) => {
        Candidate.belongsTo(models.Room);
        Candidate.belongsTo(models.User);
    };

    return Candidate;
}
