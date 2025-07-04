import { useState, useEffect } from "react";
import { API_URL } from "../../url";
import HeaderComponente from "../../componetes/header/headerComponente";
import { useAuth } from "../../context/authContext";
import "./consumo.css"
function Consumo() {
    const { id, nomeUser, autorizacao } = useAuth();

    const [itens, setItens] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [todasReservas, setTodasReservas] = useState([]);

    const [data, setData] = useState("");
    const [numAcomodacao, setNumAcomodacao] = useState("");
    const [documento, setDocumento] = useState("");
    const [nomeHospede, setNomeHospede] = useState("");
    const [idReserva, setIdReserva] = useState("");
    const [categoriaBuscar, setCategoriaBusca] = useState("");
    const [itensFiltrados, setItensFiltrados] = useState([]);
    const [itemSelecionado, setItemSelecionadol] = useState(null);
    const [reservaSelecionada, setReservaSelecionada] = useState({});
    const [quantidade, setQuantidade] = useState("");
    const [valorTotal, setValorTotal] = useState("");
    const [mensagem, setMensagem] = useState("")

    const [excluirOpen, setExcluirOpen] = useState(false)
    const [idConsumo, setIdConsumo] = useState('')

    const [consumos, setConsumo] = useState([])

    const buscarItens = async () => {
        try {
            const resposta = await fetch(`${API_URL}/api/buscarItens`);
            const dados = await resposta.json();
            setItens(dados);
        } catch (error) {
            console.error("Erro ao buscar itens:", error);
        }
    };

    const buscarCategoria = async () => {
        try {
            const resposta = await fetch(`${API_URL}/api/buscarCategoria`);
            const dados = await resposta.json();
            setCategorias(dados);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };

    const buscarTodasdReservas = async () => {
        try {
            const buscar = await fetch(`${API_URL}/api/buscarReservasConsumo`);
            const dados = await buscar.json();
            setTodasReservas(dados);
        } catch (error) {
            console.error("Erro ao buscar reservas:", error);
        }
    };

    function filtrarPorCategoria(dados) {
    return dados.filter(item => {
        const categoriaItem = typeof item.categoria === "string" ? item.categoria.toLowerCase() : "";
        const categoriaBusca = categoriaBuscar.toLowerCase();

        return !categoriaBuscar || categoriaItem === categoriaBusca;
    });
    }

    const consultarConsumo = async () => {
        const consultar = await fetch(`${API_URL}/api/reservasComConsumo`)
        const dados = await consultar.json()
        console.log(dados)
        setConsumo(dados)
    }


    const filtrarReservas = (dados) => {
    return dados.find((item) => {
        const matchNumAcomodacao = numAcomodacao
            ? String(item.numAcomodacao || "").toLowerCase().includes(String(numAcomodacao).toLowerCase())
            : false;

        const matchDocumento = documento
            ? String(item.documento || "").toLowerCase().includes(String(documento).toLowerCase())
            : false;

        const matchNome = nomeHospede
            ? String(item.nome || "").toLowerCase().includes(String(nomeHospede).toLowerCase())
            : false;

        const matchId = idReserva
            ? String(item.id || "").toLowerCase().includes(String(idReserva).toLowerCase())
            : false;

        return matchNumAcomodacao || matchDocumento || matchNome || matchId;
    });
};

    const obterData = () => {
        const dataAtual = new Date();
        const dia = String(dataAtual.getDate()).padStart(2, '0');
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const ano = dataAtual.getFullYear();
        const dataFormatada = `${ano}-${mes}-${dia}`; // formato para input date
        setData(dataFormatada);
    };

    const converterData = (dataCon) => {
        const dataFormatada = new Date(dataCon).toLocaleDateString("pt-BR")
        return dataFormatada
    }

    useEffect(() => {
        buscarItens();
        buscarCategoria();
        buscarTodasdReservas();
        obterData();
        consultarConsumo()
    }, []);

    useEffect(() => {
    const reserva = filtrarReservas(todasReservas);

    if (reserva) {
        setReservaSelecionada(reserva);

        if (!numAcomodacao) setNumAcomodacao(reserva.numAcomodacao || "");
        if (!documento) setDocumento(reserva.documento || "");
        if (!nomeHospede) setNomeHospede(reserva.nome || "");
        if (!idReserva) setIdReserva(reserva.id || "");
        } else {
            setReservaSelecionada({});
        }
    }, [nomeHospede, documento, numAcomodacao, idReserva, todasReservas]);

    useEffect(() => {
        setItensFiltrados(filtrarPorCategoria(itens));
        
    }, [categoriaBuscar, itens]);

    useEffect(() => {
        if (itemSelecionado && quantidade) {
            setValorTotal(quantidade * itemSelecionado.preco);
        } else {
            setValorTotal("");
        }
    }, [itemSelecionado, quantidade]);

    const cadastrarConsumo = async () => {
        if(numAcomodacao === "" || idReserva === "" || documento === "" || nomeHospede === ""){
            return setMensagem("Por favor preencha todos os campos")
        }

        const dados = {
            idReserva,
            id,
            data,
            idAcomodacao : reservaSelecionada.idAcomodacao,
            item : itemSelecionado.id,
            quantidade,
        }
        

        const cadastrar = await fetch(`${API_URL}/api/cadastrarConsumo`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(dados)
        })

        const result = await cadastrar.json()

        if(!result){
           return setMensagem('Erro ao cadastrar consumo')
        }
        consultarConsumo()
        setIdReserva('')
        setNumAcomodacao('')
        setNomeHospede('')
        setDocumento('')

    }

    const excluirConsumo = async () => {
        const id = idConsumo
        try{
            const excluir = await fetch(`${API_URL}/api/excluirConsumo`, {
                method : 'POST',
                headers : { 'Content-Type' : 'application/json'},
                body : JSON.stringify({id})
            })

            const resultado = await excluir.json()
        }
        catch{

        }
        consultarConsumo()
        setExcluirOpen(false)

    }

    const setDadosCadastarConsumo = (idReserva, numAcomodacao, nomeHospede, documento) => {
        setIdReserva(idReserva)
        setNumAcomodacao(numAcomodacao)
        setNomeHospede(nomeHospede)
        setDocumento(documento)
        
    }

    const [editarOpen, setEditarOpen] = useState(false)
    const [idConsumoEditar, setIdConsumoEditar] = useState("")
    const [idItemEditar, setIdItemEditar] = useState("")
    const [numAcomodacaoEditar, setNumAcomodacaoEditar] = useState("");
    const [documentoEditar, setDocumentoEditar] = useState("");
    const [nomeHospedeEditar, setNomeHospedeEditar] = useState("");
    const [idReservaEditar, setIdReservaEditar] = useState("");
    const [quantidadeEditar, setQuantidadeEditar] = useState("");
    const [valorTotalEditar, setValorTotalEditar] = useState("");
    const [itemSelecionadoEditar, setItemSelecionadolEditar] = useState(null);

    const daddosParaEditar = (idConsumo, idItem, quantidade, numAcomodacao, idReserva, nomeHospede, documento) => {
        setIdConsumoEditar(idConsumo)
        setNumAcomodacaoEditar(numAcomodacao)
        setIdItemEditar(idItem)
        setQuantidadeEditar(quantidade)
        setNomeHospedeEditar(nomeHospede)
        setIdReservaEditar(idReserva)
        setQuantidadeEditar(quantidade)
        setDocumentoEditar(documento)

        const item = itens.find(i => i.id === idItem) || null;
        setItemSelecionadolEditar(item)

        setEditarOpen(true)
    }

    const desejaExcluir = (idexcluir) => {
        setExcluirOpen(true)
        setIdConsumo(idexcluir)
    }

    const atualizarConsumo = async () => {
        const dados = {
            data,
            id,
            idConsumoEditar,          
            idReservaEditar,
            quantidadeEditar,
            idItemEditar,
        }

        const editar = await fetch(`${API_URL}/api/editarConsumo`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(dados)
        })

        const resposta = await editar.json()

        if(!resposta){

        }
        consultarConsumo()
        setEditarOpen(false)
    }

    return (
        <>
            <HeaderComponente />
            <main>
                <div className="content-consumo">
                    <form className="form-consumo">
                        <div className="inuts-consumo">
                            <div>
                                <label>Data de consumo</label>
                                <input className="dataconsumo" type="date" value={data} readOnly />
                            </div>
                            <div>
                                <label>Funcionário</label>
                                <input className="funcionario" type="text" value={nomeUser} readOnly />
                            </div>                            
                        </div>
                        <div className="inuts-consumo">
                            <div>
                                <label>Acomodação</label>
                                <input
                                    className="acomodacao"
                                    type="text"
                                    value={numAcomodacao}
                                    onChange={(e) => setNumAcomodacao(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>ID da Reserva</label>
                                <input
                                    className="idreserva"
                                    type="text"
                                    value={idReserva}
                                    onChange={(e) => setIdReserva(e.target.value)}
                                />
                            </div>                            
                        </div>
                        <div className="inuts-consumo">
                            <div>
                                <label>Documento</label>
                                <input
                                    className="cpf"
                                    type="text"
                                    value={documento}
                                    onChange={(e) => setDocumento(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Nome do Hóspede</label>
                                <input
                                    type="text"
                                    value={nomeHospede}
                                    onChange={(e) => setNomeHospede(e.target.value)}
                                />
                            </div>                            
                        </div>
                        <div className="inuts-consumo">
                            <div>
                                <label>Categoria</label>
                                <select onChange={(e) => setCategoriaBusca(e.target.value)} value={categoriaBuscar}>
                                    <option value="">Todas as categorias</option>
                                    {categorias.map((categoria) => (
                                        <option key={categoria.id} value={categoria.nomeCategoria}>
                                            {categoria.nomeCategoria}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Item</label>
                                <select
                                    value={itemSelecionado?.id || ""}
                                    onChange={(e) => {
                                        const item = itensFiltrados.find(i => i.id === parseInt(e.target.value));
                                        setItemSelecionadol(item || null);
                                    }}
                                >
                                    <option value="">Todos os itens</option>
                                    {itensFiltrados.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nomeItem} - ${item.preco}
                                        </option>
                                    ))}
                                </select>
                            </div>                            
                        </div>
                        <div className="inuts-consumo">
                            <div>
                                <label>Quantidade</label>
                                <input
                                    className="quant_consumo"
                                    type="number"
                                    value={quantidade}
                                    onChange={(e) => setQuantidade(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Valor Total:</label>
                                <p>{valorTotal ? `R$ ${valorTotal.toFixed(2)}` : "-"}</p>
                            </div>
                            <div>
                                <p>{mensagem}</p>
                            </div>
                        </div>

                        <div className="button-consumo">
                            <button onClick={cadastrarConsumo} className='adicionar_consumo'>Adicionar</button>
                            <button type="reset">Cancelar</button>
                        </div>

                    </form> 
                </div>
                
                <div>
                    {consumos.map(consumo => (
                        <div key={consumo.idReserva} className="reserva-consumo">
                            <div className="title-reserva-connsumo">
                                <h3>Acomodação:{consumo.numAcomodacao}</h3>
                                <p>Unidade:{consumo.nomeUnidade}</p> 
                            </div>
                            <p>Hospede: {consumo.nomeHospede}</p>
                            <p>Valor Total de Consumo: R$ {
                            consumo.consumos.reduce((total, item) => {
                                return total + item.preco * item.quantidade;
                            }, 0).toFixed(2)
                            }</p>
                            <div>
                                <button onClick={() =>setDadosCadastarConsumo(consumo.idReserva, consumo.numAcomodacao, consumo.nomeHospede, consumo.documento)}>Cadastrar Consumo</button>
                            </div>

                            <div>
                                <h4>Consumo</h4>
                                {consumo.consumos.map(consumoUnt => (
                                    <div key={consumoUnt.idConsumo} className="consumo-unit">
                                        <p>Data de Consumo:{converterData(consumoUnt.dataConsumo)}</p>
                                        <p>Funcionario:{consumoUnt.nomeFuncionario}</p>
                                        <p>Item:{consumoUnt.nomeItem}</p>
                                        <p>Preço:{consumoUnt.preco}</p>
                                        <p>Quantidade:{consumoUnt.quantidade}</p>
                                        <p>Total: R$ {(consumoUnt.preco * consumoUnt.quantidade).toFixed(2)}</p>
                                        <div>
                                            <button onClick={() => desejaExcluir(consumoUnt.idConsumo)}>Excluir</button>
                                            <button onClick={() => daddosParaEditar(consumoUnt.idConsumo, consumoUnt.idItem, consumoUnt.quantidade, consumo.numAcomodacao, consumo.idReserva, consumo.nomeHospede, consumo.documento)}>Editar</button>                                            
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    ))}
                </div>
            </main>
            {excluirOpen && (
                <div className="overlay">
                    <div className="alert-modal">
                        <p>Desea realmente excluir esse consumo?</p>
                        <div>
                            <button onClick={excluirConsumo}>Excluir</button>
                            <button onClick={() => setExcluirOpen(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
            {editarOpen && (
                    <div className="overlay-consumo">
                        <div className="alert-consumo">
                            <form>
                                <div className="inuts-consumo">
                                    <div>
                                        <label>Data de consumo</label>
                                        <input className="dataconsumo" type="date" value={data} readOnly />
                                    </div>
                                    <div>
                                        <label>Funcionário</label>
                                        <input className="funcionario" type="text" value={nomeUser} readOnly />
                                    </div>

                                </div>
                                <div className="inuts-consumo">
                                    <div>
                                        <label>Acomodação</label>
                                        <input
                                            className="acomodacao"
                                            type="text"
                                            value={numAcomodacaoEditar}
                                            onChange={(e) => setNumAcomodacaoEditar(e.target.value)}
                                        />
                                    </div> 
                                    <div>
                                        <label>ID da Reserva</label>
                                        <input
                                            className="idreserva"
                                            type="text"
                                            value={idReservaEditar}
                                            onChange={(e) => setIdReservaEditar(e.target.value)}
                                        />
                                    </div>                                                                       
                                </div>
                                <div className="inuts-consumo">
                                    <div>
                                        <label>Documento</label>
                                        <input
                                            className="cpf"
                                            type="text"
                                            value={documentoEditar}
                                            onChange={(e) => setDocumentoEditar(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label>Nome do Hóspede</label>
                                        <input
                                            type="text"
                                            value={nomeHospedeEditar}
                                            onChange={(e) => setNomeHospedeEditar(e.target.value)}
                                        />
                                    </div>                                    
                                </div>
                                <div className="inuts-consumo">
                                    <div>
                                        <label>Categoria</label>
                                        <select onChange={(e) => setCategoriaBusca(e.target.value)} value={categoriaBuscar}>
                                            <option value="">Todas as categorias</option>
                                            {categorias.map((categoria) => (
                                                <option key={categoria.id} value={categoria.nomeCategoria}>
                                                    {categoria.nomeCategoria}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label>Item</label>
                                        <select
                                            value={itemSelecionadoEditar?.id || ""}
                                            onChange={(e) => {
                                                const item = itensFiltrados.find(i => i.id === parseInt(e.target.value));
                                                setItemSelecionadolEditar(item || null);
                                            }}
                                        >
                                            <option value="">Todos os itens</option>
                                            {itensFiltrados.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.nomeItem} - ${item.preco}
                                                </option>
                                            ))}
                                        </select>
                                    </div>                                    
                                </div>
                                <div className="inuts-consumo">
                                    <div>
                                        <label>Quantidade</label>
                                        <input
                                            className="quant_consumo"
                                            type="number"
                                            value={quantidadeEditar}
                                            onChange={(e) => setQuantidadeEditar(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label>Valor Total:</label>
                                        <p>{}</p>
                                    </div>                                
                                </div>                

                                <div>
                                    <p>{mensagem}</p>
                                </div>
                                <div className="button-consumo">
                                    <button onClick={atualizarConsumo} className='adicionar_consumo'>Salvar Edição</button>
                                    <button  onClick={() => setEditarOpen(false)}>Cancelar</button>                                    
                                </div>

                            </form>
                        </div>
                    </div>
            )}
        </>
    );
}

export default Consumo;
