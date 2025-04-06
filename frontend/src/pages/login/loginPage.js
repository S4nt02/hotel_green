import { Link } from 'react-router-dom';

function LoginPage(){
    return(
        <main>
            <h1>estamos na página de login</h1>
            <Link to="/"><h1>Voltar para Home</h1> </Link>
        </main>
    )
}

export default LoginPage