const { OrdemServico, Cliente, Veiculo, Pagamento, Peca, Mecanico } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  index: async (req, res) => {
    try {
      const dataAtual = new Date();
      const primeiroDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
      const ultimoDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);

      // Total de OS por status
      const abertas = await OrdemServico.count({ where: { status: 'Aberta' } });
      const emAndamento = await OrdemServico.count({ where: { status: 'Em Andamento' } });
      const concluidas = await OrdemServico.count({ where: { status: 'Concluida' } });
      const canceladas = await OrdemServico.count({ where: { status: 'Cancelada' } });

      // Faturamento do mês (Pagamentos)
      const pagamentosMes = await Pagamento.sum('valor', {
        where: {
          status: 'Pago',
          data_pagamento: {
            [Op.between]: [primeiroDiaMes, ultimoDiaMes]
          }
        }
      });

      // Gráfico 1: Faturamento dos últimos 6 meses (Simplificado para o momento)
      // Idealmente fariamos um GROUP BY com a sintaxe do BD, mas faremos no JS por simplicidade p/ sqlite/mysql mix
      const seisMesesAtras = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 5, 1);
      const ultimosPagamentos = await Pagamento.findAll({
        where: { status: 'Pago', data_pagamento: { [Op.gte]: seisMesesAtras } }
      });
      
      const mesesLabels = [];
      const faturamentoData = [0, 0, 0, 0, 0, 0];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - i, 1);
        mesesLabels.push(d.toLocaleString('pt-BR', { month: 'short' }));
      }
      
      ultimosPagamentos.forEach(p => {
        const pDate = new Date(p.data_pagamento);
        const index = mesesLabels.indexOf(pDate.toLocaleString('pt-BR', { month: 'short' }));
        if (index > -1) {
          faturamentoData[index] += parseFloat(p.valor);
        }
      });

      // Alertas de Estoque Crítico (< 5)
      const alertasEstoque = await Peca.findAll({
        where: { estoque: { [Op.lt]: 5 } },
        order: [['estoque', 'ASC']],
        limit: 5
      });

      // Últimas OS abertas (Para a tabela)
      const ultimasOS = await OrdemServico.findAll({
        where: { status: { [Op.ne]: 'Cancelada' } }, // Mostra não canceladas
        order: [['data_abertura', 'DESC']],
        limit: 6,
        include: [
          { model: Veiculo, as: 'veiculo', include: [{ model: Cliente, as: 'cliente' }] },
          { model: Mecanico, as: 'mecanico' }
        ]
      });

      res.render('dashboard/index', {
        stats: {
          abertas, emAndamento, concluidas, canceladas,
          faturamentoMes: pagamentosMes || 0
        },
        graficos: {
          meses: JSON.stringify(mesesLabels),
          faturamento: JSON.stringify(faturamentoData)
        },
        alertasEstoque,
        ultimasOS
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao carregar dashboard');
    }
  }
};
