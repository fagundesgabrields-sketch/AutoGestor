const { Veiculo, Cliente } = require('../models');

module.exports = {
  index: async (req, res) => {
    try {
      const { cliente_id } = req.query;
      let veiculos = [];
      let cliente = null;

      if (cliente_id) {
        cliente = await Cliente.findByPk(cliente_id);
        if (cliente) {
          veiculos = await Veiculo.findAll({ where: { cliente_id } });
        }
      } else {
        // Se quiser listar todos, opcional. O briefing pede "listagem por cliente"
        veiculos = await Veiculo.findAll({ include: [{ model: Cliente, as: 'cliente' }] });
      }

      res.render('veiculos/index', { veiculos, cliente });
    } catch (error) {
      res.status(500).send('Erro ao listar veículos');
    }
  },

  create: async (req, res) => {
    const { cliente_id } = req.query;
    let clientes = [];
    if (!cliente_id) {
      clientes = await Cliente.findAll();
    } else {
      const c = await Cliente.findByPk(cliente_id);
      if (c) clientes.push(c);
    }
    res.render('veiculos/create', { cliente_id, clientes });
  },

  store: async (req, res) => {
    try {
      await Veiculo.create(req.body);
      res.redirect(`/veiculos?cliente_id=${req.body.cliente_id}`);
    } catch (error) {
      const clientes = await Cliente.findAll();
      res.render('veiculos/create', { cliente_id: req.body.cliente_id, clientes, error: 'Erro ao cadastrar veículo' });
    }
  },

  edit: async (req, res) => {
    try {
      const veiculo = await Veiculo.findByPk(req.params.id);
      if (!veiculo) return res.status(404).send('Veículo não encontrado');
      const clientes = await Cliente.findAll();
      res.render('veiculos/edit', { veiculo, clientes });
    } catch (error) {
      res.status(500).send('Erro ao buscar veículo');
    }
  },

  update: async (req, res) => {
    try {
      const veiculo = await Veiculo.findByPk(req.params.id);
      if (!veiculo) return res.status(404).send('Veículo não encontrado');
      await veiculo.update(req.body);
      res.redirect(`/veiculos?cliente_id=${veiculo.cliente_id}`);
    } catch (error) {
      const veiculo = await Veiculo.findByPk(req.params.id);
      const clientes = await Cliente.findAll();
      res.render('veiculos/edit', { veiculo, clientes, error: 'Erro ao atualizar veículo' });
    }
  },

  destroy: async (req, res) => {
    try {
      const veiculo = await Veiculo.findByPk(req.params.id);
      if (veiculo) {
        const cliente_id = veiculo.cliente_id;
        await veiculo.destroy();
        return res.redirect(`/veiculos?cliente_id=${cliente_id}`);
      }
      res.redirect('/veiculos');
    } catch (error) {
      res.status(500).send('Erro ao excluir veículo.');
    }
  }
};
