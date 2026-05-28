'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDefinition = await queryInterface.describeTable('Agendamentos');

    if (!Object.prototype.hasOwnProperty.call(tableDefinition, 'consumo_validado')) {
      await queryInterface.addColumn('Agendamentos', 'consumo_validado', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      });
    }
  },

  async down(queryInterface) {
    const tableDefinition = await queryInterface.describeTable('Agendamentos');

    if (Object.prototype.hasOwnProperty.call(tableDefinition, 'consumo_validado')) {
      await queryInterface.removeColumn('Agendamentos', 'consumo_validado');
    }
  }
};