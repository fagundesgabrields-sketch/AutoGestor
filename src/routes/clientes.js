const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClienteController');
const { checkAuth } = require('../middlewares/auth');

router.use(checkAuth);

router.get('/', ClienteController.index);
router.get('/novo', ClienteController.create);
router.post('/', ClienteController.store);
router.get('/:id/editar', ClienteController.edit);
router.put('/:id', ClienteController.update);
router.delete('/:id', ClienteController.destroy);

module.exports = router;
