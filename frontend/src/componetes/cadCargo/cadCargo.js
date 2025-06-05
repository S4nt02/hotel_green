import "./cadCargo.css"
import {UserCog2 } from 'lucide-react';
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { API_URL } from '../../url';
import { set } from "react-hook-form";



function CadCargo (){

    const [exibir, setExibir] = useState(false)
    const [cargo, setCargo] = useState('')
    const [erro, setErro] = useState(false)
    const [cadastrado, setCadastrado] = useState(false) 
    const [mensagem, setExibirMensagem] = useState("")

    const cadastrarCargo = async () =>{
        if(cargo === ""){
            setErro(true)
        }
        else{
            let dados = {}
            dados.cargo = cargo
            try{
                const cadastrarCargo = await fetch(`${API_URL}/cadastroCargo`, {
                    method : "POST",
                    headers : {
                        'Content-Type' : "application/json"
                    },
                    body : JSON.stringify(dados)
                })

                const resultado = await cadastrarCargo.json()

                if(!resultado.cadastrado){
                    setExibir(true)
                    setExibirMensagem("Erro ao cadastrar cargo, tente novamente")
                    
                }
                else{
                    setExibir(true)
                    setExibirMensagem("Cargo cadastrado")
                    setCadastrado(true) 
                }

            }
            catch{
                setExibir(true)
                setExibirMensagem("Erro ao cadastrar cargo, tente novamente")
            }
        }


    }


    return(
        <>
            {exibir === false && <div className="alinhar-cadCargo-content">
                <label className="edit-carCargo-label">
                    <UserCog2 size={18}/>
                    Nome do cargo
                </label>
                <input type="text" placeholder="Insira o nome para o novo cargo" value={cargo} className="cadCargo-input" onChange={(e) => setCargo(e.target.value)}></input>
                {erro && (<p className="erro-mensagem">Por favor insira um nome para o cargo</p>)}
                <button className="button-cad-cargo" onClick={cadastrarCargo}>Cadastrar</button>
            </div>}
            {exibir === true && (
                <div>
                    {mensagem && <p>{mensagem}</p>}
                    {cadastrado === true && (
                        <button className="button-cad-cargo" onClick={() => {
                            setExibir(false)
                            setCadastrado(false)
                            setCargo('')
                            setErro(false)
                            setExibirMensagem('')
                        }}>
                            Cadastrar novo cargo
                        </button>
                    )}
                    {cadastrado === false && (
                        <button className="button-cad-cargo" onClick={() => {
                            setExibir(false)
                            setErro(false)
                        }}>
                            Tentar novamente
                        </button>
                    )}
                </div>
            )}

        </>
    )
}

export default CadCargo