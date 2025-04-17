import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { API_URL } from '../../url';
import entradaImg from '../../assets/entrada_hotel.jpg';
import Rodape from '../../componetes/rodape/rodape';
///////////////////////IMPORT DOS COMPONENTES + CSS//////////////////////////////
import "./login.css"
import HeaderComponente from '../../componetes/header/headerComponente';
//////////////////////////////////////////////////////////////////////////

function LoginPage(){

    const [usuario, setUsuario] = useState("")
    const [senha, setSenha] = useState("")
    const [erroUsuario, setErroUsuario] = useState("")
    const [erroSenha, setErroSenha] = useState("")
    const [erroLogin, setErroLoin] = useState("")

    const fazerLogin = async () => {
        console.log("chamando a função")
        console.log(usuario)
        console.log(senha)
        

        if(!usuario.trim()){
            setErroUsuario("Por favor insira o nome de usuário")
        }

        if(!senha.trim()){
            setErroSenha("Por favor insira sua senha")
            return
        }

        if (!usuario.trim() || !senha.trim()) {
            return;
        }
        
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
                setErroLoin("E-mail ou senha incorretos.")
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
                        {erroLogin && <label className='erro' onChange={ () => {if(erroUsuario) setErroUsuario(""); if (erroSenha) setErroSenha("")
                            
                        }}>{erroLogin}</label>}
                        <input type='email' 
                            id='usuario' 
                            placeholder='Digite seu Email' 
                            value={usuario} 
                            onChange={(e) => {setUsuario(e.target.value);
                                if (erroUsuario) setErroUsuario("")
                            }}>
                        </input>
                        {erroUsuario && <label className='erro'>{erroUsuario}</label>}
                        <input type='password' 
                            id='senha' 
                            placeholder='Digite sua Senha' 
                            value={senha} 
                            onChange={(e) => {setSenha(e.target.value);
                            if (erroSenha) setErroSenha("")}}>
                        </input>
                        {erroSenha && <label className='erro'>{erroSenha}</label>}
                        <Link to="/recover_senha"><h6>esqueceu sua senha?</h6></Link>
                        <div className='cadastro_login'>
                            <Link to="/cadastro"><button id='cadastro'>CADASTRE-SE</button></Link>
                            <button id='login' onClick={fazerLogin}>LOGIN</button>
                        </div>
                    </div>
                </main>
            </main>
            
            <Rodape></Rodape>
        </>
    )
}

export default LoginPage