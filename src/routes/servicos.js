const express = require('express');
const router = express.Router();
const ServicoController = require('../controllers/ServicoController');
const { checkAuth, checkGestor } = require('../middlewares/auth');

router.use(checkAuth, checkGestor);

router.get('/', ServicoController.index);
router.get('/novo', ServicoController.create);
router.post('/', ServicoController.store);
router.get('/:id/editar', ServicoController.edit);
router.put('/:id', ServicoController.update);
router.delete('/:id', ServicoController.destroy);

module.exports = router;
