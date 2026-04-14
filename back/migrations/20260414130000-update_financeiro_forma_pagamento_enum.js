'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const hasFinanceiro = tables.some((table) => String(table).toLowerCase() === 'financeiro');

    if (!hasFinanceiro) {
      return;
    }

    await queryInterface.changeColumn('Financeiro', 'forma_pagamento', {
      type: Sequelize.ENUM('Dinheiro', 'Debito', 'Credito', 'Pix'),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const hasFinanceiro = tables.some((table) => String(table).toLowerCase() === 'financeiro');

    if (!hasFinanceiro) {
      return;
    }

    await queryInterface.changeColumn('Financeiro', 'forma_pagamento', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
