import React, { useEffect, useState } from 'react';
import HeaderComponente from '../../componetes/header/headerComponente';
import CadTipoQuarto from '../../componetes/cadTipoQuarto/cadTipoQuarto';
import CadAcomodacoes from '../../componetes/cadAcomodacao/cadAcomodacao';
import { API_URL } from '../../url';
import "./cadquartos.css"
import CadUnidade from '../../componetes/cad_unidade/cadUnidade';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import Ocupacao from '../ocupacao/ocupacao';

function App() {
    ///// Adicionar verificações de login e autorização//////


    const [formSelecionado, setFormSelecionado] = useState(null);
    const handleSelecionarFormulario = (formId) => setFormSelecionado(formId);

    const [dadosAcomodacao, setDadosAcomodacao]  = useState([])
    const [dadosTpQuarto, setDadosTpQuarto] = useState([])
    const [dadosAcomodacaoEditar, setDadosAcomodacaoEditar] = useState([])
    const [dadosTpQuartoEditar, setDadosTpQuartoEditar] = useState([])
    const [desejaExcluirTpQuartoOpen, setDesejaExcluirTpQuarto] = useState(false)
    const [desejaExcluirAcomodacaoOpen, setDesejaExcluirAcomodacao] = useState(false)
    const [idTpQuarto, setIdTpQuarto] = useState("")
    const [idAcomodacao, setIdAcomodacao] = useState("")

    useEffect(() => {
      buscarAcomodacoes();
      buscarTpQuarto();
      handleSelecionarFormulario(1)
    },[])

    const buscarTpQuarto = async () => {
      try{
          const buscarTiposQuartos = await fetch(`${API_URL}/api/buscarTipoQuartos`,)
          const dados = await buscarTiposQuartos.json()

          if(!buscarTiposQuartos.ok){
              
          }

          setDadosTpQuarto(dados)
      }
      catch(erro){
          
      }
    }

    const buscarAcomodacoes = async () => {
      try{
        const buscarAcomodacoes = await fetch(`${API_URL}/api/buscarAcomodacoes`,)
        const dados = await buscarAcomodacoes.json()

        if(!buscarAcomodacoes.ok){
              
        }

          setDadosAcomodacao(dados)
      }
      catch(erro){
          
      }
    }

    const editarTpQuarto = (idTpQuarto) => {
      const dados = dadosTpQuarto.find(item => item.id === idTpQuarto);
      // Criar nova referência
      setDadosTpQuartoEditar({ ...dados });
    }



    const editarAcomodacao = (idAcomodacao) => {
      const dados = dadosAcomodacao.find(item => item.id === idAcomodacao);
      setDadosAcomodacaoEditar({ ...dados });
    }


    const excluirAcomodacao = async () =>{
      console.log("Chamando")
      const id = idAcomodacao
      console.log(id)
      try{
        const excluirAcomodacao = await fetch(`${API_URL}/api/excluirAcomodacao`, {
          method : `POST`,
          headers : {
            'Content-Type' : 'application/json'          
          },
          body : JSON.stringify({id})
        })

        const dados = await excluirAcomodacao.json()

        if(dados.excluido === true){

        }
      }
      catch{
        
      }
      buscarAcomodacoes()
      setIdAcomodacao("")
    }

    const excluirTpQuarto = async () => {
      const id = idTpQuarto
      console.log("Chamando")
      console.log(id)
      try{
        const excluirTpQuarto = await fetch(`${API_URL}/api/excluirTpQuarto`, {
          method : `POST`,
          headers : {
            'Content-Type' : 'application/json'          
          },
          body : JSON.stringify({id})
        })

        const dados = await excluirTpQuarto.json()
        console.log(dados)

        if(dados.excluido === true){

        }
      }
      catch{
        
      }
      buscarTpQuarto()
      setIdTpQuarto("")
      setDesejaExcluirTpQuarto(false)
    }

    const desejaExcluirTpQuarto = (id) =>{
       setDesejaExcluirTpQuarto(!desejaExcluirTpQuartoOpen)
       setIdTpQuarto(id)  
    }

    const desejaExcluirAcomodacao = async (id) =>{
      setDesejaExcluirAcomodacao(!desejaExcluirAcomodacaoOpen)
      setIdAcomodacao(id)

    }

  return (
    <>
      <main>
        <HeaderComponente />
        <div style={{ padding: '20px' }}>
          <h1>Sistema de acomodações</h1><br />
          <h4>Gerenciamento dos tipos de acomodações</h4>
          <input type="button" value="Tipos de acomodações" onClick={() => handleSelecionarFormulario(1)} />
          <input type="button" value="Quartos" onClick={() => handleSelecionarFormulario(2)} />
          <input type='button'  value="Unidades"onClick={() => handleSelecionarFormulario(3)}/>
          <input type='button'  value="Ocupação"onClick={() => handleSelecionarFormulario(4)}/> 

          <div style={{ marginTop: '20px' }}>
            {formSelecionado === 1 && (
              <>              
              <CadTipoQuarto dadosTipoQuartoParaEditar={dadosTpQuartoEditar} aoAlterar={buscarTpQuarto}></CadTipoQuarto>
              <div>
                {dadosTpQuarto.map(tpQuarto =>(
                  <div>
                    <div>
                      <h1>{tpQuarto.nomeAcomodacao}</h1>
                      {tpQuarto.unidade_hotel}
                    </div>
                    <div>
                      Diaria-{tpQuarto.vlDiaria}
                    </div>
                    <div>
                      <Swiper
                        modules={[Navigation]}
                        navigation
                        spaceBetween={10}
                        slidesPerView={1}
                        style={{ width: '300px', height: '300px' }}
                      >
                        {tpQuarto.imagens?.map((url, index) => (
                          <SwiperSlide key={index}>
                            <img src={url} alt={`Imagem ${index + 1}`} style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      Quantidade Hospedes<br></br>
                      Adutlos-{tpQuarto.quantidade_adultos}<br></br>
                      Criancar-{tpQuarto.quantidade_criancas}
                      <button onClick={() => editarTpQuarto(tpQuarto.id)}>EDITAR</button>
                      <button onClick={() => desejaExcluirTpQuarto(tpQuarto.id)}>EXCLUIR</button>
                    </div>
                  </div>
                ))}
              </div>
              </>

              )}
            {formSelecionado === 2 && (
              <>
                <CadAcomodacoes dadosAcomodacaoParaEditar = {dadosAcomodacaoEditar} aoAlterar={buscarAcomodacoes}></CadAcomodacoes>
                <div>
                  {dadosAcomodacao.map(acomodacao => {
                    const tpQuarto = dadosTpQuarto.find(t => t.id === acomodacao.tpAcomodacao);

                    return (
                      <div key={acomodacao.id} className='exibirAcomodacoes'>
                        <h1>Número quarto - {acomodacao.numAcomodacao}</h1>
                        <h1>Andar - {acomodacao.num_andar}</h1>
                        <h1>Tipo de quarto - {tpQuarto.nomeAcomodacao}</h1>
                        <h1>Unidade-{acomodacao.nomeUnidade}</h1>
                        <button onClick={() => editarAcomodacao(acomodacao.id)}>EDITAR</button>
                        <button onClick={() => desejaExcluirAcomodacao(acomodacao.id)}>EXCLUIR</button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {formSelecionado === 3 && (
              <>
                <CadUnidade/>
              </>
            )}

            {formSelecionado === 4 && (
              <Ocupacao/>
            )}
          </div>
        </div>
      </main>
      {desejaExcluirTpQuartoOpen && (
        <div className='excluir-overlay'>
          <div className='excluir-content'>
            <p>Deseja realmente excluir</p>
            <button onClick={excluirTpQuarto}>Sim</button>
            <button onClick={desejaExcluirTpQuarto}>não</button>
          </div>
        </div>
      )}

      {desejaExcluirAcomodacaoOpen && (
        <div className='exlcuir-overlay'>
          <div className='excluir-content'>
            <p>Deseja realmente excluir</p>
            <button onClick={excluirAcomodacao}>Sim</button>
            <button onClick={desejaExcluirAcomodacao}>não</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
