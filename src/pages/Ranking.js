import React, { useState, useEffect } from 'react';
import { usePayment } from '../context/PaymentContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useConcursos } from '../context/ConcursosContext';
import { useAuth } from '../context/AuthContext';
// styles moved to src/pages/global.css (CSS variables + utility classes)

import { getApiUrl, authFetch } from '../api';

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
    padding: '24px',
    textAlign: 'center',
    backgroundColor: 'var(--white)',
    borderRadius: 12,
    boxShadow: '0 4px 25px var(--shadow)',
    border: '1px solid var(--border)',
    minHeight: '130px', // Altura mínima para consistência
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: 'var(--text-medium)',
    marginBottom: '8px',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: '2.2rem',
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
    flexWrap: 'wrap', // Permite quebra de linha em telas menores
  },
  subNavLink: {
    padding: '8px 16px',
    textDecoration: 'none',
    color: 'var(--text-medium)',
    fontWeight: '600',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
  },
  subNavLinkActive: {
    backgroundColor: 'var(--beige-contrast)',
    color: 'var(--primary)',
    border: '2px solid var(--border)',
  },
  // Estilos da Tabela (refinados)
  table: {
    width: '100%',
    borderCollapse: 'separate', // Necessário para border-radius
    borderSpacing: 0,
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
    backgroundColor: '#FEF7EC', // Um creme/pêssego bem claro
    fontWeight: '700',
    borderLeft: '4px solid var(--primary)',
    borderRight: '4px solid var(--primary)',
  },
  // Linhas zebradas para melhor leitura
  evenRow: {
    backgroundColor: 'var(--background-light)',
  }
};

const FILTROS = ['Ampla Concorrência', 'PPP', 'PCD', 'Indígena'];

function Ranking() {
  const { paidConcursoIds } = usePayment();
  const navigate = useNavigate();
  const { id } = useParams();
  const { concursos } = useConcursos();
  const { user, isLoggedIn } = useAuth(); // Autenticação real
  const concurso = id ? concursos.find(c => String(c.id) === String(id)) : null;
  
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(FILTROS[0]);
  const [vagasParaFiltro, setVagasParaFiltro] = useState(0);
  
  const isAdmin = false; // Simulação de admin

  // 1. Busca os dados brutos do ranking
  useEffect(() => {
    async function fetchRanking() {
      if (!id || !user) { // Espera o user carregar
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await authFetch(`/concurso/${id}/ranking`);
        if (res.ok) {
          const data = await res.json(); // API: [{ usuarioId: 1, notaTotal: 2 }, ...]
          
          // Ordena e transforma os dados
          const sortedData = data.sort((a, b) => b.notaTotal - a.notaTotal);
          
          const transformedData = sortedData.map((item, index) => {
            const isCurrentUser = user && user.id === item.usuarioId;
            
            return {
              posicao: index + 1,
              nota: item.notaTotal,
              usuarioId: item.usuarioId,
              // Anônimiza outros usuários, destaca o atual
              nome: isCurrentUser ? (user.nome || 'Você') : `Candidato #${item.usuarioId}`,
              avatar: isCurrentUser ? (user.avatar || null) : null,
              isUser: isCurrentUser,
            };
          });
          
          setRanking(transformedData);
        } else {
          console.error("Erro ao buscar ranking");
          setRanking([]);
        }
      } catch (error) {
        console.error("Erro na requisição do ranking:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRanking();
  }, [id, user]); // Recarrega se o ID do concurso ou o usuário mudar

  // 2. Redireciona se não tiver pago (exceto admin)
  useEffect(() => {
    if (isAdmin || !concurso) return;
    if (!paidConcursoIds.includes(concurso.id)) {
      // navigate('/checkout'); // Descomente para ativar o paywall
    }
  }, [concurso, paidConcursoIds, navigate, isAdmin]);

  // 3. Atualiza o número de vagas para o cálculo da nota de corte
  useEffect(() => {
    if (!concurso) return;
    
    let vagas = 0;
    switch (activeFilter) {
      case 'Ampla Concorrência':
        vagas = concurso.vagasAmpla || 0;
        break;
      case 'PCD':
        vagas = concurso.vagasPCD || 0;
        break;
      case 'PPP':
        vagas = concurso.vagasPPP || 0;
        break;
      case 'Indígena':
        vagas = concurso.vagasPI || 0;
        break;
      default:
        vagas = concurso.vagasAmpla || 0;
    }
    setVagasParaFiltro(vagas);
  }, [activeFilter, concurso]);


  // --- Variáveis Calculadas para Renderização ---
  
  const numeroDeInscritos = ranking.length;
  const usuarioNoRanking = ranking.find(r => r.isUser);
  const suaPosicao = usuarioNoRanking ? usuarioNoRanking.posicao : null;
  const usuarioInscrito = !!usuarioNoRanking;

  // Calcula a nota de corte baseada no filtro de vagas
  const notaDeCorte = ranking.length >= vagasParaFiltro && vagasParaFiltro > 0
    ? ranking[vagasParaFiltro - 1].nota.toFixed(2)
    : 'N/A';
    
  // Calcula o total de vagas para o card do cabeçalho
  const totalVagas = concurso 
    ? (concurso.vagasAmpla || 0) + (concurso.vagasPPP || 0) + (concurso.vagasPCD || 0) + (concurso.vagasPI || 0)
    : 0;

  return (
    <div className="page-content">
      <h1 className="global-h1" style={{ textAlign: 'center' }}>📊 Ranking do Concurso</h1>
      
      {/* Card do Concurso Selecionado */}
      {concurso ? (
        <div className="global-card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          {/* Logo removido pois não vem da API de Concurso */}
          <div style={{ minWidth: 220 }}>
            <h2 className="text-primary" style={{ marginBottom: 8, fontSize: '1.75rem' }}>{concurso.nome}</h2>
            <p style={{ margin: '4px 0' }}><strong>Banca:</strong> {concurso.banca}</p>
            <p style={{ margin: '4px 0' }}><strong>Vagas Totais:</strong> {totalVagas}</p>
            <p style={{ margin: '4px 0' }}><strong>Questões:</strong> {concurso.qtdQuestoes || 'N/A'}</p>
            <p style={{ margin: '4px 0' }}><strong>Tipo:</strong> {concurso.tipoProva}</p>
          </div>
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>Selecione um concurso para ver o ranking.</p>
      )}

      {/* Cards de Stats */}
      <div style={pageStyles.statsContainer}>
        <div style={pageStyles.statCard}>
          <div style={pageStyles.statLabel}>Sua Posição (Geral)</div>
          {isLoggedIn && usuarioInscrito && suaPosicao ? (
            <div style={pageStyles.statValue}>{suaPosicao}º</div>
          ) : (
            <Link to={isLoggedIn ? `/formulario?concurso=${id}` : "/login"} className="global-button" style={{ fontSize: '1rem', padding: '10px 24px', textDecoration: 'none' }}>
              Enviar Gabarito
            </Link>
          )}
        </div>
        
        <div style={pageStyles.statCard}>
          <div style={pageStyles.statLabel}>Nota de Corte ({activeFilter})</div>
          <div style={pageStyles.statValue}>{notaDeCorte}</div>
          <small style={{ color: 'var(--text-medium)', marginTop: '4px' }}>{vagasParaFiltro} vagas</small>
        </div>
        
        <div style={pageStyles.statCard}>
          <div style={pageStyles.statLabel}>Total de Inscritos</div>
          <div style={pageStyles.statValue}>{numeroDeInscritos}</div>
        </div>
      </div>

      {/* --- Barra de Filtros/Navegação Secundária --- */}
      <div style={pageStyles.subNav}>
        {FILTROS.map(filtro => (
          <a 
            key={filtro}
            href="#/" 
            style={activeFilter === filtro ? {...pageStyles.subNavLink, ...pageStyles.subNavLinkActive} : pageStyles.subNavLink} 
            onClick={(e) => { e.preventDefault(); setActiveFilter(filtro); }}
          >
            {filtro}
          </a>
        ))}
      </div>

      {/* --- Tabela do Ranking --- */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Carregando ranking...</p>
      ) : numeroDeInscritos === 0 ? (
        <p style={{ textAlign: 'center' }}>Ninguém enviou o gabarito para este concurso ainda.</p>
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
              const isEven = index % 2 === 1; // Index 1 (segunda linha) é par
              const rowStyle = {
                ...(isEven && !item.isUser && pageStyles.evenRow),
                ...(item.isUser && pageStyles.userHighlight),
              };
              return (
                <tr key={index} style={rowStyle}>
                  <td style={pageStyles.td}>
                    {item.posicao}º
                  </td>
                  <td style={{ ...pageStyles.td, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.avatar && (
                      <img src={item.avatar} alt="Avatar" style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--primary)' }} />
                    )}
                    {item.nome}
                  </td>
                  <td style={{...pageStyles.td, fontWeight: '600' }}>{item.nota.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {!usuarioInscrito && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to={isLoggedIn ? `/formulario?concurso=${id}` : "/login"} className="global-button">
            Participe! Envie seu Gabarito
          </Link>
        </div>
      )}
    </div>
  );
}

export default Ranking;