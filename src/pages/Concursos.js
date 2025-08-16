// src/pages/Concursos.js
import React from 'react';
import { Link } from 'react-router-dom';
import { PALETTE, globalStyles } from './globalStyles';
import { useConcursos } from '../context/ConcursosContext';

const ConcursoCard = ({ concurso }) => (
  <div style={{ ...globalStyles.card, minHeight: 180, position: 'relative' }}>
    {concurso.logo && (
      <img src={concurso.logo} alt="Logo" style={{ maxWidth: 80, maxHeight: 80, position: 'absolute', top: 12, left: 12, borderRadius: 8, border: '1px solid #ccc' }} />
    )}
    <h3 style={{ marginBottom: '8px', color: PALETTE.textDark, marginLeft: concurso.logo ? 100 : 0 }}>{concurso.nome}</h3>
    <p><strong>Organizadora:</strong> {concurso.organizadora}</p>
    <p><strong>Encerramento:</strong> {concurso.encerramento}</p>
    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
      <Link to="/formulario" style={{ ...globalStyles.button, display: 'inline-block' }}>
        Enviar Gabarito
      </Link>
      <Link to={`/ranking/${concurso.id}`} style={{ ...globalStyles.button, background: '#7C5C3B', color: '#fff', display: 'inline-block' }}>
        Ver Ranking
      </Link>
    </div>
  </div>
);

function Concursos() {
  const { concursos } = useConcursos();
  return (
    <div style={globalStyles.pageContent}>
      <h1 style={globalStyles.h1}>📚 Concursos Abertos</h1>
      <p style={globalStyles.subtitle}>Confira abaixo os concursos com ranking ativo. Escolha um e envie seu gabarito!</p>
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {concursos.map((c) => (
          <ConcursoCard key={c.id} concurso={c} />
        ))}
      </div>
    </div>
  );
}

export default Concursos;
