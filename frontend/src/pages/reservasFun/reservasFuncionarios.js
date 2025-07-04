import { ExpandIcon } from "lucide-react"
import HeaderComponente from "../../componetes/header/headerComponente"
import { useEffect, useState } from "react"
import { API_URL } from "../../url"
import RealizarCheckIn from "../../componetes/realizarCheckIIn/realizarCheckIn"
import { useAuth } from "../../context/authContext"
import FazerRservaFun from "../../componetes/fazerReservaFuncionario/fazerReservaFun"
import CheckOut from "../../componetes/checkOut/checkOut"
import "./reservasFuncionarios.css"

function ReservasFuncionarios (){

    const {id, nomeUser} = useAuth()
    const [sessao, selecionarSesao] = useState(1)
    const [reservas, setReservas] = useState([])
    const [reservasCheckIn, setReservasCheckIn] = useState([])
    const [checkInOpen, setCheckInOpen] = useState(false)
    const [idReserva, setIdReserva] = useState(null)
    const [mensagemCancelamento, setMensagemCancelamento] = useState("")
    const [cancelamentoValido, setCancelamentoValido] = useState(false)
    const [idCancelamento, setIdCancelamento] = useState(null)
    const [alertaCancelamento, setAlertaCancelamento] = useState(false)
    const [modalExcluir, setModalExcluir] = useState(false)
    const [cancelarOpen, setCancelarOpen] = useState(false)

    const [idCheckOut, setIdCheckOut] = useState("")
    const [checkOutOpen, setCheckOutOpen] = useState(false)

    const buscarTodasReservas = async () =>{
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
        setIdReserva(reserva)
        setCheckInOpen(true)

    }


    const irParaCheckOut = (id) => {
        setIdCheckOut(id)
        setCheckOutOpen(true)
    }

    useEffect(() => {
        buscarTodasReservas()
        buscarCheckIn()
    },[sessao])

    useEffect(() => {
        buscarCheckIn()
        buscarTodasReservas()
    }, [checkOutOpen])

    const relatorioReserasDias = async () => {
    try {
        const response = await fetch(`${API_URL}/api/relatorioReservas`, {
        method: 'GET',
        });

        if (!response.ok) {
        throw new Error('Erro ao buscar o relatório');
        }

        // Aqui você está recebendo um PDF (blob), e **não** um JSON:
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'relatorioReservasDia.pdf';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Erro ao baixar o relatório:', error);
    }
    };

       
    
    const estaDentroDoPrazo = (checkIn) => {
        const agora = new Date();
        const dataCheckIn = new Date(checkIn);

        // Define check-in ao meio-dia
        dataCheckIn.setHours(12, 0, 0, 0);

        // Subtrai 12 horas da data de check-in
        const limite = new Date(dataCheckIn.getTime() - 12 * 60 * 60 * 1000);

        // Retorna true se agora for antes do limite
        return agora < limite;
    };


    const desejaCancelar = (id, checkIn) =>{
        setIdCancelamento(id)
        const cancelamentoValido = estaDentroDoPrazo(checkIn)
        setCancelamentoValido(cancelamentoValido)

        if(!cancelamentoValido){
            setAlertaCancelamento(true)
            
        }
        setCancelarOpen(true)

    }



    const cancelarReserva = async () => {
        console.log(cancelamentoValido)

        if(cancelamentoValido){
            try{
                const cancelarReserva = await fetch(`${API_URL}/api/cancelarReserva`, {
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify({idCancelamento})
                })

                const data = await cancelarReserva.json()
                if(data.excluido){
                    setModalExcluir(true)
                    setCancelarOpen(false)
                    setMensagemCancelamento('Reserva cancelada com sucesso')
                }
            }
            catch{

            }
            
        }
        else{
            try{
                const cacelarReservaInvalida = await fetch(`${API_URL}/api/cancelarReservaInvalida`, {
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify({id})
                })

                const dados = await cacelarReservaInvalida.json()

                if(dados.excluido){
                    setModalExcluir(true)
                    setCancelarOpen(false)
                    setMensagemCancelamento("A resreva foi cancelada fora do prazo limite para cancelalmento, irá ser realizada a cobrança de uma taxa de cancelamento")
                }
            }
            catch{

            }
        }
        buscarTodasReservas()
        setCancelarOpen(false)
    }



    return(
        <>
            <HeaderComponente/>
            <main>
                {/* {exibir todas as reservas} */}
                {/* {permitir novas reservas} */}
                {/* realizar check-in */}
                <div className="alinhar_button_princi">
                    <button onClick={() => selecionarSesao(1)}>Reservas</button>
                    <button onClick={() => selecionarSesao(2)}>Reservas com chek-in</button>
                    <button onClick={() => selecionarSesao(4)}>Nova reserva</button>

                </div>
                {sessao === 1 && (
                    <>
                        <button onClick={relatorioReserasDias}>Relatorio Reservas do dia</button>
                        <div div className="body_cards">
                            {reservas.map(reserva => (
                                <>
                                <div key={reserva.id} className="card_reservas_check">
                                        <div className="title_reserva">
                                            Número da reserva: {reserva.id}
                                        </div>
                                        <hr></hr>
                                        <br/>
                                        <div className="alinhar_infos_reservas">
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
                                        <br/>                                  
                                        <div>
                                            <button onClick={() => desejaCancelar(reserva.id, reserva.checkIn)}>Cancelar</button>
                                            <button onClick={() => irParaCheckIn(reserva.id)}>Realizar Check-in</button>
                                        </div>    
                                    </div>
                            
                                </>

                            ))}
                        </div>
                    </>
                )}

                {sessao === 2 && (
                    <>
                        <div className="body_cards">
                            {reservasCheckIn.map(reserva => (
                                <>
                                    <div key={reserva.id} className="card_reservas_check">
                                        <div className="title_reserva">
                                            <h3>Número da reserva: {reserva.id}</h3>
                                        </div>
                                        <div className="alinhar_infos_reservas">
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
                                        <div className="button_reservas">
                                          <button onClick={() => irParaCheckOut(reserva.id)}>Realizar Check-Out</button>
                                        </div>  
                                    </div>
                                                                     
                                </>

                            ))}
                        </div>
                    </>
                )}

                {sessao === 4 && (
                    <>
                        <FazerRservaFun/>
                    </>
                )}
            </main>

            {checkInOpen && (
                <>
                    <div className="overlay-reservas" onClick={() => setCheckInOpen(false)}>
                        <div className="checkin-content">
                            <RealizarCheckIn idReserva={idReserva}/>
                            <div>
                                <button onClick={() => setCheckInOpen(false)}>Cancelar</button>
                            </div>
                        </div>

                    </div>
                </>
            )}

            {cancelarOpen && (
                <>
                <div className="overlay-reservas">
                    <div className="cancelar-content">
                        <div>
                            <p>Deseja realmente cancelar a reserva?</p>
                            {alertaCancelamento && (
                                <p>O cancelamento da reserva sem 12 horas de antecedência gerará cobraça de uma taxa adicional</p>
                            )}
                        </div>
                        <div className="cancelar-buttons">
                            <button onClick={() => setCancelarOpen(false)}>Não</button>
                            <button onClick={cancelarReserva}>Sim</button>
                        </div>
                    </div>
                </div>
                </>
            )}

            {modalExcluir && (
                <div className="overlay-reservas" onClick={() => setModalExcluir(false)}>
                    <div>
                        <p>{mensagemCancelamento}</p>
                    </div>
                </div>
            )}

            {checkOutOpen && (
                <>
                    <div className="overlay-reservas" onClick={() => setCheckOutOpen(false)}>
                        <div className="aleert-modal-reservas">
                            <CheckOut idCheckOut={idCheckOut}/>
                        </div>

                    </div>

                </>
            )}
        </>
    )
}

export default ReservasFuncionarios