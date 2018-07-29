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
        album_name: DataTypes.STRING,
        album_image: DataTypes.STRING,
        vote_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        UserId: {
            type: DataTypes.INTEGER,
            defaultValue: null
        }
    });

    Candidate.associate = (models) => {
        Candidate.belongsTo(models.Room);
        // Candidate.belongsTo(models.User);
    };

    return Candidate;
}
