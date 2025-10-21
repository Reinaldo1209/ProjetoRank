import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// styles moved to src/pages/global.css (CSS variables + utility classes)
import { useAuth } from '../context/AuthContext';
import { getApiUrl, authFetch } from '../api';

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
      const res = await authFetch(`/respostausuario/usuario/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setConcursos(data);
      }
      setLoading(false);
    }
    fetchMeusConcursos();
  }, [user]);

  return (
    <main className="page-content">
      <h2 className="global-h2">Meus Concursos</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : concursos.length === 0 ? (
        <p>Você ainda não cadastrou gabaritos em nenhum concurso.</p>
      ) : (
        <div className="row gx-4 gy-4" style={{ marginTop: '32px' }}>
          {concursos.map(concurso => (
            <div key={concurso.id} className="col-12 col-md-6 col-lg-4">
              <div className="global-card" style={{ minHeight: 180, position: 'relative', padding: '24px' }}>
                {concurso.logo && (
                  <img src={concurso.logo} alt="Logo" style={{ maxWidth: 64, maxHeight: 64, position: 'absolute', top: 16, left: 16, borderRadius: 8, border: '1px solid #ccc' }} />
                )}
                <h3 style={{ marginBottom: '8px', color: 'var(--text-dark)', marginLeft: concurso.logo ? 80 : 0 }}>{concurso.nome}</h3>
                <p><strong>Data da Prova:</strong> {concurso.dataProva || concurso.data}</p>
                <p><strong>Status do Gabarito:</strong> {concurso.gabarito || 'Enviado'}</p>
                <p><strong>Minha posição no ranking:</strong> {concurso.ranking ? `${concurso.ranking}º` : '-'}</p>
                <div className="d-flex" style={{ gap: 12, marginTop: 18 }}>
                  <Link to={`/gabarito/${concurso.id}`} className="global-button">Ver Meu Gabarito</Link>
                  <Link to={`/gabarito/${concurso.id}?definitivo=true`} className="btn btn-outline-secondary">Ver Gabarito Final</Link>
                  <Link to={`/ranking/${concurso.id}`} className="btn btn-outline-primary">Ver Ranking</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MeusConcursos;
