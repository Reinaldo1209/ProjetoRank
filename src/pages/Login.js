// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Supondo que globalStyles.js está em ../styles/globalStyles.js
import { PALETTE, globalStyles } from './globalStyles';

// --- ÍCONES (SVG Paths) ---
const ICONS = {
    email: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
    lock: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
    eye: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z",
    eyeOff: "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75C21.27 7.61 17 4.5 12 4.5c-1.25 0-2.44.23-3.53.65l1.99 1.99c.52-.09 1.05-.14 1.54-.14zM2.38 4.21L1.21 5.38l2.27 2.27C2.18 8.99 1.19 10.43 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l2.05 2.05 1.17-1.17L3.55 3.05 2.38 4.21zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
};

// --- ESTILOS DA PÁGINA ---
const pageStyles = {
  loginContainer: {
    ...globalStyles.card,
    maxWidth: '450px',
    margin: '3rem auto',
    padding: '40px',
    textAlign: 'center'
  },
  inputGroup: {
    position: 'relative',
    marginBottom: '1.5rem',
  },
  input: {
    ...globalStyles.inputBase, // Reutiliza estilo do globalStyles
    paddingLeft: '40px', // Espaço para o ícone
  },
  inputFocus: {
    ...globalStyles.inputFocus // Reutiliza estilo do globalStyles
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: PALETTE.textMedium,
    transition: 'color 0.3s ease',
  },
  inputIconFocus: {
    color: PALETTE.primary,
  },
  togglePassword: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: PALETTE.textMedium,
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  forgotLink: {
    fontSize: '0.9rem',
    color: PALETTE.primary,
    textDecoration: 'none',
    fontWeight: '600',
  },
  registerPrompt: {
    marginTop: '2rem',
    color: PALETTE.textMedium,
  }
};

// --- COMPONENTE REUTILIZÁVEL DE INPUT ---
const InputWithIcon = ({ id, type, value, onChange, placeholder, icon, isFocused, onFocus, onBlur }) => (
    <div style={pageStyles.inputGroup}>
        <div style={{...pageStyles.inputIcon, ...(isFocused && pageStyles.inputIconFocus)}}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path d={icon} fill="currentColor" /></svg>
        </div>
        <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onFocus={onFocus}
            onBlur={onBlur}
            style={{...pageStyles.input, ...(isFocused && pageStyles.inputFocus)}}
            required
        />
    </div>
);


function Login() {
  const navigate = useNavigate();
  
  // --- ESTADOS DO COMPONENTE ---
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focus, setFocus] = useState({});

  const handleFocus = (field) => setFocus({ [field]: true });
  const handleBlur = () => setFocus({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      console.log("Autenticando:", { email, senha });
      setIsLoading(false);
      // Após sucesso, redirecionar para a home ou dashboard
      navigate('/'); 
    }, 1500);
  };

  return (
    <div style={globalStyles.pageContent}>
      <div style={pageStyles.loginContainer}>
        <h1 style={{...globalStyles.h1, textAlign: 'center'}}>🔐 Acessar Conta</h1>
        <p style={{marginBottom: '2rem'}}>Use suas credenciais para continuar.</p>

        <form onSubmit={handleSubmit}>
          <InputWithIcon
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={ICONS.email}
              isFocused={focus.email}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
          />

          <div style={pageStyles.inputGroup}>
              <div style={{...pageStyles.inputIcon, ...(focus.senha && pageStyles.inputIconFocus)}}>
                  <svg width="20" height="20" viewBox="0 0 24 24"><path d={ICONS.lock} fill="currentColor" /></svg>
              </div>
              <input
                  id="senha"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  onFocus={() => handleFocus('senha')}
                  onBlur={handleBlur}
                  style={{...pageStyles.input, ...(focus.senha && pageStyles.inputFocus)}}
                  required
              />
              <div style={pageStyles.togglePassword} onClick={() => setShowPassword(!showPassword)}>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                      <path d={showPassword ? ICONS.eyeOff : ICONS.eye} fill="currentColor" />
                  </svg>
              </div>
          </div>

          <div style={pageStyles.actions}>
              <Link to="/recuperar-senha" style={pageStyles.forgotLink}>Esqueceu a senha?</Link>
          </div>
          
          <button 
            type="submit" 
            style={isLoading ? globalStyles.buttonDisabled : globalStyles.button} 
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={pageStyles.registerPrompt}>
          Não tem uma conta? <Link to="/cadastro" style={pageStyles.forgotLink}>Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;