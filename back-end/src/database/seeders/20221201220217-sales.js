// seeder para teste
'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.bulkInsert('sales', [
    //   {
    //     id: 1,
    //     user_id: 3,
    //     seller_id: 2,
    //     total_price: 26.90,
    //     delivery_address: 'Qualquer um',
    //     delivery_number: 87,
    //     sale_date: '2022-12-01',
    //     status: 'Pendente'
    //   },
    // ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sales', null, {}); 
  }
};
