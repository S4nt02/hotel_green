import { useEffect, useState } from "react"
import HeaderComponente from "../../componetes/header/headerComponente"
import { API_URL } from "../../url"

function Hospedes () {

    const [infos, setInfos] = useState([])

    const buscarHospedes = async () => {
        const resultado = await fetch(`${API_URL}/api/buscarHospedes`)
        const dados = await resultado.json()

        setInfos(dados)
    }

    const removerValoresVazios = (array) => {
        return array.filter(item => item !== "")
    }

    const converterData = (dataCon) => {
        const dataFormatada = new Date(dataCon).toLocaleDateString("pt-BR")
        return dataFormatada
    }

    useEffect(() => {
        buscarHospedes()
    })

    return(
        <>
            <HeaderComponente/>
            <main>
                {infos.map(info => (
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