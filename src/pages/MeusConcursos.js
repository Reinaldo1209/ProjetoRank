import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { globalStyles, PALETTE } from './globalStyles';

// Simulação de dados do usuário logado
const concursosMock = [
  {
    id: 1,
    nome: 'Concurso Polícia Civil',
    data: '2025-05-10',
    gabarito: 'Enviado',
    ranking: 12,
  },
  {
    id: 2,
    nome: 'Concurso INSS',
    data: '2025-03-22',
    gabarito: 'Enviado',
    ranking: 5,
  },
  {
    id: 3,
    nome: 'Concurso Receita Federal',
    data: '2024-12-15',
    gabarito: 'Enviado',
    ranking: 27,
  },
];

const MeusConcursos = () => {
  const [concursos, setConcursos] = useState([]);

  useEffect(() => {
    // Aqui você buscaria os concursos do usuário logado via API
    setConcursos(concursosMock);
  }, []);

  return (
    <main style={globalStyles.pageContent}>
      <h2 style={globalStyles.h2}>Meus Concursos</h2>
      {concursos.length === 0 ? (
        <p>Você ainda não cadastrou gabaritos em nenhum concurso.</p>
      ) : (
        <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', marginTop: '32px' }}>
          {concursos.map(concurso => (
            <div key={concurso.id} style={{ ...globalStyles.card, minHeight: 180, position: 'relative', padding: '32px 24px 24px 24px' }}>
              {concurso.logo && (
                <img src={concurso.logo} alt="Logo" style={{ maxWidth: 64, maxHeight: 64, position: 'absolute', top: 16, left: 16, borderRadius: 8, border: '1px solid #ccc' }} />
              )}
              <h3 style={{ marginBottom: '8px', color: PALETTE.textDark, marginLeft: concurso.logo ? 80 : 0 }}>{concurso.nome}</h3>
              <p><strong>Data da Prova:</strong> {concurso.data}</p>
              <p><strong>Status do Gabarito:</strong> {concurso.gabarito}</p>
              <p><strong>Minha posição no ranking:</strong> {concurso.ranking}º</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '18px' }}>
                <Link to={`/gabarito/${concurso.id}`} style={{ ...globalStyles.button, background: PALETTE.primary, color: '#fff', display: 'inline-block' }}>Ver Meu Gabarito</Link>
                <Link to={`/gabarito/${concurso.id}?definitivo=true`} style={{ ...globalStyles.button, background: PALETTE.primary, color: '#fff', display: 'inline-block' }}>Ver Gabarito Final</Link>
                <Link to={`/ranking/${concurso.id}`} style={{ ...globalStyles.button, background: PALETTE.primary, color: '#fff', display: 'inline-block' }}>Ver Ranking</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MeusConcursos;
