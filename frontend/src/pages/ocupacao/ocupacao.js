import { useEffect, useState } from "react"
import { API_URL } from "../../url"
import HeaderComponente from "../../componetes/header/headerComponente"
import "./ocupacao.css"

function Ocupacao() {
    const [sessao, setSessaso] = useState(1)
    const [unidades, setUnidades] = useState([])
    const [acomodacaoOcupada, setAcomodacaoOcupada] = useState([])
    const [acomodacoesDisponiveis, setAcomodacaoDisponiveis] = useState([])
    const [acomodacoesReservadas, setAcomodacaoReservada] = useState([])

    const [unidadeSelecionada, setUnidadeSelecionada] = useState("")
    const [disponiveisFiltradas, setDisponiveisFiltradas ] = useState([])
    const [reservadasFiltradas, setReservadasFiltradas] = useState([])
    const [ocupadasFiltradas, setOcupadasFiltradas] = useState([])
    


    const hoje = new Date()
    const formatarData = (data) => data.toISOString().split("T")[0]
    const [dataInicial, setDataInicial] = useState(formatarData(hoje))
    const [dataFinal, setDataFinal] = useState(formatarData(new Date(hoje.setDate(hoje.getDate() + 7))))

    const buscarUnidade = async () => {
        try {
            const buscarUnidade = await fetch(`${API_URL}/api/buscarUnidade`)
            const dados = await buscarUnidade.json()
            setUnidades(dados)
        } catch { }
    }

    const buscarAcomodacoesOcupadas = async () => {
        console.log('chamando')
        try {
            const resposta = await fetch(`${API_URL}/api/buscarAcomodacoesOcupadas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dataInicial, dataFinal })
            })
            const data = await resposta.json()
            setAcomodacaoOcupada(data?.acomodacoesOcupadas || [])
            setAcomodacaoReservada(data?.acomodacoesReservadas || [])

        } catch (erro) {
            console.error('Erro ao buscar acomodações ocupadas:', erro)
        }
    }

    const buscarAcomodacoesDisponiveis = async () => {
        try {
            const resposta = await fetch(`${API_URL}/api/buscarAcomodacoesDisponiveis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dataInicial, dataFinal })
            })
            const data = await resposta.json()
            setAcomodacaoDisponiveis(data?.acomodacoesDisponiveis || [])

        } catch (erro) {
            console.error('Erro ao buscar acomodações disponíveis:', erro)
        }
    }

    const filtrarAcomodacoes = (lista) => {
        return lista.filter(acomodacao => {
            const idUnidadeAcomodacao = String(acomodacao.idUnidade || acomodacao.unidade?.id || "")
            return unidadeSelecionada === "" || idUnidadeAcomodacao === unidadeSelecionada
        })
    }



    useEffect(() => {
        buscarUnidade()
    }, [])

    useEffect(() => {
        buscarAcomodacoesDisponiveis()
        buscarAcomodacoesOcupadas()
    }, [dataInicial, dataFinal])

    useEffect(() => {
        console.log('Unidade selecionada:', unidadeSelecionada)
        console.log('Reservadas antes do filtro:', acomodacoesReservadas)

        setDisponiveisFiltradas(filtrarAcomodacoes(acomodacoesDisponiveis))
        setReservadasFiltradas(filtrarAcomodacoes(acomodacoesReservadas))
        setOcupadasFiltradas(filtrarAcomodacoes(acomodacaoOcupada))
    }, [unidadeSelecionada, acomodacoesDisponiveis, acomodacoesReservadas, acomodacaoOcupada])


    return (
        <>  
            <HeaderComponente/>
            <main className="alinhar_button">
                <input type="button" value="Disponíveis" onClick={() => setSessaso(1)} />
                <input type="button" value="Reservadas" onClick={() => setSessaso(2)} />
                <input type="button" value="Ocupadas" onClick={() => setSessaso(3)} />
            </main>
            <div className="barra-de-pesquisa">
                <form className="card_ocupacao">
                    <div className="primeira_linha">
                        <label>Data Inicial</label>
                        <input
                            type="date"
                            value={dataInicial}
                            onChange={(e) => setDataInicial(e.target.value)}
                        />
                        <label>Data Final</label>
                        <input
                            type="date"
                            value={dataFinal}
                            onChange={(e) => setDataFinal(e.target.value)}
                        />
                    </div>
                    <div className="segunda_linha">
                        <label>Unidade</label>
                        <select
                            value={unidadeSelecionada}
                            onChange={(e) => setUnidadeSelecionada(e.target.value)}
                        >
                            <option value={''}>Todas unidades</option>
                            {unidades.map(unidade => (
                                <option key={unidade.id} value={unidade.id}>{unidade.nomeUnidade}</option>
                            ))}
                        </select>
                    </div>
                    <div className="infos_ocupacao">
                        <p>Quantidade Total de Acomodações: {disponiveisFiltradas.length + reservadasFiltradas.length + ocupadasFiltradas.length}</p>
                        <p>Quantidade de Acomodações disponíveis: {disponiveisFiltradas.length}</p>
                        <p>Quantidade de acomodações ocupadas: {ocupadasFiltradas.length}</p>
                        <p>Quantidade de acomodações reservadas: {reservadasFiltradas.length}</p>
                    </div>
                </form>
            </div>
            <main className="body_conteudos">
                <div>
                    {sessao === 1 && (
                        <div className="body_ocupacao">
                            <div className="grid-exibir">
                                {disponiveisFiltradas.map(acomodacao => (
                                    <div key={acomodacao.id} className="exibir_ocupacoes" >
                                        <h1>Acomodação: {acomodacao.id}</h1><br></br>
                                        <div>
                                            <p>Unidade: {acomodacao.nomeUnidade}</p>
                                            <p>Tipo acomodação: {acomodacao.nomeAcomodacao}</p>
                                            <p>Número do Quarto: {acomodacao.numAcomodacao}</p>
                                            <p>Número do andar: {acomodacao.num_andar}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    )}

                    {sessao === 2 && (
                        <div className="body_ocupacao">
                            <div className="grid-exibir">
                                {reservadasFiltradas.map(acomodacao => (
                                    <div key={acomodacao.id} className="exibir_ocupacoes">
                                        <h1>Acomodação: {acomodacao.id}</h1><br></br>
                                        <div>
                                        <p>Unidade: {acomodacao.nomeUnidade}</p>
                                        <p>Tipo acomodação: {acomodacao.nomeAcomodacao}</p>
                                        <p>Número do Quarto: {acomodacao.numAcomodacao}</p>
                                        <p>Número do andar: {acomodacao.num_andar}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    )}
                
                    {sessao === 3 && (
                        <div className="body_ocupacao">
                            <div className="grid-exibir">
                                {ocupadasFiltradas.map(acomodacao => (
                                    <div key={acomodacao.id} className="exibir_ocupacoes">
                                        <h1>Acomodação: {acomodacao.id}</h1><br></br>
                                        <div>
                                        <p>Unidade: {acomodacao.nomeUnidade}</p>
                                        <p>Tipo acomodação: {acomodacao.nomeAcomodacao}</p>
                                        <p>Número do Quarto: {acomodacao.numAcomodacao}</p>
                                        <p>Número do andar: {acomodacao.num_andar}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    )}

                </div>
            </main>
        </>
    )
}

export default Ocupacao
