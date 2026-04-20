'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const hasTabela = tables.some((table) => String(table).toLowerCase() === 'profissionaisnomesservico');

    if (hasTabela) {
      return;
    }

    await queryInterface.createTable('ProfissionaisNomesServico', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome_servico_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'NomesServico',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      profissional_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Profissionais',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    const hasTabela = tables.some((table) => String(table).toLowerCase() === 'profissionaisnomesservico');

    if (hasTabela) {
      await queryInterface.dropTable('ProfissionaisNomesServico');
    }
  }
};
