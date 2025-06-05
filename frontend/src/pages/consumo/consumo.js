import { useState, useEffect } from "react"
import { API_URL } from "../../url"
import HeaderComponente from "../../componetes/header/headerComponente"
import { useAuth } from "../../context/authContext"

function Consumo () {

    const {id, nomeUser, autorizacao} = useAuth()

    const [itens, setItens] = useState([])
    const [categorias, setCategorias] = useState([])
    const [todasReservas, setTodasReservas] = useState([])

    const [data, setData] = useState()
    const [unidade, setUnidade] = useState("")
    const [numAcomodacao, setNumAcomodacao] = useState("")
    const [documento, setDocumento] = useState("")
    const [nomeHospede, setNomeHospede] = useState("")
    const [idReserva, setIdReserva] = useState("")
    const [categoriaBuscar, setCategoriaBusca] = useState("")
    const [itensFiltrados, setItensFiltrados] = useState([])
    const [itemSelecionado, setItemSelecionadol] = useState('')
    const [reservaSelecionada, setReservaSelecionada] = useState([])
    const [quantidade, setQuantidade] = useState("")
    const [valorTotal, setValorTotal] = useState("")

    const buscarItens = async () => {
        try{
            const resposta = await fetch(`${API_URL}/api/buscarItens`)
            const dados = await resposta.json()
            console.log(dados)
            setItens(dados)
        }
        catch{

        }

    }

    const buscarCategoria = async () => {
        try{
            const resposta = await fetch(`${API_URL}/api/buscarCategoria`)
            const dados = await resposta.json()
            console.log(dados)
            setCategorias(dados)
        }
        catch{

        }

    }


    const buscarTodasdReservas = async () => {
        try{
            const buscar = await fetch(`${API_URL}/api/buscarReservasConsumo`)
            const dados = await buscar.json()
            console.log(dados)
            setTodasReservas(dados)
        }
        catch{
            
        }

    }

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

            const matchId = id
            ? item.id?.toLowerCase().includes(idReserva.toLowerCase())
            : false;

            return matchNumAcomodacao || matchDocumento || matchNome || matchId;
        });
    }

    const obterData = () => {
        const data = new Date();
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro = 0
        const ano = data.getFullYear();

        const dataFormatada = `${dia}/${mes}/${ano}`
        setData(dataFormatada)
    }

    const calculoValorTotal = () => {
        return setValorTotal((quantidade * itemSelecionado.preco))
    }

    useEffect(() => {
        buscarItens()
        buscarCategoria()
        buscarTodasdReservas()
        obterData()
    }, [])

    useEffect(() => {
        filtrarReservas(todasReservas)
    },[nomeHospede,documento, numAcomodacao, idReserva ])

    useEffect(() => {
        setReservaSelecionada(filtrarPorCategoria(itens))
    },[categoriaBuscar])

    useEffect(() => {
        calculoValorTotal()
    },[itemSelecionado])

return(
    <>
        <HeaderComponente/>
        <main>
            <form>
                <div>
                    <label> Data de consumo</label>
                    <input className="dataconsumo" type="date" value={data}></input>
                </div>
                <div>
                    <label>Funcionário</label>
                    <input className="funcionario" type="text" value={nomeUser}></input>
                </div>
                <div>
                    <label>Acomodação</label>
                    <input className="acomodacao" type="text" 
                        value={reservaSelecionada.numAcomodacao || ""}
                        onChange={(e) => setNumAcomodacao(e.target.value)}
                    ></input>
                </div>
                <div>
                    <label>ID da Reserva</label>
                    <input className="idreserva" type="number"
                        value={reservaSelecionada.id || ""}
                        onChange={(e) => setIdReserva(e.target.value)}
                    ></input>
                </div>
                <div>
                    <label>Documento</label>
                    <input className="cpf" type="number"
                    value={reservaSelecionada.documento || ""} 
                    onChange={(e) => setDocumento(e.target.value)}></input>
                </div>
                <div>
                    <label>Nome do Hospede</label>
                    <input type="text"
                        value={reservaSelecionada.nome || ""}
                        onChange={(e) => setNomeHospede(e.target.value)}
                    ></input>
                </div>
                <div>
                    <label>Categoria</label>
                    <select>
                        <option value={categoriaBuscar}
                            onChange={(e) => setCategoriaBusca(e.target.value)}
                        >Todas as categorias</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>{categoria.nomeCategorias}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Item</label>
                    <select>
                        <option value={itemSelecionado} 
                            onChange={(e) => setItemSelecionadol(e.target.value)}
                            >Todos os itens</option>
                        {itensFiltrados.map((item) => (
                            <option key={item.id} value={item.id}>{item.nomeItem}- ${item.preco}</option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label>Quantidade</label>
                    <input className="quant_consumo" type="text" 
                    value={quantidade || ""} 
                    onChange={(e) => setQuantidade(e.target.value)}></input>
                </div>
                <div>
                    <label>Valor Total:</label>
                    <p>{valorTotal}</p>
                </div>

                <button type='submit' className='adicionar_consumo'>Adicionar</button>
            </form>
        </main>
    
    </>

)
}
export default Consumo;

