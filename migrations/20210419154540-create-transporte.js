'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transporte', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      minPrice: {
        type: Sequelize.STRING
      },
      direct: {
        type: Sequelize.BOOLEAN
      },
      departure: {
        type: Sequelize.STRING
      },
      airline: {
        type: Sequelize.STRING
      },
      landmarkOrigin: {
        type: Sequelize.STRING
      },
      landmarkDestination: {
        type: Sequelize.STRING
      },
      countryOrigin: {
        type: Sequelize.STRING
      },
      countryDestination: {
        type: Sequelize.STRING
      },
      cityOrigin: {
        type: Sequelize.STRING
      },
      cityDestination: {
        type: Sequelize.STRING
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transporte');
  }
};