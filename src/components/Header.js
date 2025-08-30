import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { globalStyles } from '../pages/globalStyles';
import { useAuth } from '../context/AuthContext';


// Simulação de autenticação (troque por contexto ou lógica real depois)

// ...existing code...



const Header = () => {
  const { isLoggedIn, user } = useAuth();
  return (
    <header className="header">
      <nav style={globalStyles.navbar}>
        <Link to="/" style={globalStyles.brand}>
          Rank.Ou
        </Link>
        <div style={globalStyles.navLinks}>
          <Link to="/formulario" style={globalStyles.navLink}>Inserir Gabarito</Link>
          <Link to="/ranking" style={globalStyles.navLink}>Ranking</Link>
          <Link to="/concursos" style={globalStyles.navLink}>Concursos</Link>
          {!isLoggedIn && (
            <>
              <Link to="/cadastro" style={globalStyles.navLinkCta}>Cadastre-se</Link>
              <Link to="/login" style={globalStyles.navLinkCta}>Login</Link>
            </>
          )}
          {isLoggedIn && (
            <span style={{ ...globalStyles.navLinkCta, cursor: 'default' }}>{user?.nome || 'Usuário'}</span>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
