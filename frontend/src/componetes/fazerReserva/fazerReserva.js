import { useEffect, useState } from "react"
import { API_URL } from "../../url"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useAuth } from "../../context/authContext";

function FazerReserva () {

    const {id, autorizacao, nomeUser} = useAuth()
    const [telaExibida, setTelaExibida] = useState(1)
    const [tpQuartos, setDadosTpQuarto] = useState([])
    const [unidades, setUnidades] = useState([])
    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")
    const [unidadeBuscar, setUnidadeBuscar] = useState()
    const [exibirTpQuartos, setExibirTpQuartos] = useState([])
    const [acomodacoesDisponiveis, setAcomodacoesDisp] = useState([])
    const [tpQuartoSelecionado, setTpQuartoSelecionado] = useState([])

    const buscarTpQuarto = async () => {
        try{
            const buscarTiposQuartos = await fetch(`${API_URL}/api/buscarTipoQuartos`)
            const dados = await buscarTiposQuartos.json()

            if(!buscarTiposQuartos.ok){
                
            }

            setDadosTpQuarto(dados)
            setExibirTpQuartos(dados)
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

        // Aguarda o tpQuartos estar carregado
        if (tpQuartos.length > 0) {
        const tiposFiltrados = tpQuartos.filter(tpQuarto =>
            dados.tpAcomodacao.includes(tpQuarto.id) &&
            String(tpQuarto.unidade_hotel) === String(unidadeBuscar)
        );
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
        console.log(tpQuartoSelecionado)
    }



    useEffect(() => {
        buscarTpQuarto();
        buscarUnidade();
    },[])

    useEffect(() => {
        if (checkIn || checkOut || unidadeBuscar) {
            buscarAcomodacoesDisp();
        } else {
            // Se quiser, limpa os estados quando algum parâmetro estiver vazio
            setAcomodacoesDisp([]);
            setExibirTpQuartos([]);
        }
    }, [checkIn, checkOut, unidadeBuscar]);



    return(
        <>
            {telaExibida === 1 &&(
                // tela de seleção dos valores
                <>
                    <div>
                        //dados de check-in check-out unidade adultos e crianças
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
                        <label>Unidade</label>

                    </div>
                    <div>
                        //exibição dos tipos de quartos
                        
                        <div>
                            {exibirTpQuartos.map(tpQuarto =>(
                                <div key={tpQuarto.id}>
                                    <h3>{tpQuarto.nomeAcomodacao}</h3>
                                    <div>
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
                                
                            ))}
                            
                        </div>
                    </div>
                    <div>
                        <button onClick={() => setTelaExibida(2)}>Avançar</button>
                    </div>
                </>
            )}

            {telaExibida === 2 &&(
                //tela de confirmaçao de informações
                <>
                    <div>
                        <h3>Confirmar Reservas</h3>
                        <p>Revise os detalhes de sua reserva antes de confirmar</p>
                        <div>
                            <p>Uunidade: {unidadeBuscar}</p>
                            <p>Check-in: {checkIn}</p>
                            <p>Check-out: {checkOut}</p>
                            <p>Período: {parseInt(checkOut - checkIn)}noites </p>
                            <p>Acomodação: {tpQuartoSelecionado.nomeAcomodacao}</p>
                            <p>Diaria: {tpQuartoSelecionado.vlDiaria}</p>
                            <div>
                                <p>Hospede: {nomeUser}</p>
                                <div>
                                    <p>Acompanhantes</p>
                                    {tpQuartoSelecionado.quantidade_adultos > 1 && (
                                        <>
                                            <div>
                                                <label>Adultos</label>
                                                {[...Array(tpQuartoSelecionado.quantidade_adultos)].map((_, index) =>(
                                                    <input type="text" placeholder={`Acompanhante ${index + 1}`}></input>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                    {tpQuartoSelecionado.quantidade_criancas > 0 && (
                                        <>
                                            <div>
                                                <label>Crianças</label>
                                                 {[...Array(tpQuartoSelecionado.quantidade_criancas)].map((_, index) =>(
                                                    <input type="text" placeholder={`Criança ${index + 1}`}></input>
                                                 ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <button onClick={() => setTelaExibida(1)}>Voltar</button>
                            <button>Confirmar Reservas</button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default FazerReserva