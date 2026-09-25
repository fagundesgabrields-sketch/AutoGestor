const express = require('express');
const router = express.Router();
const MecanicoController = require('../controllers/MecanicoController');
const { checkAuth, checkGestor } = require('../middlewares/auth');

router.use(checkAuth, checkGestor);

router.get('/', MecanicoController.index);
router.get('/novo', MecanicoController.create);
router.post('/', MecanicoController.store);
router.get('/:id/editar', MecanicoController.edit);
router.put('/:id', MecanicoController.update);
router.delete('/:id', MecanicoController.destroy);

module.exports = router;
