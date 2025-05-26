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
    const query = 'UPDATE doacao SET status = $1 WHERE id = $2';
    await pool.query(query, [novoStatus, id]);
  },

  async excluir(id) {
    const query = 'DELETE FROM doacao WHERE id = $1';
    await pool.query(query, [id]);
  },

  async buscarPorId(id_usuario) {
    const query = 'SELECT doacao.*, usuario.nome AS nome_usuario, bancos_de_leite.nome AS nome_banco_leite FROM doacao JOIN usuario ON doacao.id_usuario = usuario.id JOIN bancos_de_leite ON doacao.id_bancos_de_leite = bancos_de_leite.id WHERE doacao.id_usuario = $1;';
    const { rows } = await pool.query(query, [id_usuario]);
    return rows; // retorna o array com todos os agendamentos do usuário
  },

  async buscarPorIdEUsuario(id_doacao, id_usuario) {
    const query = `
      SELECT doacao.*, usuario.nome AS nome_usuario, bancos_de_leite.nome AS nome_banco_leite
      FROM doacao
      JOIN usuario ON doacao.id_usuario = usuario.id
      JOIN bancos_de_leite ON doacao.id_bancos_de_leite = bancos_de_leite.id
      WHERE doacao.id = $1 AND doacao.id_usuario = $2;
    `;
    const { rows } = await pool.query(query, [id_doacao, id_usuario]);
    return rows[0]; // retorna o agendamento ou undefined se não encontrar
  },




  async reagendar(id, novaData) {
    const query = 'UPDATE doacao SET data_doacao = $1, status = $2 WHERE id = $3';
    await pool.query(query, [novaData, 'reagendado', id]);
  },

};

module.exports = Doacao;
