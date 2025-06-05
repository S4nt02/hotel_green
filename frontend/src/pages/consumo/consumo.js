import { useState, useEffect } from "react";
import { API_URL } from "../../url";
import HeaderComponente from "../../componetes/header/headerComponente";
import { useAuth } from "../../context/authContext";

function Consumo() {
    const { id, nomeUser, autorizacao } = useAuth();

    const [itens, setItens] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [todasReservas, setTodasReservas] = useState([]);

    const [data, setData] = useState("");
    const [unidade, setUnidade] = useState("");
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
        return dados.filter(item =>
            !categoriaBuscar || item.categoria?.toLowerCase() === categoriaBuscar.toLowerCase()
        );
    }

    const filtrarReservas = (dados) => {
        return dados.find((item) => {
            const matchNumAcomodacao = numAcomodacao
                ? item.numAcomodacao?.toLowerCase().includes(numAcomodacao.toLowerCase())
                : false;

            const matchDocumento = documento
                ? item.documento?.toLowerCase().includes(documento.toLowerCase())
                : false;

            const matchNome = nomeHospede
                ? item.nome?.toLowerCase().includes(nomeHospede.toLowerCase())
                : false;

            const matchId = idReserva
                ? item.id?.toString().includes(idReserva)
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

    useEffect(() => {
        buscarItens();
        buscarCategoria();
        buscarTodasdReservas();
        obterData();
    }, []);

    useEffect(() => {
        const resultado = filtrarReservas(todasReservas);
        setReservaSelecionada(resultado || {});
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

    return (
        <>
            <HeaderComponente />
            <main>
                <form>
                    <div>
                        <label>Data de consumo</label>
                        <input className="dataconsumo" type="date" value={data} readOnly />
                    </div>
                    <div>
                        <label>Funcionário</label>
                        <input className="funcionario" type="text" value={nomeUser} readOnly />
                    </div>
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

                    <button type='submit' className='adicionar_consumo'>Adicionar</button>
                </form>
            </main>
        </>
    );
}

export default Consumo;
