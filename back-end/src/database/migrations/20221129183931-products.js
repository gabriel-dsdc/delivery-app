'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('products', {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        price: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        url_image: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};
