// ...imports...
// src/pages/Ranking.js
import React, { useState, useEffect } from 'react';
import { usePayment } from '../context/PaymentContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useConcursos } from '../context/ConcursosContext';
// Supondo que globalStyles.js está em ../styles/globalStyles.js
import { PALETTE, globalStyles } from './globalStyles'; 

import { getApiUrl } from '../api';

// --- LÓGICA DE CÁLCULO ---
// Removido mock, cálculo será feito com dados reais

// --- ESTILOS DA PÁGINA ---
const pageStyles = {
  // Estilos para os cartões de estatísticas
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '2rem',
  },
  statCard: {
    ...globalStyles.card, // Reutiliza o estilo base de card
    padding: '20px',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: PALETTE.textMedium,
    marginBottom: '8px',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '700',
    color: PALETTE.primary,
  },
  // Estilos para a navegação secundária (filtros)
  subNav: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: `2px solid ${PALETTE.border}`,
  },
  subNavLink: {
    padding: '8px 16px',
    textDecoration: 'none',
    color: PALETTE.textMedium,
    fontWeight: '600',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
  },
  subNavLinkActive: {
    backgroundColor: PALETTE.primary,
    color: PALETTE.white,
  },
  // Estilos da Tabela (refinados)
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '2rem',
    backgroundColor: PALETTE.white,
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: `0 4px 25px ${PALETTE.shadow}`,
  },
  th: {
    backgroundColor: PALETTE.primary,
    color: PALETTE.white,
    padding: '16px',
    textAlign: 'left',
    textTransform: 'uppercase',
    fontSize: '0.85rem',
    fontWeight: '700',
  },
  td: {
    padding: '16px',
    borderBottom: `1px solid ${PALETTE.border}`,
    color: PALETTE.textDark,
  },
  // Linha do usuário destacada com cor do tema
  userHighlight: {
    backgroundColor: '#FEF7EC', // Um creme/pêssego bem claro da paleta
    fontWeight: '600',
  },
  // Linhas zebradas para melhor leitura
  evenRow: {
    backgroundColor: PALETTE.backgroundLight,
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
      const res = await fetch(getApiUrl(`/concurso/${id}/ranking`));
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
  const { user } = require('../context/AuthContext').useAuth();
  // Simulação de inscrição (ajuste conforme lógica real)
  const usuarioInscrito = false; // Exemplo: false = não inscrito
  const usuario = ranking.find(c => c.nome === (user?.nome || 'Você'));
  const suaPosicao = user && usuarioInscrito && usuario ? usuario.posicao : null;
  const notaDeCorte = ranking.length >= numeroDeVagas && numeroDeVagas > 0
    ? ranking[numeroDeVagas - 1].nota.toFixed(2)
    : 'N/A';

  return (
    <div style={globalStyles.pageContent}>
      <h1 style={globalStyles.h1}>📊 Ranking do Concurso</h1>
      {concurso && (
        <div style={{ marginBottom: '2rem', padding: '16px', background: '#f9f6f2', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          {concurso.logo && (
            <img src={concurso.logo} alt="Logo" style={{ maxWidth: 80, maxHeight: 80, borderRadius: 8, border: '1px solid #ccc', flexShrink: 0 }} />
          )}
          <div style={{ minWidth: 220 }}>
            <h2 style={{ color: PALETTE.primary, marginBottom: 8 }}>{concurso.nome}</h2>
            <p><strong>Organizadora:</strong> {concurso.organizadora}</p>
            <p><strong>Data da Prova:</strong> {concurso.dataProva}</p>
            <p><strong>Vagas:</strong> {numeroDeVagas}</p>
            <p><strong>Questões:</strong> {numeroDeQuestoes}</p>
          </div>
        </div>
      )}
      <p>Veja sua colocação e compare seu desempenho com outros candidatos.</p>
      <div style={{ display: 'flex', gap: 32, margin: '24px 0', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
        {concursos.map((c) => (
          <div key={c.id} style={{ textAlign: 'center', width: 100, minWidth: 100, marginBottom: 12 }}>
            <button
              onClick={() => navigate(`/ranking/${c.id}`)}
              style={{
                border: String(c.id) === String(concurso?.id) ? '2px solid #2d9cdb' : '1px solid #ccc',
                background: String(c.id) === String(concurso?.id) ? '#eaf6fb' : '#fff',
                borderRadius: 8,
                padding: 8,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #eee',
                marginBottom: 8,
                width: 80,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              disabled={String(c.id) === String(concurso?.id)}
              title={c.nome}
            >
              {c.logo ? (
                <img src={c.logo} alt={c.nome} style={{ maxWidth: 64, maxHeight: 64, borderRadius: 6 }} />
              ) : (
                <span style={{ fontSize: 12, color: '#aaa' }}>Sem logo</span>
              )}
            </button>
            <div style={{ fontSize: 12, color: String(c.id) === String(concurso?.id) ? PALETTE.primary : PALETTE.textMedium, fontWeight: String(c.id) === String(concurso?.id) ? 'bold' : 'normal', wordBreak: 'break-word', whiteSpace: 'pre-line', maxWidth: 90, lineHeight: 1.2 }}>{c.nome}</div>
            {/* Se não tem acesso ao ranking desse concurso */}
            {String(c.id) !== String(concurso?.id) && !isAdmin && !paidConcursoIds.includes(c.id) && (
              <div style={{ marginTop: 8, color: '#e74c3c', fontSize: 13 }}>
                Você não está participando deste ranking.<br />
                <Link to="/formulario" style={{ ...globalStyles.button, fontSize: '0.9rem', marginTop: 6 }}>Participar</Link>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={pageStyles.statsContainer}>
        <div style={pageStyles.statCard}>
          <div style={pageStyles.statLabel}>Sua Posição</div>
          {isLoggedIn && usuarioInscrito && suaPosicao ? (
            <div style={pageStyles.statValue}>{suaPosicao}º</div>
          ) : (
            <Link to={isLoggedIn ? "/formulario" : "/login"} style={{ ...globalStyles.button, fontSize: '1rem', padding: '10px 24px', textDecoration: 'none' }}>
              Cadastre seu Gabarito
            </Link>
          )}
        </div>
        <div style={pageStyles.statCard}>
          <div style={pageStyles.statLabel}>MotoSerra (Est.)</div>
          <div style={pageStyles.statValue}>{notaDeCorte}</div>
        </div>
        <div style={pageStyles.statCard}>
          <div style={pageStyles.statLabel}>Combatentes</div>
          <div style={pageStyles.statValue}>{numeroDeInscritos}</div>
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
        <Link to={isLoggedIn ? "/formulario" : "/login"} style={globalStyles.button}>
          Cadastre seu Gabarito
        </Link>
      </div>
    </div>
  );
}

export default Ranking;