import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PALETTE, globalStyles } from './globalStyles'; // Importa os estilos

// Ícones (pode movê-los para um arquivo separado como `src/components/Icons.js` no futuro)
const Icon = ({ path, style }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', ...style }}>
    <path d={path} fill="currentColor" />
  </svg>
);
const ICONS = {
  form: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
  ranking: "M16 11V3H8v8l-2.5 2.5 1.41 1.41L12 10.83l5.09 5.09L18.5 13.5 16 11zM4 21h16v-2H4v2z",
  register: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  contests: "M14.5 11L18 7.5 14.5 4H5v14h9.5v-7zM5 21h14v-2H5v2z"
};

// Estilos específicos da página Home
const pageStyles = {
  hero: {
    textAlign: 'center',
    padding: '80px 20px',
    width: '100%',
    background: PALETTE.backgroundGradient, // Usa a paleta global
  },
  heroTitle: {
    ...globalStyles.h1, // Reutiliza o estilo de H1
    color: PALETTE.textDark, // Pode sobrescrever se necessário
  },
  subtitle: {
    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
    color: PALETTE.textMedium,
    marginBottom: '12px',
    fontWeight: '400',
    maxWidth: '650px',
    margin: '0 auto 32px auto',
    lineHeight: '1.6',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px',
  },
  cardTitle: {
    fontSize: '1.5rem',
    color: PALETTE.textDark,
    marginBottom: '12px',
  },
  cardDescription: {
    fontSize: '1rem',
    color: PALETTE.textMedium,
    lineHeight: '1.5',
  },
};

const FeatureCard = ({ title, description, linkTo, icon }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardStyle = {
    ...globalStyles.card, // Estilo base do card
    ...(isHovered ? globalStyles.cardHover : {}), // Efeito de hover
  };

  return (
    <Link to={linkTo} style={cardStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div style={{ color: PALETTE.primary, marginBottom: '16px' }}>{icon}</div>
      <h3 style={pageStyles.cardTitle}>{title}</h3>
      <p style={pageStyles.cardDescription}>{description}</p>
    </Link>
  );
};

function Home() {
  const [isHovered, setIsHovered] = useState(false);
  // 1. Componente Navbar
const Navbar = () => (
  <nav style={globalStyles.navbar}>
    <Link to="/" style={globalStyles.brand}>
      <Icon path={ICONS.logo} />
      RankSim
    </Link>
    <div style={globalStyles.navLinks}>
      <Link to="/formulario" style={globalStyles.navLink}>Inserir Gabarito</Link>
      <Link to="/ranking" style={globalStyles.navLink}>Ranking</Link>
      <Link to="/concursos" style={globalStyles.navLink}>Concursos</Link>
      <Link to="/cadastro" style={globalStyles.navLinkCta}>Cadastrar</Link>
    </div>
  </nav>
);


  return (
    // Note que não há mais o container da página aqui, pois ele será gerenciado pelo App.js
    <>
            <Navbar />

      <header style={pageStyles.hero}>
        <h1 style={pageStyles.heroTitle}>🎯 Bem-vindo ao RankSim</h1>
        <p style={pageStyles.subtitle}>
          A sua plataforma completa para simular e acompanhar seu desempenho em concursos públicos.
        </p>
        <Link 
            to="/formulario" 
            style={{ ...globalStyles.button, ...(isHovered ? globalStyles.buttonHover : {}) }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
          <Icon path={ICONS.form} style={{ marginRight: '8px' }}/>
          Inserir Meu Gabarito Agora
        </Link>
      </header>

      <main style={globalStyles.pageContent}>
        <h2 style={globalStyles.h2}>Recursos Principais</h2>
        <div style={pageStyles.featuresGrid}>
          <FeatureCard title="Rankings Dinâmicos" description="Veja sua colocação em tempo real." linkTo="/ranking" icon={<Icon path={ICONS.ranking} />} />
          <FeatureCard title="Cadastro de Conta" description="Salve seu histórico e acompanhe múltiplos concursos." linkTo="/cadastro" icon={<Icon path={ICONS.register} />} />
          <FeatureCard title="Concursos Recentes" description="Navegue por uma lista de concursos com rankings abertos." linkTo="/concursos" icon={<Icon path={ICONS.contests} />} />
        </div>
      </main>
    </>
  );
}

export default Home;