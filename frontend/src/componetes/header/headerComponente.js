import React from 'react'
import "./header.css"
import { Link, useNavigate } from 'react-router-dom'



function HeaderComponente(){

    const navigate = useNavigate();
    const goToLoginPage = () => {
      navigate('/login');
    };

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
                        <button class="login_button" onClick={goToLoginPage}>LOGIN</button>
                        <button class="menu_button">///</button>
                    </div>
                </li>
             </ul>
        </header>
    )
}


export default HeaderComponente