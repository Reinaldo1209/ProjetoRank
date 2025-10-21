import React, { useState } from 'react';
import { getApiUrl, authFetch } from '../api';

function CadastroPergunta() {
  const [form, setForm] = useState({ texto: '', peso: '', disciplinaId: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const res = await authFetch('/pergunta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texto: form.texto,
        peso: parseFloat(form.peso),
        disciplinaId: parseInt(form.disciplinaId)
      })
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setForm({ texto: '', peso: '', disciplinaId: '' });
    } else {
      setError('Erro ao cadastrar pergunta.');
    }
  };

  return (
    <div className="page-content">
      <h2 className="global-h2">Cadastro de Pergunta</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <input name="texto" value={form.texto} onChange={handleChange} placeholder="Texto da pergunta" required className="input-base" />
        <input name="peso" value={form.peso} onChange={handleChange} placeholder="Peso" required type="number" step="0.1" className="input-base" />
        <input name="disciplinaId" value={form.disciplinaId} onChange={handleChange} placeholder="ID da Disciplina" required type="number" className="input-base" />
        <button type="submit" className="global-button" disabled={loading}>{loading ? 'Enviando...' : 'Cadastrar'}</button>
        {success && <p style={{ color: 'green' }}>Pergunta cadastrada com sucesso!</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default CadastroPergunta;
