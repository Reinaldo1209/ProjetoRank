import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const isAdmin = user?.role && user.role.toLowerCase() === 'admin';
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <header className="header">
      <nav className="global-navbar">
        <Link to="/" className="brand">Eae, Rank.Ou?</Link>
        <div className="nav-links">
          <Link to="/formulario" className="nav-link">Inserir Gabarito</Link>
          <Link to="/ranking" className="nav-link">Ranking</Link>
          <Link to="/concursos" className="nav-link">Concursos</Link>
          {isAdmin && (
            <Link to="/novo-concurso" className="nav-link-cta">Cadastrar Concurso</Link>
          )}
          {!isLoggedIn && (
            <>
              <Link to="/cadastro" className="nav-link-cta">Cadastre-se</Link>
              <Link to="/login" className="nav-link-cta">Login</Link>
            </>
          )}
          {isLoggedIn && (
            <div ref={dropdownRef} className="dropdown-wrapper">
              <button
                onClick={() => setOpen(o => !o)}
                className="nav-link-cta dropdown-toggle"
                aria-expanded={open}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <span>{user?.nome || 'Usuário'}</span>
                <span className={`chev ${open ? 'open' : ''}`} />
              </button>
              <div className={`dropdown-menu ${open ? 'show' : ''}`}>
                <Link to="/dashboard" className="dropdown-item" onClick={() => setOpen(false)}>Perfil</Link>
                {isAdmin && (
                  <Link to="/novo-concurso" className="dropdown-item" onClick={() => setOpen(false)}>Cadastrar Concurso</Link>
                )}
                <button className="dropdown-item" onClick={() => { logout(); setOpen(false); navigate('/'); }}>Sair</button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
