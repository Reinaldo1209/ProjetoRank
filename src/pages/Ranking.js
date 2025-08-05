// src/pages/Ranking.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Supondo que globalStyles.js está em ../styles/globalStyles.js
import { PALETTE, globalStyles } from './globalStyles'; 

// --- DADOS MOCK (MAIS COMPLETOS) ---
const mockRanking = [
  { nome: 'João V. Silva', nota: 91.0, posicao: 1 },
  { nome: 'Ana C. Souza', nota: 88.5, posicao: 2 },
  { nome: 'Carlos F. Lima', nota: 87.0, posicao: 3 },
  { nome: 'Mariana B. Costa', nota: 85.0, posicao: 4 },
  { nome: 'Você', nota: 83.5, posicao: 5 },
  { nome: 'Lucas R. Almeida', nota: 82.0, posicao: 6 },
  { nome: 'Beatriz S. Oliveira', nota: 81.5, posicao: 7 },
  { nome: 'Rafael P. Martins', nota: 79.0, posicao: 8 },
  { nome: 'Fernanda G. Rocha', nota: 78.5, posicao: 9 },
  { nome: 'Thiago L. Pereira', nota: 77.0, posicao: 10 },
];

// --- LÓGICA DE CÁLCULO ---
const numeroDeVagas = 4; // Exemplo: número de vagas para o cargo
const numeroDeInscritos = mockRanking.length;
const usuario = mockRanking.find(c => c.nome === 'Você');
const suaPosicao = usuario ? usuario.posicao : 'N/A';
// Nota de corte estimada: nota do último candidato dentro do número de vagas.
const notaDeCorte = mockRanking.length >= numeroDeVagas 
  ? mockRanking[numeroDeVagas - 1].nota.toFixed(2) 
  : 'N/A';

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
  const [ranking] = useState(mockRanking);
  const [activeFilter, setActiveFilter] = useState('Ampla Concorrência');

  return (
    <div style={globalStyles.pageContent}>
      <h1 style={globalStyles.h1}>📊 Ranking do Concurso</h1>
      <p>Veja sua colocação e compare seu desempenho com outros candidatos.</p>

      {/* --- Resumo de Estatísticas --- */}
      <div style={pageStyles.statsContainer}>
        <div style={pageStyles.statCard}>
          <div style={pageStyles.statLabel}>Sua Posição</div>
          <div style={pageStyles.statValue}>{suaPosicao}º</div>
        </div>
        <div style={pageStyles.statCard}>
          <div style={pageStyles.statLabel}>Nota de Corte (Est.)</div>
          <div style={pageStyles.statValue}>{notaDeCorte}</div>
        </div>
        <div style={pageStyles.statCard}>
          <div style={pageStyles.statLabel}>Inscritos</div>
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
          Cotas (PCD)
        </a>
      </div>

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
            const isUser = item.nome === 'Você';
            const isEven = index % 2 === 1; // Para zebrar a partir da segunda linha de dados
            
            // Combina os estilos: zebrado e destaque do usuário
            const rowStyle = {
              ...(isEven && !isUser && pageStyles.evenRow),
              ...(isUser && pageStyles.userHighlight),
            };

            return (
              <tr key={index} style={rowStyle}>
                <td style={pageStyles.td}>{item.posicao}º</td>
                <td style={pageStyles.td}>{item.nome}</td>
                <td style={pageStyles.td}>{item.nota.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link to="/formulario" style={globalStyles.button}>
          Atualizar ou Inserir Gabarito
        </Link>
      </div>
    </div>
  );
}

export default Ranking;