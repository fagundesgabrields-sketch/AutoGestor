const express = require('express');
const router = express.Router();
const VeiculoController = require('../controllers/VeiculoController');
const { checkAuth } = require('../middlewares/auth');

router.use(checkAuth);

router.get('/', VeiculoController.index);
router.get('/novo', VeiculoController.create);
router.post('/', VeiculoController.store);
router.get('/:id/editar', VeiculoController.edit);
router.put('/:id', VeiculoController.update);
router.delete('/:id', VeiculoController.destroy);

module.exports = router;
