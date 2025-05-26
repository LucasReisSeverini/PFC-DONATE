const Doacao = require('../models/doacaoModel'); // Seu model de doação/agendamento
const pool = require('../config/db');

exports.listarAgendamentos = async (req, res) => {
  try {
    console.log("Entrou errado");
    const agendamentos = await Doacao.buscarTodos(); // Ajuste o método conforme seu model
    res.json(agendamentos);
  } catch (error) {
    console.error("Erro ao listar agendamentos:", error);
    res.status(500).json({ message: "Erro ao listar agendamentos" });
  }
};

exports.aceitarAgendamento = async (req, res) => {
  const { id } = req.params;
  try {
    await Doacao.atualizarStatus(id, 'aceito');
    res.json({ message: "Agendamento aceito com sucesso" });
  } catch (error) {
    console.error("Erro ao aceitar agendamento:", error);
    res.status(500).json({ message: "Erro ao aceitar agendamento" });
  }
};

exports.reagendarAgendamento = async (req, res) => {
  const { id } = req.params;
  const { novaData } = req.body;
  try {
    await Doacao.reagendar(id, novaData);
    res.json({ message: "Agendamento reagendado com sucesso" });
  } catch (error) {
    console.error("Erro ao reagendar agendamento:", error);
    res.status(500).json({ message: "Erro ao reagendar agendamento" });
  }
};

exports.recusarAgendamento = async (req, res) => {
  const { id } = req.params;
  try {
    await Doacao.atualizarStatus(id, 'recusado');
    res.json({ message: "Agendamento recusado com sucesso" });
  } catch (error) {
    console.error("Erro ao recusar agendamento:", error);
    res.status(500).json({ message: "Erro ao recusar agendamento" });
  }
};

exports.listarAgendamentosPorUsuario = async (req, res) => {
  try {
    console.log("Entrou em listarAgendamentosPorUsuario");
    const userId = req.usuario.id;
    console.log("Usuário autenticado:", req.usuario);
    const agendamentos = await Doacao.buscarPorId(userId); // Você precisa criar esse método no model
    res.json(agendamentos);
  } catch (error) {
    console.error("Erro ao listar agendamentos do usuário:", error);
    res.status(500).json({ message: "Erro ao listar agendamentos do usuário" });
  }
};



exports.cancelarAgendamento = async (req, res) => {
  const { id } = req.params;
  const userId = req.usuario.id;


  try {
    const agendamento = await Doacao.buscarPorIdEUsuario(id, userId); // Também deve criar esse método no model

    if (!agendamento) {
      return res.status(404).json({ message: "Agendamento não encontrado ou sem permissão" });
    }

    await Doacao.excluir(id); // Método para deletar no model
    res.json({ message: "Agendamento cancelado com sucesso" });
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error);
    res.status(500).json({ message: "Erro ao cancelar agendamento" });
  }
};
