import React, { useEffect, useState, useRef } from 'react';
import "./header.css";
import logoWhite from '../../assets/logo_white.png'
import { useNavigate, useLocation } from 'react-router-dom';
import MenuLateral from '../menu_lateral/menuLateral';

function HeaderComponente() {
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);

  const [mostrarButton, setButton] = useState(true);

  useEffect(() => {
    if (headerRef.current) {
      if (location.pathname === "/login") {
        setButton(false);
        headerRef.current.style.backgroundColor = "transparent";
      } else {
        setButton(true);
        headerRef.current.style.backgroundColor = "#2e8b57";
      }
    }
  }, [location]);

  return (
    <header ref={headerRef} className="padrao_header">
      {mostrarButton && <div className="overlay"></div>}
      <ul className="navbar">
        <li>
          <div className="logo_nome">
            <img src={logoWhite} id='logo_img' alt="logo" />
            <h1 className="hotel_name">HOTEL GREEN GARDEN</h1>
          </div>
        </li>
        <li>
          <div className="login_menu">
            {mostrarButton && (
              <button id="login_button" onClick={() => navigate('/login')}>
                LOGIN
              </button>
            )}
            <MenuLateral />
          </div>
        </li>
      </ul>
    </header>
  );
}

export default HeaderComponente;
