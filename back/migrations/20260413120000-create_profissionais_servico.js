'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const hasProfissionaisServico = tables.some((table) => String(table).toLowerCase() === 'profissionaisservico');

    if (hasProfissionaisServico) {
      return;
    }

    await queryInterface.createTable('ProfissionaisServico', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      servico_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Servicos',
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
    const hasProfissionaisServico = tables.some((table) => String(table).toLowerCase() === 'profissionaisservico');

    if (hasProfissionaisServico) {
      await queryInterface.dropTable('ProfissionaisServico');
    }
  }
};
