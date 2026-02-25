'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const hasClientes = tables.some((table) => String(table).toLowerCase() === 'clientes');
    const hasProfissionais = tables.some((table) => String(table).toLowerCase() === 'profissionais');
    const hasUsuarios = tables.some((table) => String(table).toLowerCase() === 'usuarios');

    if (!hasClientes) {
      await queryInterface.createTable('Clientes', {
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
      telefone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: true
      },
      data_nascimento: {
        type: Sequelize.STRING,
        allowNull: false
      },
      observacoes: {
        type: Sequelize.STRING,
        allowNull: true
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

    if (!hasProfissionais) {
      await queryInterface.createTable('Profissionais', {
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
      telefone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      horario_inicio: {
        type: Sequelize.STRING,
        allowNull: false
      },
      horario_fim: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dias_ativos: {
        type: Sequelize.STRING,
        allowNull: false
      },
      especialidades: {
        type: Sequelize.STRING,
        allowNull: true
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

    if (!hasUsuarios) {
      await queryInterface.createTable('Usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      login: {
        type: Sequelize.STRING,
        allowNull: false
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tipo_login: {
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
  },

  async down(queryInterface) {
    const tables = await queryInterface.showAllTables();
    const hasClientes = tables.some((table) => String(table).toLowerCase() === 'clientes');
    const hasProfissionais = tables.some((table) => String(table).toLowerCase() === 'profissionais');
    const hasUsuarios = tables.some((table) => String(table).toLowerCase() === 'usuarios');

    if (hasUsuarios) {
      await queryInterface.dropTable('Usuarios');
    }

    if (hasProfissionais) {
      await queryInterface.dropTable('Profissionais');
    }

    if (hasClientes) {
      await queryInterface.dropTable('Clientes');
    }
  }
};
