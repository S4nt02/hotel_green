import React from 'react';
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { array, coerce, z } from 'zod';
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
    const [imagens, setImagens] = useState([])
    const [urlAntiga, setUrlAntiga] = useState([])

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

    const adicionarImagem = (event) => {
        const files = Array.from(event.target.files)

        const imageFiles = files.filter(file => file.type.startsWith('image/'))

        setImagens( prevImagens => [...prevImagens, ...imageFiles])
    }

    const removerImagen = (indexImg) =>{
        setImagens(prevImages => prevImages.filter((_, index) => index !== indexImg))
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

        const formData = new FormData();

        // Adiciona os campos simples
        formData.append("unidade_hotel", dados.unidade_hotel);
        formData.append("nomeAcomodacao", dados.nomeAcomodacao);
        formData.append("quantidade_total", dados.quantidade_total);
        formData.append("descricao", dados.descricao);
        formData.append("vlDiaria", dados.vlDiaria);
        formData.append("quantidade_adultos", dados.quantidade_adultos);
        formData.append("quantidade_criancas", dados.quantidade_criancas);
        formData.append("urlAntigas", urlAntiga)

        // Adiciona comodidades (como múltiplos valores)
        dados.comodidades.forEach((item, index) => {
            formData.append(`comodidades[]`, item);
        });


        const arquivos = [];
        const urls = [];

        imagens.forEach((img) => {
        if (typeof img === 'string') {
            urls.push(img); // é uma URL
        } else if (img instanceof File) {
            arquivos.push(img); // é um arquivo
        }
        });

        arquivos.forEach((arquivo) => {
            formData.append("imagensNovas", arquivo);
        });

        formData.append("urlsExistentes", JSON.stringify(urls));
        
        ///dados para o back
        if(editar){
            
            formData.append( "id", dadosTipoQuarto.id)
            try{
                const cadastrar = await fetch(`${API_URL}/api/editarTpQuarto`, {
                    method : 'POST',
                    body : formData
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
                        setImagens([])
                        setUrlAntiga([])
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
                    body : formData
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
                        setImagens([])
                        setUrlAntiga([])
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
            setImagens(dadosTipoQuartoParaEditar.imagens || [])
            setUrlAntiga(dadosTipoQuartoParaEditar.imagens || [])
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
        setImagens([])
        setUrlAntiga([])

    };

    const alertModal = () => {
        setAlertModal(!alertOpen)
    }


    return(
        <>
            <form onSubmit={handleSubmit(onSaveTpAcomodacao, onError)} className="acomodacoes_card">
                <div className='tipo_A'>
                  <h2>Tipos de Acomodações</h2>
                  <h4>Adicionar tipo de Acomodação</h4>
                </div>
                <div className='corpo'>
                    <div className='linha_1'>
                        <div className='UnidadeHotel'>
                            <label>Unidade do Hotel</label>
                            <select value={watch('unidade_hotel')||""}{  ...register('unidade_hotel')}>
                              <option value={""}>Selecione uma Unidade</option>
                              {unidades.map(unidade => (
                              <  option key={unidade.id} value={unidade.id}>{unidade.nomeUnidade}</option>
                              ))}
                        
                            </select>
                            {errors.unidade_hotel && <p>{errors.unidade_hotel.message}</p>}
                        </div>
                        <div className='codigoQuarto'>
                          <label className='codigo'>Nome acomodação</label>
                          <input type="text" placeholder="Produto"{...register("nomeAcomodacao")}/>
                          {errors.nomeAcomodacao && <p>{errors.nomeAcomodacao.message}</p>}
                        </div>
                    </div>

                    <div className='quantidade'>
                        <label>Quantidade Total de Quartos</label>
                        <input
                         type="text"
                         placeholder="Produto"
                         classNamename='quant_quarto'
                       
                        
                         {...register("quantidade_total")}
                        />
                        {errors.quantidade_total && <p>{errors.quantidade_total.message}</p>}
                    </div>
                    <div className='descricao'>
                        <label className='texto'>Descrição</label><br />
                        <textarea placeholder="Descreva o tipo de acomodação" rows={4} cols={50} style={{ resize: 'vertical', padding: '8px' }}{...register("descricao")}/><br />
                        {errors.descricao && <p>{errors.descricao.message}</p>}
                    </div>
                    {/* Seção de Comodidades */}
                    <div className='linha_2'>
                        <div className='comodidades'>
                           <label>Comodidades</label>
                            <div className='buttons'>
                                <input
                                 type="text"
                                 placeholder="Ex: TV, Frigobar..."
                                  onChange={event => setComodidadeAtual(event.target.value)}
                                  nKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                  e.preventDefault(); // Impede o envio do form
                                  adicionarComodidade();
                                  }
                                  }}
                                />
                                <button className='adicionar' type="button" onClick={adicionarComodidade}>Adicionar</button>
                                <input type="hidden"  {...register("comodidades")} />
                            </div>

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
                    </div>
                    <div className='linha_3'>
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
                            <   input 
                              type="number" 
                              placeholder="0" 
                              {...register("quantidade_criancas")}
                            />
                            {errors.quantidade_criancas && <p>{errors.quantidade_criancas.message}</p>}
                        </div>
                    </div>
                    <div className='button'>
                        <div className='imagens-input'>
                            <input
                             type="file"
                             accept="image/*"
                             multiple
                             onChange={adicionarImagem}
                            />
                            {imagens.map((image, index) => (
                            <div key={index}>
                            <img
                                src={
                                    editar
                                    ? image
                                    : image instanceof Blob
                                        ? URL.createObjectURL(image)
                                        : image // assume que já é uma string (URL)
                                }
                                className='ref-imagen'
                            />
                            <button className='deletar_foto' onClick={() => removerImagen(index)}>X</button>
                        </div>
                        ))}
                        </div>
                        <button type='submit' className='cad_quartos'>{editar ? "Atualizar tipo de acomodação" : "Cadastrar Tipo de Acomodação"}</button>
                        {editar && (<button type="button" onClick={cancelarEdicao}>Cancelar</button>)}
                    </div>

                    
                </div>
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