// --- PALETA DE CORES OFICIAL DO PROJETO ---
export const PALETTE = {
  primary: '#7C5C3B',      // O marrom principal
  primaryDark: '#5D452C',   // Um tom mais escuro para hover/links
  backgroundLight: '#FDFBF8', // Um fundo de cor creme/bege muito claro
  backgroundGradient: 'linear-gradient(170deg, #FDFBF8 0%, #F5F1EC 100%)',
  textDark: '#402F1D',      // Cor de texto principal (marrom escuro)
  textMedium: '#8D7B68',     // Cor de texto secundária
  textLight: '#FFFFFF',     // Cor de texto para fundos escuros
  white: '#FFFFFF',
  border: '#F0EAE4',      // Cor sutil para bordas
  shadow: 'rgba(124, 92, 59, 0.1)', // Sombra baseada na cor primária
};

// --- ESTILOS GLOBAIS E REUTILIZÁVEIS ---
export const globalStyles = {
  // Layout Geral da Página
  page: {
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
    background: PALETTE.backgroundLight,
    color: PALETTE.textDark,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100vw',
    overflowX: 'hidden',
    boxSizing: 'border-box',
  },
  pageContent: {
    flex: '1', // Faz o conteúdo principal crescer e empurrar o footer para baixo
    width: '100vw',
    maxWidth: '100vw', // Limita a largura máxima ao tamanho da tela
    margin: '0 auto',   // Centraliza o conteúdo
    padding: '40px 20px',
    boxSizing: 'border-box',
    overflowX: 'hidden',
  },

  // Componente: Navbar
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '16px 40px',
    backgroundColor: PALETTE.white,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: PALETTE.primary,
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLink: {
    fontSize: '1rem',
    fontWeight: '500',
    color: PALETTE.textMedium,
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  },
  navLinkHover: {
    color: PALETTE.primary,
  },
  navLinkCta: {
    padding: '10px 20px',
    backgroundColor: PALETTE.primary,
    color: PALETTE.white,
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
  navLinkCtaHover: {
    backgroundColor: PALETTE.primaryDark,
  },

  // Componente: Footer
  footer: {
    width: '100%',
    padding: '40px 20px',
    marginTop: 'auto', // Garante que ele fique no final
    backgroundColor: PALETTE.primaryDark,
    color: PALETTE.backgroundLight,
    textAlign: 'center',
    fontSize: '0.9rem',
  },
  
  // Componentes Genéricos
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    backgroundColor: PALETTE.primary,
    color: PALETTE.white,
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: `0 4px 15px ${PALETTE.shadow}`,
  },
  buttonHover: {
    transform: 'translateY(-3px)',
    boxShadow: `0 8px 25px rgba(124, 92, 59, 0.2)`,
  },
  card: {
    background: PALETTE.white,
    padding: '32px',
    borderRadius: '12px',
    boxShadow: `0 4px 25px ${PALETTE.shadow}`,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    textDecoration: 'none',
    color: 'inherit',
    border: `1px solid ${PALETTE.border}`,
  },
  cardHover: {
    transform: 'translateY(-8px)',
    boxShadow: `0 12px 35px rgba(124, 92, 59, 0.15)`,
  },

  // Tipografia
  h1: {
    fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
    color: PALETTE.textDark,
    marginBottom: '16px',
    fontWeight: '700',
  },
  h2: {
    textAlign: 'center',
    fontSize: '2.5rem',
    color: PALETTE.textDark,
    marginBottom: '48px',
  }
};