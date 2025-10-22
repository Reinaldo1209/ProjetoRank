import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Importe o novo CSS
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isLoggedIn, user, logout, isAdmin } = useAuth();
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
        <Link to="/" className="brand">Rank.Ou?</Link>
        <div className="nav-links">
          <Link to="/concursos" className="nav-link">Concursos</Link>
          
          {isLoggedIn ? (
            // --- Menu Dropdown para Usuário Logado ---
            <div ref={dropdownRef} className="dropdown-wrapper">
              <button
                onClick={() => setOpen(o => !o)}
                className="dropdown-toggle" // Classe própria, não mais um botão
                aria-expanded={open}
              >
                <span>{user?.nome || 'Usuário'}</span>
                <span className={`chev ${open ? 'open' : ''}`} />
              </button>
              <div className={`dropdown-menu ${open ? 'show' : ''}`}>
                <Link to="/dashboard" className="dropdown-item" onClick={() => setOpen(false)}>Meu Painel</Link>
                {isAdmin && (
                  <Link to="/novo-concurso" className="dropdown-item" onClick={() => setOpen(false)}>Cadastrar Concurso</Link>
                )}
                <button className="dropdown-item dropdown-item-logout" onClick={() => { logout(); setOpen(false); navigate('/'); }}>
                  Sair
                </button>
              </div>
            </div>
          ) : (
            // --- Botões para Visitante ---
            <>
              {isAdmin && (
                <Link to="/novo-concurso" className="nav-link-secondary">Cadastrar Concurso</Link>
              )}
              <Link to="/login" className="nav-link-secondary">Login</Link>
              <Link to="/cadastro" className="global-button">Cadastre-se</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;