import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/loginPage';
import CadastroPage from './pages/cadastro/cadastroPage';
import PerfilPage from './pages/perfil/perfilPage';
import AdminHome from './pages/admin_home/adminHome';
import FuncionarioPage from './pages/funcionario/funcionarioPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/cadastro' element={<CadastroPage/>}/>
        <Route path='/perfil' element={<PerfilPage/>}/>
        <Route path='/admin' element={<AdminHome/>}/>
        <Route path='/funcionario' element={<FuncionarioPage/>}/>
      </Routes>
   </Router>
  );
}

export default App;
