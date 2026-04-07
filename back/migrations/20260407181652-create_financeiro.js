'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const hasFinanceiro = tables.some((table) => String(table).toLowerCase() === 'financeiro');

    if (hasFinanceiro) {
      return;
    }

    await queryInterface.createTable('Financeiro', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipo: {
        type: Sequelize.ENUM('Receita', 'Despesa'),
        allowNull: false
      },
      valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: false
      },
      forma_pagamento: {
        type: Sequelize.STRING,
        allowNull: false
      },
      categoria: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Pago', 'Pendente'),
        defaultValue: 'Pago'
      },
      data_pagamento: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
      },
      fornecedor: {
        type: Sequelize.STRING,
        allowNull: true
      },
      agendamento_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: true
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

  async down(queryInterface) {
    const tables = await queryInterface.showAllTables();
    const hasFinanceiro = tables.some((table) => String(table).toLowerCase() === 'financeiro');

    if (hasFinanceiro) {
      await queryInterface.dropTable('Financeiro');
    }
  }
};
