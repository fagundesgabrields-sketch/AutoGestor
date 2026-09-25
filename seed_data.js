const { Cliente, Veiculo, Mecanico, Servico, Peca, OrdemServico, OrdemServicoPeca, OrdemServicoServico, Pagamento } = require('./src/models');

async function seed() {
  try {
    console.log('Criando clientes...');
    const c1 = await Cliente.create({ nome: 'Roberto Albuquerque', cpf: '12345678901', telefone: '(11) 98765-4321', email: 'roberto@email.com', endereco: 'Rua A, 123' });
    const c2 = await Cliente.create({ nome: 'Mariana Mendonça', cpf: '09876543210', telefone: '(11) 97112-9988', email: 'mariana@email.com', endereco: 'Av B, 456' });
    const c3 = await Cliente.create({ nome: 'Transportadora Veloz Ltda', cpf: '11223344000199', telefone: '(11) 3244-1100', email: 'contato@veloz.com.br', endereco: 'Rodovia C, km 10' });

    console.log('Criando veículos...');
    const v1 = await Veiculo.create({ cliente_id: c1.id, marca: 'Toyota', modelo: 'Corolla XEi 2.0', ano: 2021, placa: 'BRA2E19' });
    const v2 = await Veiculo.create({ cliente_id: c2.id, marca: 'Honda', modelo: 'Civic Touring', ano: 2020, placa: 'GHJ4B88' });
    const v3 = await Veiculo.create({ cliente_id: c3.id, marca: 'Jeep', modelo: 'Compass Longitude', ano: 2022, placa: 'JEP9A22' });

    console.log('Criando mecânicos...');
    const m1 = await Mecanico.create({ nome: 'Marcos Vinicius', especialidade: 'Mecânica Geral', telefone: '(11) 91111-1111' });
    const m2 = await Mecanico.create({ nome: 'Lucas Santana', especialidade: 'Suspensão e Freios', telefone: '(11) 92222-2222' });
    const m3 = await Mecanico.create({ nome: 'Rodrigo T.', especialidade: 'Injeção Eletrônica', telefone: '(11) 93333-3333' });

    console.log('Criando serviços...');
    const s1 = await Servico.create({ nome: 'Revisão 40k km', descricao: 'Troca de fluidos, filtros e velas', valor_mao_obra: 350.00 });
    const s2 = await Servico.create({ nome: 'Troca de Amortecedores', descricao: 'Substituição dos amortecedores dianteiros', valor_mao_obra: 250.00 });
    const s3 = await Servico.create({ nome: 'Diagnóstico Eletrônico', descricao: 'Scanner da injeção', valor_mao_obra: 150.00 });

    console.log('Criando peças...');
    const p1 = await Peca.create({ nome: 'Óleo Sintético 5W30', descricao: 'Óleo para motor', valor_unitario: 45.00, estoque: 50 });
    const p2 = await Peca.create({ nome: 'Filtro de Óleo', descricao: 'Filtro padrão', valor_unitario: 35.00, estoque: 30 });
    const p3 = await Peca.create({ nome: 'Par de Amortecedores', descricao: 'Amortecedores dianteiros Monroe', valor_unitario: 450.00, estoque: 10 });
    const p4 = await Peca.create({ nome: 'Pastilha de Freio Cobreq', descricao: 'Jogo dianteiro', valor_unitario: 120.00, estoque: 5 });

    console.log('Criando Ordens de Serviço...');
    // OS 1 - Aguardando Peças
    const os1 = await OrdemServico.create({ veiculo_id: v1.id, mecanico_id: m1.id, status: 'Aberta', descricao_problema: 'Revisão 40k + Barulho no freio', valor_total: 0 });
    await OrdemServicoServico.create({ ordem_servico_id: os1.id, servico_id: s1.id, quantidade: 1, valor_unitario: 350, subtotal: 350 });
    await OrdemServicoPeca.create({ ordem_servico_id: os1.id, peca_id: p1.id, quantidade: 4, valor_unitario: 45, subtotal: 180 });
    await OrdemServicoPeca.create({ ordem_servico_id: os1.id, peca_id: p2.id, quantidade: 1, valor_unitario: 35, subtotal: 35 });
    os1.valor_total = 350 + 180 + 35;
    await os1.save();

    // OS 2 - Em Execução
    const os2 = await OrdemServico.create({ veiculo_id: v2.id, mecanico_id: m2.id, status: 'Em Andamento', descricao_problema: 'Carro quicando muito na frente', valor_total: 0 });
    await OrdemServicoServico.create({ ordem_servico_id: os2.id, servico_id: s2.id, quantidade: 1, valor_unitario: 250, subtotal: 250 });
    await OrdemServicoPeca.create({ ordem_servico_id: os2.id, peca_id: p3.id, quantidade: 1, valor_unitario: 450, subtotal: 450 });
    os2.valor_total = 250 + 450;
    await os2.save();

    // OS 3 - Em Diagnóstico
    const os3 = await OrdemServico.create({ veiculo_id: v3.id, mecanico_id: m3.id, status: 'Aberta', descricao_problema: 'Luz da injeção acesa no painel', valor_total: 0 });
    await OrdemServicoServico.create({ ordem_servico_id: os3.id, servico_id: s3.id, quantidade: 1, valor_unitario: 150, subtotal: 150 });
    os3.valor_total = 150;
    await os3.save();

    // OS 4 - Concluída
    const os4 = await OrdemServico.create({ veiculo_id: v1.id, mecanico_id: m2.id, status: 'Concluida', descricao_problema: 'Troca de pastilhas rápida', valor_total: 0, data_conclusao: new Date() });
    await OrdemServicoServico.create({ ordem_servico_id: os4.id, servico_id: s2.id, quantidade: 1, valor_unitario: 100, subtotal: 100 });
    await OrdemServicoPeca.create({ ordem_servico_id: os4.id, peca_id: p4.id, quantidade: 1, valor_unitario: 120, subtotal: 120 });
    os4.valor_total = 100 + 120;
    await os4.save();
    await Pagamento.create({ ordem_servico_id: os4.id, forma_pagamento: 'Pix', valor: 220, status: 'Pago', data_pagamento: new Date() });

    console.log('Massa de dados criada com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

seed();
