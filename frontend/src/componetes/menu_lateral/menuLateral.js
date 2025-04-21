import React from 'react';

import { FaBars } from 'react-icons/fa'; 
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { Link, useNavigate, useLocation } from 'react-router-dom'

import "./menuLateral.css"

function MenuLateral(){

    const [isOpen, setIsOpen] = useState(false)
    const abrirMenu = () => setIsOpen(!isOpen)
    const [infosMenu, setInfosMenu] = useState("padrao")
    const location = useLocation()
    
    let color_menu = "#ffffff"
    if (isOpen == true){
        color_menu = "#8b4513"
    }
    else{
        color_menu = "#ffffff"
    }
    useEffect( () => {
        if(location.pathname === "/admin"){
            setInfosMenu('admin')
        }
        else{
            setInfosMenu('')

        }
    }, [] )


    return(
        <>
            <FaBars class="menu" color={color_menu} onClick={abrirMenu}/>

            {infosMenu === "" && <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <ul>
                    <li><a href="/">Acomodações</a></li>
                    <li><a href="/">Reservas</a></li>
                    <li><a href="/">Sobre nós</a></li>
                    <li><a href="/">Sair</a></li>
                </ul>
            </div>}

            {infosMenu === "admin" && <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <ul>
                    <Link to="/funcionario"><li><a>Funcionários</a></li></Link>
                    <li><a href="/">Hospedes</a></li>
                    <li><a href="/">Reservas</a></li>
                    <li><a href="/">Quartos</a></li>
                    <li><a href="/">Itens</a></li>
                    <li><a href="/">Consumo</a></li>
                </ul>
            </div> }
        </>

    )
}

export default MenuLateral