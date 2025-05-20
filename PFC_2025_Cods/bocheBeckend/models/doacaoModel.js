const pool = require('../config/db');

const Doacao = {

  async buscarTodos() {
    const query = `
      SELECT
        d.id,
        d.data_doacao,
        d.status,
        d.quantidade_ml,
        u.nome AS nome_doadora
      FROM doacao d
      JOIN usuario u ON d.id_usuario = u.id
      ORDER BY d.data_doacao DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  async atualizarStatus(id, novoStatus) {
    const query = 'UPDATE doacoes SET status = $1 WHERE id = $2';
    await pool.query(query, [novoStatus, id]);
  },

  async reagendar(id, novaData) {
    const query = 'UPDATE doacoes SET data_agendamento = $1, status = $2 WHERE id = $3';
    await pool.query(query, [novaData, 'reagendado', id]);
  }

};

module.exports = Doacao;
