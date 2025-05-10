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
  const [excluirOpen, setExcluirOpen] = useState(false)
  const [idFuncionario, setIdFuncionario] = useState("")
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
        const resposta = await fetch(`${API_URL}/funcionarios`, {
          method: 'POST'
        });
        const dados = await resposta.json();
        console.log("DADOS RECEBIDOS:", dados); // Veja o formato
        if (Array.isArray(dados)) {
          setFuncionarios(dados);
        } else if (Array.isArray(dados.funcionarios)) {
          setFuncionarios(dados.funcionarios);
        } else {
          console.error("Formato inesperado:", dados);
        }
      } catch (erro) {
        console.error("Erro ao buscar funcionários:", erro);
      }
    };
  
    buscarFuncionarios();
  }, []);
  


  const abrirexcluirOpen = (id) => {
    setExcluirOpen(!excluirOpen)
    setIdFuncionario(id)
    console.log(id)
  }



  const excluirFuncionario = async () =>{
    const id = idFuncionario
    console.log(idFuncionario)
    try{
      const excluir =  await fetch(`${API_URL}/excluir_funcionarios` , {
        method :'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id}),
      }) 
      const data = await excluir.json();

      if(data.excluido === true){
        setMensagem("Funcionario excluido")
        setIdFuncionario("")
        setExcluirOpen(false)
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
        <div className="botoes">
          <h2>funcionários</h2>
          <div className="botoes-direita">
            <button onClick={abrirModal}>CADASTRAR FUNCIONÁRIO</button>
            <button onClick={abrirCadCargo}>CADASTRAR CARGO</button>
          </div>
        </div>
        <div className="exibir_funcionarios_content">
        <div className="table_content">
          <table aria-label="dados">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Documento</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionarios.map((funcionario) => (
              <tr key={funcionario.id}>
                <td>{funcionario.id}</td> 
                <td>{funcionario.nome}</td>
                <td>{funcionario.email}</td>
                <td>{funcionario.documento}</td>
                <td>{funcionario.telefone}</td>
                <td>
                  <button onClick={() => abrirexcluirOpen(funcionario.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        </div>
          {excluirOpen && (
            <div className="modal-overlay">
              <div className="excluir_content">
                <h4 onClick={() => abrirexcluirOpen("")}></h4>
                <h4>Deseja realmente excluir este funcioanrio</h4>
                <div>
                  <button onClick={excluirFuncionario}>Excluir</button>
                  <button onClick={() => abrirexcluirOpen("")}>Cancelar</button>
                </div>
              </div>
            </div>
          )}
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