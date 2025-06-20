import React from 'react';

import { FaBars } from 'react-icons/fa'; 
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext';


import "./menuLateral.css"
import { API_URL } from '../../url';

function MenuLateral(){
    const {id, autorizacao} = useAuth()
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false)
    const abrirMenu = () => setIsOpen(!isOpen)
    const [infosMenu, setInfosMenu] = useState("")
    const location = useLocation()
    
    let color_menu = "#ffffff"
    if (isOpen == true){
        color_menu = "#8b4513"
    }
    else{
        color_menu = "#ffffff"
    }
    useEffect( () => {
        console.log('menu lateral')
        console.log(id)
        console.log(autorizacao)
        if(autorizacao !== null){
            setInfosMenu('admin')
        }
        else{
            setInfosMenu('')

        }
    }, [] )

    const sair = async () => {
        console.log('chamando sair')
        await  logout(); 
        console.log('logout executado');
      };

    return(
        <>
            <FaBars class="menu" color={color_menu} onClick={abrirMenu}/>

            {infosMenu === "" && <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <ul>
                    <Link to="/acomodacoes"><li>Acomodações</li></Link>
                    <Link to="/reservas"><li>Reservas</li></Link>
                    <Link to="/minhasReservas"><li>Minhas Reservas</li></Link>
                    <li>Sobre nós</li>
                    <li><button onClick={sair}>SAIR</button></li>
                </ul>
            </div>}

            {infosMenu === "admin" && <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <ul>
                    <Link to="/funcionario"><li><a>Funcionários</a></li></Link>
                    <Link to="/hospedes"><li>Hospedes</li></Link>
                    <Link to="/reservasFun"><li>Reservas</li></Link>
                    <Link to="/cadastro_quartos"><li>Quartos</li></Link>
                    <Link to="/ocupacao"><li>Ocupação</li></Link>
                    <Link to="/itens"><li>Itens</li></Link>
                    <Link to="/consumo"><li>Consumo</li></Link>
                    <li><button onClick={sair}>SAIR</button></li>
                </ul>
            </div> }
        </>

    )
}

export default MenuLateral