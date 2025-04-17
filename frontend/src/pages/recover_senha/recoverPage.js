import React, { useState } from 'react';

function RecoverPage() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const validarEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const verificarEmail = async () => {
    setCarregando(true);
    setMensagem('');

    if (!validarEmail(email)) {
      setMensagem('❌ Email inválido.');
      setCarregando(false);
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const resposta = await fetch(`${API_URL}/recover_senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const dados = await resposta.json();

      if (dados.sucesso) {
        setMensagem('✅ Nova senha enviada para seu e-mail!');
      } else if (dados.existe === false) {
        setMensagem('❌ Email não encontrado.');
      } else {
        setMensagem('❌ Ocorreu um erro inesperado.');
      }
    } catch (error) {
      setMensagem('❌ Erro ao verificar e enviar email.');
    }

    setCarregando(false);
  };

  const estilosMensagem = {
    sucesso: { color: 'green' },
    erro: { color: 'red' },
  };

  let tipoMensagem = 'erro';
  if (mensagem.includes('Nova senha')) tipoMensagem = 'sucesso';

  return (
    <div style={styles.container}>
      <h2>Recuperar Senha</h2>
      <input
        type="email"
        placeholder="Digite o email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <button onClick={verificarEmail} style={styles.button} disabled={carregando}>
        {carregando ? 'Enviando...' : 'Enviar nova senha'}
      </button>
      <p style={tipoMensagem === 'sucesso' ? estilosMensagem.sucesso : estilosMensagem.erro}>
        {mensagem}
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: '50px auto',
    padding: 20,
    border: '1px solid #ddd',
    borderRadius: 10,
    textAlign: 'center',
    fontFamily: 'Arial',
  },
  input: {
    width: '100%',
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    borderRadius: 5,
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
};

export default RecoverPage;
