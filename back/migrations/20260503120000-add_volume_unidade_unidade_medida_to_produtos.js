'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Produtos', 'volume_unidade', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('Produtos', 'unidade_medida', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'ml'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Produtos', 'unidade_medida');
    await queryInterface.removeColumn('Produtos', 'volume_unidade');
  }
};
