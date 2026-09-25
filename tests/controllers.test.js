const request = require('supertest');
const app = require('../src/app');
const { Cliente, Veiculo, OrdemServico } = require('../src/models');

// Mock Auth middleware to bypass login
jest.mock('../src/middlewares/auth', () => ({
  checkAuth: (req, res, next) => {
    req.session = { usuario: { id: 1, nome: 'Test', perfil: 'gestor' } };
    res.locals.usuario = req.session.usuario;
    next();
  },
  checkGestor: (req, res, next) => next()
}));

// Mock Sequelize Models
jest.mock('../src/models', () => {
  const mockCliente = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  };
  const mockVeiculo = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  };
  const mockOrdemServico = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  };

  return {
    Cliente: mockCliente,
    Veiculo: mockVeiculo,
    OrdemServico: mockOrdemServico,
    Pagamento: { sum: jest.fn() },
    Mecanico: { findAll: jest.fn() },
    Servico: { findAll: jest.fn() },
    Peca: { findAll: jest.fn() },
    sequelize: { authenticate: jest.fn() }
  };
});

describe('Controllers Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Cliente Controller', () => {
    it('GET /clientes - deve listar clientes', async () => {
      Cliente.findAll.mockResolvedValue([{ id: 1, nome: 'João', cpf: '123' }]);
      const res = await request(app).get('/clientes');
      expect(res.statusCode).toBe(200);
      expect(Cliente.findAll).toHaveBeenCalled();
    });

    it('POST /clientes - deve criar cliente e redirecionar', async () => {
      Cliente.create.mockResolvedValue({ id: 2, nome: 'Maria' });
      const res = await request(app)
        .post('/clientes')
        .send({ nome: 'Maria', cpf: '456', telefone: '999' });
      expect(res.statusCode).toBe(302); // Redirect to /clientes
      expect(res.headers.location).toBe('/clientes');
      expect(Cliente.create).toHaveBeenCalledWith(expect.objectContaining({
        nome: 'Maria', cpf: '456'
      }));
    });
  });

  describe('Veiculo Controller', () => {
    it('GET /veiculos - deve listar veiculos', async () => {
      Veiculo.findAll.mockResolvedValue([{ id: 1, placa: 'ABC1234' }]);
      const res = await request(app).get('/veiculos');
      expect(res.statusCode).toBe(200);
      expect(Veiculo.findAll).toHaveBeenCalled();
    });

    it('POST /veiculos - deve criar veiculo', async () => {
      Veiculo.create.mockResolvedValue({ id: 1, placa: 'XYZ9876' });
      const res = await request(app)
        .post('/veiculos')
        .send({ cliente_id: 1, placa: 'XYZ9876', marca: 'Fiat', modelo: 'Uno' });
      expect(res.statusCode).toBe(302);
      expect(Veiculo.create).toHaveBeenCalledWith(expect.objectContaining({
        placa: 'XYZ9876'
      }));
    });
  });

  describe('OrdemServico Controller', () => {
    it('GET /ordens-servico - deve listar ordens', async () => {
      OrdemServico.findAll.mockResolvedValue([{ id: 1, status: 'Aberta' }]);
      const res = await request(app).get('/ordens-servico');
      expect(res.statusCode).toBe(200);
      expect(OrdemServico.findAll).toHaveBeenCalled();
    });

    it('POST /ordens-servico - deve criar ordem', async () => {
      OrdemServico.create.mockResolvedValue({ id: 10 });
      const res = await request(app)
        .post('/ordens-servico')
        .send({ veiculo_id: 1, descricao_problema: 'Motor falhando' });
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe('/ordens-servico/10');
      expect(OrdemServico.create).toHaveBeenCalledWith(expect.objectContaining({
        veiculo_id: "1", descricao_problema: 'Motor falhando'
      }));
    });
  });
});
