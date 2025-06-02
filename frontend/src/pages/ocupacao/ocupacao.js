import { useEffect, useState } from "react"
import { API_URL } from "../../url"
import HeaderComponente from "../../componetes/header/headerComponente"

function Ocupacao() {
    const [sessao, setSessaso] = useState(1)
    const [unidades, setUnidades] = useState([])
    const [acomodacaoOcupada, setAcomodacaoOcupada] = useState([])
    const [acomodacoesDisponiveis, setAcomodacaoDisponiveis] = useState([])
    const [acomodacoesReservadas, setAcomodacaoReservada] = useState([])

    const [busca, setBusca] = useState("")
    const [unidadeSelecionada, setUnidadeSelecionada] = useState("")


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
            const buscar = busca.toLowerCase()
            const idMatch = acomodacao.id?.toString().includes(buscar)
            const numeroMatch = acomodacao.numAcomodacao?.toString().includes(buscar)
            const unidadeMatch = unidadeSelecionada === "" || acomodacao.idUnidade?.toString() === unidadeSelecionada

            return (idMatch || numeroMatch) && unidadeMatch
        })
    }   

    const disponiveisFiltradas = filtrarAcomodacoes(acomodacoesDisponiveis)
    const reservadasFiltradas = filtrarAcomodacoes(acomodacoesReservadas)
    const ocupadasFiltradas = filtrarAcomodacoes(acomodacaoOcupada)

    useEffect(() => {
        buscarUnidade()
    }, [])

    useEffect(() => {
        buscarAcomodacoesDisponiveis()
        buscarAcomodacoesOcupadas()
    }, [dataInicial, dataFinal])

    return (
        <>  
            <HeaderComponente/>
            <div className="barra-de-pesquisa">
                <form>
                    <div>
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
                    <div>
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
                </form>
            </div>
            <div>
                <p>Quantidade Total de Acomodações: {disponiveisFiltradas.length + reservadasFiltradas.length + ocupadasFiltradas.length}</p>
                <p>Quantidade de Acomodações disponíveis: {disponiveisFiltradas.length}</p>
                <p>Quantidade de acomodações ocupadas: {ocupadasFiltradas.length}</p>
                <p>Quantidade de acomodações reservadas: {reservadasFiltradas.length}</p>
            </div>
            <main>
                <input type="button" value="Disponíveis" onClick={() => setSessaso(1)} />
                <input type="button" value="Reservadas" onClick={() => setSessaso(2)} />
                <input type="button" value="Ocupadas" onClick={() => setSessaso(3)} />

                {sessao === 1 && (
                    <div>
                        {filtrarAcomodacoes(acomodacoesDisponiveis).map(acomodacao => (
                            <div key={acomodacao.id}>
                                <h1>Acomodação: {acomodacao.id}</h1>
                                <div>
                                    <p>Unidade: {acomodacao.nomeUnidade}</p>
                                    <p>Tipo acomodação: {acomodacao.nomeAcomodacao}</p>
                                    <p>Número do Quarto: {acomodacao.numAcomodacao}</p>
                                    <p>Número do andar: {acomodacao.num_andar}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {sessao === 2 && (
                    <div>
                        {filtrarAcomodacoes(acomodacoesReservadas).map(acomodacao => (
                            <div key={acomodacao.id}>
                                <h1>Acomodação: {acomodacao.id}</h1>
                                <div>
                                    <p>Unidade: {acomodacao.nomeUnidade}</p>
                                    <p>Tipo acomodação: {acomodacao.nomeAcomodacao}</p>
                                    <p>Número do Quarto: {acomodacao.numAcomodacao}</p>
                                    <p>Número do andar: {acomodacao.num_andar}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {sessao === 3 && (
                    <div>
                        {filtrarAcomodacoes(acomodacaoOcupada).map(acomodacao => (
                            <div key={acomodacao.id}>
                                <h1>Acomodação: {acomodacao.id}</h1>
                                <div>
                                    <p>Unidade: {acomodacao.nomeUnidade}</p>
                                    <p>Tipo acomodação: {acomodacao.nomeAcomodacao}</p>
                                    <p>Número do Quarto: {acomodacao.numAcomodacao}</p>
                                    <p>Número do andar: {acomodacao.num_andar}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    )
}

export default Ocupacao
