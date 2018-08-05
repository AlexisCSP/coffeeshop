'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spotify_id: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
      },
      owner: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          references: {
              model: 'Rooms',
              key: 'owner'
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
    return queryInterface.dropTable('Users');
  }
};
