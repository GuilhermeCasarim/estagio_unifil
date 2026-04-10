'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const hasServicoProduto = tables.some((table) => String(table).toLowerCase() === 'servicoproduto');

    if (hasServicoProduto) {
      return;
    }

    await queryInterface.createTable('ServicoProduto', {
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
      produto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Produtos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quant: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      data_hora: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
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
    const hasServicoProduto = tables.some((table) => String(table).toLowerCase() === 'servicoproduto');

    if (hasServicoProduto) {
      await queryInterface.dropTable('ServicoProduto');
    }
  }
};
