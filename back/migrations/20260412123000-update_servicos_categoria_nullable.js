'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Servicos').catch(() => null);

    if (!tableInfo) {
      return;
    }

    if (tableInfo.categoria) {
      await queryInterface.changeColumn('Servicos', 'categoria', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableInfo.categoria_servico_id) {
      await queryInterface.addColumn('Servicos', 'categoria_servico_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'CategoriasServico',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Servicos').catch(() => null);

    if (!tableInfo) {
      return;
    }

    if (tableInfo.categoria_servico_id) {
      await queryInterface.removeColumn('Servicos', 'categoria_servico_id');
    }

    if (tableInfo.categoria) {
      await queryInterface.changeColumn('Servicos', 'categoria', {
        type: Sequelize.STRING,
        allowNull: false
      });
    }
  }
};
