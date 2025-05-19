const pool = require('../config/db');

exports.getCidades = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cidade ORDER BY nome');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar cidades:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
