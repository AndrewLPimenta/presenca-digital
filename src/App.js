import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';  // Página inicial
import Present from './pages/Present';    // Página de presença
import Registration from './pages/Registration';  // Página de registro

function App() {
  return (
    <BrowserRouter> {/* Usando BrowserRouter para navegação */}
      <Routes> {/* Definindo as rotas */}
        <Route path="/" element={<HomePage />} /> {/* Página inicial */}
        <Route path="/HomePage" element={<HomePage />} /> {/* Página inicial */}
        <Route path="/Present" element={<Present />} /> {/* Página de presença */}
        <Route path="/Registration" element={<Registration />} /> {/* Página de registro */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
