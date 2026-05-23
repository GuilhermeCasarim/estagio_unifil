'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'Financeiro';
    const tableDefinition = await queryInterface.describeTable(tableName);
    const hasColumn = Object.prototype.hasOwnProperty.call(tableDefinition, 'fornecedor');

    if (hasColumn) {
      await queryInterface.removeColumn(tableName, 'fornecedor');
    }
  },

  async down(queryInterface, Sequelize) {
    const tableName = 'Financeiro';
    const tableDefinition = await queryInterface.describeTable(tableName);
    const hasColumn = Object.prototype.hasOwnProperty.call(tableDefinition, 'fornecedor');

    if (!hasColumn) {
      await queryInterface.addColumn(tableName, 'fornecedor', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  }
};
