import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// styles moved to src/pages/global.css (CSS variables + utility classes)
import { useAuth } from '../context/AuthContext';

// Ícone SVG genérico
const Icon = ({ path, style }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', ...style }}>
    <path d={path} fill="currentColor" />
  </svg>
);

// Ícones usados na Home
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
    background: 'var(--background-gradient)',
  },
  heroTitle: {
    // using CSS class global-h1 in markup; keep color var here for inline uses
    color: 'var(--text-dark)',
  },
  subtitle: {
    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
    color: 'var(--text-medium)',
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
    color: 'var(--text-dark)',
    marginBottom: '12px',
  },
  cardDescription: {
    fontSize: '1rem',
    color: 'var(--text-medium)',
    lineHeight: '1.5',
  },
};

// Card de recurso principal
const FeatureCard = ({ title, description, linkTo, icon, index }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // small stagger based on index
    const timeout = setTimeout(() => setMounted(true), (index || 0) * 120);
    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <Link to={linkTo} className={`feature-card ${mounted ? 'visible animate' : ''}`} style={{ textDecoration: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="feature-icon" aria-hidden>{icon}</div>
        <div>
          <h3 className="feature-card-title">{title}</h3>
          <p className="feature-card-desc">{description}</p>
        </div>
      </div>
    </Link>
  );
};

function Home() {
  const { isLoggedIn } = useAuth();

  return (
    <>
    <header className="bg-beige-gradient" style={pageStyles.hero}>
      <h1 className="global-h1">🎯 Bem-vindo ao Rank.Ou</h1>
        <p style={pageStyles.subtitle}>
          A sua plataforma completa para simular e acompanhar seu desempenho em concursos públicos.
        </p>
    <Link to="/formulario" className="global-button">
          <Icon path={ICONS.form} style={{ marginRight: '8px' }}/>
          Inserir Meu Gabarito Agora
        </Link>
      </header>

      <main className="page-content">
        <div className="container">
          <h2 className="global-h2">Recursos Principais</h2>
          {/* Bootstrap row/cols for responsiveness; keep inline grid as fallback */}
          <div className="row" style={{ marginTop: 8 }}>
            <div className="col-sm-12 col-md-6 col-lg-4" style={{ marginBottom: 24 }}>
              <FeatureCard index={0} title="Solicitar abertura de ranking" description="Peça para abrir um ranking para um concurso que ainda não está na plataforma." linkTo="/solicitar-ranking" icon={<Icon path={ICONS.ranking} />} />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4" style={{ marginBottom: 24 }}>
              {isLoggedIn ? (
                <FeatureCard index={1} title="Meus Concursos" description="Veja os concursos que você já se cadastrou." linkTo="/meus-concursos" icon={<Icon path={ICONS.register} />} />
              ) : (
                <FeatureCard index={1} title="Cadastro de Conta" description="Salve seu histórico e acompanhe múltiplos concursos." linkTo="/cadastro" icon={<Icon path={ICONS.register} />} />
              )}
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4" style={{ marginBottom: 24 }}>
              <FeatureCard index={2} title="Concursos Recentes" description="Navegue por uma lista de concursos com rankings abertos." linkTo="/concursos" icon={<Icon path={ICONS.contests} />} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;