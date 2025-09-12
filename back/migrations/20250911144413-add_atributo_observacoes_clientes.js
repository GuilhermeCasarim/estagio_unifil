'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // add coluna 'observacoes' na tabela 'Clientes'
    await queryInterface.addColumn('Clientes', 'observacoes', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Clientes', 'observacoes');
  }
};
