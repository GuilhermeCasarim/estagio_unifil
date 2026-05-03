'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'ServicosProduto';
    const tableDefinition = await queryInterface.describeTable(tableName);
    const hasColumn = Object.prototype.hasOwnProperty.call(tableDefinition, 'quantidade_gasta');

    if (!hasColumn) {
      await queryInterface.addColumn(tableName, 'quantidade_gasta', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      });
    }
  },

  async down(queryInterface) {
    const tableName = 'ServicosProduto';
    const tableDefinition = await queryInterface.describeTable(tableName);
    const hasColumn = Object.prototype.hasOwnProperty.call(tableDefinition, 'quantidade_gasta');

    if (hasColumn) {
      await queryInterface.removeColumn(tableName, 'quantidade_gasta');
    }
  }
};
