const pool = require('../config/db');

exports.buscarTodos = async () => {
  const result = await pool.query('SELECT * FROM doacao ORDER BY data_agendada ASC');
  return result.rows;
};

exports.atualizarStatus = async (id, status) => {
  await pool.query('UPDATE doacao SET status = $1 WHERE id = $2', [status, id]);
};

exports.reagendar = async (id, novaData) => {
  await pool.query('UPDATE doacao SET data_agendada = $1, status = $2 WHERE id = $3', [novaData, 'reagendado', id]);
};
