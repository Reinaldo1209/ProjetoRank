import React, { useState } from 'react';
import { getApiUrl } from '../api';
import { globalStyles } from './globalStyles';

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
    const res = await fetch(getApiUrl('/pergunta'), {
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
    <div style={globalStyles.pageContent}>
      <h2>Cadastro de Pergunta</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <input name="texto" value={form.texto} onChange={handleChange} placeholder="Texto da pergunta" required style={globalStyles.inputBase} />
        <input name="peso" value={form.peso} onChange={handleChange} placeholder="Peso" required type="number" step="0.1" style={globalStyles.inputBase} />
        <input name="disciplinaId" value={form.disciplinaId} onChange={handleChange} placeholder="ID da Disciplina" required type="number" style={globalStyles.inputBase} />
        <button type="submit" style={globalStyles.button} disabled={loading}>{loading ? 'Enviando...' : 'Cadastrar'}</button>
        {success && <p style={{ color: 'green' }}>Pergunta cadastrada com sucesso!</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default CadastroPergunta;
