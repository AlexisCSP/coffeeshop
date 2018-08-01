'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Candidates', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            vote: {
                allowNull: true,
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            roomId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Rooms',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            songId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Songs',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Candidates');
    }
};
