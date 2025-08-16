import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { globalStyles } from '../pages/globalStyles';
import { useAuth } from '../context/AuthContext';


// Simulação de autenticação (troque por contexto ou lógica real depois)

// ...existing code...



const Header = () => {
  const { isLoggedIn } = useAuth();
  return (
    <header className="header">
      <nav style={globalStyles.navbar}>
        <Link to="/" style={globalStyles.brand}>
          RankSim
        </Link>
        <div style={globalStyles.navLinks}>
          <Link to="/formulario" style={globalStyles.navLink}>Inserir Gabarito</Link>
          <Link to="/ranking" style={globalStyles.navLink}>Ranking</Link>
          <Link to="/concursos" style={globalStyles.navLink}>Concursos</Link>
          {isLoggedIn ? (
            <Link to="/meus-concursos" style={globalStyles.navLinkCta}>Meus Concursos</Link>
          ) : (
            <Link to="/cadastro" style={globalStyles.navLinkCta}>Cadastrar</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
