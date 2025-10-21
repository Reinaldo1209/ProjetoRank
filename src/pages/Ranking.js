// ...imports...
// src/pages/Ranking.js
import React, { useState, useEffect } from 'react';
import { usePayment } from '../context/PaymentContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useConcursos } from '../context/ConcursosContext';
import { useAuth } from '../context/AuthContext';
// Supondo que globalStyles.js está em ../styles/globalStyles.js
// styles moved to src/pages/global.css (CSS variables + utility classes)

import { getApiUrl, authFetch } from '../api';

// --- LÓGICA DE CÁLCULO ---
// Removido mock, cálculo será feito com dados reais

// --- ESTILOS DA PÁGINA ---
const pageStyles = {
  // Estilos para os cartões de estatísticas (usamos CSS vars)
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '2rem',
  },
  statCard: {
    padding: '20px',
    textAlign: 'center',
    backgroundColor: 'var(--white)',
    borderRadius: 12,
    boxShadow: '0 4px 25px var(--shadow)',
    border: '1px solid var(--border)'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: 'var(--text-medium)',
    marginBottom: '8px',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--primary)',
  },
  // Estilos para a navegação secundária (filtros)
  subNav: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: `2px solid var(--border)`,
  },
  subNavLink: {
    padding: '8px 16px',
    textDecoration: 'none',
    color: 'var(--text-medium)',
    fontWeight: '600',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
  },
  subNavLinkActive: {
    backgroundColor: 'var(--primary)',
    color: 'var(--white)',
  },
  // Estilos da Tabela (refinados)
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '2rem',
    backgroundColor: 'var(--white)',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 25px var(--shadow)',
  },
  th: {
    backgroundColor: 'var(--primary)',
    color: 'var(--white)',
    padding: '16px',
    textAlign: 'left',
    textTransform: 'uppercase',
    fontSize: '0.85rem',
    fontWeight: '700',
  },
  td: {
    padding: '16px',
    borderBottom: `1px solid var(--border)`,
    color: 'var(--text-dark)',
  },
  // Linha do usuário destacada com cor do tema
  userHighlight: {
    backgroundColor: '#FEF7EC', // Um creme/pêssego bem claro da paleta
    fontWeight: '600',
  },
  // Linhas zebradas para melhor leitura
  evenRow: {
    backgroundColor: 'var(--background-light)',
  }
};

function Ranking() {
  const { paidConcursoIds } = usePayment();
  const navigate = useNavigate();
  const { id } = useParams();
  const { concursos } = useConcursos();
  const concurso = id ? concursos.find(c => String(c.id) === String(id)) : null;
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Ampla Concorrência');
  const isAdmin = false;

  useEffect(() => {
    async function fetchRanking() {
      if (!id) return;
      setLoading(true);
      const res = await authFetch(`/concurso/${id}/ranking`);
      if (res.ok) {
        const data = await res.json();
        setRanking(data);
      }
      setLoading(false);
    }
    fetchRanking();
  }, [id]);

  useEffect(() => {
    if (isAdmin) return;
    if (concurso && !paidConcursoIds.includes(concurso.id)) {
      navigate('/checkout');
    }
  }, [concurso, paidConcursoIds, navigate, isAdmin]);

  const numeroDeVagas = concurso?.numeroVagas || concurso?.vagas || 0;
  const numeroDeQuestoes = concurso?.qtdQuestoes || 0;
  const numeroDeInscritos = ranking.length;
  // Autenticação real
  const { user, isLoggedIn } = useAuth();
  // Simulação de inscrição (ajuste conforme lógica real)
  const usuarioInscrito = false; // Exemplo: false = não inscrito
  const usuario = ranking.find(c => c.nome === (user?.nome || 'Você'));
  const suaPosicao = user && usuarioInscrito && usuario ? usuario.posicao : null;
  const notaDeCorte = ranking.length >= numeroDeVagas && numeroDeVagas > 0
    ? ranking[numeroDeVagas - 1].nota.toFixed(2)
    : 'N/A';

  return (
    <div className="page-content">
      <h1 className="global-h1">📊 Ranking do Concurso</h1>
      {concurso && (
        <div className="global-card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          {concurso.logo && (
            <img src={concurso.logo} alt="Logo" style={{ maxWidth: 80, maxHeight: 80, borderRadius: 8, border: '1px solid #ccc', flexShrink: 0 }} />
          )}
          <div style={{ minWidth: 220 }}>
            <h2 className="text-primary" style={{ marginBottom: 8 }}>{concurso.nome}</h2>
            <p><strong>Organizadora:</strong> {concurso.organizadora}</p>
            <p><strong>Data da Prova:</strong> {concurso.dataProva}</p>
            <p><strong>Vagas:</strong> {numeroDeVagas}</p>
            <p><strong>Questões:</strong> {numeroDeQuestoes}</p>
          </div>
        </div>
      )}
  <p>Veja sua colocação e compare seu desempenho com outros candidatos.</p>
  <div className="d-flex flex-wrap justify-content-center" style={{ gap: 32, margin: '24px 0' }}>
        {concursos.map((c) => (
          <div key={c.id} className="text-center" style={{ width: 100, minWidth: 100, marginBottom: 12 }}>
            <button
              onClick={() => navigate(`/ranking/${c.id}`)}
              className={`btn ${String(c.id) === String(concurso?.id) ? 'btn-outline-primary' : 'btn-light'}`} 
              style={{ borderRadius: 8, padding: 8, width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              disabled={String(c.id) === String(concurso?.id)}
              title={c.nome}
            >
              {c.logo ? (
                <img src={c.logo} alt={c.nome} style={{ maxWidth: 64, maxHeight: 64, borderRadius: 6 }} />
              ) : (
                <span style={{ fontSize: 12, color: '#aaa' }}>Sem logo</span>
              )}
            </button>
            <div style={{ fontSize: 12, color: String(c.id) === String(concurso?.id) ? 'var(--primary)' : 'var(--text-medium)', fontWeight: String(c.id) === String(concurso?.id) ? 'bold' : 'normal', wordBreak: 'break-word', whiteSpace: 'pre-line', maxWidth: 90, lineHeight: 1.2 }}>{c.nome}</div>
            {/* Se não tem acesso ao ranking desse concurso */}
              {String(c.id) !== String(concurso?.id) && !isAdmin && !paidConcursoIds.includes(c.id) && (
              <div style={{ marginTop: 8, color: '#e74c3c', fontSize: 13 }}>
                Você não está participando deste ranking.<br />
                <Link to="/formulario" className="global-button" style={{ fontSize: '0.9rem', marginTop: 6 }}>Participar</Link>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="row gx-4 gy-3" style={{ marginTop: '1rem' }}>
        <div className="col-12 col-md-4">
          <div className="global-card text-center">
            <div className="subtitle">Sua Posição</div>
            {isLoggedIn && usuarioInscrito && suaPosicao ? (
              <div className="h2">{suaPosicao}º</div>
            ) : (
              <Link to={isLoggedIn ? "/formulario" : "/login"} className="global-button" style={{ fontSize: '1rem', padding: '10px 24px', textDecoration: 'none' }}>
                Cadastre seu Gabarito
              </Link>
            )}
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="global-card text-center">
            <div className="subtitle">Nota de Corte</div>
            <div className="h2">{notaDeCorte}</div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="global-card text-center">
            <div className="subtitle">Inscritos</div>
            <div className="h2">{numeroDeInscritos}</div>
          </div>
        </div>
      </div>

      {/* --- Barra de Filtros/Navegação Secundária --- */}
      <div style={pageStyles.subNav}>
        <a 
          href="#/" 
          style={activeFilter === 'Ampla Concorrência' ? {...pageStyles.subNavLink, ...pageStyles.subNavLinkActive} : pageStyles.subNavLink} 
          onClick={(e) => { e.preventDefault(); setActiveFilter('Ampla Concorrência'); }}
        >
          Ampla Concorrência
        </a>
        <a 
          href="#/" 
          style={activeFilter === 'Cotas (PCD)' ? {...pageStyles.subNavLink, ...pageStyles.subNavLinkActive} : pageStyles.subNavLink} 
          onClick={(e) => { e.preventDefault(); setActiveFilter('Cotas (PCD)'); }}
        >
           PCD
        </a>
        <a 
          href="#/" 
          style={activeFilter === 'PPP' ? {...pageStyles.subNavLink, ...pageStyles.subNavLinkActive} : pageStyles.subNavLink} 
          onClick={(e) => { e.preventDefault(); setActiveFilter('PPP'); }}
        >
          PPP
        </a>
        <a 
          href="#/" 
          style={activeFilter === 'Indígena' ? {...pageStyles.subNavLink, ...pageStyles.subNavLinkActive} : pageStyles.subNavLink} 
          onClick={(e) => { e.preventDefault(); setActiveFilter('Indígena'); }}
        >
          Indígena
        </a>
      </div>

      {loading ? (
        <p>Carregando ranking...</p>
      ) : (
        <table style={pageStyles.table}>
          <thead>
            <tr>
              <th style={pageStyles.th}>Posição</th>
              <th style={pageStyles.th}>Nome</th>
              <th style={pageStyles.th}>Nota Final</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((item, index) => {
              const isUser = user && item.nome === user.nome;
              const isEven = index % 2 === 1;
              const rowStyle = {
                ...(isEven && !isUser && pageStyles.evenRow),
                ...(isUser && pageStyles.userHighlight),
              };
              return (
                <tr key={index} style={rowStyle}>
                  <td style={pageStyles.td}>
                    {item.posicao}º
                    {item.avatar && (
                      <img src={item.avatar} alt="Avatar" style={{ width: 32, height: 32, borderRadius: '50%', marginLeft: 100, verticalAlign: 'middle', border: isUser ? '2px solid #2d9cdb' : '1px solid #ccc' }} />
                    )}
                  </td>
                  <td style={pageStyles.td}>{item.nome}</td>
                  <td style={pageStyles.td}>{item.nota.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link to={isLoggedIn ? "/formulario" : "/login"} className="global-button">
          Cadastre seu Gabarito
        </Link>
      </div>
    </div>
  );
}

export default Ranking;