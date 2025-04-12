import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { API_URL } from '../../url';
import entradaImg from '../../assets/entrada_hotel.jpg'

///////////////////////IMPORT DOS COMPONENTES + CSS//////////////////////////////
import "./login.css"
import HeaderComponente from '../../componetes/header/headerComponente';
//////////////////////////////////////////////////////////////////////////

function LoginPage(){

    const [usuario, setUsuario] = useState("")
    const [senha, setSenha] = useState("")

    const fazerLogin = async () => {
        // Obtendo diretamente os valores dos campos de entrada
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;
    
        console.log("Email:", usuario);
        console.log("Senha:", senha);
    
        try {
            const resposta = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: usuario, senha: senha }), // Usando as variáveis obtidas diretamente
            });
    
            const data = await resposta.json();
            console.log(data);
            if (data.logado) {
                alert("Login realizado com sucesso!");
            } else {
                alert("E-mail ou senha incorretos.");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
        }
    };
      

    return(
        <>
            <main className="page" style={{ backgroundImage: `url(${entradaImg})` }}>
                <div className="overlay"></div>
                <HeaderComponente className="header_login"></HeaderComponente>
                <main className='alinhar_login'>
                    <div className='login_section'>
                        <h6>Digite seu email e senha para prosseguir</h6>
                        <input type='text' id='usuario'></input>
                        <input type='password' id='senha'></input>
                        <h6>esqueceu sua senha?</h6>
                        <div className='cadastro_login'>
                            <Link to="/cadastro"><button id='cadastro'>CADASTRE-SE</button></Link>
                            <button id='login' onClick={fazerLogin}>LOGIN</button>
                        </div>
                    </div>  
                </main>

            </main>
        </>
    )
}

export default LoginPage