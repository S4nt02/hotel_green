import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import HeaderComponente from "../../componetes/header/headerComponente"
import { Link } from "react-router-dom";
import { API_URL } from "../../url";
import Rodape from "../../componetes/rodape/rodape"

import "./acomodacoes.css";

function Acomodacoes (){

    const [tpQuartos, setTpQuartos] = useState([])

    const buscarTpQuarto = async () => {
        try{
            const buscarTiposQuartos = await fetch(`${API_URL}/api/buscarTipoQuartos`,)
            const dados = await buscarTiposQuartos.json()

            if(!buscarTiposQuartos.ok){
                
            }

            setTpQuartos(dados)
        }
        catch(erro){
            
        }
    }

    useEffect(() => {
        buscarTpQuarto()
    }, [])

    return(
        <>
           <main>
                <HeaderComponente/>
                <div>
                    <div className="titulo">
                        <h1 className="t1">Catálogo de Acomodações</h1>
                        <p className="t2">Contamos com os melhores quartos e estrutura para atender você e toda sua família</p>
                    </div>
                    {tpQuartos.map(quarto =>(
                        <div key={quarto.id}>                            
                            <div>
                                <Swiper
                                modules={[Navigation]}
                                navigation
                                spaceBetween={10}
                                slidesPerView={1}
                                style={{ width: '300px', height: '300px' }}
                                >
                                {quarto.imagens?.map((url, index) => (
                                    <SwiperSlide key={index}>
                                    <img src={url} alt={`Imagem ${index + 1}`} style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
                                    </SwiperSlide>
                                ))}
                                </Swiper>
                            </div>
                            <div>
                                <h3>{quarto.nomeAcomodacao}</h3>
                                <div>
                                    {quarto.descricao}
                                </div>
                                <div>
                                    <p>Quantidade de adultos-{quarto.quantidade_adultos}</p>
                                    <p>Quantidade de crianças-{quarto.quantidade_criancas}</p>
                                </div>
                                <button>Reservar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <footer>
                <Rodape></Rodape>
            </footer>

            
        </>
    )
}

export default Acomodacoes