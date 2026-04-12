'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const hasCategorias = tables.some((table) => String(table).toLowerCase() === 'categoriasservico');
    const hasServicos = tables.some((table) => String(table).toLowerCase() === 'servicos');

    if (!hasCategorias) {
      await queryInterface.createTable('CategoriasServico', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        nome: {
          type: Sequelize.STRING,
          allowNull: false
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
    }

    if (hasServicos) {
      const tableInfo = await queryInterface.describeTable('Servicos').catch(() => null);
      if (tableInfo && !tableInfo.categoria_servico_id) {
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
    }
  },

  async down(queryInterface) {
    const tables = await queryInterface.showAllTables();
    const hasCategorias = tables.some((table) => String(table).toLowerCase() === 'categoriasservico');
    const hasServicos = tables.some((table) => String(table).toLowerCase() === 'servicos');

    if (hasServicos) {
      const tableInfo = await queryInterface.describeTable('Servicos').catch(() => null);
      if (tableInfo && tableInfo.categoria_servico_id) {
        await queryInterface.removeColumn('Servicos', 'categoria_servico_id');
      }
    }

    if (hasCategorias) {
      await queryInterface.dropTable('CategoriasServico');
    }
  }
};
