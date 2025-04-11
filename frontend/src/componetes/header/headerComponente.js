import React, { use } from 'react'
import "./header.css"
import { Link, useNavigate } from 'react-router-dom'
import MenuLateral from '../menu_lateral/menuLateral';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react' //import para recuperar dados do back




function HeaderComponente(){

    const navigate = useNavigate();
    const goToLoginPage = () => {
      navigate('/login');
    };

    const location = useLocation()
    const [ mostartButton , setButton] = useState(true)
    useEffect(() => {
        if (location.pathname == "/login"){
            setButton(false)
        }
        else{
            setButton(true)
        }
    }, [location])

  


    return(
        <header>
             <ul class="navbar">
                <li>
                    <div class="logo_nome">
                        <img src='/imagens/logo_white.png' id='logo_img'></img>
                        <h1 class="hotel_name">HOTEL GREEN GARDEN</h1>
                    </div>
                </li>
                <li>
                    <div class="login_menu">
                        {mostartButton && <button id="login_button" onClick={goToLoginPage}>LOGIN</button>}
                        <MenuLateral></MenuLateral>
                    </div>
                </li>
             </ul>
        </header>
    )
}


export default HeaderComponente