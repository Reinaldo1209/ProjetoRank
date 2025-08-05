// src/pages/Concursos.js
import React from 'react';
import { Link } from 'react-router-dom';
import { PALETTE, globalStyles } from './globalStyles';

const concursosMock = [
  {
    id: 1,
    nome: 'Concurso Prefeitura de São Paulo 2025',
    organizadora: 'Vunesp',
    encerramento: '15/09/2025',
  },
  {
    id: 2,
    nome: 'Concurso TRF-3ª Região',
    organizadora: 'FCC',
    encerramento: '30/08/2025',
  },
  {
    id: 3,
    nome: 'Concurso Banco Central',
    organizadora: 'Cesgranrio',
    encerramento: '01/10/2025',
  },
];

const ConcursoCard = ({ concurso }) => (
  <div style={globalStyles.card}>
    <h3 style={{ marginBottom: '8px', color: PALETTE.textDark }}>{concurso.nome}</h3>
    <p><strong>Organizadora:</strong> {concurso.organizadora}</p>
    <p><strong>Encerramento:</strong> {concurso.encerramento}</p>
    <Link to="/formulario" style={{ ...globalStyles.button, marginTop: '12px', display: 'inline-block' }}>
      Enviar Gabarito
    </Link>
  </div>
);

function Concursos() {
  return (
    <div style={globalStyles.pageContent}>
      <h1 style={globalStyles.h1}>📚 Concursos Abertos</h1>
      <p style={globalStyles.subtitle}>Confira abaixo os concursos com ranking ativo. Escolha um e envie seu gabarito!</p>
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {concursosMock.map((c) => (
          <ConcursoCard key={c.id} concurso={c} />
        ))}
      </div>
    </div>
  );
}

export default Concursos;
