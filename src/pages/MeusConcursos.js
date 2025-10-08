import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { globalStyles, PALETTE } from './globalStyles';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../api';

const MeusConcursos = () => {
  const [concursos, setConcursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchMeusConcursos() {
      if (!user) return;
      setLoading(true);
      // Exemplo de endpoint: /api/respostausuario/usuario/{usuarioId}/concurso/{concursoId}
      // Aqui vamos supor que existe um endpoint para listar todos concursos do usuário
      const res = await fetch(getApiUrl(`/respostausuario/usuario/${user.id}`));
      if (res.ok) {
        const data = await res.json();
        setConcursos(data);
      }
      setLoading(false);
    }
    fetchMeusConcursos();
  }, [user]);

  return (
    <main style={globalStyles.pageContent}>
      <h2 style={globalStyles.h2}>Meus Concursos</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : concursos.length === 0 ? (
        <p>Você ainda não cadastrou gabaritos em nenhum concurso.</p>
      ) : (
        <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', marginTop: '32px' }}>
          {concursos.map(concurso => (
            <div key={concurso.id} style={{ ...globalStyles.card, minHeight: 180, position: 'relative', padding: '32px 24px 24px 24px' }}>
              {concurso.logo && (
                <img src={concurso.logo} alt="Logo" style={{ maxWidth: 64, maxHeight: 64, position: 'absolute', top: 16, left: 16, borderRadius: 8, border: '1px solid #ccc' }} />
              )}
              <h3 style={{ marginBottom: '8px', color: PALETTE.textDark, marginLeft: concurso.logo ? 80 : 0 }}>{concurso.nome}</h3>
              <p><strong>Data da Prova:</strong> {concurso.dataProva || concurso.data}</p>
              <p><strong>Status do Gabarito:</strong> {concurso.gabarito || 'Enviado'}</p>
              <p><strong>Minha posição no ranking:</strong> {concurso.ranking ? `${concurso.ranking}º` : '-'}</p>
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
