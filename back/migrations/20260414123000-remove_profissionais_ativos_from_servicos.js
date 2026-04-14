'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const hasServicos = tables.some((table) => String(table).toLowerCase() === 'servicos');

    if (!hasServicos) {
      return;
    }

    const tableInfo = await queryInterface.describeTable('Servicos').catch(() => null);
    if (tableInfo && tableInfo.profissionais_ativos) {
      await queryInterface.removeColumn('Servicos', 'profissionais_ativos');
    }
  },

  async down(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const hasServicos = tables.some((table) => String(table).toLowerCase() === 'servicos');

    if (!hasServicos) {
      return;
    }

    const tableInfo = await queryInterface.describeTable('Servicos').catch(() => null);
    if (tableInfo && !tableInfo.profissionais_ativos) {
      await queryInterface.addColumn('Servicos', 'profissionais_ativos', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  }
};
