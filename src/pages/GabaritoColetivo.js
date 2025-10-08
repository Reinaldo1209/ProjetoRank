import React, { useState } from 'react';
import { getApiUrl } from '../api';
import { globalStyles } from './globalStyles';

function GabaritoColetivo() {
  const [concursoId, setConcursoId] = useState('');
  const [gabarito, setGabarito] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGabarito([]);
    const res = await fetch(getApiUrl(`/concurso/${concursoId}/gabarito-coletivo`));
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setGabarito(data);
    } else {
      setError('Erro ao consultar gabarito coletivo.');
    }
  };

  return (
    <div style={globalStyles.pageContent}>
      <h2>Gabarito Coletivo</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <input value={concursoId} onChange={e => setConcursoId(e.target.value)} placeholder="ID do Concurso" required type="number" style={globalStyles.inputBase} />
        <button type="submit" style={globalStyles.button} disabled={loading}>{loading ? 'Consultando...' : 'Consultar'}</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      {gabarito.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3>Respostas Coletivas:</h3>
          <ul>
            {gabarito.map((item, idx) => (
              <li key={idx}>{item.texto || JSON.stringify(item)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default GabaritoColetivo;
