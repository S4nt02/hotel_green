import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_URL } from '../url';
import { set } from 'react-hook-form';

// Criando o contexto
const AuthContext = createContext();

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  const [id, setId] = useState(null);
  const [autorizacao, setAutorizacao] = useState(null)
  const [carregando, setCarregando] = useState(true);

  // Função para verificar se o usuário está logado
  const verificarLogin = async () => {
    try {
      const resposta = await fetch(`${API_URL}/auth/verify`, {
        method: 'GET',
        credentials: 'include', // Isso garante que o cookie de sessão seja enviado
      });
      const data = await resposta.json();
      if (data.autenticado) {
        setId(data.id);
        setAutorizacao(data.autorizacao)
      } else {
        setId(null);
        setAutorizacao(null)
      }
    } catch (erro) {
      console.error('Erro ao verificar login:', erro);
      setId(null);
      setAutorizacao(null)
    } finally {
      setCarregando(false);
    }
    console.log(id)
    console.log(autorizacao)
  };

  // Verificando o login na montagem do componente
  useEffect(() => {
    verificarLogin();
  }, []);

  // Função para fazer o login
  const login = async (email, senha) => {
    const resposta = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, senha }),
    });
  
    const data = await resposta.json();
  
    if (data.logado) {
      setId(data.usuario.id); 
      setAutorizacao(data.usuario.autorizacao || null); 
    } else {
      throw new Error("Falha no login");
    }
  };
  
  

  // Função para fazer o logout
  const logout = async () => {
    console.log("chamando logout...");
    try {
      const resposta = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include', // Envia os cookies de sessão
      });
  
      if (resposta.ok) {
        console.log("Logout bem-sucedido");
        setId(null);
        setAutorizacao(null);
      } else {
        console.error("Erro ao fazer logout:", resposta.status);
        throw new Error('Falha ao realizar logout');
      }
    } catch (erro) {
      console.error("Erro na requisição de logout:", erro);
    }
  };
  
  
  

  return (
    <AuthContext.Provider value={{ id, login, logout, carregando, autorizacao }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
