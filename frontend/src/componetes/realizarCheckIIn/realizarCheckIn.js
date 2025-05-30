import { use, useEffect, useState } from "react"
import { API_URL } from "../../url"
import { useAuth } from "../../context/authContext"

function RealizarCheckIn ({idReserva}){
    
    const {id, nomeUser} = useAuth()
    const [infosReservas, setInfosReserva] = useState({})
    const [horarioCheckIn, setHorarioCheckIn] = useState("")

    const buscarReservaUnica = async () => {

        const buscar = await fetch(`${API_URL}/api/buscarReservaUnica`, {
            method: 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({idReserva})
        })

        const dados = await buscar.json()
        console.log(dados)
        setInfosReserva(dados[0])
        
    }

    const obterData = () => {
        const data = new Date();
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro = 0
        const ano = data.getFullYear();

        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');

        const dataFormatada = `${dia}/${mes}/${ano} ${horas}:${minutos}`
        setHorarioCheckIn(dataFormatada)
    }

    const efetuarCheckIn = async () => {
        // alterar entrada na tabela reservas para true
        // salvar dados da hora da entrada em uma tabela
        const registro = {
            idReserva : idReserva,
            idFuncionario : id,
            horarioCheckIn : horarioCheckIn
        }
        

        try{
            const confirmarEntrada = await fetch(`${API_URL}/api/confirmarEntrada`, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({idReserva})
            })

            const dados = await confirmarEntrada.json()
            
            if(!dados.entrada){
                return
            }

            const registrarHorario = await fetch(`${API_URL}/api/registrarEntrada` , {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(registro)
            })

            const horario = await registrarHorario.json()

            if(!horario.sucesso){
                return
            }

        }
        catch{

        }
    }

    useEffect(() => {
        buscarReservaUnica()
        obterData()
        
    },[])

    return(
        <>
            <div>
                <div>
                    ID
                    <p>{infosReservas.id}</p>
                    Nome
                    <p>{infosReservas.nome}</p>
                    <label>Horário da entrada</label>
                    <input value={horarioCheckIn}></input>
                    <div>
                        <button onClick={efetuarCheckIn}>Efetuar checkIn</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RealizarCheckIn