import React, { useState } from 'react';
import "./recover.css"

function RecoverPage() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  

  const abrirModal = () => setIsOpen(true)
  const fecharModal = () => {
    setIsOpen(false)
    setEmail('')
    setMensagem('')
    setCarregando(false)
  }

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
    <>
      <h6 onClick={abrirModal}>Esqueceu sua senha?</h6>
      {isOpen && <div className={`container ${isOpen ? 'open' : ''}`}>
        <div className='container_content'>
          <div className='alinhar_fecharModal'>
            <h1 onClick={fecharModal}>x</h1>
          </div>
          <div className='alinhar_modal_content'>
            <h2>Recuperar Senha</h2>
            <input className='recover_input'
              type="email"
              placeholder="Digite o email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={verificarEmail}  disabled={carregando} className='recover_button'>
              {carregando ? 'Enviando...' : 'Enviar nova senha'}
            </button>
            <p style={tipoMensagem === 'sucesso' ? estilosMensagem.sucesso : estilosMensagem.erro}>
              {mensagem}
            </p>
          </div>
          
        </div>
      </div>
      }
    </>  
  );
}


export default RecoverPage;
