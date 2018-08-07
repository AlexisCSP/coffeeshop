'use strict';
module.exports = (sequelize, DataTypes) => {
    const Candidate = sequelize.define('Candidate', {
        roomId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'room',
                key: 'id',
                allowNull: false
            }
        },
        songId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'song',
                key: 'id',
                allowNull: false
            }
        },
        vote_count: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
    });

    Candidate.associate = (models) => {

    };

    return Candidate;
}
