const express = require('express');
const router = express.Router();
const OrdemServicoController = require('../controllers/OrdemServicoController');
const { checkAuth } = require('../middlewares/auth');

router.use(checkAuth);

router.get('/', OrdemServicoController.index);
router.get('/nova', OrdemServicoController.create);
router.post('/', OrdemServicoController.store);
router.get('/:id', OrdemServicoController.show);
router.get('/:id/print', OrdemServicoController.print);
router.post('/:id/status', OrdemServicoController.updateStatus);
router.post('/:id/servicos', OrdemServicoController.addServico);
router.delete('/:id/servicos/:itemId', OrdemServicoController.removeServico);
router.post('/:id/pecas', OrdemServicoController.addPeca);
router.delete('/:id/pecas/:itemId', OrdemServicoController.removePeca);
router.post('/:id/pagamentos', OrdemServicoController.addPagamento);

module.exports = router;
