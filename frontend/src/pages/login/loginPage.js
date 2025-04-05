import { Link } from 'react-router-dom';

function loginPage(){
    return(
        <body>
            <h1>estamos na página de login</h1>
            <Link to="/"><h1>Voltar para Home</h1> </Link>
        </body>
    )
}

export default loginPage