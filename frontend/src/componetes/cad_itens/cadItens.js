import React from 'react';
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { coerce, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { set, useForm} from 'react-hook-form';
import { API_URL } from '../../url';
import { Key } from 'lucide-react';
import {CirclePlus, Search} from 'lucide-react'
import "./cadItens.css"


function CadItens () {
    const [itemOpen, setItemOpen] = useState(false)
    const [categorias, setCategorias] = useState([])
    const [itens, setItens] = useState([])
    const [excluirOpen, setExcluirOpen] = useState(false)
    const [idItem, setIdItem] = useState(null)
    const [editar, setEditar] = useState(false)

    const abrirAdicionarItem = () => {
        setItemOpen(!itemOpen)
    }

    const excluirModal = (id) => {
        setExcluirOpen(!excluirOpen)
        setIdItem(id)
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

    const cadastroItem = async (dados) => {
        console.log(JSON.stringify(dados))

        if(editar === true){
            dados.id = idItem
                try{
                    const adicionarItem = await fetch(`${API_URL}/api/editarItem`, {
                        method : `POST`,
                        headers : {
                            'Content-Type' : 'application/json'
                        },
                        body : JSON.stringify(dados)
                    })

                    if(!adicionarItem.sucesso){

                    }

                    reset({
                        nomeItem :"",
                        categoria : "",
                        preco : ""
                    })

                }
                catch{

            } 
        }
        else{
            try{
                const adicionarItem = await fetch(`${API_URL}/api/adicionarItem`, {
                    method : `POST`,
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify(dados)
                })

                if(!adicionarItem.sucesso){

                }

                reset({
                    nomeItem :"",
                    categoria : "",
                    preco : ""
                })

            }
            catch{

            } 
        }


        buscarItens()
    }

    const buscarItens = async () => {
        try{
            const buscarItens = await fetch(`${API_URL}/api/buscarItens`)
            const dados = await buscarItens.json()

            setItens(dados)
        }
        catch{

        }
    }

    const excluirItem = async () => {
    
        const id = idItem
        
        try{
            const excluirItem = await fetch(`${API_URL}/api/excluirItem`,{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({id})
            })

            const data = await excluirItem.json()

            if(data.excluido === true){
                setIdItem(null)
                setExcluirOpen(false)
            }
        }
        catch{
            
        }
        buscarItens()
    }

    const editarItem = async (item) =>{
        console.log(item)
        setItemOpen(true)
        setIdItem(item.id)
        setEditar(true)
        reset({
            nomeItem : item.nomeItem,
            categoria : item.categoria,
            preco : item.preco
        })

    }

    const validarItem = z.object({
        nomeItem : z.string().min(1, {message : "O campo de nome do item precisa está preenchido"}),
        categoria : z.coerce.number().min(1, {message : "Selecione uma categoria"}),
        preco : z.coerce.number().min(0.01 , {message : "Defina o preço do item"})
    })

    useEffect(() => {
        buscarCategoria()
        buscarItens()
    }, [])

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        clearErrors,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(validarItem)
    })


    return (
        <>
            <div className='busca'>
                <div>
                    <input type='text'></input>
                    <button onClick={buscarItens}><Search size={18}></Search></button>                    
                </div>

                <button onClick={abrirAdicionarItem}><CirclePlus size={18}/>Adicionar</button>
            </div>

            {itemOpen && (<div>
                <form onSubmit={handleSubmit(cadastroItem)}>
                    <div>
                        <label>Nome do item</label>
                        <input type='text' placeholder='Descrição do item' {...register("nomeItem")}></input>    
                        {errors.nomeItem && <p>{errors.nomeItem.message}</p>}                    
                    </div>
                    <div>
                        <label>Categoria</label>
                        <select {...register("categoria")}>
                            <option value={""}>Selecione uma categoria</option>
                            {categorias.map(categoria => (
                                <option key={categoria.id} value={categoria.id}>{categoria.nomeCategoria}</option>
                            ))}
                        </select>  
                        {errors.categoria && <p>{errors.categoria.message}</p>}                        
                    </div>
                    <div>
                        <label>
                            Preço(R$)
                        </label>
                        <input type='text' placeholder='0000.00' {...register("preco")}></input>
                        {errors.preco && <p>{errors.preco.message}</p>}  
                    </div>
                    <button onClick={abrirAdicionarItem}>Cancelar</button>
                    <button type='submit'>{editar === true ? "Editar" : "Adicionar"}</button>
                </form>
            </div>)}

            {itens.map(item => (
                <div>
                    <p>Codigo-{item.id}</p>
                    <p>Item-{item.nomeItem}</p>
                    <p>Categoria-{item.categoria}</p>
                    <p>Preço-{item.preco}</p>
                    <button onClick={() => excluirModal(item.id)}>Excluir</button>
                    <button onClick={() => editarItem(item)}>Editar</button>
                </div>
            ))}

            {excluirOpen && (
                <div className='overlay'> 
                    <div className='alert-modal'>
                        <div>
                            <p>Deseja excluir esse item</p>

                        </div>
                        <div>
                            <button onClick={excluirItem}>Excluir</button>
                            <button onClick={excluirModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CadItens