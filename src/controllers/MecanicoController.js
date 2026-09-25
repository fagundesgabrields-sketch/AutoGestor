const { Mecanico } = require('../models');

module.exports = {
  index: async (req, res) => {
    const mecanicos = await Mecanico.findAll();
    res.render('mecanicos/index', { mecanicos });
  },
  create: (req, res) => res.render('mecanicos/create'),
  store: async (req, res) => {
    await Mecanico.create(req.body);
    res.redirect('/mecanicos');
  },
  edit: async (req, res) => {
    const mecanico = await Mecanico.findByPk(req.params.id);
    res.render('mecanicos/edit', { mecanico });
  },
  update: async (req, res) => {
    const mecanico = await Mecanico.findByPk(req.params.id);
    await mecanico.update(req.body);
    res.redirect('/mecanicos');
  },
  destroy: async (req, res) => {
    const mecanico = await Mecanico.findByPk(req.params.id);
    if (mecanico) await mecanico.destroy();
    res.redirect('/mecanicos');
  }
};
