import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../index.css';

function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-page">
      <Header />
      <div className={`banner ${isVisible ? 'show' : ''}`}>
        <div className="banner-content">
          <h2 className="title-gestao animate-text">Bem-vindo à Presença Digital!</h2>
          <p className="animate-text">Esta é a página inicial do aplicativo, onde os alunos podem marcar sua presença de forma digital!</p>
          <div className="buttons">
            <Link to="/Present">
              <button className="btn">Acessar a Marcação de Presença</button>
            </Link>
            <Link to="/Registration">
              <button className="btn">Realizar Registro</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;