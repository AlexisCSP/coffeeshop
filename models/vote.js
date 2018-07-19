module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define('Vote', {
    });

    Vote.associate = (models) => {
        Vote.belongsTo(models.Candidate);
        Vote.belongsTo(models.User);
    };

    return Vote;
};