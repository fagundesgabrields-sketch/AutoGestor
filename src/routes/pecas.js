const express = require('express');
const router = express.Router();
const PecaController = require('../controllers/PecaController');
const { checkAuth, checkGestor } = require('../middlewares/auth');

router.use(checkAuth, checkGestor);

router.get('/', PecaController.index);
router.get('/novo', PecaController.create);
router.post('/', PecaController.store);
router.get('/:id/editar', PecaController.edit);
router.put('/:id', PecaController.update);
router.delete('/:id', PecaController.destroy);

module.exports = router;
