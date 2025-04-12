//////////////////////// CLOUD BACK -> FRONT //////////////////////////////////////////
const path = require('path');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

const port = process.env.PORT || 8080; 

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

const cors = require('cors');
app.use(cors())

////////////////////////////////////////////////////////////////////////////////////

///////////////////////// Conexão com banco de dados ///////////////////////////////
const mysql = require('mysql2');
require('dotenv').config();
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

////////////////////////////////////////////////////////////////////////////////

//////////////////////CONSULTA BANCO DE DADOS///////////////////////////////////

// app.get('/rota', (req, res) => { //dentro do get configurar a rota onde vão ser exibido os dados, substituir rota pelo nome, usar geralmente o nome do que ira fazer consulta
//     const query = 'SELECT * FROM clientes'; // query para consulta na tabela
//     db.query(query, (err, results) => { // inicia a query no banco de dados para trazer os resultados
//       if (err) { // if para erro dos resultados
//         console.error('Erro na consulta:', err);
//         return res.status(500).json({ error: 'Erro ao consultar o banco de dados' });
//       }
//       res.json(results);//resposta da query
//     });
//   });

app.post('/login', (req, res) => {
    console.log(req.body)
    const { email , senha } = req.body;

    console.log(email)
    console.log(senha)
    const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
  
    bd.query(sql, [email, senha], (err, result) => { 
        console.log(result)
      if (err) return res.status(500).json({ erro: err });
  
      if (result.length > 0) {
        res.json({ logado: true, usuario: result[0] });
      } else {
        res.json({ logado: false });
      }
    });
  });
  