import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/loginPage';
import CadastroPage from './pages/cadastro/cadastroPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />s
        <Route path='/cadastro' element={<CadastroPage/>}/>
      </Routes>
   </Router>
  );
}

export default App;
