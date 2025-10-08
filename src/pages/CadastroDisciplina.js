import React, { useState } from 'react';
import { getApiUrl } from '../api';
import { useAuth } from '../context/AuthContext';
import { globalStyles } from './globalStyles';

function CadastroDisciplina() {
  const { user } = useAuth();
  const [form, setForm] = useState({ nome: '', peso: '', concursoId: '' });
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
    const res = await fetch(getApiUrl('/disciplina'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: form.nome,
        peso: parseFloat(form.peso),
        concursoId: parseInt(form.concursoId)
      })
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setForm({ nome: '', peso: '', concursoId: '' });
    } else {
      setError('Erro ao cadastrar disciplina.');
    }
  };

  return (
    <div style={globalStyles.pageContent}>
      <h2>Cadastro de Disciplina</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome da disciplina" required style={globalStyles.inputBase} />
        <input name="peso" value={form.peso} onChange={handleChange} placeholder="Peso" required type="number" step="0.1" style={globalStyles.inputBase} />
        <input name="concursoId" value={form.concursoId} onChange={handleChange} placeholder="ID do Concurso" required type="number" style={globalStyles.inputBase} />
        <button type="submit" style={globalStyles.button} disabled={loading}>{loading ? 'Enviando...' : 'Cadastrar'}</button>
        {success && <p style={{ color: 'green' }}>Disciplina cadastrada com sucesso!</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default CadastroDisciplina;
