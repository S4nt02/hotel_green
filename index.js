const path = require('path');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve o React build
app.use(express.static(path.join(__dirname, 'frontend', 'build')));
// Deve vir **por último**: rota para React SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Inicia o servidor
const port = process.env.PORT || 8080; 
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});


// Conecta ao banco de dados
const bd = mysql.createConnection({
    host: '34.27.45.81',
    user: 'root',
    password: 'hotelgreen',
    database: 'hotel_green',
    connectTimeout: 10000,
});

bd.connect(err => {
    if (err) {
        console.error('Erro ao conectar no banco:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

// Rota de login
app.post('/login', (req, res) => {
    const { email , senha } = req.body;
    const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
  
    bd.query(sql, [email, senha], (err, result) => { 
      if (err) return res.status(500).json({ erro: err });
      if (result.length > 0) {
        res.json({ logado: true, usuario: result[0] });
      } else {
        res.json({ logado: false });
      }
    });
});


