'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Rooms', [{ 
        key: 'AAAA',
        title: 'Seed Room 1',
        createdAt: new Date(),
        updatedAt: new Date()
    },{ key: 'BBBB',
        title: 'Seed Room 2',
        createdAt: new Date(),
        updatedAt: new Date()
    }])
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Contacts', null, {});
  }
};
