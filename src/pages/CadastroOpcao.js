import React, { useState } from 'react';
import { getApiUrl } from '../api';
import { globalStyles } from './globalStyles';

function CadastroOpcao() {
  const [form, setForm] = useState({ texto: '', perguntaId: '' });
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
    const res = await fetch(getApiUrl('/opcao'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texto: form.texto,
        perguntaId: parseInt(form.perguntaId)
      })
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setForm({ texto: '', perguntaId: '' });
    } else {
      setError('Erro ao cadastrar opção.');
    }
  };

  return (
    <div style={globalStyles.pageContent}>
      <h2>Cadastro de Opção</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <input name="texto" value={form.texto} onChange={handleChange} placeholder="Texto da opção" required style={globalStyles.inputBase} />
        <input name="perguntaId" value={form.perguntaId} onChange={handleChange} placeholder="ID da Pergunta" required type="number" style={globalStyles.inputBase} />
        <button type="submit" style={globalStyles.button} disabled={loading}>{loading ? 'Enviando...' : 'Cadastrar'}</button>
        {success && <p style={{ color: 'green' }}>Opção cadastrada com sucesso!</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default CadastroOpcao;
