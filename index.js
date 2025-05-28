const path = require('path');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const { Storage } = require("@google-cloud/storage");
const multer = require('multer');
const nodemailer = require('nodemailer');
require('dotenv').config();
// import { MySQLConnector } from '@google-cloud/sql-connector';

const app = express();

const whitelist = [
  'http://localhost:8080',            // ambiente local
  'https://hotel-green-915114613175.us-central1.run.app'     // produção
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); 
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
    maxAge: 60000 * 60 * 60
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

// Conecta ao banco de dados localhost
const bd = mysql.createPool({
  host: '34.27.45.81',
  user: 'root',
  password: 'hotelgreen',
  database: 'hotel_green',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});

// Conexão BD produção
// const bd = mysql.createPool({
//   host: '10.84.208.3', // Conecta-se ao proxy localmente
//   port: 3306,       // Porta padrão do MySQL
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   socketPath: '/cloudsql/hotel-green-455600:us-central1:hotel-green-bd',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   connectTimeout: 10000,
// });
// })

/////////Confi multer imagens para o storage
const upload = multer({ storage: multer.memoryStorage() });

// Configuração do GCS
const keyFilePath = process.env.GCP_STORE;
const storage = new Storage({ keyFilename: keyFilePath });
const bucket = storage.bucket("hotel_green_garden_imagens");


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

app.post('/api/editarFuncionario', (req, res) =>{
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
    id,
  } = req.body;

  const formatarData = (data) => {
    if (!data) return null;
    const d = new Date(data);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  const dataNascimentoFormatada = formatarData(dtNascimento)

  const sql = `UPDATE funcionarios SET 
    nome = ?,
    dtNascimento = ?,
    nomeMae = ?,
    nomePai = ?,
    email = ?,
    senha = ?,
    documento = ?,
    cargo_id = ?,
    autorizacao = ?,
    telefone = ?,
    cep = ?,
    logradouro = ?,
    numero = ?,
    complemento = ?,
    bairro = ?,
    cidade = ?,
    estado = ?,
    pais = ? WHERE id = ? `;

  valores = [
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
    id,
  ]

  bd.query(sql, valores, (err, result) => {
    if (err) {
      console.error('Erro ao atualizar cadastro:', err);
      return res.status(500).json({ erro: 'Erro ao atualizar cadastro', detalhes: err });
    }
    res.status(201).json({ editado : true, mensagem: 'Funcionario atualizado com sucesso' });
  });
})


///////////CADASTRO TP QUARTO//////////////////

app.post('/api/cadastrarTpQuarto', upload.array('imagens'), async (req, res)  =>{
  const {
    unidade_hotel,
    nomeAcomodacao,
    quantidade_total,
    descricao,
    comodidades,
    vlDiaria,
    quantidade_adultos,
    quantidade_criancas,
  } = req.body

  const comodidadesFormatado = Array.isArray(comodidades)
    ? JSON.stringify(comodidades)
    : comodidades;

   const urls = await Promise.all(
      req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const blob = bucket.file(Date.now() + "_" + file.originalname);
          const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: file.mimetype,
          });

          blobStream.on("error", reject);

          blobStream.on("finish", async () => {
            await blob.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
          });

          blobStream.end(file.buffer);
        });
      })
    );

  const sql = `INSERT INTO tipo_acomodacao 
    (unidade_hotel, nomeAcomodacao, quantidade_total, descricao, comodidades, vlDiaria, quantidade_adultos, quantidade_criancas, imagens) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const valores = [
    unidade_hotel,
    nomeAcomodacao,
    quantidade_total,
    descricao,
    comodidadesFormatado,
    vlDiaria,
    quantidade_adultos,
    quantidade_criancas,
    JSON.stringify(urls)
  ]
  
  bd.query(sql, valores, (err, result) =>{
    if(err){
        console.error('Erro ao salvar cadastro:', err);
        return res.status(500).json({ erro: 'Erro ao salvar cadastro', detalhes: err });
    }
    res.status(201).json({ sucesso: true, mensagem: 'Cadastro salvo com sucesso!' })
  })
})


////////EDITAR TP QUARTO/////////
app.post('/api/editarTpQuarto', upload.array('imagensNovas'), async (req, res) => {
  const {
    unidade_hotel,
    nomeAcomodacao,
    quantidade_total,
    descricao,
    comodidades,
    vlDiaria,
    quantidade_adultos,
    quantidade_criancas,
    id,
    urlsExistentes // <- vem como string JSON
  } = req.body;

  let urlsMantidas = [];
  try {
    urlsMantidas = JSON.parse(urlsExistentes || '[]');
    if (!Array.isArray(urlsMantidas)) urlsMantidas = [];
  } catch (e) {
    console.error('Erro ao parsear urlsExistentes:', e.message);
    urlsMantidas = [];
  }

  const comodidadesFormatado = Array.isArray(comodidades)
    ? JSON.stringify(comodidades)
    : comodidades;

  try {
    // 1. Buscar URLs atuais do banco (urlAntigas)
    const imagensAntigas = await new Promise((resolve, reject) => {
      const sqlUrl = `SELECT imagens FROM tipo_acomodacao WHERE id = ?`;
      bd.query(sqlUrl, [id], (err, result) => {
        if (err) return reject(err);
        if (result.length === 0) return reject(new Error('Tipo de quarto não encontrado'));

        let urls = [];
        try {
          urls = JSON.parse(result[0].imagens || '[]');
          if (!Array.isArray(urls)) urls = [];
        } catch (e) {
          console.warn('Imagens antigas malformadas:', e.message);
        }

        resolve(urls);
      });
    });

    // 2. Descobrir quais URLs devem ser excluídas (não estão mais nas mantidas)
    const urlsParaExcluir = imagensAntigas.filter(
      (url) => !urlsMantidas.includes(url)
    );

    // 3. Apagar essas do Cloud Storage
    for (const url of urlsParaExcluir) {
      try {
        const nomeArquivo = decodeURIComponent(url.split('/').pop());
        const file = bucket.file(`hotel_green_garden_imagens/${nomeArquivo}`);
        await file.delete();
        console.log(`Deletado do storage: ${nomeArquivo}`);
      } catch (error) {
        console.error('Erro ao deletar imagem:', error.message);
      }
    }

    // 4. Upload de novas imagens
    const novasUrls = await Promise.all(
      req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const nomeUnico = `${Date.now()}_${file.originalname}`;
          const blob = bucket.file(`hotel_green_garden_imagens/${nomeUnico}`);
          const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: file.mimetype,
          });

          blobStream.on("error", reject);

          blobStream.on("finish", async () => {
            await blob.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
          });

          blobStream.end(file.buffer);
        });
      })
    );

    // 5. Junta as URLs mantidas com as novas
    const todasAsImagens = [...urlsMantidas, ...novasUrls];

    // 6. Atualiza o banco
    const sqlUpdate = `UPDATE tipo_acomodacao SET
      unidade_hotel = ?, nomeAcomodacao = ?, quantidade_total = ?, 
      descricao = ?, comodidades = ?, vlDiaria = ?, 
      quantidade_adultos = ?, quantidade_criancas = ?, imagens = ?
      WHERE id = ?`;

    const valoresUpdate = [
      unidade_hotel,
      nomeAcomodacao,
      quantidade_total,
      descricao,
      comodidadesFormatado,
      vlDiaria,
      quantidade_adultos,
      quantidade_criancas,
      JSON.stringify(todasAsImagens),
      id
    ];

    await new Promise((resolve, reject) => {
      bd.query(sqlUpdate, valoresUpdate, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    return res.status(200).json({ editado: true, mensagem: 'Cadastro atualizado com sucesso!' });

  } catch (error) {
    console.error('Erro ao editar tipo de quarto:', error);
    return res.status(500).json({ erro: 'Erro interno ao editar', detalhes: error.message });
  }
});



/////BUSCAR TP QUARTO//////////

app.get('/api/buscarTipoQuartos', (req, res) => {
  const sql = 'SELECT * FROM tipo_acomodacao ORDER BY id';
  bd.query(sql, (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar tipo de quartos' });
    res.json(result);
  });
});



////CADASTRAR ACOMODAÇÂO/////////

app.post('/api/cadastrarAcomodacao', (req, res) => {
  const {
    numAcomodacao,
    num_andar,
    tpAcomodacao,
    unidade_hotel,
  } = req.body

  const sql = `INSERT INTO acomodacoes 
  (numAcomodacao, num_andar, tpAcomodacao, unidade_hotel)
  VALUES (?, ?, ?, ?) `

  const valores = [
    numAcomodacao,
    num_andar,
    tpAcomodacao,
    unidade_hotel
  ]

  bd.query(sql, valores, (err, result) =>{
    if(err){
      console.error('Erro ao salvar cadastro:', err);
      return res.status(500).json({ erro: 'Erro ao salvar cadastro', detalhes: err });
    }
    res.status(201).json({ sucesso: true, mensagem: 'Cadastro salvo com sucesso!' })
  })
})


//////////EDITAR ACOMODAÇÂO////////////////////
app.post('/api/editarAcomodacao', (req, res) => {
  const {
    numAcomodacao,
    num_andar,
    tpAcomodacao,
    unidade_hotel,
    id
  } = req.body

  const sql = `UPDATE acomodacoes SET
  numAcomodacao = ?, 
  num_andar = ?, 
  tpAcomodacao = ?, 
  unidade_hotel = ?
   WHERE id = id`

  const valores = [
    numAcomodacao,
    num_andar,
    tpAcomodacao,
    unidade_hotel,
    id
  ]

  bd.query(sql, valores, (err, result) =>{
    if(err){
      console.error('Erro ao salvar cadastro:', err);
      return res.status(500).json({ erro: 'Erro ao salvar cadastro', detalhes: err });
    }
    res.status(201).json({ editado: true, mensagem: 'Cadastro salvo com sucesso!' })
  })
})

//////////BUSCAR ACOMODAÇÔES///////////////////

app.get('/api/buscarAcomodacoes', (req, res) => {
  const sql = 'SELECT * FROM acomodacoes ORDER BY id';
  bd.query(sql, (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar acomodações' });
    res.json(result);
  });
});


//////////EXCLUIR TPQUARTO///////////////////


app.post('/api/excluirTpQuarto', async (req, res) => {
  const { id } = req.body;

  try {
    // 1. Buscar imagens atuais no banco
    const imagens = await new Promise((resolve, reject) => {
      const sqlBusca = 'SELECT imagens FROM tipo_acomodacao WHERE id = ?';
      bd.query(sqlBusca, [id], (err, result) => {
        if (err) return reject(err);
        if (result.length === 0) return reject(new Error('Tipo de quarto não encontrado'));
        
        const imagensArray = JSON.parse(result[0].imagens || '[]');
        resolve(imagensArray);
      });
    });

    // 2. Deletar imagens do Cloud Storage
    for (const url of imagens) {
      try {
        const nomeArquivo = decodeURIComponent(url.split('/').pop());
        const file = bucket.file(nomeArquivo); // ou `pasta/${nomeArquivo}` se você estiver usando uma subpasta
        await file.delete();
        console.log(`Imagem deletada: ${nomeArquivo}`);
      } catch (error) {
        console.error(`Erro ao deletar ${url}:`, error.message);
      }
    }

    // 3. Deletar o registro do banco
    await new Promise((resolve, reject) => {
      const sqlDelete = 'DELETE FROM tipo_acomodacao WHERE id = ?';
      bd.query(sqlDelete, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    res.json({ excluido: true });

  } catch (error) {
    console.error('Erro ao excluir tipo de quarto:', error);
    res.status(500).json({ erro: 'Erro ao excluir tipo de quarto', detalhes: error.message });
  }
});



//////////EXCLUIR ACOMODAÇÔES////////////////


app.post('/api/excluirAcomodacao' , (req, res) =>{
  const {id} = req.body

  const sql = 'DELETE FROM acomodacoes WHERE id = ?'

  bd.query(sql, [id], (err, result) => {
    if(err){
      return res.status(500).json({ erro: err })
    }
    else{
      res.json({excluido: true})
    }
  })
})


//////////////CADASTRO CATEGORIA //////////////////

app.post('/api/cadCategoria', (req, res) =>{
  const {categoria} = req.body

  const sql = `INSERT INTO categoria_itens (nomeCategoria) VALUES (?)`

  const valores = [
    categoria
  ]

  bd.query(sql, valores, (err, result) => {
    if(err){
      return res.status(500).json({ erro: 'Erro ao salvar categoria', detalhes: err });
    }
    res.status(201).json({ editado: true, mensagem: 'Cadastro salvo com sucesso!' })
  })
})

////////////////BUSCAR CATEGORIA////////////////////////

app.get('/api/buscarCategoria', (req, res) => {
    const sql = 'SELECT * FROM categoria_itens ORDER BY id';
    bd.query(sql, (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar tipo de quartos' });
      res.json(result);
    });
})

//////////////EXCLUIR CATEGORIA//////////////////////////

app.post('/api/excluirCategoria', (req, res) => {
  const {id} = req.body
  
  const sql = 'DELETE FROM categoria_itens WHERE id = ?'

  bd.query(sql, [id], (err, result) => {
    if(err){
      return res.status(500).json({ erro: err })
    }
    else{
      res.json({excluido: true})
    }
  })
})


///////////EDITAR CATEGORIA/////////////////////////////
app.post('/api/editarCategoria', (req, res) =>{
  const {categoria, id} = req.body

  const sql = `UPDATE categoria_itens SET  nomeCategoria = ? WHERE id = ?`

  const valores = [
    categoria,
    id
  ]

  bd.query(sql, valores, (err, result) => {
    if(err){
      return res.status(500).json({ erro: 'Erro ao salvar categoria', detalhes: err });
    }
    res.status(201).json({ editado: true, mensagem: 'Cadastro salvo com sucesso!' })
  })
})


////////////////////ADICIONAR ITEM////////////////////////

app.post('/api/adicionarItem', (req, res) => {
  let { nomeItem, categoria, preco } = req.body;

  // Converte vírgula para ponto
  if (typeof preco === 'string') {
    preco = parseFloat(preco.replace(',', '.'));
  }

  console.log('DADOS RECEBIDOS:', { nomeItem, categoria, preco }); // 👈 IMPORTANTE

  const sql = `INSERT INTO itens (nomeItem, categoria, preco) VALUES (?, ?, ?)`;
  const valores = [nomeItem, categoria, preco];

  bd.query(sql, valores, (err, result) => {
    if (err) {
      console.error('ERRO SQL:', err); // 👈 MOSTRA ERRO NO TERMINAL
      return res.status(500).json({ erro: 'Erro ao salvar item', detalhes: err });
    }
    res.status(201).json({ editado: true, mensagem: 'Cadastro salvo com sucesso!' });
  });
});



///////////////BUSCAR ITEM//////////////////////////

app.get('/api/buscarItens', (req, res) => {
    const sql = 'SELECT * FROM itens ORDER BY id';
    bd.query(sql, (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar tipo de quartos' });
      res.json(result);
    });
})


////////////////EXCLUIR ITEM////////////////////////

app.post('/api/excluirItem', (req, res) => {
  const {id} = req.body
  
  const sql = 'DELETE FROM itens WHERE id = ?'

  bd.query(sql, [id], (err, result) => {
    if(err){
      return res.status(500).json({ erro: err })
    }
    else{
      res.json({excluido: true})
    }
  })
})

/////////EDITAR ITEM///////////////////////////////

app.post('/api/editarItem', (req, res) =>{
  const {nomeItem, categoria, preco, id} = req.body

  const sql = `UPDATE itens SET nomeItem = ?, categoria = ?, preco = ? WHERE id = ?`

  const valores = [
    nomeItem,
    categoria,
    preco,
    id
  ]

  bd.query(sql, valores, (err, result) => {
    if(err){
      return res.status(500).json({ erro: 'Erro ao salvar categoria', detalhes: err });
    }
    res.status(201).json({ editado: true, mensagem: 'Cadastro salvo com sucesso!' })
  })
})

//////////////////////////CADASTRO UNIDADE///////////////////////////

app.post('/api/cadUnidade', (req, res) =>{
  const {unidade} = req.body

  const sql = `INSERT INTO unidades (nomeUnidade) VALUES (?)`

  const valores = [
    unidade
  ]

  bd.query(sql, valores, (err, result) => {
    if(err){
      return res.status(500).json({ erro: 'Erro ao salvar unidade', detalhes: err });
    }
    res.status(201).json({ editado: true, mensagem: 'Cadastro salvo com sucesso!' })
  })
})

////////////////BUSCAR UNIDADE////////////////////////

app.get('/api/buscarUnidade', (req, res) => {
    const sql = 'SELECT * FROM unidades ORDER BY id';
    bd.query(sql, (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar unidades' });
      res.json(result);
    });
})

//////////////EXCLUIR UNIDADE//////////////////////////

app.post('/api/excluirUnidade', (req, res) => {
  const {id} = req.body
  
  const sql = 'DELETE FROM unidades WHERE id = ?'

  bd.query(sql, [id], (err, result) => {
    if(err){
      return res.status(500).json({ erro: err })
    }
    else{
      res.json({excluido: true})
    }
  })
})


///////////EDITAR UNIDADE/////////////////////////////
app.post('/api/editarUnidade', (req, res) =>{
  const {unidade, id} = req.body

  const sql = `UPDATE unidades SET  nomeUnidade = ? WHERE id = ?`

  const valores = [
    unidade,
    id
  ]

  bd.query(sql, valores, (err, result) => {
    if(err){
      return res.status(500).json({ erro: 'Erro ao salvar unidade', detalhes: err });
    }
    res.status(201).json({ editado: true, mensagem: 'Cadastro salvo com sucesso!' })
  })
})



//////////////////////////BUSCAR QUARTOS DISPONIVEIS////////////////////////
app.post('/api/quartosDisponiveis', (req, res) => {
  const { checkIn, checkOut, unidade } = req.body;

  const formatarData = (data) => {
    if (!data) return null;
    const d = new Date(data);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  const checkInFormatado = formatarData(checkIn);
  const checkOutFormatado = formatarData(checkOut);

  const sqlReservas = `
    SELECT id_acomodacao FROM reservas
    WHERE (
      (? IS NULL OR ? IS NULL)
      OR (
        checkIn <= ? AND checkOut >= ?
      )
    )
    AND (? IS NULL OR unidade = ?)
  `;

  const paramsReservas = [
    checkInFormatado, checkOutFormatado,
    checkOutFormatado, checkInFormatado,
    unidade, unidade
  ];

  // Executa consulta de reservas usando callback
  bd.query(sqlReservas, paramsReservas, (erroReservas, resultadosReservas) => {
    if (erroReservas) {
      console.error('Erro ao buscar reservas:', erroReservas);
      return res.status(500).json({ error: 'Erro ao buscar reservas' });
    }

    const idsReservados = resultadosReservas.map(r => r.id_acomodacao);
    console.log(idsReservados)

    let sqlAcomodacoes = 'SELECT * FROM acomodacoes';
    let paramsAcomodacoes = [];

    if (idsReservados.length > 0) {
      const placeholders = idsReservados.map(() => '?').join(', ');
      sqlAcomodacoes += ` WHERE id NOT IN (${placeholders})`;
      paramsAcomodacoes = idsReservados;
    }

    // Executa consulta de acomodações disponíveis
    bd.query(sqlAcomodacoes, paramsAcomodacoes, (erroAcomodacoes, resultadosAcomodacoes) => {
      if (erroAcomodacoes) {
        console.error('Erro ao buscar acomodações:', erroAcomodacoes);
        return res.status(500).json({ error: 'Erro ao buscar acomodações' });
      }

      const tiposUnicos = [...new Set(resultadosAcomodacoes.map(a => a.tpAcomodacao))];
      console.log(resultadosAcomodacoes)
      console.log(tiposUnicos)

      res.json({
        acomodacoesDisponiveis: resultadosAcomodacoes,
        tpAcomodacao: tiposUnicos
      });
    });
  });
});




























































































































































// Rota para React SPA SEMPRE DEIXAR NO FINAL
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});
