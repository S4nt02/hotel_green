import React from 'react';
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { coerce, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { set, useForm} from 'react-hook-form';
import { API_URL } from '../../url';
import { Key } from 'lucide-react';
import {CirclePlus} from 'lucide-react'
import "./cadUnidade.css"

function CadUnidade (){

    const [unidades, setUnidades] = useState([])
    const [idEditando, setIdEditando] = useState(null);
    const [valueEdit, setValueEdit] = useState('')
    const [categOpen, setAdicionarCateg] = useState(false)
    const [excluirOpen, setExcluirOpen] = useState(false)
    const [idUnidade, setIdUnidade] = useState(null)

    const validarUnidade = z.object({
        unidade : z.string().min(1, {message : "O campo unidade não pode ser vazio"})
    })


    const excluirModal = (id) => {
        setExcluirOpen(!excluirOpen)
        setIdUnidade(id)
    }

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        clearErrors,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(validarUnidade)
    })

    const onError = (errors) => {
        console.log("❌ Erros de validação:");
        console.log(errors);
    };

    const cadastrarUnidade = async (dados) => {
        try{
            const cadUnidade = await fetch(`${API_URL}/api/cadUnidade`, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(dados)
            })

            if(!cadUnidade.sucesso){

            }

            reset({
                Unidade : ""
            })

        }
        catch{

        }
        buscarUnidade()
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

    const editarUnidade = async () => {
    const dados = { id: idEditando, unidade: valueEdit };

    if (!valueEdit.trim()) {
        alert("O campo Unidade não pode ser vazio");
        return;
    }

    try {
        const editarUnidade = await fetch(`${API_URL}/api/editarUnidade`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if(!editarUnidade.editado){

        }
        setIdEditando(null);
        setValueEdit("");
        buscarUnidade();
    } catch (error) {
        console.log("Erro ao editar", error);
    }
    };


    const excluirUnidade = async () => {
        const id = idUnidade
        try{
            const excluirUnidade = await fetch(`${API_URL}/api/excluirUnidade`, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({id})
            })

            if(excluirUnidade.excluido){

            }

            setExcluirOpen(false)
        }   
        catch{

        }

        buscarUnidade()
    }

    useEffect(() => {
        buscarUnidade()
    }, [])

    const adicionarUnidade = () => {
        setAdicionarCateg(!categOpen)
    }

    return(
        <>

            {categOpen === false && (<div>
                <button onClick={adicionarUnidade}><CirclePlus size={18}/>Adicionar</button>
            </div>)}

            {categOpen && (<div>
                <form onSubmit={handleSubmit(cadastrarUnidade, onError)}>
                    <label>Adicionar Unidade</label>
                        <input type='text' placeholder='Nome da unidade' {...register("unidade")}></input>
                        <button onClick={adicionarUnidade}>Cancelar</button>
                        <button type='submit'>Adicionar</button>
                        {errors.unidade && <p>{errors.unidade.message}</p>}
                </form>
            </div>)}
            <div>
                {unidades.map((unidade) => (
                <div key={unidade.id}>
                    {idEditando === unidade.id ? (
                    <>  
                        <form onSubmit={(e) => {
                        e.preventDefault();
                        editarUnidade();
                        }}>
                        <input
                            type="text"
                            value={valueEdit}
                            onChange={(e) => setValueEdit(e.target.value)}
                        />
                        <button type="submit">Salvar</button>
                        <button type="button" onClick={() => setIdEditando(null)}>Cancelar</button>
                        </form>

                    </>
                    ) : (
                    <>
                        <p className='unidades'>{unidade.nomeUnidade}</p>
                        <button className='editar'
                            onClick={() => {
                            setIdEditando(unidade.id);
                            setValueEdit(unidade.nomeUnidade);
                            }}>Editar
                        </button>
                        <button onClick={() => excluirModal(unidade.id)}>Excluir</button>
                    </>
                    )}
                </div>
                ))}

                {excluirOpen && (
                    <div className='overlay'> 
                        <div className='alert-modal'>
                            <div>
                                <p>Deseja excluir esse item</p>

                            </div>
                            <div>
                                <button onClick={excluirUnidade}>Excluir</button>
                                <button onClick={excluirModal}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}


export default CadUnidade