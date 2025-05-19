import React from 'react';
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { coerce, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { set, useForm} from 'react-hook-form';
import { API_URL } from '../../url';
import { Key } from 'lucide-react';
import {CirclePlus} from 'lucide-react'

function CadCategoria (){

    const [categorias, setCategorias] = useState([])
    const [idEditando, setIdEditando] = useState(null);
    const [valueEdit, setValueEdit] = useState('')
    const [categOpen, setAdicionarCateg] = useState(false)

    const validarCategoria = z.object({
        categoria : z.string().min(1, {message : "O campo categoria não pode ser vazio"})
    })


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


    const excluirCategoria = async (id) => {
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
        <>

            {categOpen === false && (<div>
                <button onClick={adicionarCategoria}><CirclePlus size={18}/>Adicionar</button>
            </div>)}

            {categOpen && (<div>
                <form onSubmit={handleSubmit(cadastrarCategoria, onError)}>
                    <label>Adicionar Categoria</label>
                    <input type='text' placeholder='Nome da categoria' {...register("categoria")}></input>
                    <button onClick={adicionarCategoria}>Cancelar</button>
                    <button type='submit'>Adicionar</button>
                    {errors.categoria && <p>{errors.categoria.message}</p>}
                </form>
            </div>)}
            <div>
                {categorias.map((categoria) => (
                <div key={categoria.id}>
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
                        <button 
                            onClick={() => {
                            setIdEditando(categoria.id);
                            setValueEdit(categoria.nomeCategoria);
                            }}>Editar
                        </button>
                        <button onClick={() => excluirCategoria(categoria.id)}>Excluir</button>
                    </>
                    )}
                </div>
                ))}
            </div>
        </>
    )
}

export default CadCategoria