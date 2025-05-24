import React from 'react';
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { coerce, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { set, useForm} from 'react-hook-form';
import { API_URL } from '../../url';
import { Key } from 'lucide-react';
import "./cadAcomodacao.css"

function CadAcomodacoes ({dadosAcomodacaoParaEditar, aoAlterar}){

    const [dadosAcomodacao, setDadosAcomodacao] = useState(() => dadosAcomodacaoParaEditar || {})
    const [idAcomodacao, setIdAcomodacao] = useState("")
    const [editar, setEditar] = useState(false)
    const [tiposQuartos, setTiposQuartos] = useState([])
    const [alertOpen, setAlertModal] = useState(false)
    const [alertMensagem, setAlertMensagem] = useState("")
    const [unidades, setUnidades] = useState([])

    const validarAcomodacao = z.object({
        numAcomodacao : z.coerce.number().min(1, { message: "Digite um número para a acomodação" }) ,
        num_andar : z.coerce.number().min(1, { message: "Digite o número do andar" }),
        tpAcomodacao : z.coerce.number().min(1, { message: "Selecione o tipo de acomodação" }) ,
        unidade_hotel : z.coerce.number().min(1, { message: "Selecione a Unidade do Hotel" }) ,
    })

    const buscarTpQuarto = async () => {
        try{
            const buscarTiposQuartos = await fetch(`${API_URL}/api/buscarTipoQuartos`,)
            const dados = await buscarTiposQuartos.json()

            if(!buscarTiposQuartos.ok){
                
            }

            setTiposQuartos(dados)
        }
        catch(erro){
            
        }
    }

    const buscarUnidade = async () => {
        try{
            const buscarUnidade = await fetch(`${API_URL}/api/buscarUnidade`)
            const dados = await buscarUnidade.json()

            setUnidades(dados)
        }
        catch{

        }

    }

    
    useEffect(() => {
        buscarTpQuarto();
        buscarUnidade()
    }, []); // <- só busca os tipos de quarto uma vez ao montar

    useEffect(() => {
        if(dadosAcomodacaoParaEditar){
            setDadosAcomodacao(dadosAcomodacaoParaEditar)
            setIdAcomodacao(dadosAcomodacaoParaEditar.id)
            if(dadosAcomodacaoParaEditar.id){
                setEditar(true)
            }
            


        }
    }, [dadosAcomodacaoParaEditar])


    const onError = (errors) => {
        console.log("❌ Erros de validação:");
        console.log(errors);
    };


    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        clearErrors,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(validarAcomodacao)
    })

    const onSaveQuarto = async (dados) =>{
        setAlertModal(true)
        
        if(editar){
            dados.id = dadosAcomodacao.id
            try{
                const cadastrarAcomodacao = await fetch(`${API_URL}/api/editarAcomodacao`,{
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify(dados)
                })

                if(!cadastrarAcomodacao.editado){
                    setAlertMensagem("Acomodação editada com sucesso")
                    reset({
                        numAcomodacao: "",
                        num_andar: "",
                        tpAcomodacao: "",
                        unidade_hotel: "",
                    });
                }
                else{
                     setAlertMensagem("Erro ao editar acomodação")
                }

                

            }
            catch(erro){
                setAlertMensagem("Erro ao cadastrar acomodação")
            }

        }
        else{
            try{
                const cadastrarAcomodacao = await fetch(`${API_URL}/api/cadastrarAcomodacao`,{
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify(dados)
                })

                if(!cadastrarAcomodacao.sucesso){
                    setAlertMensagem("Acomodação editada com sucesso")
                    reset({
                        numAcomodacao: "",
                        num_andar: "",
                        tpAcomodacao: "",
                        unidade_hotel: "",
                    });
                }
                else{
                    setAlertMensagem("Erro ao editar acomodação")
                }

                

            }
            catch(erro){
                setAlertMensagem("Erro ao editar acomodação")
            }
        }

        if (aoAlterar) aoAlterar()

    }

    const cancelarEdicao = () => {
        setEditar(false);
        reset({
            numAcomodacao: "",
            num_andar: "",
            tpAcomodacao: "",
            unidade_hotel: "",
        });
    };

    const alertModal = () => {
        setAlertModal(!alertOpen)
    }

    return(
        <>
        
        <form onSubmit={handleSubmit(onSaveQuarto, onError)} className="tiposacomodacoes">
            <h2>Acomodações</h2>
            <div className="numacomodacoes">
            <label>Número da acomodação:</label>
            <input 
            type="number" 
            placeholder="Ex: 101" 
            {...register('numAcomodacao')}
            />
             {errors.numAcomodacao && <p>{errors.numAcomodacao.message}</p>}
            </div>

            <div>
            <label>Andar</label>
            <input 
            type="number" 
            placeholder="Ex: 1" 
            {...register('num_andar')}
            />
             {errors.num_andar && <p>{errors.num_andar.message}</p>}
            </div>

            <div className="tiposacomodacoes">
            <label >
            Tipos de acomodações      
            </label>
            {/* {trazer tp dados do tp acomodacoes} */}
            <select value={watch('tpAcomodacao')||""} {...register('tpAcomodacao')}>
                <option value={""}>Selecione o tipo de quarto</option>
                {tiposQuartos.map(tpQuarto => (
                    <option key={tpQuarto.id} value={tpQuarto.id}>
                        {tpQuarto.id} - {tpQuarto.nomeAcomodacao}
                    </option>
                ))}
            </select>
             {errors.tpAcomodacao && <p>{errors.tpAcomodacao.message}</p>}
            </div>

            <div className="unidades">
            <label>Unidade do Hotel</label>
            <select value={watch('unidade_hotel')||""} {...register('unidade_hotel')}>
                    <option value={""}>Selecione uma Unidade</option>
                    {unidades.map(unidade =>(
                        <option key={unidade.id} value={unidade.id}>{unidade.nomeUnidade}</option>
                    ))}

            </select>
             {errors.unidade_hotel && <p>{errors.unidade_hotel.message}</p>}
            </div>
            
            <button type='submit' className='cad_acomodacoes'>{editar ? "Atualizar acomodação" : "Cadastrar Acomodação"}</button>
             {editar && (<button type="button" onClick={cancelarEdicao}>Cancelar</button>)}
        </form>
            {alertOpen && (
                <div className='overlay-modal'>
                    <div className='alert-modal'>
                        <h1 onClick={alertModal}>X</h1>
                         <p>{alertMensagem}</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default CadAcomodacoes