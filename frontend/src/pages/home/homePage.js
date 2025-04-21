import React from 'react'
import { Link } from 'react-router-dom'; //import para usar rotas
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { API_URL } from '../../url';
import conteudo_1 from '../../assets/conteudo_1.jpg'
import conteudo_2 from '../../assets/conteudo_2.jpg'
import conteudo_3 from '../../assets/conteudo_3.jpg'
import entradaImg from '../../assets/entrada_hotel.jpg'
import fachada from '../../assets/entrada_hotel.jpg'

///////////////////////IMPORT DOS COMPONENTES + CSS//////////////////////////////
import "./home.css"
import HeaderComponente from '../../componetes/header/headerComponente';
import Rodape from '../../componetes/rodape/rodape';
//////////////////////////////////////////////////////////////////////////


function HomePage() {

  return(
    <>
        <main className="pagina">
          <HeaderComponente></HeaderComponente>

          <div class = "corpo_central" style={{ backgroundImage: `url(${entradaImg})` }}>
            <div className="over"></div>
            <h1>Hospede-se na melhor rede de hotéis do mundo !</h1>
            <h4>Nossos hotéis contam com uma ampla variedade de diversões
              e entretenimento para você e sua família !</h4>
          </div>
          <hr/>
          <div class = "conteudo1_hotel">
             <img src={conteudo_1} id='conteudo1_img' alt="logo"/>
            <h3>A Green Garden é uma rede hoteleira comprometida com a excelência em hospitalidade, aliando conforto, sofisticação e atendimento personalizado. 
              Com unidades estrategicamente localizadas em [principais cidades/estados], atendemos tanto o público corporativo quanto o turístico, oferecendo uma 
              estrutura completa e adaptada às diferentes necessidades dos hóspedes.
              Cada uma de nossas unidades conta com acomodações modernas, espaços para eventos, restaurantes de alta qualidade e serviços adicionais pensados 
              para proporcionar uma experiência única. Nosso diferencial está na atenção aos detalhes, no cuidado com o bem-estar de cada cliente e no compromisso 
              com a sustentabilidade e inovação no setor hoteleiro.
              Acreditamos que a hospitalidade vai além da hospedagem — ela está na forma como recebemos, acolhemos e surpreendemos nossos clientes. É com essa 
              visão que seguimos expandindo, construindo uma marca sólida e confiável no mercado.
              Estamos sempre abertos a novas conexões e parcerias que possam contribuir para o crescimento mútuo e a geração de valor para todos os envolvidos.
            </h3>
          </div>
          <hr/>
          <div class = "conteudo2_hotel">
            <h3>A Green Garden oferece soluções inteligentes e flexíveis em hospedagem corporativa, com foco na praticidade, economia e qualidade de atendimento. 
              Pensando na rotina dinâmica das empresas e de seus colaboradores, disponibilizamos condições especiais, como tarifas corporativas, planos de pagamento 
              facilitados, serviços personalizados e suporte dedicado para reservas em grupo.
              Nossas unidades estão localizadas em pontos estratégicos, próximas a centros empresariais, aeroportos e rodovias, garantindo fácil acesso e comodidade. 
              Além disso, contamos com salas de reunião, espaços para eventos e todos os recursos necessários para a realização de encontros corporativos de pequeno, 
              médio e grande porte.
              Ao firmar uma parceria conosco, sua empresa terá a tranquilidade de contar com uma rede preparada para oferecer hospitalidade de alto nível, aliada à 
              agilidade e profissionalismo. Estamos prontos para personalizar nossas soluções de acordo com as demandas da sua equipe, tornando cada estadia uma experiência 
              produtiva e agradável.
              Gostaríamos de agendar uma apresentação e explorar as possibilidades de colaboração entre nossas marcas.
            </h3>
            <img src={conteudo_2} id='conteudo2' alt="logo"/>
          </div>
          <hr/>
          <div class = "conteudo3_hotel">
             <img src={conteudo_3} id='conteudo3' alt="logo"/>
            <h3>A Green Garden valoriza parcerias estratégicas com agências de turismo, marketing e criadores de conteúdo que compartilhem de nossos valores e visão de hospitalidade. 
              Buscamos estabelecer colaborações autênticas que fortaleçam a presença da nossa marca em diferentes canais, promovendo nossos hotéis de maneira criativa e relevante.
              Temos interesse em desenvolver ações como press trips, experiências de hospedagem com cobertura digital, campanhas de conteúdo, descontos exclusivos para seguidores e muito mais. 
              Para isso, procuramos parceiros com sinergia com nosso público-alvo — viajantes que buscam qualidade, conforto e experiências memoráveis.
              Também estamos abertos a modelos de parceria com agências de viagens, operadoras e marketplaces do setor, oferecendo comissões diferenciadas, 
              treinamentos e suporte para garantir uma relação comercial duradoura e produtiva.
              Acreditamos que parcerias bem construídas geram resultados positivos para todos e proporcionam experiências enriquecedoras tanto para os hóspedes quanto 
              para os parceiros envolvidos. Estamos à disposição para conversar e desenvolver propostas personalizadas.
            </h3>
          </div>
          <hr/>
          <div class = "sobre">
          <img src={fachada} id='fachada_img' alt="logo"/>
            <h3>Na Green Garden, acreditamos que hospitalidade vai além da hospedagem. Somos uma rede de hotéis comprometida em oferecer experiências memoráveis, 
              combinando conforto, sofisticação e uma conexão genuína com a natureza.
              Com unidades estrategicamente localizadas em destinos urbanos e paradisíacos, buscamos proporcionar o equilíbrio perfeito entre bem-estar e praticidade. 
              Nossos espaços são pensados para encantar todos os perfis de hóspedes — do viajante corporativo ao turista em busca de lazer.
              Cada hotel da Green Garden é único, mas todos compartilham a mesma essência: um ambiente acolhedor, serviços personalizados e uma estrutura moderna, 
              rodeada de áreas verdes cuidadosamente preservadas. Valorizamos a sustentabilidade em cada detalhe, promovendo ações que respeitam o meio ambiente e 
              contribuem para um futuro mais verde.
              Nosso time é apaixonado por receber bem. Estamos sempre prontos para surpreender, cuidar e criar momentos inesquecíveis para quem escolhe estar conosco.
              Green Garden. Onde conforto e natureza se encontram.</h3> 
          </div>
          <hr/>
          <Rodape></Rodape>
        </main>
        
    </>
  )
}
  
export default HomePage;
  