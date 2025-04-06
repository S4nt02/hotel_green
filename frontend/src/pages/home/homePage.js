import { Link } from 'react-router-dom';

function HomePage() {
    return (
      <div>
        Teste conexão com o banco de dados<br />
        <div>
          {/* Aqui você pode colocar mais conteúdo depois */}
        </div>
        <div>
          <Link to="/login"><h1>ir para página de login</h1></Link>
        </div>
      </div>
    );
  }
  
  export default HomePage;
  