const express = require('express');
const router = express.Router();
const RelatorioController = require('../controllers/RelatorioController');
const { checkAuth } = require('../middlewares/auth');

router.get('/laudo', checkAuth, RelatorioController.laudo);

module.exports = router;
