'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const tableName = tables.find(
      (table) => String(table).toLowerCase() === 'clientes'
    );

    if (!tableName) {
      return;
    }

    const tableDefinition = await queryInterface.describeTable(tableName);

    if (!tableDefinition.observacoes) {
      await queryInterface.addColumn(tableName, 'observacoes', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const tableName = tables.find(
      (table) => String(table).toLowerCase() === 'clientes'
    );

    if (!tableName) {
      return;
    }

    const tableDefinition = await queryInterface.describeTable(tableName);

    if (tableDefinition.observacoes) {
      await queryInterface.removeColumn(tableName, 'observacoes');
    }
  }
};
