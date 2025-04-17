import React from 'react'
import { Link } from 'react-router-dom'; //import para usar rotas
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { API_URL } from '../../url';
import HeaderComponente from '../../componetes/header/headerComponente';
import { User, Phone, MapPin, Calendar, Flag, Home, Mail, IdCard, FileText, Lock } from 'lucide-react';
import "./cadastro.css"


function CadastroPage(){
    const [nacionalidade, setNacionalidade] = useState("brasileiro")
    const [documento, setDocumento] = useState("CPF")


    const verificarNacionalidade = (event) => {
        setNacionalidade(event.target.value)
    }

    const selecionarDocumento = (doc) => {
        setDocumento(doc.target.value)
        
    }


    return(
        <>
            <main>
                <HeaderComponente></HeaderComponente>
                <div className='form_content'>
                    <form>
                        <div className='informacoePessoais'>
                            <h5>Informações Pessoais</h5>
                            <hr></hr>
                            <div className='alinhar_content'>
                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <User size={18}/> Nome Completo
                                    </label>
                                    <input type='text' id='nomeCompleto' placeholder='Digite seu nome completo'></input>
                                    <label></label>
                                </div>
                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Calendar size={18} />Data de Nascimento
                                    </label>
                                    <input type='date' id='dtNascimento'></input>
                                </div>
                            </div>
                            <div className='alinhar_content'>
                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <User size={18}/> Nome do Pai
                                    </label>
                                    <input type='text' id='nomePai' placeholder='Digite o nome do pai completo'></input>
                                </div>
                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <User size={18}/> Nome da Mãe
                                    </label>
                                    <input type='text' id='nomeMae' placeholder='Digite o nome da mãe completo'></input>
                                </div>
                            </div>
                            <div className='alinhar_content'>
                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Mail size={18}/> Email
                                    </label>
                                    <input type='mail' placeholder='Digite seu email'></input>
                                </div>
                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Lock size={18}/> Senha
                                    </label>
                                    <input type='password' placeholder=''></input>
                                </div>
                            </div>
                        </div>

                        <div className='nacionalidade_documento'>
                            <h5>Nacionalidade e Documentação</h5>
                            <hr></hr>
                            <div>
                                <label className='alinhar_itens'>
                                    <Flag size={18} /> Nacionalidade 
                                </label>
                                <div>
                                    <input type='radio'name='nacionalidade'  value='brasileiro' onChange={verificarNacionalidade} checked={nacionalidade === "brasileiro"}/>
                                    <label>Brasileiro</label>
                                </div>
                                <div>
                                    <input type='radio' name='nacionalidade'  value='estrangeiro' onChange={verificarNacionalidade} checked={nacionalidade === "estrangeiro"}/>
                                    <label>Estrangeiro</label>
                                </div>
                            </div>
                            <div>
                                {nacionalidade === "brasileiro"  && 
                                <div>
                                    <div>
                                        <label className='alinhar_itens'>
                                            <IdCard size={18} /> Documento
                                        </label>
                                        <div>
                                            <input type='radio'name='documento' value="CPF" onChange={selecionarDocumento} checked={documento === "CPF"}/>
                                            <label>CPF</label>
                                        </div>
                                        <div>
                                            <input type='radio' name='documento' value="RG"  onChange={selecionarDocumento} checked={documento === "RG"}/>
                                            <label>RG</label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className='alinhar_itens'>
                                            <IdCard size={18}/> Número do {documento}
                                        </label>
                                        <input type='text' placeholder={`Digite seu número de ${documento}`}></input>
                                    </div>

                                </div>}
                                { nacionalidade === "estrangeiro" && 
                                    <div>
                                        <label className='alinhar_itens'>
                                        <FileText size={18}/> Número do Passaporte
                                        </label>
                                        <input type='text' placeholder='Diite seu número de passaporte '></input>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className='contato_endereco'>

                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export default CadastroPage