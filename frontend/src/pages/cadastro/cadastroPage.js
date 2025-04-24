import React from 'react'
import { Link } from 'react-router-dom'; //import para usar rotas
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { API_URL } from '../../url';
import HeaderComponente from '../../componetes/header/headerComponente';
import { User, Phone, MapPin, Calendar, Flag, Home, Mail, IdCard, FileText, Lock, MapPinHouse, Building2, Landmark, Building, Map } from 'lucide-react';
import "./cadastro.css"
import { useForm} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom'




function CadastroPage(){
    const navigate =  useNavigate()

    const [nacionalidade, setNacionalidade] = useState("brasileiro")
    const [documento, setDocumento] = useState("CPF")
    const [cep, setCep] = useState("")
    const [dadosEndereco, setDadosEndereco] = useState("")
    const [erroCep, setErroCep] = useState("")
    const [cpf_rg, setCPF_RG] = useState("")
    const [passaporte, setPassaporte] = useState("")
    
      

    const verificarNacionalidade = (event) => {
        setNacionalidade(event.target.value); 
        event.target.value = 0
        setValue('cpf_rg', '');
        setValue('passaporte', '');
      };
    
    const selecionarDocumento = (event) => {
        setDocumento(event.target.value);
        errors.cpf_rg = false
    };

    ///////////////////API CORREIOS/////////////////////

    const buscarCep = async (buscarCep) => {
      console.log("chamando função");
      if(buscarCep.length > 7){
        console.log("CEP digitado:", buscarCep);
      
        try {
          const resposta = await fetch(`${API_URL}/api/cep/${buscarCep}`);
          const data = await resposta.json();
      
          if (!resposta.ok || data.erro) {
            setErroCep("CEP não encontrado");
            setDadosEndereco({});
            return;
          }
      
          setDadosEndereco(data);
          setErroCep("");
      
          // Se quiser ver os dados, use um efeito ou log direto aqui
          console.log("Dados recebidos:", data);
        }
        finally{
            
        }
      }
        
    };
    /////////////////////////////////////////////////////////


    /////////////validação formulário////////////////


    const validar = z.object({
        nome: z.string().min(10, { message: "Nome completo é obrigatório" }),
        dtNascimento: z
          .string()
          .min(1, { message: "A data de nascimento é obrigatória" }) // Garante que o campo não está vazio
          .transform((val) => new Date(val)) // Transforma em Date
          .refine((date) => date <= new Date(), {
            message: "A data de nascimento não pode ser no futuro",
          }),
      
        nomeMae: z.string().min(10, { message: "Nome da Mãe é obrigatório" }),
        nomePai : z.string().optional(),
        email: z.string()
          .email({ message: "Formato de email inválido" })
          .refine(email => email.trim().length > 0, {
            message: "Email é obrigatório"
          }),
        senha: z.string()
          .min(8, "A senha deve conter no mínimo 8 digitos")
          .refine(s => s.trim().length > 0, {
            message: "Por favor, crie uma senha"
          }),
        confirmarSenha: z.string()
          .refine(s => s.trim().length > 0, {
            message: "Por favor confirme sua senha"
          }),
        nacionalidade : z.string().optional(),
        cpf_rg : z.string().optional(),
        passaporte: z.string().optional(), // precisa estar aqui como string normal
        telefone: z.string()
          .refine(telefone => telefone.trim().length > 0, {
            message: "O número de telefone é obrigatório"
          }),
        cep: z.string()
          .optional(),
        logradouro: z.string()
          .refine(logradouro => logradouro.trim().length > 0, {
            message: "Logradouro é obrigatório"
          }),
        numero: z.string()
          .refine(numero => numero.trim().length > 0, {
            message: "Número é obrigatório"
          }),
        bairro: z.string()
          .refine(bairro => bairro.trim().length > 0, {
            message: "Bairro é obrigatório"
          }),
        cidade: z.string()
          .refine(cidade => cidade.trim().length > 0, {
            message: "Cidade é obrigatório"
          }),
        estado: z.string()
          .refine(estado => estado.trim().length > 0, {
            message: "Estado é obrigatório"
          }),
        pais: z.string()
          .refine(pais => pais.trim().length > 0, {
            message: "País é obrigatório"
          }),
        
      })

      .refine(data => data.senha === data.confirmarSenha, {
        path: ['confirmarSenha'],
        message: "As senhas não coincidem"
      })

      .refine(data => {
        if (nacionalidade === "estrangeiro") {
          return data.passaporte && data.passaporte.trim().length > 0
        }
        return true;
      }, {
        path: ['passaporte'],
        message: "Digite seu número de passaporte"
      })

      .refine(data => {
        if (nacionalidade === "brasileiro") {
          return data.cep && data.cep.trim().length > 0; 
        }
        return true;
      }, {
        path: ['cep'],
        message: "CEP é obrigatório para brasileiros"
    })

    .refine(async (data) => {
      if (nacionalidade === "brasileiro") {

        if (!cpf_rg || cpf_rg.trim() === "") return false;
        const isValid = await validarCPF_RG(cpf_rg);
        return isValid;  }
      return true; 
    }, {
      message: `${documento} é obrigatório e precisa ser válido para brasileiros`,
      path: ["cpf_rg"] 
    });
    
      
    ///////////////validação de CPF//////////////////
    const validarCPF_RG = (cpf_rg) => {
      console.log(cpf_rg)
      if (!cpf_rg) return false; // Se cpf_rg for undefined ou null, retorna false imediatamente.
    
      // Se o documento for CPF
      if (documento === 'CPF') {
        cpf_rg = cpf_rg.replace(/[^\d]/g, ""); // Remove caracteres não numéricos
    
        // Verifica se o CPF tem 11 dígitos e não é uma sequência repetitiva
        if (cpf_rg.length !== 11 || /^(\d)\1{10}$/.test(cpf_rg)) return false;
    
        // Calcula os dígitos verificadores do CPF
        let sum = 0;
        for (let i = 0; i < 9; i++) sum += parseInt(cpf_rg[i]) * (10 - i);
        let firstVerifier = 11 - (sum % 11);
        firstVerifier = (firstVerifier === 10 || firstVerifier === 11) ? 0 : firstVerifier;
    
        sum = 0;
        for (let i = 0; i < 10; i++) sum += parseInt(cpf_rg[i]) * (11 - i);
        let secondVerifier = 11 - (sum % 11);
        secondVerifier = (secondVerifier === 10 || secondVerifier === 11) ? 0 : secondVerifier;
    
        // Compara os dígitos verificadores calculados com os do CPF
        return cpf_rg[9] === firstVerifier.toString() && cpf_rg[10] === secondVerifier.toString();
      }
    
      // Lógica para validar RG (ainda não implementada)
      if (documento === 'RG') {
        // Adicione a lógica de validação de RG aqui, se necessário
      }
    
      return true; // Se não for nem CPF nem RG, retorna true
    };
    
    //////////////////////////////////////////////////////////////
    
    ////////////////////////ENIO FORMULARIO///////////////////////
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(validar)
    })

    const enviarFormulario = async (dados) => {     
        dados.nacionalidade = nacionalidade 
        console.log("chamando a função")
        console.log(`dados ${JSON.stringify(dados)}`)
        console.log(`dados ${JSON.stringify(dados.nacionalidade)}`)
        

        try{
          const cadastrar = await fetch(`${API_URL}/api/cadastro`, {
            method : 'POST',
            headers : {
              'Content-Type' : "application/json"
            },
            body : JSON.stringify(dados)
          })

          if(!cadastrar.ok){
            //definir erros do alerta
          }
          navigate('/perfil')
        }
        catch (erro){
          //definir erros do alerta
        }
    }

    const onError = (errors) => {
      console.log("❌ Erros de validação:");
      console.log(errors);
    };


    /////////////////////////////////////////////////////////////////

    return(
        <>
            <main>
                <HeaderComponente></HeaderComponente>
                <div className='form_content'>
                    <form onSubmit={handleSubmit(enviarFormulario, onError)}>
                        <div className='informacoePessoais'>
                            <h5>Informações Pessoais</h5>
                            <hr></hr>
                            <div className='alinhar_content'>
                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <User size={18}/> Nome Completo
                                    </label>
                                    <input type='text' className='cadastro_input' id='nomeCompleto' placeholder='Digite seu nome completo' {...register("nome")}></input>
                                    {errors.nome && <p>{errors.nome.message}</p>}
                                </div>
                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Calendar size={18} />Data de Nascimento
                                    </label>
                                    <input type='date' className='cadastro_input' id='dtNascimento' {...register('dtNascimento')} inputMode='numeric' pattern='[0-9]*'></input>
                                    {errors.dtNascimento && <p>{errors.dtNascimento.message}</p>}
                                </div>
                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <User size={18}/> Nome da Mãe
                                    </label>
                                    <input type='text' className='cadastro_input' id='nomeMae' placeholder='Digite o nome da mãe completo' {...register("nomeMae")}></input>
                                    {errors.nomeMae && <p>{errors.nomeMae.message}</p>}
                                </div>
                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <User size={18}/> Nome do Pai
                                    </label>
                                    <input type='text' className='cadastro_input' id='nomePai' placeholder='Digite o nome do pai completo' {...register("nomePai")}></input>
                                </div>

                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Mail size={18}/> Email
                                    </label>
                                    <input type='mail' className='cadastro_input' placeholder='Digite seu email' {...register("email")}></input>
                                    {errors.email && <p>{errors.email.message}</p>}
                                </div>
                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Lock size={18}/> Senha
                                    </label>
                                    <input type='password' className='cadastro_input' placeholder='Digite sua senha' {...register("senha")}></input>
                                    {errors.senha && <p>{errors.senha.message}</p>}
                                </div>
                                <div className='edit_label_input'>

                                </div>
                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Lock size={18}/> Confirmar Senha
                                    </label>
                                    <input type='password' className='cadastro_input' placeholder='Confirme sua senha' {...register("confirmarSenha")}></input>
                                    {errors.confirmarSenha && <p>{errors.confirmarSenha.message}</p>}
                                </div>
                            </div>
                        </div>

                        <div className='nacionalidade_documento'>
                            <h5>Nacionalidade e Documentação</h5>
                            <hr></hr>
                            <div class = 'nacionalidade'>
                                <label className='alinhar_itens'>
                                    <Flag size={18} /> Nacionalidade 
                                </label>
                                <div className='opcao'>
                                    <input type='radio'name='nacionalidade'  value='brasileiro'  onChange={verificarNacionalidade}  checked={nacionalidade === "brasileiro"} />
                                    <label>Brasileiro</label>
                                </div>
                                <div className='opcao'>
                                    <input type='radio' name='nacionalidade'  value='estrangeiro'  onChange={verificarNacionalidade}  checked={nacionalidade === "estrangeiro"} />
                                    <label>Estrangeiro</label>
                                </div>
                                {errors.nacionalidade && <p>{errors.nacionalidade.message}</p>}
                            </div>
                            <div>
                                {nacionalidade === "brasileiro"  && 
                                <div className='documento_brasil'>
                                    <div className='documentos'>
                                        <label className='alinhar_itens'>
                                            <IdCard size={18} /> Documento
                                        </label>
                                        <div className='opcao'>
                                            <input type='radio'name='documento' value="CPF" checked={documento === "CPF"} onChange={selecionarDocumento}/>
                                            <label>CPF</label>
                                        </div>
                                        <div className='opcao'>
                                            <input type='radio' name='documento' value="RG" checked={documento === "RG"} onChange={selecionarDocumento} />
                                            <label>RG</label>
                                        </div>
                                        {errors.documento && <p>{errors.documento.message}</p>}
                                    </div>
                                    <div class = 'resposta'>
                                        <label className='alinhar_itens'>
                                            <IdCard size={18}/> Número do {documento}
                                        </label>
                                        <input
                                          type='text'
                                          className='cadastro_input'
                                          placeholder={`Digite seu número de ${documento}`}
                                          {...register("cpf_rg")}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setCPF_RG(value); // Atualiza o estado com o valor
                                            validarCPF_RG(value); // Passa o valor diretamente para a validação
                                          }}
                                          inputMode='numeric'
                                          pattern='[0-9]*'
                                        />
                                        {errors.cpf_rg && <p>{errors.cpf_rg.message}</p>}
                                    </div>

                                </div>}
                                { nacionalidade === "estrangeiro" && 
                                    <div class = 'resposta'>
                                        <label className='alinhar_itens'>
                                        <FileText size={18}/> Número do Passaporte
                                        </label>
                                        <input type='text' className='cadastro_input' placeholder='Diite seu número de passaporte'  onChange={(e) => setPassaporte(e.target.value)} {...register("passaporte")} ></input>
                                        {errors.passaporte && <p>{errors.passaporte.message}</p>}
                                    </div>
                                }
                            </div>
                        </div>

                        <div className='contato_endereco'>
                            <h5>Endereço e contato</h5>
                            <hr></hr>
                            <div className='alinhar_contato_endereco'>
                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Phone size={18}/>Número de Telefone
                                    </label>
                                    <input type='text' className='cadastro_input' placeholder='Número de telefone com DDD' {...register("telefone")}></input>
                                    {errors.telefone && <p>{errors.telefone.message}</p>}
                                </div>

                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <MapPin size={18}/>CEP
                                    </label>
                                    <input type='text' className='cadastro_input' placeholder='Digite seu CEP' 
                                      {...register("cep")}
                                      onBlur={(e) => {
                                        const novoCep = e.target.value;
                                        setCep(novoCep);
                                        setValue("cep", novoCep); // sincroniza com react-hook-form
                                        buscarCep(novoCep);
                                      }}
                                      
                                      inputMode='numeric'
                                      pattern='[0-9]*'
                                      maxLength={8}
                                    >

                                    </input>
                                    {errors.cep && <p>{errors.cep.message}</p>}
                                </div>

                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Home size={18}/>Logradouro
                                    </label>
                                    <input type='text' className='cadastro_input' placeholder='Nome da rua' value={dadosEndereco.logradouro} {...register("logradouro")}></input>
                                    {errors.logradouro && <p>{errors.logradouro.message}</p>}
                                </div>

                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <MapPinHouse size={18}/>Número
                                    </label>
                                    <input type='text' className='cadastro_input' placeholder='Número' {...register("numero")} inputMode='numeric' pattern='[0-9]*'></input>
                                    {errors.numero && <p>{errors.numero.message}</p>}
                                </div>

                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Building size={18}/>Complemento
                                    </label>
                                    <input type='text' className='cadastro_input' placeholder='Apartamento, bloco, etc'></input>
                                </div>

                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Landmark size={18}/> Bairro
                                    </label>
                                    <input type='text' className='cadastro_input' placeholder='Bairro' value={dadosEndereco.bairro} {...register("bairro")}></input>
                                    {errors.bairro && <p>{errors.bairro.message}</p>}
                                </div>

                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Building2 size={18}/>Cidade
                                    </label>
                                    <input type='text' className='cadastro_input' placeholder='Cidade' value={dadosEndereco.localidade} {...register("cidade")}></input>
                                    {errors.cidade && <p>{errors.cidade.message}</p>}
                                </div>

                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <MapPin size={18}/>Estado
                                    </label>
                                    <input type='text' className='cadastro_input' placeholder='Estado' value={dadosEndereco.estado} {...register("estado")}></input>
                                    {errors.estado && <p>{errors.estado.message}</p>}
                                </div>

                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Flag size={18}/>País
                                    </label>
                                    <input type='text' className='cadastro_input' placeholder='País' {...register("pais")}></input>
                                    {errors.pais && <p>{errors.pais.message}</p>}
                                </div>

                            </div>
                        </div>
                        <div >
                            <button type='submit' className='cadastro_button'>ENVIAR</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export default CadastroPage