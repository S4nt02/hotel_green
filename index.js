const path = require('path');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

// Serve o React build
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Rota para React SPA
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
  const { email, senha } = req.body;
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

// Cria o transporte do nodemailer para envio de emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // Provedor de email
  auth: {
    user: process.env.EMAIL_USER, // Usuário (vem do .env)
    pass: process.env.EMAIL_PASS, // Senha ou app password (do .env)
  },
});

// Rota de recuperação de senha
app.post('/recover_senha', (req, res) => {
  const { email } = req.body; // Recebe o email do corpo da requisição
  const sql = "SELECT * FROM usuarios WHERE email = ?"; // Verifica se o email existe

  bd.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json({ erro: err }); // Erro ao buscar no banco

    if (result.length > 0) {
      // Usuário encontrado, gera nova senha aleatória
      const novaSenha = Math.random().toString(36).slice(-8);

      // Atualiza a senha do usuário no banco
      const updateSQL = "UPDATE usuarios SET senha = ? WHERE email = ?";
      bd.query(updateSQL, [novaSenha, email], (err) => {
        if (err) return res.status(500).json({ erro: 'Erro ao atualizar senha' });

        // Define o conteúdo do email
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Recuperação de Senha - Hotel Green',
          text: `Olá!\n\nSua nova senha de acesso é: ${novaSenha}\n\nUse essa senha para entrar no sistema e altere-a depois pelo seu perfil.`
        };

        // Envia o email com a nova senha
        transporter.sendMail(mailOptions, (erro, info) => {
          if (erro) {
            console.error('Erro ao enviar e-mail:', erro);
            return res.status(500).json({ erro: 'Erro ao enviar email', detalhes: erro.message });
          }

          console.log('E-mail enviado:', info.response);
          return res.json({ sucesso: true, mensagem: 'Senha enviada para o email!' });
        });
      });
    } else {
      // Email não existe no banco
      res.json({ existe: false });
    }
  });
});