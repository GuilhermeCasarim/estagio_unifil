'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const hasProdutos = tables.some((table) => String(table).toLowerCase() === 'produtos');

    if (hasProdutos) {
      return;
    }

    await queryInterface.createTable('Produtos', {
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
      marca: {
        type: Sequelize.STRING,
        allowNull: false
      },
      categoria: {
        type: Sequelize.STRING,
        allowNull: false
      },
      observacoes: {
        type: Sequelize.STRING,
        allowNull: true
      },
      estoque_minimo: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      estoque_atual: {
        type: Sequelize.INTEGER,
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
  },

  async down(queryInterface) {
    const tables = await queryInterface.showAllTables();
    const hasProdutos = tables.some((table) => String(table).toLowerCase() === 'produtos');

    if (hasProdutos) {
      await queryInterface.dropTable('Produtos');
    }
  }
};
