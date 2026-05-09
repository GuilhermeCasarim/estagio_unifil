"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Mapear valores antigos que não existem mais ('em andamento' -> 'confirmado')
      await queryInterface.sequelize.query(
        "UPDATE `Agendamentos` SET `status` = 'confirmado' WHERE `status` = 'em andamento';",
        { transaction }
      );

      // Alterar a coluna para o novo ENUM (MySQL): MODIFY COLUMN com os novos valores
      await queryInterface.sequelize.query(
        "ALTER TABLE `Agendamentos` MODIFY `status` ENUM('agendado','confirmado','cancelado','concluido') NOT NULL DEFAULT 'agendado';",
        { transaction }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Mapear de volta os valores alterados
      await queryInterface.sequelize.query(
        "UPDATE `Agendamentos` SET `status` = 'em andamento' WHERE `status` = 'confirmado';",
        { transaction }
      );

      // Reverter o ENUM para o estado antigo
      await queryInterface.sequelize.query(
        "ALTER TABLE `Agendamentos` MODIFY `status` ENUM('agendado','em andamento','concluido') NOT NULL DEFAULT 'agendado';",
        { transaction }
      );
    });
  }
};
