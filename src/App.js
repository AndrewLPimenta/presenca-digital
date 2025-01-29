import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';  // Página inicial
import Present from './pages/Present';    // Página de presença
import Registration from './pages/Registration';  // Página de registro

function App() {
  return (
    <Router> {/* Envolvendo o conteúdo com Router para habilitar a navegação */}
      <Routes> {/* Usando Routes ao invés de Switch (para React Router v6+) */}
      <Route path="/HomePage" element={<HomePage />} /> {/* Página inicial */}
        <Route path="/Present" element={<Present />} /> {/* Página de presença */}
        <Route path="/Registration" element={<Registration />} /> {/* Página de registro */}
      </Routes>
    </Router>
  );
}

export default App;
