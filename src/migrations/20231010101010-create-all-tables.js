'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('clientes', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        nome: { type: Sequelize.STRING(120), allowNull: false },
        cpf: { type: Sequelize.STRING(14), allowNull: false, unique: true },
        telefone: { type: Sequelize.STRING(20), allowNull: false },
        email: { type: Sequelize.STRING(120) },
        endereco: { type: Sequelize.STRING(200) },
        created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
      }, { transaction });

      await queryInterface.createTable('veiculos', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        cliente_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'clientes', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        placa: { type: Sequelize.STRING(8), allowNull: false },
        marca: { type: Sequelize.STRING(60), allowNull: false },
        modelo: { type: Sequelize.STRING(60), allowNull: false },
        ano: { type: Sequelize.INTEGER },
        cor: { type: Sequelize.STRING(30) }
      }, { transaction });

      await queryInterface.createTable('mecanicos', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        nome: { type: Sequelize.STRING(120), allowNull: false },
        especialidade: { type: Sequelize.STRING(80) },
        telefone: { type: Sequelize.STRING(20) }
      }, { transaction });

      await queryInterface.createTable('servicos', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        nome: { type: Sequelize.STRING(120), allowNull: false },
        descricao: { type: Sequelize.STRING(255) },
        valor_mao_obra: { type: Sequelize.DECIMAL(10, 2), allowNull: false }
      }, { transaction });

      await queryInterface.createTable('pecas', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        nome: { type: Sequelize.STRING(120), allowNull: false },
        descricao: { type: Sequelize.STRING(255) },
        valor_unitario: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
        estoque: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }
      }, { transaction });

      await queryInterface.createTable('ordens_servico', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        veiculo_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'veiculos', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        mecanico_id: {
          type: Sequelize.INTEGER,
          references: { model: 'mecanicos', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        data_abertura: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        data_conclusao: { type: Sequelize.DATE },
        status: {
          type: Sequelize.ENUM('Aberta', 'Em Andamento', 'Concluida', 'Cancelada'),
          defaultValue: 'Aberta'
        },
        descricao_problema: { type: Sequelize.TEXT },
        valor_total: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 }
      }, { transaction });

      await queryInterface.createTable('ordem_servico_servicos', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        ordem_servico_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'ordens_servico', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        servico_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'servicos', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        quantidade: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
        valor_unitario: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
        subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false }
      }, { transaction });

      await queryInterface.createTable('ordem_servico_pecas', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        ordem_servico_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'ordens_servico', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        peca_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'pecas', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        quantidade: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
        valor_unitario: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
        subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false }
      }, { transaction });

      await queryInterface.createTable('pagamentos', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        ordem_servico_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'ordens_servico', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        forma_pagamento: {
          type: Sequelize.ENUM('Dinheiro', 'Cartao', 'Pix', 'Boleto'),
          allowNull: false
        },
        valor: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
        data_pagamento: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        status: {
          type: Sequelize.ENUM('Pendente', 'Pago', 'Cancelado'),
          defaultValue: 'Pendente'
        }
      }, { transaction });

      await queryInterface.createTable('usuarios', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        nome: { type: Sequelize.STRING(120), allowNull: false },
        login: { type: Sequelize.STRING(60), allowNull: false, unique: true },
        senha: { type: Sequelize.STRING(255), allowNull: false },
        perfil: {
          type: Sequelize.ENUM('recepcao', 'mecanico', 'gestor'),
          allowNull: false
        }
      }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('usuarios', { transaction });
      await queryInterface.dropTable('pagamentos', { transaction });
      await queryInterface.dropTable('ordem_servico_pecas', { transaction });
      await queryInterface.dropTable('ordem_servico_servicos', { transaction });
      await queryInterface.dropTable('ordens_servico', { transaction });
      await queryInterface.dropTable('pecas', { transaction });
      await queryInterface.dropTable('servicos', { transaction });
      await queryInterface.dropTable('mecanicos', { transaction });
      await queryInterface.dropTable('veiculos', { transaction });
      await queryInterface.dropTable('clientes', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
