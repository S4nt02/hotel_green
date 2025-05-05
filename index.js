const path = require('path');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
require('dotenv').config();


const app = express();

const whitelist = [
  'http://localhost:8080',            // ambiente local
  'https://hotel-green-915114613175.us-central1.run.app'     // produção
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // permitir requisições sem origin (como Postman)
    if (whitelist.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

const session = require('express-session');
app.use(session({
  secret: 'minha-chave-secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 24000 * 60 * 60
  }
}));


app.use(express.json());

// Serve o React build
app.use(express.static(path.join(__dirname, 'frontend', 'build')));


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
  console.log(`email:${email}`)
  console.log(`senha:${senha}`)

  const sql = `
    SELECT id, email, NULL AS autorizacao, 'usuario' AS tipo
    FROM usuarios 
    WHERE email = ? AND senha = ?
    UNION
    SELECT id, email, autorizacao, 'funcionario' AS tipo
    FROM funcionarios 
    WHERE email = ? AND senha = ?
  `;

  bd.query(sql, [email, senha, email, senha], (err, result) => {
    if (err) {
      console.error('Erro no SQL:', err);
      return res.status(500).json({ erro: err });
    }

    if (result.length > 0) {
      req.session.userId = result[0].id;
      req.session.autorizacao = result[0].autorizacao || null;
      console.log(req.session.userId)
      console.log(req.session.autorizacao)

      req.session.save(() => {
        res.json({ logado: true, usuario: result[0] });
      });
    } else {
      res.json({ logado: false });
    }
  });

});

app.get('/auth/verify', (req, res) => {
  console.log(req.session.userId)
  if (req.session.userId) {
    // O usuário está logado
    res.json({
      autenticado: true,
      id: req.session.userId,
      autorizacao : req.session.autorizacao,
    });
  } else {
    // O usuário não está logado
    res.json({ autenticado: false });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao encerrar a sessão' });
    }
    res.clearCookie('connect.sid'); // limpa o cookie da sessão
    res.json({ mensagem: 'Sessão encerrada com sucesso' });
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

/////API CORREIOS BUSCAR CEP/////////////////

app.get('/api/cep/:cep', async (req, res) => {
  const { cep } = req.params;

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();

    if (dados.erro) {
      return res.json({ erro: "CEP não encontrado" });
    }

    res.json(dados);
  } catch (er) {
    res.json({ erro: "Erro ao buscar CEP" });
  }
});


///////////////////////SALVAR DADOS DO CADASTRO NO BANCO///////////////////////


// Rota para salvar os dados do cadastro com verificação de duplicidade
app.post('/api/cadastro', (req, res) => {
  const {
    nome,
    dtNascimento,
    nomeMae,
    nomePai,
    email,
    senha,
    cpf_rg,
    passaporte,
    telefone,
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    pais,
    nacionalidade,
  } = req.body;

  // 1. Formata a data para o formato aceito pelo MySQL (YYYY-MM-DD)
  const formatarData = (data) => {
    if (!data) return null;
    const d = new Date(data);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  const dataNascimentoFormatada = formatarData(dtNascimento);

  // 2. Define qual documento será salvo (CPF/RG ou Passaporte)
  const documento = cpf_rg && cpf_rg.trim() !== '' ? cpf_rg : passaporte;

  const verificaSql = `SELECT * FROM usuarios WHERE documento = ? OR email = ?`;

  bd.query(verificaSql, [documento, email], (err, result) => {
    if (err) {
      console.error('Erro ao verificar cadastro:', err);
      return res.status(500).json({ erro: 'Erro ao verificar cadastro', detalhes: err });
    }

    if (result.length > 0) {
      return res.status(400).json({ erro: 'Documento ou Email já cadastrado!' });
    }

    const sql = `INSERT INTO usuarios 
      (nome, dtNascimento, nomeMae, nomePai, email, senha, documento, telefone, cep, logradouro, numero, complemento bairro, cidade, estado, pais, nacionalidade) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const valores = [
      nome,
      dataNascimentoFormatada,
      nomeMae,
      nomePai,
      email,
      senha,
      documento,
      telefone,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      pais,
      nacionalidade
    ];

    bd.query(sql, valores, (err, result) => {
      if (err) {
        console.error('Erro ao salvar cadastro:', err);
        return res.status(500).json({ erro: 'Erro ao salvar cadastro', detalhes: err });
      }
      res.status(201).json({ sucesso: true, mensagem: 'Cadastro salvo com sucesso!' });
    });
  });
});


////////////////////// RECUPERA TODOS OS FUNCIONARIOS ///////////////////////////////

app.post('/funcionarios', (req, res) => {
  const sql = 'SELECT * FROM funcionarios ORDER BY id';

  bd.query(sql, (err, result, fields) => {
    console.log("Erro:", err);
    console.log("Resultado:", result);
    console.log("Fields:", fields);
  
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar funcionários' });
    }
  
    res.json(result);
  });
  
});

//////////////////////////////////////////////////////

app.post('/excluir_funcionarios' , (req, res) =>{
  const {id} = req.body

  const sql = 'DELETE FROM funcionarios WHERE id = ?'

  bd.query(sql, [id], (err, result) => {
    if(err){
      return res.status(500).json({ erro: err })
    }
    else{
      res.json({excluido: true})
    }
  })
})

/////////////////////////////////////////////////////////

///////////////////CADASTRO FUNCIONARIO//////////////////
app.post('/api/cadFuncionario', (req, res) => {
  const {
    nome,
    dtNascimento,
    nomeMae,
    nomePai,
    email,
    senha,
    documento,
    cargo,
    autorizacao,
    telefone,
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    pais,
  } = req.body;

  // 1. Formata a data para o formato aceito pelo MySQL (YYYY-MM-DD)
  const formatarData = (data) => {
    if (!data) return null;
    const d = new Date(data);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  const dataNascimentoFormatada = formatarData(dtNascimento);

  const verificaSql = `SELECT * FROM funcionarios WHERE documento = ? OR email = ?`;

  bd.query(verificaSql, [documento, email], (err, result) => {
    if (err) {
      console.error('Erro ao verificar cadastro:', err);
      return res.status(500).json({ erro: 'Erro ao verificar cadastro', detalhes: err });
    }

    if (result.length > 0) {
      return res.status(400).json({ erro: 'Documento ou Email já cadastrado!' });
    }

    const sql = `INSERT INTO funcionarios 
      (nome, dtNascimento, nomeMae, nomePai, email, senha, documento, cargo_id, autorizacao, telefone, cep, logradouro, numero, complemento, bairro, cidade, estado, pais) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const valores = [
      nome,
      dataNascimentoFormatada,
      nomeMae,
      nomePai,
      email,
      senha,
      documento,
      cargo,
      autorizacao,
      telefone,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      pais,
    ];

    bd.query(sql, valores, (err, result) => {
      if (err) {
        console.error('Erro ao salvar cadastro:', err);
        return res.status(500).json({ erro: 'Erro ao salvar cadastro', detalhes: err });
      }
      res.status(201).json({ sucesso: true, mensagem: 'Cadastro salvo com sucesso!' });
    });
  });
});

/////////////////BUSCAR CARGOS//////////////////////

app.get('/cargos', (req, res) => {
  const sql = 'SELECT * FROM cargos ORDER BY id';
  bd.query(sql, (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar cargos' });
    res.json(result);
  });
});

app.post('/cadastroCargo', (req, res) =>{
  const {cargo} = req.body

  const sql = 'INSERT INTO cargos (nome) values (?)';

  const valores = [cargo]

  bd.query(sql, valores, (err, result) =>{
    if(err){
      console.error("Erro ao cadastrar cargo:", err);
      return res.status(500).json({erro: "Erro ao cadastrar", detalhes: err})
    }

    res.status(201).json({cadastrado : true})

  })
})






























































































































































































// Rota para React SPA SEMPRE DEIXAR NO FINAL
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});
