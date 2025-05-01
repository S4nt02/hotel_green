import HeaderComponente from "../../componetes/header/headerComponente"
import CadFuncionario from "../../componetes/cad_funcionario/cadFuncionario"
import CadCargo from "../../componetes/cadCargo/cadCargo";
import React, { use, useState, useEffect } from 'react';
import "./funcionarioPage.css"

import { API_URL } from "../../url";



function FuncionarioPage () {

  const [isOpen, setIsOpen] = useState(false)
  const [cadCargoOpen, setCargoOpen] = useState(false)
  const [funcionarios, setFuncionarios] = useState([])
  const [mesangem, setMensagem] = useState("")

  const abrirModal  = () => {
    setIsOpen(!isOpen)
  }

  const abrirCadCargo = () =>{
    setCargoOpen(!cadCargoOpen)
  }

  useEffect(() => {
    const buscarFuncionarios = async () => {
      try {
        const resposta = await fetch(`${API_URL}/funcionarios` , {
          method: 'POST'
        });
        const dados = await resposta.json();
        setFuncionarios(dados);
      } catch (erro) {
        console.error("Erro ao buscar funcionários:", erro);
      }
    };
    console.log(funcionarios)
    buscarFuncionarios();
  }, []);




  const excluirFuncionario = async () =>{
    const id = funcionarios.id
    try{
      const excluir =  await fetch(`${API_URL}/excluir_funcionario` , {
        method :'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id}),
      }) 
      const excluido = await excluir.json();

      if(excluido === true){
        setMensagem("Funcionario excluido")
      }
    }
    catch{
      setMensagem("Erro ao excluir funcionario")
    }
    
    

  }

  return(
    <>
      <HeaderComponente />
      <main className="main-content">
        <div>
          <button onClick={abrirModal}>CADASTRAR FUNCIONARIO</button>
          <button onClick={abrirCadCargo}>Cadastrar cargo</button>
        </div>

        {funcionarios.map((funcionario) => (
          <div>
            <li key={funcionario.id}>
              {funcionario.id} - {funcionario.nome}
            </li>
            <button onClick={excluirFuncionario}></button>
          </div>

        ))}
        {isOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={abrirModal} className="fechar-cad-funcioanrio">FECHAR</button>
              <h2>Novo Funcionário</h2>
              <CadFuncionario />
            </div>
          </div>
        )}
        {cadCargoOpen && (
          <div className="modal-overlay">
            <div className="modal-cargo-content">
              <button onClick={abrirCadCargo}>X</button>
              <CadCargo></CadCargo>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default FuncionarioPage