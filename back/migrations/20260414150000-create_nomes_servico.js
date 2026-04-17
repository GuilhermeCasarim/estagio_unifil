'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const hasNomes = tables.some((table) => String(table).toLowerCase() === 'nomesservico');
    const hasServicos = tables.some((table) => String(table).toLowerCase() === 'servicos');

    if (!hasNomes) {
      await queryInterface.createTable('NomesServico', {
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
      if (tableInfo && !tableInfo.nome_servico_id) {
        await queryInterface.addColumn('Servicos', 'nome_servico_id', {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'NomesServico',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        });
      }

      if (tableInfo && tableInfo.nome) {
        await queryInterface.sequelize.query(`
          INSERT INTO NomesServico (nome, createdAt, updatedAt)
          SELECT DISTINCT nome, NOW(), NOW()
          FROM Servicos
          WHERE nome IS NOT NULL
            AND nome <> ''
            AND nome NOT IN (SELECT nome FROM NomesServico)
        `);

        await queryInterface.sequelize.query(`
          UPDATE Servicos s
          JOIN NomesServico n ON n.nome = s.nome
          SET s.nome_servico_id = n.id
          WHERE s.nome IS NOT NULL AND s.nome <> ''
        `);

        const [[result]] = await queryInterface.sequelize.query(
          'SELECT COUNT(*) AS total, SUM(CASE WHEN nome_servico_id IS NULL THEN 1 ELSE 0 END) AS faltando FROM Servicos'
        );

        if (result && Number(result.faltando) === 0) {
          await queryInterface.removeColumn('Servicos', 'nome');
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const hasNomes = tables.some((table) => String(table).toLowerCase() === 'nomesservico');
    const hasServicos = tables.some((table) => String(table).toLowerCase() === 'servicos');

    if (hasServicos) {
      const tableInfo = await queryInterface.describeTable('Servicos').catch(() => null);
      if (tableInfo && !tableInfo.nome) {
        await queryInterface.addColumn('Servicos', 'nome', {
          type: Sequelize.STRING,
          allowNull: true
        });
      }

      if (tableInfo && tableInfo.nome_servico_id) {
        await queryInterface.removeColumn('Servicos', 'nome_servico_id');
      }
    }

    if (hasNomes) {
      await queryInterface.dropTable('NomesServico');
    }
  }
};
