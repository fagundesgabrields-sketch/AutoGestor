const { Cliente } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  index: async (req, res) => {
    try {
      const { search } = req.query;
      let where = {};
      if (search) {
        where = {
          [Op.or]: [
            { nome: { [Op.like]: `%${search}%` } },
            { cpf: { [Op.like]: `%${search}%` } }
          ]
        };
      }
      const clientes = await Cliente.findAll({ where });
      res.render('clientes/index', { clientes, search });
    } catch (error) {
      res.status(500).send('Erro ao listar clientes');
    }
  },

  create: (req, res) => {
    res.render('clientes/create');
  },

  store: async (req, res) => {
    try {
      await Cliente.create(req.body);
      res.redirect('/clientes');
    } catch (error) {
      res.render('clientes/create', { error: 'Erro ao cadastrar cliente. Verifique o CPF.' });
    }
  },

  edit: async (req, res) => {
    try {
      const cliente = await Cliente.findByPk(req.params.id);
      if (!cliente) return res.status(404).send('Cliente não encontrado');
      res.render('clientes/edit', { cliente });
    } catch (error) {
      res.status(500).send('Erro ao buscar cliente');
    }
  },

  update: async (req, res) => {
    try {
      const cliente = await Cliente.findByPk(req.params.id);
      if (!cliente) return res.status(404).send('Cliente não encontrado');
      await cliente.update(req.body);
      res.redirect('/clientes');
    } catch (error) {
      const cliente = await Cliente.findByPk(req.params.id);
      res.render('clientes/edit', { cliente, error: 'Erro ao atualizar cliente.' });
    }
  },

  destroy: async (req, res) => {
    try {
      const cliente = await Cliente.findByPk(req.params.id);
      if (cliente) {
        await cliente.destroy();
      }
      res.redirect('/clientes');
    } catch (error) {
      res.status(500).send('Erro ao excluir cliente. Verifique se há veículos ou ordens vinculadas.');
    }
  }
};
