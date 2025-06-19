import { useState, useEffect } from "react"
import HeaderComponente from "../../componetes/header/headerComponente"
import Rodape from "../../componetes/rodape/rodape"
import { useAuth } from "../../context/authContext"
import { TriangleAlert } from "lucide-react"
import { API_URL } from "../../url"


import "./minhasReservas.css";



function MinhasReservas (){

    const {id, nomeUser} = useAuth()
    const [minhasReservas, setMinhasReservas] = useState([])
    const [cancelarOpen, setCancelarOpen] = useState(false)
    const [idCancelamento, setIdCancelamento] = useState(null)
    const [alertaCancelamento, setAlertaCancelamento] = useState(false)
    const [modalExcluir, setModalExcluir] = useState(false)
    const [mensagemCancelamento, setMensagemCancelamento] = useState("")
    const [cancelamentoValido, setCancelamentoValido] = useState(false)

    const buscarReservas = async () =>{

        if(!id){
            return
        }

        const buscarReservas = await fetch(`${API_URL}/api/buscarMinhasReservas`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({id})
        })

        const dados = await buscarReservas.json()
        setMinhasReservas(dados)
        console.log(dados)
    }

    const converterData = (dataCon) => {
        const dataFormatada = new Date(dataCon).toLocaleDateString("pt-BR")
        return dataFormatada
    }

    const valorTotal = (vlDiaria, dias) => {
    return parseFloat(vlDiaria) * parseInt(dias, 10);
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
            setCancelarOpen(false)
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
        buscarReservas()
    }

    useEffect(() => {
        buscarReservas()
    },[])

    return(
        <>
            <HeaderComponente/>
            <main>
                {!id ? (
                    <div className="alerta-login">
                        <TriangleAlert size={100}/>
                        <p className="titulo-alerta">Faça login para visualizar suas reservas</p>
                    </div>
                ) : (
                    <>
                        <p className="title-reservas">Suas Reservas</p>
                        <div className="alinhar-minhas-reservas" >
                            {minhasReservas.map(reserva => (
                                <div key={reserva.id} className="card-minhas-reservas">
                                    <div className="info-minhas-reservas">
                                        <p className="editar-p-minhas-reservas">Número Reserva: {reserva.id}</p>
                                        <p className="editar-p-minhas-reservas">Unidade: {reserva.nomeUnidade}</p>
                                        <p className="editar-p-minhas-reservas">{reserva.nomeAcomodacao}</p>
                                    </div>
                                    <div className="">
                                        <div className="infos-data">
                                            <p className="editar-p-minhas-reservas">checkIn: {converterData(reserva.checkIn)}</p>
                                            <p className="editar-p-minhas-reservas">check-out: {converterData(reserva.checkOut)}</p>
                                            <p className="editar-p-minhas-reservas">Duração: {reserva.periodo} Noites</p>
                                            <p className="editar-p-minhas-reservas">Reserva feita em: {converterData(reserva.dataReserva)}</p>
                                        </div>
                                        <div>
                                            <p className="p-valores">Valor Diaria : {reserva.vlDiaria}</p>
                                            <p className="p-valores">Valor Total: {valorTotal(reserva.vlDiaria, reserva.periodo)}</p>
    
                                        </div>
                                    </div>
                                    <div className="button-cancelar">
                                        {((!reserva.entrada && !reserva.cancelada)) && (
                                            <button className="canelar-minhas-reservas" onClick={() => desejaCancelar(reserva.id, reserva.checkIn)}>Cancelar</button>
                                        )}    
                                    </div>


                                </div>
                            ))}
                        </div>
                    </>
                )}


            </main>
            <Rodape/>

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
        </>
    )
}

export default MinhasReservas