const Doacao = require('../models/doacaoModel'); // Seu model de doação/agendamento
const pool = require('../config/db');


exports.listarAgendamentos = async (req, res) => {
  try {
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
