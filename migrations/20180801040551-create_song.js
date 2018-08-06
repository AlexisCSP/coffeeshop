'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Songs', {
      id: {
        allowNull: false,
        // autoIncrement: true,
        primaryKey: true,
        type: Sequelize.STRING
      },
      name: Sequelize.STRING,
      artist: Sequelize.STRING,
      preview: Sequelize.STRING,
      album_name: Sequelize.STRING,
      album_image: Sequelize.STRING,
      uri: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
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
    return queryInterface.dropTable('Songs');
  }
};
