import React from 'react'
import { Link } from 'react-router-dom';

///////////////////////IMPORT DOS COMPONENTES + CSS//////////////////////////////
import "./login.css"
import HeaderComponente from '../../componetes/header/headerComponente';
//////////////////////////////////////////////////////////////////////////

function LoginPage(){
    return(
        <main>
            <HeaderComponente></HeaderComponente>
            <h1>estamos na página de login</h1>
            <Link to="/"><h1>Voltar para Home</h1> </Link>
        </main>
    )
}

export default LoginPage