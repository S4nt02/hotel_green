import { Link } from 'react-router-dom';

function homePage(){
    return(
        <div>
            Teste conexão com o banco de dados<br></br>
            <div>
                
            </div>
            <div>
                <Link to="/login"><h1>ir para página de login</h1></Link>
            </div>
        </div>
    )
}

export default homePage