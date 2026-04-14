'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const tables = await queryInterface.showAllTables();
    const hasOld = tables.some((table) => String(table).toLowerCase() === 'servicoproduto');
    const hasNew = tables.some((table) => String(table).toLowerCase() === 'servicosproduto');

    if (hasOld && !hasNew) {
      await queryInterface.renameTable('ServicoProduto', 'ServicosProduto');
    }
  },

  async down(queryInterface) {
    const tables = await queryInterface.showAllTables();
    const hasOld = tables.some((table) => String(table).toLowerCase() === 'servicoproduto');
    const hasNew = tables.some((table) => String(table).toLowerCase() === 'servicosproduto');

    if (hasNew && !hasOld) {
      await queryInterface.renameTable('ServicosProduto', 'ServicoProduto');
    }
  }
};
