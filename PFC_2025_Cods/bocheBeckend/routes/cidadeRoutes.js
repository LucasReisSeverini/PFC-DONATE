const express = require('express');
const router = express.Router();
const cidadeController = require('../controllers/cidadeController');

// Rota pública para listar cidades
router.get('/', cidadeController.getCidades);

module.exports = router;
