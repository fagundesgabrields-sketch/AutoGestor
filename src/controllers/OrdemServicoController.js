const { OrdemServico, Cliente, Veiculo, Mecanico, Servico, Peca, OrdemServicoServico, OrdemServicoPeca, Pagamento } = require('../models');

module.exports = {
  index: async (req, res) => {
    const ordens = await OrdemServico.findAll({
      include: [
        { model: Veiculo, as: 'veiculo', include: [{ model: Cliente, as: 'cliente' }] },
        { model: Mecanico, as: 'mecanico' }
      ],
      order: [['data_abertura', 'DESC']]
    });
    res.render('ordens_servico/index', { ordens });
  },

  create: async (req, res) => {
    const veiculos = await Veiculo.findAll({ include: [{ model: Cliente, as: 'cliente' }] });
    const mecanicos = await Mecanico.findAll();
    res.render('ordens_servico/create', { veiculos, mecanicos });
  },

  store: async (req, res) => {
    try {
      const os = await OrdemServico.create({
        veiculo_id: req.body.veiculo_id,
        mecanico_id: req.body.mecanico_id || null,
        descricao_problema: req.body.descricao_problema
      });
      res.redirect(`/ordens-servico/${os.id}`);
    } catch (error) {
      res.status(500).send('Erro ao abrir OS');
    }
  },

  show: async (req, res) => {
    const os = await OrdemServico.findByPk(req.params.id, {
      include: [
        { model: Veiculo, as: 'veiculo', include: [{ model: Cliente, as: 'cliente' }] },
        { model: Mecanico, as: 'mecanico' },
        { model: OrdemServicoServico, as: 'servicos_os', include: [{ model: Servico, as: 'servico' }] },
        { model: OrdemServicoPeca, as: 'pecas_os', include: [{ model: Peca, as: 'peca' }] },
        { model: Pagamento, as: 'pagamentos' }
      ]
    });
    if (!os) return res.status(404).send('OS não encontrada');

    const servicos = await Servico.findAll();
    const pecas = await Peca.findAll();
    const mecanicos = await Mecanico.findAll();

    res.render('ordens_servico/show', { os, servicos, pecas, mecanicos });
  },

  print: async (req, res) => {
    const os = await OrdemServico.findByPk(req.params.id, {
      include: [
        { model: Veiculo, as: 'veiculo', include: [{ model: Cliente, as: 'cliente' }] },
        { model: Mecanico, as: 'mecanico' },
        { model: OrdemServicoServico, as: 'servicos_os', include: [{ model: Servico, as: 'servico' }] },
        { model: OrdemServicoPeca, as: 'pecas_os', include: [{ model: Peca, as: 'peca' }] },
        { model: Pagamento, as: 'pagamentos' }
      ]
    });
    if (!os) return res.status(404).send('OS não encontrada');

    res.render('ordens_servico/print', { layout: false, os });
  },

  updateStatus: async (req, res) => {
    const os = await OrdemServico.findByPk(req.params.id);
    if (!os) return res.status(404).send('OS não encontrada');
    
    os.status = req.body.status;
    if (os.status === 'Concluida' && !os.data_conclusao) {
      os.data_conclusao = new Date();
    }
    await os.save();
    res.redirect(`/ordens-servico/${os.id}`);
  },

  addServico: async (req, res) => {
    const os = await OrdemServico.findByPk(req.params.id);
    const servico = await Servico.findByPk(req.body.servico_id);
    const qtd = parseInt(req.body.quantidade);
    
    await OrdemServicoServico.create({
      ordem_servico_id: os.id,
      servico_id: servico.id,
      quantidade: qtd,
      valor_unitario: servico.valor_mao_obra,
      subtotal: servico.valor_mao_obra * qtd
    });
    
    os.valor_total = parseFloat(os.valor_total) + (servico.valor_mao_obra * qtd);
    await os.save();
    
    res.redirect(`/ordens-servico/${os.id}`);
  },

  removeServico: async (req, res) => {
    const osServico = await OrdemServicoServico.findByPk(req.params.itemId);
    if (osServico) {
      const os = await OrdemServico.findByPk(osServico.ordem_servico_id);
      os.valor_total = parseFloat(os.valor_total) - parseFloat(osServico.subtotal);
      await os.save();
      await osServico.destroy();
    }
    res.redirect(`/ordens-servico/${req.params.id}`);
  },

  addPeca: async (req, res) => {
    const os = await OrdemServico.findByPk(req.params.id);
    const peca = await Peca.findByPk(req.body.peca_id);
    const qtd = parseInt(req.body.quantidade);

    if (peca.estoque < qtd) {
      return res.status(400).send('Estoque insuficiente');
    }

    await OrdemServicoPeca.create({
      ordem_servico_id: os.id,
      peca_id: peca.id,
      quantidade: qtd,
      valor_unitario: peca.valor_unitario,
      subtotal: peca.valor_unitario * qtd
    });

    peca.estoque -= qtd;
    await peca.save();

    os.valor_total = parseFloat(os.valor_total) + (peca.valor_unitario * qtd);
    await os.save();

    res.redirect(`/ordens-servico/${os.id}`);
  },

  removePeca: async (req, res) => {
    const osPeca = await OrdemServicoPeca.findByPk(req.params.itemId);
    if (osPeca) {
      const peca = await Peca.findByPk(osPeca.peca_id);
      peca.estoque += osPeca.quantidade;
      await peca.save();

      const os = await OrdemServico.findByPk(osPeca.ordem_servico_id);
      os.valor_total = parseFloat(os.valor_total) - parseFloat(osPeca.subtotal);
      await os.save();
      await osPeca.destroy();
    }
    res.redirect(`/ordens-servico/${req.params.id}`);
  },

  addPagamento: async (req, res) => {
    const os = await OrdemServico.findByPk(req.params.id);
    await Pagamento.create({
      ordem_servico_id: os.id,
      forma_pagamento: req.body.forma_pagamento,
      valor: req.body.valor,
      status: 'Pago'
    });
    res.redirect(`/ordens-servico/${os.id}`);
  }
};
