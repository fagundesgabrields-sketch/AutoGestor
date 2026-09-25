const { Peca } = require('../models');

module.exports = {
  index: async (req, res) => {
    const pecas = await Peca.findAll();
    res.render('pecas/index', { pecas });
  },
  create: (req, res) => res.render('pecas/create'),
  store: async (req, res) => {
    await Peca.create(req.body);
    res.redirect('/pecas');
  },
  edit: async (req, res) => {
    const peca = await Peca.findByPk(req.params.id);
    res.render('pecas/edit', { peca });
  },
  update: async (req, res) => {
    const peca = await Peca.findByPk(req.params.id);
    await peca.update(req.body);
    res.redirect('/pecas');
  },
  destroy: async (req, res) => {
    const peca = await Peca.findByPk(req.params.id);
    if (peca) await peca.destroy();
    res.redirect('/pecas');
  }
};
