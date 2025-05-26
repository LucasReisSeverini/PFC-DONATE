const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { autorizarProfissional } = require('../middlewares/perfilMiddleware');
const agendamentoController = require('../controllers/agendamentoController');


// Listar todos os agendamentos (para profissionais)
router.get('/', authMiddleware.verificarToken, autorizarProfissional, agendamentoController.listarAgendamentos);

// Aceitar agendamento
router.post('/:id/aceitar', authMiddleware.verificarToken, autorizarProfissional, agendamentoController.aceitarAgendamento);

// Reagendar agendamento
router.put('/:id/reagendar', authMiddleware.verificarToken, autorizarProfissional, agendamentoController.reagendarAgendamento);

// Recusar agendamento
router.post('/:id/recusar', authMiddleware.verificarToken, autorizarProfissional, agendamentoController.recusarAgendamento);

// Rota para listar agendamentos do usuário logado
router.get('/meus-agendamentos', authMiddleware.verificarToken, agendamentoController.listarAgendamentosPorUsuario);

// Rota para cancelar agendamento (cancelar = deletar)
router.delete('/:id/cancelar', authMiddleware.verificarToken, agendamentoController.cancelarAgendamento);

module.exports = router;
