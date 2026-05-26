'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const hasTabela = tables.some((table) => String(table).toLowerCase() === 'consumoagendamento');

    if (hasTabela) {
      return;
    }

    await queryInterface.createTable('ConsumoAgendamento', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_agendamento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Agendamentos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_produto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Produtos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantidade_utilizada: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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
    const hasTabela = tables.some((table) => String(table).toLowerCase() === 'consumoagendamento');

    if (hasTabela) {
      await queryInterface.dropTable('ConsumoAgendamento');
    }
  }
};