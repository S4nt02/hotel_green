import React from 'react'
import { Link } from 'react-router-dom'; //import para usar rotas
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { API_URL } from '../../url';
import HeaderComponente from '../../componetes/header/headerComponente';
import { User, Phone, MapPin, Calendar, Flag, Home, Mail, IdCard, FileText, Lock } from 'lucide-react';
import "./cadastro.css"


function CadastroPage(){
    return(
        <>
            <main>
                <HeaderComponente></HeaderComponente>
                <div className='form_content'>
                    <form>
                        <div className='informacoePessoais'>
                            <h5>Informações Pessoais</h5>
                            <div className='alinhar_content'>
                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <User size={18}/> Nome Completo
                                    </label>
                                    <input type='text' id='nomeCompleto' placeholder='Digite seu nome completo'></input>
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
                        </div>

                        <div className='nacionalidade_documento'>

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