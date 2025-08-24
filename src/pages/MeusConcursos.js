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
        <table style={{...globalStyles.table, marginTop: '32px'}}>
          <thead>
            <tr>
              <th>Nome do Concurso</th>
              <th>Data</th>
              <th>Status do Gabarito</th>
              <th>Ranking</th>
              <th>Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {concursos.map(concurso => (
              <tr key={concurso.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {concurso.logo && (
                    <img src={concurso.logo} alt="Logo" style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 8, border: '1px solid #ccc' }} />
                  )}
                  {concurso.nome}
                </td>
                <td>{concurso.data}</td>
                <td>{concurso.gabarito}</td>
                <td>{concurso.ranking}º</td>
                <td>
                  <Link to={`/gabarito/${concurso.id}`} style={globalStyles.navLink}>Ver Gabarito</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default MeusConcursos;
