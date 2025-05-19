require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Importação de rotas
const userRoutes = require('./routes/userRoutes');
const bancoRoutes = require('./routes/banco.routes'); // 🔥 Nova rota dos bancos de leite
const doacaoRoutes = require('./routes/doacaoRoutes');
const cidadeRoutes = require('./routes/cidadeRoutes'); // nova rota cidades

// Rotas
app.use('/usuarios', userRoutes);
app.use('/bancos', bancoRoutes); // 🔥 Nova rota para os bancos de leite
app.use('/doacao', doacaoRoutes);
// Rota para cidades
app.use('/cidades', cidadeRoutes);
console.log('doacaoRoutes carregado');

app.use('/bancos-de-leite', bancoRoutes);



// Rota inicial de teste
app.get('/', (req, res) => {
    res.send('🚀 API do sistema de doação de leite está rodando!');
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
