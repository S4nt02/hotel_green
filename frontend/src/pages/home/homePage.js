import React from 'react'
import { Link } from 'react-router-dom'; //import para usar rotas
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { API_URL } from '../../url';

///////////////////////IMPORT DOS COMPONENTES + CSS//////////////////////////////
import "./home.css"
import HeaderComponente from '../../componetes/header/headerComponente';
//////////////////////////////////////////////////////////////////////////


function HomePage() {
  // //busca pelos dados no back precisa estar dentro da função//
  // const [dados, setDados] = useState([]); //define dados como um array vazio setdados é usado para atualizar o valor de dados, substituir dados pelo item da consulta
  // //useeffect é a chamada da api onde iremos bucar os dados na rota definida no backedn
  // useEffect(() => {
  //   fetch(`${API_URL}/sua-rota`) //definição da rota da api
  //   .then((res) => res.json())
  //   .then((data) => setDados(data)) //uso do set para atribuir valor a variavel
  //   .catch((err) => console.error('Erro ao buscar dados:', err)); //mensagem de erro
  // }, []);

    return (
      
      <div class="body">
        <HeaderComponente></HeaderComponente>
        Teste conexão com o banco de dados<br />
        <div>
          {/* Aqui você pode colocar mais conteúdo depois
          {dados.map((dados) => ( //coamndo igual o ngfor do angular percorre o json por meio de chave falor e exibe na tela, usar nome da variavel que foi atribuido o valor
          <li key={dados.id}>{dados.nome}</li>))}  */}
        </div>
        <div>
          {/* //link da rota */}
          <Link to="/login"><h1>ir para página de login</h1></Link> 
        </div>
      </div>
    );
  }
  
  export default HomePage;
  