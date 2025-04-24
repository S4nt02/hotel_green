import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate para redirecionamento
import { API_URL } from '../../url';
import entradaImg from '../../assets/entrada_hotel.jpg';
import { useAuth } from '../../context/authContext'; // Importando o contexto

///////////////////////IMPORT DOS COMPONENTES + CSS//////////////////////////////
import "./login.css";
import HeaderComponente from '../../componetes/header/headerComponente';
import RecoverPage from '../../componetes/recover_senha/recoverPage';
import Rodape from '../../componetes/rodape/rodape';
//////////////////////////////////////////////////////////////////////////

function LoginPage() {
    const { login, usuario, carregando, logout } = useAuth(); // Pegando o método de login do contexto
    const navigate = useNavigate(); // Para navegar após login
    const [erroUsuario, setErroUsuario] = useState("");
    const [erroSenha, setErroSenha] = useState("");
    const [erroLogin, setErroLogin] = useState("");

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const fazerLogin = async () => {
        if (!email.trim()) {
            setErroUsuario("Por favor insira o e-mail.");
        }
    
        if (!senha.trim()) {
            setErroSenha("Por favor insira sua senha.");
            return;
        }
    
        if (!email.trim() || !senha.trim()) {
            return;
        }
    
        try {
            await login(email, senha); // Só essa chamada é suficiente
            alert("Login realizado com sucesso!");
            navigate("/"); 
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            setErroLogin("Ocorreu um erro. Tente novamente.");
        }
    };
    

    return (
        <>
            <main className="page" style={{ backgroundImage: `url(${entradaImg})` }}>
                <div className="overlay"></div>
                <HeaderComponente className="header_login"></HeaderComponente>
                <main className="alinhar_login">
                    <div className="login_section">
                        <h6>Digite seu email e senha para prosseguir</h6>
                        {erroLogin && (
                            <label className="erro" onChange={() => { if (erroUsuario) setErroUsuario(""); if (erroSenha) setErroSenha(""); }}>
                                {erroLogin}
                            </label>
                        )}
                        <input
                            className="loin_input"
                            type="email"
                            id="usuario"
                            placeholder="Digite seu Email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (erroUsuario) setErroUsuario("");
                            }}
                        />
                        {erroUsuario && <label className="erro">{erroUsuario}</label>}
                        <input
                            className="loin_input"
                            type="password"
                            id="senha"
                            placeholder="Digite sua Senha"
                            value={senha}
                            onChange={(e) => {
                                setSenha(e.target.value);
                                if (erroSenha) setErroSenha("");
                            }}
                        />
                        {erroSenha && <label className="erro">{erroSenha}</label>}
                        <RecoverPage></RecoverPage>
                        <div className="cadastro_login">
                            <Link to="/cadastro">
                                <button id="cadastro">CADASTRE-SE</button>
                            </Link>
                            <button id="login" onClick={fazerLogin}>
                                LOGIN
                            </button>
                        </div>
                    </div>
                </main>
            </main>
        </>
    );
}

export default LoginPage;
