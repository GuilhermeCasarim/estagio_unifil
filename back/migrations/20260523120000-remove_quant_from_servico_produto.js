'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'ServicosProduto';
    const tableDefinition = await queryInterface.describeTable(tableName);
    const hasColumn = Object.prototype.hasOwnProperty.call(tableDefinition, 'quant');

    if (hasColumn) {
      await queryInterface.removeColumn(tableName, 'quant');
    }
  },

  async down(queryInterface, Sequelize) {
    const tableName = 'ServicosProduto';
    const tableDefinition = await queryInterface.describeTable(tableName);
    const hasColumn = Object.prototype.hasOwnProperty.call(tableDefinition, 'quant');

    if (!hasColumn) {
      await queryInterface.addColumn(tableName, 'quant', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      });
    }
  }
};
