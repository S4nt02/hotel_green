import { ExpandIcon } from "lucide-react"
import HeaderComponente from "../../componetes/header/headerComponente"
import { useEffect, useState } from "react"
import { API_URL } from "../../url"

function ReservasFuncionarios (){

    const [sessao, selecionarSesao] = useState(1)
    const [reservas, setReservas] = useState([])

    const BuscarTodasReservas = async () =>{
        try{
            const buscarReservas = await fetch(`${API_URL}/api/buscarReservasFun`)
            const dados = await buscarReservas.json()

            setReservas(dados)
        }
        catch{

        }
    }

    const converterData = (dataCon) => {
        const dataFormatada = new Date(dataCon).toLocaleDateString("pt-BR")
        return dataFormatada
    }

    useEffect(() => {
        BuscarTodasReservas()
    },[])

    return(
        <>
            <HeaderComponente/>
            <main>
                {/* {exibir todas as reservas} */}
                {/* {permitir novas reservas} */}
                {/* realizar check-in */}
                <div>
                    <button onClick={() => selecionarSesao(1)}>Reservas</button>
                    <button onClick={() => selecionarSesao(2)}>Reservas com chek-in</button>
                    <button onClick={() => selecionarSesao(3)}>Reservas com check-out</button>
                    <button onClick={() => selecionarSesao(4)}>Nova reserva</button>

                </div>
                {sessao === 1 && (
                    <>
                        <div>
                            {reservas.map(reserva => (
                                <>
                                    <div key={reserva.id}>
                                        <div>
                                            Número da reserva: {reserva.id}
                                        </div>
                                        <hr></hr>
                                        <div>
                                            Check-in: {converterData(reserva.checkIn)}<br/>
                                            Check-out: {converterData(reserva.checkOut)}<br/>
                                            Hospede Principal : {reserva.nome}<br/>
                                            <div>
                                                Acompanhantes:<br/>
                                                Adultos- <br/>
                                                {reserva.acompanhantesAdultos.map((adulto, index) => (
                                                    <p key={index}>{adulto}</p>
                                                ))}
                                                Crianças-<br/>
                                                {reserva.acompanhantesCriancas.map((crianca, index) => (
                                                    <p key={index}>{crianca}</p>
                                                ))}
                                            </div>
                                            Unidade: {reserva.nomeUnidade}<br/>
                                            Acomodação: {reserva.tpAcomodacao}<br/>
                                            Andar: {reserva.num_andar}<br/>
                                            Quarto: {reserva.numAcomodacao}<br/>                                        
                                        </div>
                                    </div>
                                    <div>
                                        <button>Cancelar</button>
                                        <button>Realizar Check-in</button>
                                    </div>                                
                                </>

                            ))}
                        </div>
                    </>
                )}

                {sessao === 2 && (
                    <>
                        
                    </>
                )}

                {sessao === 3 && (
                    <>
                        
                    </>
                )}

                {sessao === 4 && (
                    <>
                        
                    </>
                )}
            </main>
        </>
    )
}

export default ReservasFuncionarios