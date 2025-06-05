import { useEffect, useState } from "react"
import HeaderComponente from "../../componetes/header/headerComponente"
import { API_URL } from "../../url"

function Hospedes () {

    const [infos, setInfos] = useState([])
    const [unidades, setUnidades] = useState([])
    const [unidadeSelecionada, setUnidadeSelecionada] = useState("")
    const [dadosRelatorio, setDadosRelatorio] = useState([])

    const buscarHospedes = async () => {
        const resultado = await fetch(`${API_URL}/api/buscarHospedes`)
        const dados = await resultado.json()

        setInfos(dados)
        setDadosRelatorio(dados)
    }

    const buscarUnidade = async () => {
        try {
            const buscarUnidade = await fetch(`${API_URL}/api/buscarUnidade`);
            const dados = await buscarUnidade.json();

            setUnidades(dados);
        } catch (erro) {
            console.error("Erro ao buscar unidades:", erro);
        }
    };

    const removerValoresVazios = (array) => {
        return array.filter(item => item !== "")
    }

    const converterData = (dataCon) => {
        const dataFormatada = new Date(dataCon).toLocaleDateString("pt-BR")
        return dataFormatada
    }

    const filtrarAcomodacoes = (lista) => {
        return lista.filter(acomodacao => {
            const idUnidadeAcomodacao = String(acomodacao.unidade || "")
            return unidadeSelecionada === "" || idUnidadeAcomodacao === unidadeSelecionada
        })
    }

    const baixarRelatorio = async () => {
        const response = await fetch(`${API_URL}/api/geraRelatorioHospedes`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosRelatorio),
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'relatorio.pdf';
        link.click();
    }

    useEffect(() => {
        buscarHospedes()
        buscarUnidade()
    },[])

    useEffect(() => {
        setDadosRelatorio(filtrarAcomodacoes(infos))
    }, [unidadeSelecionada, infos])

    return(
        <>
            <HeaderComponente/>
            <main>
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
                <button onClick={baixarRelatorio}>Baixar relatorio</button>
                {dadosRelatorio.map(info => (
                    <>
                        <div key={info.id}>
                            <p>Reserva: {info.id}</p>
                            <p>Data de checkIN: {info.horarioEntrada}</p>
                            <p>Data de saída: {converterData(info.checkOut)}</p>
                            <p>Unidade: {info.nomeUnidade}</p>
                            <p>Quarto: {info.numAcomodacao}</p>
                            <p>Hospede Principal: {info.hospede}</p>
                            <p>Acompanhantes:</p>
                            <p>Adultos:</p>
                            {removerValoresVazios(info.acompanhantesAdultos).map((acompanhante, index) => (
                                <p key={index}>{acompanhante}</p>
                            ))}
                            <p>Crianças:</p>
                            {removerValoresVazios(info.acompanhantesCriancas).map((acompanhante, index) => (
                                <p key={index}>{acompanhante}</p>
                            ))}
                        </div>
                    </>
                ))}
            </main>
        </>
    )
}

export default Hospedes