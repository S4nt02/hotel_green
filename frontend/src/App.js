import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/loginPage';
import CadastroPage from './pages/cadastro/cadastroPage';
import RecoverPage from './pages/recover_senha/recoverPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/cadastro' element={<CadastroPage/>}/>
        <Route path='/recover_senha' element={<RecoverPage/>}/>
      </Routes>
   </Router>
  );
}

export default App;
