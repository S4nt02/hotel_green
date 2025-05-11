import React from 'react'
import { Link } from 'react-router-dom'; //import para usar rotas
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { API_URL } from '../../url';
import HeaderComponente from '../../componetes/header/headerComponente';
import { User, Phone, MapPin, Calendar, Flag, Home, Mail, IdCard, FileText, Lock, MapPinHouse, Building2, Landmark, Building, Map, UserCog2 } from 'lucide-react';
import "./cadFuncionario.css"
import { useForm} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom'
import { KeyRound } from 'lucide-react';



function CadFuncionario ({dadosFuncionarioParaEditar}){
    const navigate =  useNavigate()

    const [cep, setCep] = useState("")
    const [dadosEndereco, setDadosEndereco] = useState("")
    const [erroCep, setErroCep] = useState("")
    const [cpf_rg, setCPF_RG] = useState("")
    const [cargos, setCargo] = useState([])
    const [erroCargo, setErroCargo] = useState(false)
    const [dadosFuncionario, setDadosFuncionario] = useState(() => dadosFuncionarioParaEditar || {})
    const [editar, setEditar] = useState(false)
    const [idFuncionario, setIdFuncionario] = useState()
    const [mensagem, setMensagem] = useState("")
    const [alertas, setAlertas] = useState(false)

    
    const buscarCargo = async() =>{
      try{
        const resposta = await fetch(`${API_URL}/cargos`);
        const data = await resposta.json()

        if(!resposta.ok){
          setCargo([])
          setErroCargo(true)
        }

        setCargo(data)
      }
      catch{
        setCargo([])
        setErroCargo(true)
      }
    }


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
        documento: z
          .string()
          .refine((val) => val.trim().length > 0, {
            message: "CPF é obrigatório"
          })
          .refine((val) => validarCPF_RG(val), {
            message: "CPF inválido"
          }),
        cargo: z.coerce.number().min(1, "Selecione um cargo válido"),
        autorizacao: z.coerce.number().min(1, "Selecione um cargo válido"),

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
        complemento : z.string().optional(),
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
          return data.cep && data.cep.trim().length > 0; 
      }, {
        path: ['cep'],
        message: "CEP é obrigatório"
    })

    
      
    ///////////////validação de CPF//////////////////
    const validarCPF_RG = (cpf_rg) => {
      console.log(cpf_rg)
      if (!cpf_rg) return false; // Se cpf_rg for undefined ou null, retorna false imediatamente.
    
      // Se o documento for CPF
      else{
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
    
      return true; // Se não for nem CPF nem RG, retorna true
    };
    
    //////////////////////////////////////////////////////////////
    
    ////////////////////////ENIO FORMULARIO///////////////////////
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(validar)
    })

    const enviarFormulario = async (dados) => {     
        console.log("chamando a função")
        console.log(`dados ${JSON.stringify(dados)}`)
        console.log(alertas)
        setAlertas(true)
        console.log(alertas)
        
        if(editar){
          try{
            dados.id = idFuncionario
            const cadastrar = await fetch(`${API_URL}/api/editarFuncionario`, {
              method : 'POST',
              headers : {
                'Content-Type' : "application/json"
              },
              body : JSON.stringify(dados)
            })

            if(!cadastrar.editado){
              setMensagem("Erro ao atualizar o cadastro do Funcionário")
            }

            setMensagem("Cadastro do funcionario atualizado com sucesso")
          }
          catch (erro){
            setMensagem("Erro ao atualizar o cadastro do Funcionário")
          } 
        }
        else{
          try{
            const cadastrar = await fetch(`${API_URL}/api/cadFuncionario`, {
              method : 'POST',
              headers : {
                'Content-Type' : "application/json"
              },
              body : JSON.stringify(dados)
            })

            if(!cadastrar.sucesso){
              setMensagem("Erro ao cadastrar do Funcionário")
            }

            setMensagem("Funcionário cadastrado com sucesso")
          }
          catch (erro){
            setMensagem("Erro ao cadastrar do Funcionário")
      
          } 
        }


    }

    const onError = (errors) => {
      console.log("❌ Erros de validação:");
      console.log(errors);
    };

    const formatDate = (date) => {
      const data = new Date(date);
      return data.toISOString().split('T')[0]; // Retorna apenas a parte da data (YYYY-MM-DD)
    };

    useEffect(() => {
      buscarCargo();
      
      if (dadosFuncionarioParaEditar) {
        setDadosFuncionario(dadosFuncionarioParaEditar);
        setIdFuncionario(dadosFuncionarioParaEditar.id)
        
        setEditar(true)
        

        reset({
          nome : dadosFuncionario.nome || "",
          dtNascimento : formatDate(dadosFuncionario.dtNascimento) || "",
          nomeMae : dadosFuncionario.nomeMae || "",
          nomePai : dadosFuncionario.nomePai || "",
          email : dadosFuncionario.email || "",
          senha : dadosFuncionario.senha || "",
          confirmarSenha: dadosFuncionario.senha || "",
          documento : dadosFuncionario.documento || "",
          cargo : dadosFuncionario.cargo_id || "",
          autorizacao : dadosFuncionario.autorizacao || "",
          telefone : dadosFuncionario.telefone || "",
          cep : dadosFuncionario.cep || "",
          logradouro : dadosFuncionario.logradouro || "",
          numero : dadosFuncionario.numero || "",
          complemento : dadosFuncionario.complemento || "",
          bairro : dadosFuncionario.bairro || "",
          cidade : dadosFuncionario.cidade || "",
          estado : dadosFuncionario.estado || "",
          pais : dadosFuncionario.pais || "",
        })
        
      }
    }, [dadosFuncionarioParaEditar]);

    /////////////////////////////////////////////////////////////////

    return(
        <>
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
                                    <input type='text' className='cadastro_input' id='nomeCompleto'  placeholder='Digite seu nome completo' {...register("nome")}></input>
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
                                    <input type='text' className='cadastro_input' id='nomePai'  placeholder='Digite o nome do pai completo' {...register("nomePai")}></input>
                                </div>

                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Mail size={18}/> Email
                                    </label>
                                    <input type='mail' className='cadastro_input'  placeholder='Digite seu email' {...register("email")}></input>
                                    {errors.email && <p>{errors.email.message}</p>}
                                </div>
                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Lock size={18}/> Senha
                                    </label>
                                    <input type='password' className='cadastro_input'  placeholder='Digite sua senha' {...register("senha")}></input>
                                    {errors.senha && <p>{errors.senha.message}</p>}
                                </div>
                                <div className='edit_label_input'>
                                  <label className='alinhar_itens'>
                                    <IdCard size={18}/> Número do CPF
                                  </label>
                                  <input
                                    type='text'
                                    className='cadastro_input'
                                    placeholder={`Digite seu número de CPF`}
                                    
                                    {...register("documento")}
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
                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Lock size={18}/> Confirmar Senha
                                    </label>
                                    <input type='password' className='cadastro_input' placeholder='Confirme sua senha'  {...register("confirmarSenha")}></input>
                                    {errors.confirmarSenha && <p>{errors.confirmarSenha.message}</p>}
                                </div>
                            </div>
                        </div>

                        <div className='nacionalidade_documento'>
                            <h5>Cargo e Autorização</h5>
                            <hr></hr>
                              <div className='alinhar_content'>
                                <div className='edit_label_input'>
                                  <label className='alinhar_itens'>
                                    <UserCog2 size={18}/> Cargo
                                  </label>
                                  <select 
                                    id='cargo' 
                                    {...register('cargo', { valueAsNumber: true })}
                                    value={dadosFuncionario?.cargo_id || ""} // Define o valor selecionado com base no cargo do funcionário
                                  >
                                    <option value="">Selecione um cargo</option>
                                    {cargos.map(cargo => (
                                      <option key={cargo.id} value={cargo.id}>
                                        {cargo.nome}
                                      </option>
                                    ))}
                                  </select>
                                  {errors.cargo && <p>{errors.cargo.message}</p>}
                                  {erroCargo && <p>Erro ao carregar os cargos</p>}
                                </div>

                                <div className='edit_label_input'>
                                  <label className='alinhar_itens' >
                                    <KeyRound size={18}/>Autorização
                                  </label>
                                  <select id='autorizacao'  placeholder="Selecione o nível de autorização" {...(register('autorizacao'))}>
                                    <option value={"2"} >Autorização Padrão </option>
                                    <option value={"1"}>Controle Total</option>
                                  </select>
                                </div>
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
                                    <input type='text' className='cadastro_input' placeholder='Número de telefone com DDD'  {...register("telefone")}></input>
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
                                    <input type='text' className='cadastro_input' placeholder='Nome da rua' value={dadosEndereco.logradouro} {...register("logradouro")} onChange={() => {}}></input>
                                    {errors.logradouro && <p>{errors.logradouro.message}</p>}
                                </div>

                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <MapPinHouse size={18}/>Número
                                    </label>
                                    <input type='text' className='cadastro_input' placeholder='Número'  {...register("numero")} inputMode='numeric' pattern='[0-9]*'></input>
                                    {errors.numero && <p>{errors.numero.message}</p>}
                                </div>

                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Building size={18}/>Complemento
                                    </label>
                                    <input type='text' className='cadastro_input' placeholder='Apartamento, bloco, etc' {...register("complemento")}></input>
                                </div>

                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Landmark size={18}/> Bairro
                                    </label>
                                    <input type='text' className='cadastro_input' placeholder='Bairro' value={dadosEndereco.bairro} {...register("bairro")} onChange={() => {}}></input>
                                    {errors.bairro && <p>{errors.bairro.message}</p>}
                                </div>

                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Building2 size={18}/>Cidade
                                    </label>
                                    <input type='text' className='cadastro_input' placeholder='Cidade' value={dadosEndereco.localidade} {...register("cidade")} onChange={() => {}}></input>
                                    {errors.cidade && <p>{errors.cidade.message}</p>}
                                </div>

                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <MapPin size={18}/>Estado
                                    </label>
                                    <input type='text' className='cadastro_input' placeholder='Estado' value={dadosEndereco.estado} {...register("estado")} onChange={() => {}}></input>
                                    {errors.estado && <p>{errors.estado.message}</p>}
                                </div>

                                <div className='edit_label_input'>
                                    <label className='alinhar_itens'>
                                        <Flag size={18}/>País
                                    </label>
                                    <input type='text' className='cadastro_input' placeholder='País'  {...register("pais")}></input>
                                    {errors.pais && <p>{errors.pais.message}</p>}
                                </div>

                            </div>
                        </div>
                        <div >
                            {editar == false &&<button type='submit' className='cadastro_button'>Finalizar Cadastro</button>}
                            {editar == true &&<button type='submit' className='cadastro_button'>Salvar Dados</button>}
                        </div>
                    </form>
                </div>

                {alertas && (
                  <div className='modal-overlay'>
                    <div className='modal-alerta'>
                      <p onClick={() => setAlertas(false)}>X</p>
                      <div>
                        <p className='mensagem-alerta'>{mensagem}</p>
                      </div>
                    </div>
                  </div>
                )}

        </>
    )
}

export default CadFuncionario