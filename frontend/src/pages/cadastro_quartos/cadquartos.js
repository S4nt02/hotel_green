import React, { useState } from 'react';
import HeaderComponente from '../../componetes/header/headerComponente';

function App() {
    const [formSelecionado, setFormSelecionado] = useState(null);
    const handleSelecionarFormulario = (formId) => setFormSelecionado(formId);

    //////////////////////// TIPOS DE ACOMODAÇÕES ///////////////////////////
    const [codquarto, setcodquarto] = useState("");
    const [quantquarto, setquantquarto] = useState("");
    const [descricao, setdescricao] = useState("");
    const [diaria, setdiaria] = useState("");
    const [adultos, setadultos] = useState("");
    const [criancas, setcriancas] = useState("");
    const [comodidadeAtual, setComodidadeAtual] = useState("");
    const [listaComodidades, setListaComodidades] = useState([]);

  //////////////////////// ACOMODAÇÕES ///////////////////////////
    const [numerocomod, setnumerocomod] = useState("");
    const [andar, setandar] = useState("");
    const [tiposcomod, settiposcomod] = useState("");

    function onSave(event) {
        event.preventDefault();
        console.log("numero:", numerocomod);
        console.log("Andar:", andar)
      }

  const adicionarComodidade = () => {
    if (comodidadeAtual.trim() !== "") {
      setListaComodidades([...listaComodidades, comodidadeAtual]);
      setComodidadeAtual("");
    }
  };

  const removerComodidade = (index) => {
    const novaLista = listaComodidades.filter((_, i) => i !== index);
    setListaComodidades(novaLista);
  };

  function onSave(event) {
    event.preventDefault();
    console.log("Código:", codquarto);
    console.log("Quantidade:", quantquarto);
    console.log("Descrição:", descricao);
    console.log("Diaria:", diaria);
    console.log("Adultos:" , adultos);
    console.log("criancas:", criancas);
    console.log("Comodidades:", listaComodidades);

    console.log("Numero:", numerocomod);
    console.log("Andar:", andar);
    console.log("Tipos:", tiposcomod);
    console.log("Diaria:", diaria);
  }

  const tiposAcomodacoes = () => (
    <>
      <form onSubmit={onSave} className="acomodacoes">
        <h2>Tipos de Acomodações</h2>
        <h4>Adicionar tipo de Acomodação</h4>

        <div className='codigoQuarto'>
          <label className='codigo'>Código</label>
          <input
            type="text"
            placeholder="Produto"
            required
            value={codquarto}
            onChange={event => setcodquarto(event.target.value)}
          />
        </div>

        <div className='quantidade'>
          <label>Quantidade Total</label>
          <input
            type="text"
            placeholder="Produto"
            required
            value={quantquarto}
            onChange={event => setquantquarto(event.target.value)}
          />
        </div>

        <label>Descrição</label><br />
        <textarea
          value={descricao}
          onChange={event => setdescricao(event.target.value)}
          placeholder="Descreva o tipo de acomodação"
          rows={4}
          cols={50}
          style={{ resize: 'vertical', padding: '8px' }}
        /><br />

        {/* Seção de Comodidades */}
        <div className='comodidades'>
          <label>Comodidades</label>
          <input
            type="text"
            placeholder="Ex: TV, Frigobar..."
            value={comodidadeAtual}
            onChange={event => setComodidadeAtual(event.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // Impede o envio do form
                  adicionarComodidade();
                }
              }}
          />
          <button type="button" onClick={adicionarComodidade}>Adicionar</button>

          {/* Lista de comodidades exibidas dinamicamente */}
          <ul>
            {listaComodidades.map((item, index) => (
              <li key={index}>
                {item}
                <button type="button" onClick={() => removerComodidade(index)}> X
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className='diaria'>
          <label>Preço da Diária (R$)</label>
          <input 
          type="number" 
          placeholder="0" 
          value={diaria}
          onChange={event => setdiaria(event.target.value)}
        
          />
        </div>
        <div className='adultos'>
          <label>Número de Adultos</label>
          <input 
          type="number" 
          placeholder="0"
          value={adultos}
          onChange={event => setadultos(event.target.value)}
          />
        </div>

        <div className='criancas'>
          <label>Número de Crianças</label>
          <input 
          type="number" 
          placeholder="0" 
          value={criancas}
          onChange={event => setcriancas(event.target.value)}
          />
        </div>
        <button type='submit' className='cad_quartos'>Adicionar</button>
      </form>
    </>
  );

  const acomodacoes = () => (
    <>
      <form onSubmit={onSave} className="tiposacomodacoes">
        <h2>Acomodações</h2>
        <div className="numacomodacoes">
          <label>Número da acomodação:</label>
          <input 
          type="text" 
          placeholder="Ex: 101" 
          value={numerocomod}
          onChange={event => setnumerocomod(event.target.value)}
          />
        </div>

        <div>
          <label>Andar</label>
          <input 
          type="number" 
          placeholder="Ex: 1" 
          value={andar}
          onChange={event => setandar(event.target.value)} 
          />
        </div>

        <div className="tiposacomodacoes">
          <label 
          value = {tiposcomod}
          onChange={event => settiposcomod(event.target.value)}>
          Tipos de acomodações
            
          </label>
          <select>
            <option>Apartamento de luxo</option>
            <option>Apartamento de luxo especial</option>
            <option>Suíte especial</option>
            <option>Suíte master</option>
          </select>
        </div>

        <div className="unidades">
          <label>Unidade do Hotel</label>
          <select>
            <option>Gramado</option>
            <option>Canoas</option>
            <option>Santa Maria</option>
            <option>Pelotas</option>
          </select>
        </div>
        
        <button type='submit' className='cad_acomodacoes'>Adicionar acomodação</button>
      </form>
    </>
  );

  return (
    <>
      <main>
        <HeaderComponente />
        <div style={{ padding: '20px' }}>
          <h1>Sistema de acomodações</h1><br />
          <h4>Gerenciamento dos tipos de acomodações</h4>
          <input type="button" value="Tipos de acomodações" onClick={() => handleSelecionarFormulario(1)} />
          <input type="button" value="Quartos" onClick={() => handleSelecionarFormulario(2)} />

          <div style={{ marginTop: '20px' }}>
            {formSelecionado === 1 && tiposAcomodacoes()}
            {formSelecionado === 2 && acomodacoes()}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
