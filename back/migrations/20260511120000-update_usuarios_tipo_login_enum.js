'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Ajusta valores fora do conjunto antes de aplicar o ENUM.
      await queryInterface.sequelize.query(
        `
          UPDATE Usuarios
          SET tipo_login = 'secretaria'
          WHERE tipo_login IS NULL
             OR tipo_login NOT IN ('administrador', 'profissional', 'secretaria')
        `,
        { transaction }
      );

      await queryInterface.changeColumn(
        'Usuarios',
        'tipo_login',
        {
          type: Sequelize.ENUM('administrador', 'profissional', 'secretaria'),
          allowNull: false,
        },
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Usuarios', 'tipo_login', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};