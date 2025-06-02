import { ExpandIcon } from "lucide-react"
import HeaderComponente from "../../componetes/header/headerComponente"
import { useEffect, useState } from "react"
import { API_URL } from "../../url"
import RealizarCheckIn from "../../componetes/realizarCheckIIn/realizarCheckIn"
import { useAuth } from "../../context/authContext"

function ReservasFuncionarios (){

    const {id, nomeUser} = useAuth()
    const [sessao, selecionarSesao] = useState(1)
    const [reservas, setReservas] = useState([])
    const [reservasCheckIn, setReservasCheckIn] = useState([])
    const [checkInOpen, setCheckInOpen] = useState(false)
    const [idReserva, setIdReserva] = useState(null)

    const BuscarTodasReservas = async () =>{
        try{
            const buscarReservas = await fetch(`${API_URL}/api/buscarReservasFun`)
            const dados = await buscarReservas.json()

            setReservas(dados)
        }
        catch{

        }
    }

    const buscarCheckIn = async () => {
        try{
            const buscarCheckIn = await fetch(`${API_URL}/api/buscarCheckIn`)
            const dados = await buscarCheckIn.json()

            setReservasCheckIn(dados)
        }
        catch{

        }
    }

    const converterData = (dataCon) => {
        const dataFormatada = new Date(dataCon).toLocaleDateString("pt-BR")
        return dataFormatada
    }

    const irParaCheckIn = (reserva) => {
        const dataCheckIn = new Date(reserva.checkIn)
        const hoje = new Date()

        const mesmoDia = dataCheckIn.getDate() === hoje.getDate()
        const mesmoMes = dataCheckIn.getMonth() === hoje.getMonth()
        const mesmoAno = dataCheckIn.getFullYear() === hoje.getFullYear()

        if (mesmoDia && mesmoMes && mesmoAno) {
            setIdReserva(reserva.id)
            setCheckInOpen(true)
        } else {
            alert("O check-in só pode ser realizado na data da reserva!")
        }
    }


    const irParaCheckOut = (id) => {

    }

    useEffect(() => {
        BuscarTodasReservas()
        buscarCheckIn()
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
                        <div>BARRA DE PESQUISA</div>
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
                                        <button onClick={() => irParaCheckIn(reserva.id)}>Realizar Check-in</button>
                                    </div>                                
                                </>

                            ))}
                        </div>
                    </>
                )}

                {sessao === 2 && (
                    <>
                        <div>
                            {reservasCheckIn.map(reserva => (
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
                                        <button onClick={() => irParaCheckOut(reserva.id)}>Realizar Check-Out</button>
                                    </div>                                   
                                </>

                            ))}
                        </div>
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

            {checkInOpen && (
                <>
                    <div className="checkIn-overlay" onClick={() => setCheckInOpen(false)}>
                        <div className="checkin-content">
                            <RealizarCheckIn idReserva={idReserva}/>
                            <div>
                                <button onClick={() => setCheckInOpen(false)}>Cancelar</button>
                            </div>
                        </div>

                    </div>
                </>
            )}
        </>
    )
}

export default ReservasFuncionarios