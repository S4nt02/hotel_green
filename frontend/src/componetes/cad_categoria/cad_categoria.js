import React from 'react';
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { coerce, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { set, useForm} from 'react-hook-form';
import { API_URL } from '../../url';
import { Key } from 'lucide-react';
import {CirclePlus} from 'lucide-react'
import "./cad_categoria.css"

function CadCategoria (){

    const [categorias, setCategorias] = useState([])
    const [idEditando, setIdEditando] = useState(null);
    const [valueEdit, setValueEdit] = useState('')
    const [categOpen, setAdicionarCateg] = useState(false)
    const [excluirOpen, setExcluirOpen] = useState(false)
    const [idCategoria, setIdCategoria] = useState(null)

    const validarCategoria = z.object({
        categoria : z.string().min(1, {message : "O campo categoria não pode ser vazio"})
    })


    const excluirModal = (id) => {
        setExcluirOpen(!excluirOpen)
        setIdCategoria(id)
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
        resolver: zodResolver(validarCategoria)
    })

    const onError = (errors) => {
        console.log("❌ Erros de validação:");
        console.log(errors);
    };

    const cadastrarCategoria = async (dados) => {
        try{
            const cadCategoria = await fetch(`${API_URL}/api/cadCategoria`, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(dados)
            })

            if(!cadCategoria.sucesso){

            }

            reset({
                categoria : ""
            })

        }
        catch{

        }
        buscarCategoria()
    }

    const buscarCategoria = async () => {
        try{
            const buscarCategoria = await fetch(`${API_URL}/api/buscarCategoria`)
            const dados = await buscarCategoria.json()

            setCategorias(dados)
        }
        catch{

        }

    }

    const editarCategoria = async () => {
    const dados = { id: idEditando, categoria: valueEdit };

    if (!valueEdit.trim()) {
        alert("O campo categoria não pode ser vazio");
        return;
    }

    try {
        const editarCategoria = await fetch(`${API_URL}/api/editarCategoria`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if(!editarCategoria.editado){

        }
        setIdEditando(null);
        setValueEdit("");
        buscarCategoria();
    } catch (error) {
        console.log("Erro ao editar", error);
    }
    };


    const excluirCategoria = async () => {
        const id = idCategoria
        try{
            const excluirCategoria = await fetch(`${API_URL}/api/excluirCategoria`, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({id})
            })

            if(excluirCategoria.excluido){

            }

            setExcluirOpen(false)
        }   
        catch{

        }

        buscarCategoria()
    }

    useEffect(() => {
        buscarCategoria()
    }, [])

    const adicionarCategoria = () => {
        setAdicionarCateg(!categOpen)
    }

    return(
        <div>
            <div>
{categOpen === false && (<div>
                <button onClick={adicionarCategoria}><CirclePlus size={18}/>Adicionar</button>
            </div>)}

            {categOpen && (
                <div className='alinhar-itens-cad'>
                    <div className='cad-itens'>
                        <form onSubmit={handleSubmit(cadastrarCategoria, onError)}>
                            <label>Adicionar Categoria</label>
                                <input type='text' placeholder='Nome da categoria' {...register("categoria")}></input>
                                <button onClick={adicionarCategoria}>Cancelar</button>
                                <button type='submit'>Adicionar</button>
                                {errors.categoria && <p>{errors.categoria.message}</p>}
                        </form>
                    </div>                    
                </div>

            )}
            <div className='alinhar-categ'>
                {categorias.map((categoria) => (
                <div key={categoria.id} className='exibir-item' >
                    {idEditando === categoria.id ? (
                    <>  
                        <form onSubmit={(e) => {
                        e.preventDefault();
                        editarCategoria();
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
                        <p>{categoria.nomeCategoria}</p>
                        <div>
                            <button 
                                onClick={() => {
                                setIdEditando(categoria.id);
                                setValueEdit(categoria.nomeCategoria);
                                }}>Editar
                            </button>
                            <button onClick={() => excluirModal(categoria.id)}>Excluir</button>                            
                        </div>

                    </>
                    )}
                </div>
                ))}                
            </div>

            

                {excluirOpen && (
                    <div className='overlay'> 
                        <div className='alert-modal'>
                            <div>
                                <p>Deseja excluir esse item</p>

                            </div>
                            <div>
                                <button onClick={excluirCategoria}>Excluir</button>
                                <button onClick={excluirModal}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CadCategoria