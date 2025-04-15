import React from 'react';

import { FaBars } from 'react-icons/fa'; 
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { Link, useNavigate } from 'react-router-dom'

import "./menuLateral.css"

function MenuLateral(){

    const [isOpen, setIsOpen] = useState(false)
    const abrirMenu = () => setIsOpen(!isOpen)
    
    let color_menu = "#ffffff"
    if (isOpen == true){
        color_menu = "#8b4513"
    }
    else{
        color_menu = "#ffffff"
    }

    return(
        <>
            <FaBars class="menu" color={color_menu} onClick={abrirMenu}/>

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <ul>
                    <li><a href="/">Acomodações</a></li>
                    <li><a href="/">Reservas</a></li>
                    <li><a href="/">Sobre nós</a></li>
                    <li><a href="/">Sair</a></li>
                </ul>
            </div>
        </>

    )
}

export default MenuLateral