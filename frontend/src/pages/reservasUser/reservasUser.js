import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate para redirecionamento
import { API_URL } from '../../url';
import entradaImg from '../../assets/entrada_hotel.jpg';
import { useAuth } from '../../context/authContext'; // Importando o contexto
import './reservasUser.css'


import HeaderComponente from '../../componetes/header/headerComponente';
import FazerReserva from '../../componetes/fazerReserva/fazerReserva';
import Rodape from '../../componetes/rodape/rodape';


function ReservasUser () {

    return(
        <>
           <HeaderComponente/>
            <main className='reservar-main'>
                <FazerReserva/>
                
            </main>
           <Rodape/>
        </>
    )
}

export default ReservasUser