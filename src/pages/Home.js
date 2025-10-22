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
  // form: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z", (Não mais usado no botão principal)
  faleConosco: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z", // Ícone de "Mail"
  register: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  contests: "M14.5 11L18 7.5 14.5 4H5v14h9.5v-7zM5 21h14v-2H5v2z"
};

// Estilos específicos da página Home (removidos pois estão no CSS global)
// const pageStyles = { ... };

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
      <header className="bg-beige-gradient" style={{
        textAlign: 'center',
        padding: '80px 20px',
        width: '100%',
      }}>
        <h1 className="global-h1">🏅 Bem-vindo ao Rank.Ou</h1>
        <p className="subtitle" style={{ margin: '0 auto 32px auto' }}>
          Encontre os melhores concursos públicos e alcance seu objetivo
        </p>
        <Link to="/concursos" className="global-button">
          <Icon path={ICONS.contests} style={{ marginRight: '8px' }}/>
          Ver Concursos Recentes
        </Link>
      </header>

      <main className="page-content">
        <div className="container">
          <h2 className="global-h2">Recursos Principais</h2>
          {/* Bootstrap row/cols for responsiveness; keep inline grid as fallback */}
          <div className="row justify-content-center" style={{ marginTop: 8 }}>
            
            <div className="col-sm-12 col-md-6" style={{ marginBottom: 24 }}>
              <FeatureCard 
                index={0} 
                title="Fale Conosco" 
                description="Envie suas dúvidas, sugestões ou solicite um novo ranking." 
                linkTo="/fale-conosco" 
                icon={<Icon path={ICONS.faleConosco} />} 
              />
            </div>

            <div className="col-sm-12 col-md-6" style={{ marginBottom: 24 }}>
              {isLoggedIn ? (
                <FeatureCard 
                  index={1} 
                  title="Meus Concursos" 
                  description="Acesse seu painel para ver os concursos que você já se cadastrou." 
                  linkTo="/dashboard" 
                  icon={<Icon path={ICONS.register} />} 
                />
              ) : (
                <FeatureCard 
                  index={1} 
                  title="Cadastro de Conta" 
                  description="Salve seu histórico e acompanhe múltiplos concursos." 
                  linkTo="/cadastro" 
                  icon={<Icon path={ICONS.register} />} 
                />
              )}
            </div>
            
            {/* Card de Concursos Recentes removido */}

          </div>
        </div>
      </main>
    </>
  );
}

export default Home;