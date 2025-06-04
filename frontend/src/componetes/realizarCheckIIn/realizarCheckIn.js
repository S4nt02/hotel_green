import { use, useEffect, useState } from "react"
import { API_URL } from "../../url"
import { useAuth } from "../../context/authContext"

function RealizarCheckIn ({idReserva}){
    
    const {id, nomeUser} = useAuth()
    const [infosReservas, setInfosReserva] = useState({})
    const [horarioCheckIn, setHorarioCheckIn] = useState("")
    const [acompanhantesAdultos, setAcompanhantesAdultos] = useState([])
    const [acompanhantesCriancas, setAcompanhantesCriancas] = useState([])

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

       setAcompanhantesAdultos(
            dados[0].acompanhantesAdultos && Array.isArray(dados[0].acompanhantesAdultos)
                ? dados[0].acompanhantesAdultos
                : Array(dados[0].quantidadeAdultos).fill("")
        );

        setAcompanhantesCriancas(
            dados[0].acompanhantesCriancas && Array.isArray(dados[0].acompanhantesCriancas)
                ? dados[0].acompanhantesCriancas
                : Array(dados[0].quantidadeCriancas).fill("")
        );
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
            horarioCheckIn : horarioCheckIn,
            acompanhantesAdultos: acompanhantesAdultos,
            acompanhantesCriancas : acompanhantesCriancas,
        }

        console.log(registro)
        

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

   return (
        <>
            <div>
            <div>
                ID
                <p>{infosReservas.id}</p>
                Nome
                <p>{infosReservas.nome}</p>
                <label>Horário da entrada</label>
                <input value={horarioCheckIn} readOnly />
                <div>
                <p>Acompanhantes</p>

                {infosReservas.quantidadeAdultos > 0 && (
                    <div>
                    <label>Adultos</label>
                    {[...Array(infosReservas.quantidadeAdultos)].map((_, index) => (
                        <input
                        key={`adulto-${index}`}
                        type="text"
                        placeholder={`Acompanhante ${index + 1}`}
                        value={acompanhantesAdultos[index] || ""}
                        onChange={(e) => {
                            const novoAcompanhantes = [...acompanhantesAdultos];
                            novoAcompanhantes[index] = e.target.value;
                            setAcompanhantesAdultos(novoAcompanhantes);
                        }}
                        />
                    ))}
                    </div>
                )}

                {infosReservas.quantidadeCriancas > 0 && (
                    <div>
                    <label>Crianças</label>
                    {[...Array(infosReservas.quantidadeCriancas)].map((_, index) => (
                        <input
                        key={`crianca-${index}`}
                        type="text"
                        placeholder={`Criança ${index + 1}`}
                        value={acompanhantesCriancas[index] || ""}
                        onChange={(e) => {
                            const novoAcompanhantes = [...acompanhantesCriancas];
                            novoAcompanhantes[index] = e.target.value;
                            setAcompanhantesCriancas(novoAcompanhantes);
                        }}
                        />
                    ))}
                    </div>
                )}
                </div>

                <div>
                <button onClick={efetuarCheckIn}>Efetuar checkIn</button>
                </div>
            </div>
            </div>
        </>
    )
}


export default RealizarCheckIn