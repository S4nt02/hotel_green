import React from 'react';
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { coerce, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { set, useForm} from 'react-hook-form';
import { API_URL } from '../../url';
import "./cadTipoQuarto.css"

function CadTipoQuarto ({dadosTipoQuartoParaEditar, aoAlterar}){

    const [comodidadeAtual, setComodidadeAtual] = useState("");
    const [listaComodidades, setListaComodidades] = useState([]);
    const [dadosTipoQuarto, setDadosTipoQuarto] = useState(() => dadosTipoQuartoParaEditar || {})
    const [idTipoQuarto, setIdTipoQuarto] = useState("")
    const [editar, setEditar] = useState(false)
    const [alertOpen, setAlertModal] = useState(false)
    const [alertMensagem, setAlertMensagem] = useState("")
    const [unidades, setUnidades] = useState([])

    const adicionarComodidade = () => {
        
        if (comodidadeAtual.trim() !== "") {
            
            setListaComodidades([...listaComodidades, comodidadeAtual]);
            setComodidadeAtual("");
            console.log(listaComodidades)
            clearErrors("comodidades");
        }
    };

    const removerComodidade = (index) => {
        const novaLista = listaComodidades.filter((_, i) => i !== index);
        setListaComodidades(novaLista);

         if (novaLista.length > 0) {
            clearErrors("comodidades");
        }
    };

    const buscarUnidade = async () => {
        try{
            const buscarUnidade = await fetch(`${API_URL}/api/buscarUnidade`)
            const dados = await buscarUnidade.json()

            setUnidades(dados)
        }
        catch{

        }

    }




    const validarTpAcomodacao = z.object({
        unidade_hotel: z.coerce.number().min(1, { message: "Selecione a Unidade do Hotel" }),
        nomeAcomodacao: z.string().min(5, { message: "Defina o nome para o tipo de Acomodação" }),
        quantidade_total: z.coerce.number().min(1, { message: "Insira a quantidade de Acomodações" }),
        descricao: z.string().min(10, { message: "Insira uma Descrição para a Acomodação" }),
        comodidades: z.array(z.string()).min(1, { message: "Pelo menos uma comidade deve ser inserida" }),
        vlDiaria: z.coerce.number().min(0.01, { message: "O valor da diária precisa ser inserido" }),
        quantidade_adultos: z.coerce.number().min(1, { message: "Insira a quantidade de adultos" }),
        quantidade_criancas: z.coerce.number().min(1, { message: "Insira a quantidade de crianças" }),
    });


    const onError = (errors) => {
        console.log("❌ Erros de validação:");
        console.log(errors);
    };

    const onSaveTpAcomodacao = async (dados) => {
        setAlertModal(true)
        console.log("chamando a função")
        console.log(`dados ${JSON.stringify(dados)}`)

        ///dados para o back
        if(editar){
            dados.id = dadosTipoQuarto.id
            try{
                const cadastrar = await fetch(`${API_URL}/api/editarTpQuarto`, {
                    method : 'POST',
                    headers : {
                        'Content-Type' : "application/json"
                    },
                    body : JSON.stringify(dados)
                })

                if(!cadastrar.editado){
                    setAlertMensagem("Tipo de acomodação editada com sucesso")
                        reset({
                            unidade_hotel :"",
                            nomeAcomodacao :"",
                            quantidade_total :"" ,
                            descricao : "",
                            comodidades : [] ,
                            vlDiaria :"" ,
                            quantidade_adultos : "" ,
                            quantidade_criancas : "" ,
                        });
                        setListaComodidades([])
                }
                else{
                    setAlertMensagem("Erro ao editar tipo de acomodação")
                }
            }
            catch(erro){
                setAlertMensagem("Erro ao editar tipo de acomodação")
            }
        }
        else{
            try{
                const cadastrar = await fetch(`${API_URL}/api/cadastrarTpQuarto`, {
                    method : 'POST',
                    headers : {
                        'Content-Type' : "application/json"
                },
                body : JSON.stringify(dados)
            })

                if(!cadastrar.sucesso){
                    setAlertMensagem("Tipo de acomodação cadastrada com sucesso")
                        reset({
                            unidade_hotel :"",
                            nomeAcomodacao :"",
                            quantidade_total :"" ,
                            descricao : "",
                            comodidades : [] ,
                            vlDiaria :"" ,
                            quantidade_adultos : "" ,
                            quantidade_criancas : "" ,
                        });
                        setListaComodidades([])
                }
                else{
                    setAlertMensagem("Erro ao cadastrar tipo de acomodação")
                }

            }
            catch{
                setAlertMensagem("Erro ao cadastrar tipo de acomodação")
            }

        }
       if (aoAlterar) aoAlterar()

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
        resolver: zodResolver(validarTpAcomodacao)
    })

    // Atualiza comodidades sempre que elas mudarem
    useEffect(() => {
        setValue("comodidades", listaComodidades);
        if (listaComodidades.length > 0) {
            clearErrors("comodidades");
        }
        buscarUnidade()
    }, [listaComodidades]);

    // Inicializa o formulário uma única vez quando for edição
    useEffect(() => {
        if (dadosTipoQuartoParaEditar) {
            setDadosTipoQuarto(dadosTipoQuartoParaEditar);
            setIdTipoQuarto(dadosTipoQuartoParaEditar.id);
            if(dadosTipoQuartoParaEditar.id){
                setEditar(true);
            }
            

            reset({
                unidade_hotel : dadosTipoQuartoParaEditar.unidade_hotel || "",
                nomeAcomodacao : dadosTipoQuartoParaEditar.nomeAcomodacao || "",
                quantidade_total : dadosTipoQuartoParaEditar.quantidade_total || "" ,
                descricao : dadosTipoQuartoParaEditar.descricao || "",
                comodidades : dadosTipoQuartoParaEditar.comodidades || [] ,
                vlDiaria : dadosTipoQuartoParaEditar.vlDiaria || "" ,
                quantidade_adultos : dadosTipoQuartoParaEditar.quantidade_adultos || "" ,
                quantidade_criancas : dadosTipoQuartoParaEditar.quantidade_criancas || "" ,
            });

            setListaComodidades(dadosTipoQuartoParaEditar.comodidades || []);
        }
    }, [dadosTipoQuartoParaEditar]);

    const cancelarEdicao = () => {
        setEditar(false);
        reset({
                unidade_hotel :"",
                nomeAcomodacao :"",
                quantidade_total :"" ,
                descricao : "",
                comodidades : [] ,
                vlDiaria :"" ,
                quantidade_adultos : "" ,
                quantidade_criancas : "" ,
        });
        setListaComodidades([])
    };

    const alertModal = () => {
        setAlertModal(!alertOpen)
    }


    return(
        <>
            <form onSubmit={handleSubmit(onSaveTpAcomodacao, onError)} className="acomodacoes">
                <h2>Tipos de Acomodações</h2>
                <h4>Adicionar tipo de Acomodação</h4>

                <div>
                    <label>Unidade do Hotel</label>
                    <select 
                        value={watch('unidade_hotel')||""}
                        {...register('unidade_hotel')}
                    >
                        <option value={""}>Selecione uma Unidade</option>
                        {unidades.map(unidade => (
                            <option key={unidade.id} value={unidade.id}>{unidade.nomeUnidade}</option>
                        ))}
                        
                    </select>
                    {errors.unidade_hotel && <p>{errors.unidade_hotel.message}</p>}
                </div>

                <div className='codigoQuarto'>
                <label className='codigo'>Nome acomodação</label>
                    <input
                        type="text"
                        placeholder="Produto"
                       
                        
                        {...register("nomeAcomodacao")}
                    />
                    {errors.nomeAcomodacao && <p>{errors.nomeAcomodacao.message}</p>}
                </div>

                <div className='quantidade'>
                <label>Quantidade Total de Quartos</label>
                    <input
                        type="text"
                        placeholder="Produto"
                       
                        
                        {...register("quantidade_total")}
                    />
                    {errors.quantidade_total && <p>{errors.quantidade_total.message}</p>}
                </div>

                <label>Descrição</label><br />
                <textarea
                
                
                placeholder="Descreva o tipo de acomodação"
                rows={4}
                cols={50}
                style={{ resize: 'vertical', padding: '8px' }}
                {...register("descricao")}
                /><br />
                {errors.descricao && <p>{errors.descricao.message}</p>}
                {/* Seção de Comodidades */}
                <div className='comodidades'>
                <label>Comodidades</label>
                <input
                    type="text"
                    placeholder="Ex: TV, Frigobar..."
                    value={comodidadeAtual}
                    onChange={event => setComodidadeAtual(event.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                        e.preventDefault(); // Impede o envio do form
                        adicionarComodidade();
                        }
                    }}
                />
                <button type="button" onClick={adicionarComodidade}>Adicionar</button>
                <input type="hidden"  {...register("comodidades")} />

                {errors.comodidades && <p>{errors.comodidades.message}</p>}

                {/* Lista de comodidades exibidas dinamicamente */}
                <ul>
                    {listaComodidades.map((item, index) => (
                    <li key={index}>
                        {item}
                        <button type="button" onClick={() => removerComodidade(index)}> X
                        </button>
                    </li>
                    ))}
                </ul>
                </div>

                <div className='diaria'>
                    <label>Preço da Diária (R$)</label>
                    <input 
                    type="text" 
                    step="0.01" placeholder="0.00"
                    {...register("vlDiaria")}
                    
                    />
                    {errors.vlDiaria && <p>{errors.vlDiaria.message}</p>}
                </div>
                <div className='adultos'>
                    <label>Número de Adultos</label>
                    <input 
                    type="number" 
                    placeholder="0"
                    {...register("quantidade_adultos")}
                    />
                    {errors.quantidade_adultos && <p>{errors.quantidade_adultos.message}</p>}
                </div>

                <div className='criancas'>
                    <label>Número de Crianças</label>
                    <input 
                    type="number" 
                    placeholder="0" 
                    {...register("quantidade_criancas")}
                    />
                    {errors.quantidade_criancas && <p>{errors.quantidade_criancas.message}</p>}
                </div>
                <button type='submit' className='cad_quartos'>{editar ? "Atualizar tipo de acomodação" : "Cadastrar Tipo de Acomodação"}</button>
                {editar && (<button type="button" onClick={cancelarEdicao}>Cancelar</button>)}
            </form>

            {alertOpen && (
                <div className='overlay-modal2'>
                    <div className='alert-modal2'>
                        <h1 onClick={alertModal}>X</h1>
                         <p>{alertMensagem}</p>
                    </div>
                </div>

            )}
        </>
    )
}

export default CadTipoQuarto