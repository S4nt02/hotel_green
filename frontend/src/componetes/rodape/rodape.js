import "./rodape.css";
import React from "react";
import { Link } from 'react-router-dom'; //import para usar rotas

function Rodape(){
    return(
        <>
            <footer class="rodape">
                Rede de Hotéis
                <div class="rede-hoteis">
                    <ul>
                        <li>Gramado</li>
                        <li>Email: gramado.greengarden.com</li>
                        <li>Tel: 1234-4561</li>
                    </ul>
                    <ul>
                        <li>Canoas</li>
                        <li>Email: canoas.greengarden.com</li>
                        <li>Tel: 1234-4562</li>
                    </ul>
                    <ul>
                        <li>Santa Maria</li>
                        <li>Email: santam.greengarden.com</li>
                        <li>Tel: 1234-4563</li>
                    </ul>
                    <ul>
                        <li>Pelotas</li>
                        <li>Email: gramado.greengarden.com</li>
                        <li>Tel: 1234-4564</li>
                    </ul>
                </div>
                <div class="direitos">
                    Copyright © 2025–2025 GreenGarden.com™. Todos os direitos reservados.
                </div>
            </footer>
        </>
    )
}

export default Rodape