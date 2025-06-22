import { useEffect, useState } from "react"
import { API_URL } from "../../url"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useAuth } from "../../context/authContext";
import { Link } from "react-router-dom";
import CadNovoUsuario from "../cadNovoUsuario/cadNovoUsuario";
import "./fazerReservaFun.css";

function FazerRservaFun () {


    const [nomeUser , setNomeUser ] = useState("")
    const [telaExibida, setTelaExibida] = useState(1);
    const [tpQuartos, setDadosTpQuarto] = useState([]);
    const [unidades, setUnidades] = useState([]);

    const hoje = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    const [checkIn, setCheckIn] = useState(hoje);
    const [checkOut, setCheckOut] = useState("");
    const [unidadeBuscar, setUnidadeBuscar] = useState("");
    const [exibirTpQuartos, setExibirTpQuartos] = useState([]);
    const [acomodacoesDisponiveis, setAcomodacoesDisp] = useState([]);
    const [tpQuartoSelecionado, setTpQuartoSelecionado] = useState([]);
    const [periodo, setPeriodo] = useState([]);
    const [acompanhantesAdultos, setAcompanhantesAdultos] = useState([]);
    const [acompanhantesCriancas, setAcompanhantesCriancas] = useState([]);
    const [erroMensage, setMensageErro] = useState("");
    const [reservaFeita, setReservaFeita] = useState(false);

    const [abrirModalPesquisar , setAbrirModalPesquisar] = useState(false)

    const [documento, setDocumento] = useState("")
    const [usuariosConsulta, setUsuariosConsulta] = useState([])
    const [modalNovoUsuario, setModalNovoUsuario] = useState(false)
    const [idHospede, setIdHospede] = useState("")

    const buscarTpQuarto = async () => {
    try {
        const buscarTiposQuartos = await fetch(`${API_URL}/api/buscarTipoQuartos`);
        const dados = await buscarTiposQuartos.json();

        setDadosTpQuarto(dados);
        setExibirTpQuartos(dados);
    } catch (erro) {
        console.error("Erro ao buscar tipos de quarto:", erro);
    }
    };

    const buscarUnidade = async () => {
        try {
            const buscarUnidade = await fetch(`${API_URL}/api/buscarUnidade`);
            const dados = await buscarUnidade.json();

            setUnidades(dados);
        } catch (erro) {
            console.error("Erro ao buscar unidades:", erro);
        }
    };

    const buscarAcomodacoesDisp = async () => {
        const parametros = {
            checkIn,
            checkOut,
            unidade: unidadeBuscar,
        };

        try {
            const buscarDisp = await fetch(`${API_URL}/api/quartosDisponiveis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parametros),
            });

            const dados = await buscarDisp.json();

            setAcomodacoesDisp(dados.acomodacoesDisponiveis);

            // Corrigido: exibe tipos de quarto disponíveis, com ou sem unidade selecionada
            if (tpQuartos.length > 0) {
            // Primeiro filtra pelos disponíveis na data
            let tiposFiltrados = tpQuartos.filter(tpQuarto =>
                dados.tpAcomodacao.includes(tpQuarto.id)
            );

            // Depois, se unidade estiver definida, refina o filtro
            if (unidadeBuscar && unidadeBuscar !== "") {
                tiposFiltrados = tiposFiltrados.filter(tpQuarto =>
                String(tpQuarto.unidade_hotel) === String(unidadeBuscar)
                );
            }

            setExibirTpQuartos(tiposFiltrados);
            } else {
            console.warn("tpQuartos ainda está vazio no momento do filtro.");
            }

        } catch (erro) {
            console.error("Erro ao buscar acomodações:", erro);
        }
    };

    const setTpQuartoInfos = (id) => {
        const quartoInfo = exibirTpQuartos.find(tpQuarto => tpQuarto.id === id);
        setTpQuartoSelecionado(quartoInfo); // quartoInfo será um objeto
        calcularDiferencaDias(checkIn, checkOut);
        setAcompanhantesAdultos(Array(quartoInfo.quantidade_adultos).fill(""));
        setAcompanhantesCriancas(Array(quartoInfo.quantidade_criancas).fill(""));
    };

    const calcularDiferencaDias = (checkIn, checkOut) => {
        const dataInicial = new Date(checkIn);
        const dataFinal = new Date(checkOut);

        dataInicial.setHours(0, 0, 0, 0);
        dataFinal.setHours(0, 0, 0, 0);

        const diferencaEmMs = dataFinal.getTime() - dataInicial.getTime();
        const diferencaEmDias = Math.floor(diferencaEmMs / (1000 * 60 * 60 * 24));

        setPeriodo(diferencaEmDias);
    };

    const confirmarReserva = async () => {

        const dados = {
            checkIn,
            checkOut,
            periodo,
            unidade: unidadeBuscar,
            tpAcomodacao: tpQuartoSelecionado.id,
            vlDiaria: tpQuartoSelecionado.vlDiaria,
            id_hospede: idHospede,
            acompanhantesAdultos,
            acompanhantesCriancas,
        };

        try {
            const confirmarReserva = await fetch(`${API_URL}/api/confirmarReserva`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
            });

            const dadosReserva = await confirmarReserva.json();

            if (dadosReserva.message) {
            // poderia exibir mensagem ou tratar erro
            }

            setReservaFeita(true);
        } catch (erro) {
            console.error("Erro ao confirmar reserva:", erro);
        }
    };

    const avancar = () => {
    if (tpQuartoSelecionado.length !== 0) {
        setTelaExibida(2);
    } else {
        setMensageErro("Por favor selecione um tipo de acomodação");
    }
    };

    useEffect(() => {
    buscarTpQuarto();
    buscarUnidade();
    }, []);

    useEffect(() => {
    if (checkIn && checkOut) {
        buscarAcomodacoesDisp();
    } else {
        setAcomodacoesDisp([]);
        setExibirTpQuartos([]);
    }
    }, [checkIn, checkOut, unidadeBuscar]);



    const buscarUsuario = async () => {
        try{
            const buscar = await fetch(`${API_URL}/api/buscarUsuario`, {
                method : 'POST',
                headers : { 'Content-Type' : 'application/json'},
                body : JSON.stringify({documento})
            })

            const dados = await buscar.json()
            setUsuariosConsulta(dados)
        }
        catch{

        }
    }


    const selecionarUsuario = (id, nome) => {
        setNomeUser(nome)
        setIdHospede(id)
        setAbrirModalPesquisar(false)
    }

    return(
        <>
            {telaExibida === 1 &&(
                // tela de seleção dos valores
                <>
                    <div className="card_reservas">
                        <h1>Informações</h1>
                        <label>Unidade</label>
                        <select value={unidadeBuscar} onChange={(e) => setUnidadeBuscar(e.target.value)}>
                            <option value={''}>Selecione uma unidade</option>
                            {unidades.map(unidade =>(
                                <option key={unidade.id} value={unidade.id}>{unidade.nomeUnidade}</option>
                            ))}
                        </select>                        
                        <label>Check-in</label>
                        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}></input>
                        <label>Check-out</label>
                        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}></input>

                    </div>
                    <div className="tipos_reservas">
                        <h1>Tipos de Acomodoções</h1>
                        <div className="alinhar_cards">
                            {exibirTpQuartos.length > 0 ? (
                                <>
                                    {exibirTpQuartos.map(tpQuarto =>(
                                        <div key={tpQuarto.id} className="card_tiposReserva">
                                            <div className="alinhar_reservas">
                                               <h3>{tpQuarto.nomeAcomodacao}</h3>
                                                <div className="carrossel_reservas">
                                                    <Swiper
                                                     modules={[Navigation]}
                                                     navigation
                                                     spaceBetween={10}
                                                     slidesPerView={1}
                                                     style={{ width: '300px', height: '300px' }}
                                                    >
                                                     {tpQuarto.imagens?.map((url, index) => (
                                                    <SwiperSlide key={index}>
                                                    <img src={url} alt={`Imagem ${index + 1}`} style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
                                                    </SwiperSlide>
                                                     ))}
                                                    </Swiper>
                                                </div>
                                                <button onClick={() => setTpQuartoInfos(tpQuarto.id)}>Selecionar</button> 
                                            </div>
                                            
                                        </div>
                                        
                                    ))} 
                                </>
                            ) : (
                                <>
                                    <p>Sem acomodações disponiveis para essa unidade nesta data</p>
                                </>
                            )}

                            
                        </div>
                    </div>
                    <div className="button_inferior">
                        <button onClick={avancar}>Avançar</button>
                    </div>
                </>
            )}

            {telaExibida === 2 &&(
                //tela de confirmaçao de informações
                <>
                    <div className="card_infos">
                        <h1>Confirmar Reservas</h1>
                        <h3>Revise os detalhes de sua reserva antes de confirmar</h3>
                        <div className="alinhar_infos_1">
                            <p>Unidade: {unidades.find(unidade => String(unidade.id) === String(unidadeBuscar))?.nomeUnidade}</p>
                            <p>Check-in: {checkIn}</p>
                            <p>Check-out: {checkOut}</p>
                            <p>Período: {periodo} noites </p>
                            <p>Acomodação: {tpQuartoSelecionado.nomeAcomodacao}</p>
                            <p>Diaria: {tpQuartoSelecionado.vlDiaria}</p>
                            <div>
                                <p>Informações Adicionais</p>
                                <p>* O check-In deve ser realizado após as 12:00 hrs</p>
                                <p>* O check-Out deve ser realizado até as 12:00 hrs</p>
                                <p>* O cancelamento da reserva pode ser feito até 12 horas antes do horário de ínicio da realização do chec-in, cancelamentos após esse limite será cobrada uma taxa de multa pelo cancelamento</p>
                            </div>
                            <div className="alinhar_infos_2">
                                <div className="pesquisa_usu">
                                    <h2>Hospede Principal: {nomeUser} </h2>
                                    <button onClick={() => setAbrirModalPesquisar(true)}>Pesquisar Usuario</button>
                                </div>


                                <div className="alinhamento_principal">
                                    <h4>Acompanhantes</h4>
                                    {tpQuartoSelecionado.quantidade_adultos > 1 && (
                                        <>
                                            <div className="alinhar_infos_3">
                                                <label>Adultos</label>
                                                {[...Array(tpQuartoSelecionado.quantidade_adultos)].map((_, index) =>(
                                                    <input type="text" placeholder={`Acompanhante ${index + 1}`}
                                                        value={acompanhantesAdultos[index] || ""}
                                                        onChange={(e) => {
                                                            const novoAcompanhantes = [...acompanhantesAdultos]
                                                            novoAcompanhantes[index] = e.target.value
                                                            setAcompanhantesAdultos(novoAcompanhantes)
                                                        }}
                                                    ></input>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                    {tpQuartoSelecionado.quantidade_criancas > 0 && (
                                        <>
                                            <div className="alinhar_infos_3">
                                                <label>Crianças</label>
                                                 {[...Array(tpQuartoSelecionado.quantidade_criancas)].map((_, index) =>(
                                                    <input type="text" placeholder={`Criança ${index + 1}`}
                                                        value={acompanhantesCriancas[index] || ""}
                                                        onChange={(e) => {
                                                            const novoAcompanhantes = [...acompanhantesCriancas]
                                                            novoAcompanhantes[index] = e.target.value
                                                            setAcompanhantesCriancas(novoAcompanhantes)
                                                        }}
                                                    ></input>
                                                 ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="button_infos">
                            <button onClick={() => setTelaExibida(1)}>Voltar</button>
                            <button onClick={confirmarReserva}>Confirmar Reservas</button>
                        </div>
                    </div>
                </>
            )}

            {reservaFeita && (
                <>
                    <div className="overlay-reservas" onClick={() => setReservaFeita(false)}>
                        <div className="reservaFeita">
                            <p>Reserva Realizada com sucesso</p>
                        </div>
                    </div>
                </>
            )}

            {abrirModalPesquisar && (
                <>
                    <div className="overlay">
                        <div className="alert-modal">
                            <h3 onClick={() => setAbrirModalPesquisar(false)}>X</h3>
                            <div>
                                <label>Pesquise pelo número do documento(RG/CPF)</label>
                                <input onChange={(e) => setDocumento(e.target.value)}></input>
                                <button onClick={buscarUsuario}>Buscar</button>                                
                            </div>
                            <div>
                                {usuariosConsulta.map(usuario => (
                                    <div key={usuario.id}>
                                        <p>Nome: {usuario.nome}</p>
                                        <p>Documento: {usuario.documento}</p>
                                        <p>email:{usuario.email}</p>
                                        <p>telefone:{usuario.telefone}</p>
                                        <button onClick={() => selecionarUsuario(usuario.id, usuario.nome)}>Selecionar Usuario</button>
                                    </div>
                                ))}
                                <div>
                                    <button onClick={() => (setModalNovoUsuario(true), setAbrirModalPesquisar(false))}>Cadastar novo usuário</button>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </>
            )}

            {modalNovoUsuario && (
                <>
                    <div className="overlay">
                        <div className="alert-modal">
                            <p onClick={() => setModalNovoUsuario(false)}>X</p>
                            <CadNovoUsuario/>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default FazerRservaFun