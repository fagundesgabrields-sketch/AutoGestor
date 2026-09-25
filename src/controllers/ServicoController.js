const { Servico } = require('../models');

module.exports = {
  index: async (req, res) => {
    const servicos = await Servico.findAll();
    res.render('servicos/index', { servicos });
  },
  create: (req, res) => res.render('servicos/create'),
  store: async (req, res) => {
    await Servico.create(req.body);
    res.redirect('/servicos');
  },
  edit: async (req, res) => {
    const servico = await Servico.findByPk(req.params.id);
    res.render('servicos/edit', { servico });
  },
  update: async (req, res) => {
    const servico = await Servico.findByPk(req.params.id);
    await servico.update(req.body);
    res.redirect('/servicos');
  },
  destroy: async (req, res) => {
    const servico = await Servico.findByPk(req.params.id);
    if (servico) await servico.destroy();
    res.redirect('/servicos');
  }
};
