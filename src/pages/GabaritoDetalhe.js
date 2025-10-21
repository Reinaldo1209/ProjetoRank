// src/pages/GabaritoDetalhe.js
import React from 'react';
import { useParams } from 'react-router-dom';
// styles moved to src/pages/global.css (CSS variables + utility classes)
import { useConcursos } from '../context/ConcursosContext';

// Simulação de dados para um gabarito específico
const gabaritosMock = [
  {
    id: 1,
    nome: 'João da Silva',
    concurso: 'Prefeitura de São Paulo 2025',
    nota: 85.7,
    gabarito: 'ABCDBACDCBBDACBDACDB',
    dataEnvio: '05/08/2025',
  },
  {
    id: 2,
    nome: 'Maria Oliveira',
    concurso: 'TRF-3ª Região',
    nota: 72.3,
    gabarito: 'ABCDACBDACBACDABDCAD',
    dataEnvio: '02/08/2025',
  }
];

function GabaritoDetalhe() {
  const { id } = useParams();
  const gabarito = gabaritosMock.find((g) => g.id.toString() === id);
  const { concursos } = useConcursos();
  const concursoInfo = concursos.find(c => c.nome === gabarito.concurso);
  return (
    <div className="page-content">
      <h1 className="global-h1">📄 Detalhes do Gabarito</h1>
      <p className="subtitle">Veja abaixo as informações completas do seu envio.</p>

      <div className="global-card">
        <div className="d-flex align-items-center" style={{ gap: 16, marginBottom: 16 }}>
          {concursoInfo?.logo && (
            <img src={concursoInfo.logo} alt="Logo" style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 8, border: '1px solid #ccc' }} />
          )}
          <span style={{ fontWeight: 600, fontSize: 18 }}>{gabarito.concurso}</span>
        </div>
        <p><strong>Nome:</strong> {gabarito.nome}</p>
        <p><strong>Nota Calculada:</strong> {gabarito.nota}</p>
        <p><strong>Data de Envio:</strong> {gabarito.dataEnvio}</p>
        <div style={{ marginTop: 24 }}>
          <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Gabarito enviado:</label>
          <div className="d-flex flex-wrap" style={{ gap: '24px' }}>
            {Array.from(gabarito.gabarito).map((alt, idx) => (
              <div key={idx} style={{ marginBottom: 12, minWidth: 80 }}>
                <span style={{ fontWeight: 600, marginRight: 8 }}>Q{idx + 1}</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{alt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GabaritoDetalhe;