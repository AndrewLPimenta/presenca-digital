import React, { useState } from "react";
import "../index.css";
import { Link } from 'react-router-dom';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    // Função que alterna o estado do menu
    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <div className="home-page">
            <nav>
                {/* Links visíveis no desktop */}
                <div className="links">
                    <Link className="links-nav" to=".././Present">Presença</Link>
                    <Link className="links-nav" to=".././HomePage">Home</Link>
                    <Link className="links-nav" to=".././Registration">Registro</Link>
                </div>

                {/* Menu hambúrguer visível no mobile */}
                <div className="burger-container">
                    {/* Remove o checkbox e usa o clique para alternar o estado */}
                    <label className="burger" onClick={toggleMenu}>
                        <span className={`bar ${menuOpen ? "open" : ""}`}></span>
                        <span className={`bar ${menuOpen ? "open" : ""}`}></span>
                        <span className={`bar ${menuOpen ? "open" : ""}`}></span>
                    </label>

                    {/* Links do menu que aparecem quando o hambúrguer é clicado */}
                    <div className={`burger-links ${menuOpen ? 'open' : 'closed'}`}>
                        <Link className="links-nav" to=".././Present">Presença</Link>
                        <Link className="links-nav" to=".././HomePage">Home</Link>
                        <Link className="links-nav" to=".././Registration">Registro</Link>
                        <Link className="links-nav" to="/">Desenvolvido por Andrew </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
}
