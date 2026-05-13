'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const hasProfissionais = tables.some((table) => String(table).toLowerCase() === 'profissionais');

    if (!hasProfissionais) {
      return;
    }

    const tableInfo = await queryInterface.describeTable('Profissionais').catch(() => null);

    if (tableInfo && !tableInfo.usuario_id) {
      await queryInterface.addColumn('Profissionais', 'usuario_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }
  },

  async down(queryInterface) {
    const tables = await queryInterface.showAllTables();
    const hasProfissionais = tables.some((table) => String(table).toLowerCase() === 'profissionais');

    if (!hasProfissionais) {
      return;
    }

    const tableInfo = await queryInterface.describeTable('Profissionais').catch(() => null);

    if (tableInfo && tableInfo.usuario_id) {
      await queryInterface.removeColumn('Profissionais', 'usuario_id');
    }
  }
};