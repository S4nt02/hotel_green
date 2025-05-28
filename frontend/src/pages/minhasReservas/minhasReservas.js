import { useState, useEffect } from "react"
import HeaderComponente from "../../componetes/header/headerComponente"
import Rodape from "../../componetes/rodape/rodape"
import { useAuth } from "../../context/authContext"
import { TriangleAlert } from "lucide-react"
import { API_URL } from "../../url"

function MinhasReservas (){

    const {id, nomeUser} = useAuth()
    const [minhasReservas, setMinhasReservas] = useState([])

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

        const dados = buscarReservas.json()
        setMinhasReservas(dados)
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
                        <TriangleAlert size={25}/>
                        <p>Faça login para visualizar suas reservas</p>
                    </div>
                ) : (
                    <>
                        <p>Minhas Reservas</p>
                        <div>
                            {minhasReservas.map(reserva => (
                                <div key={reserva.id}>

                                </div>
                            ))}
                        </div>
                    </>
                )}


            </main>
            <Rodape/>
        </>
    )
}

export default MinhasReservas