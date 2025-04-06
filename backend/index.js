//////////////////////// CLOUD BACK -> FRONT //////////////////////////////////////////
const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  });
///////////////////////// Conexão com banco de dados ///////////////////////////////
const mysql = require('mysql2');
require('dotenv').config();
const bd = mysql.createConnection({
    host: '34.27.45.81',
    user: 'root',
    password: 'hotelgreen',
    database: 'hotel_green'
});

bd.connect(err => {
    if (err) {
        console.error('Erro ao conectar no banco:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});
