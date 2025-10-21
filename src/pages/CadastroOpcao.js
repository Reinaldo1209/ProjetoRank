import React, { useState } from 'react';
import { getApiUrl, authFetch } from '../api';
// styles moved to src/pages/global.css (CSS variables + utility classes)

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
    const res = await authFetch('/opcao', {
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
    <div className="container py-4">
      <div className="page-content">
        <h2>Cadastro de Opção</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
          <input className="form-control mb-3 input-base" name="texto" value={form.texto} onChange={handleChange} placeholder="Texto da opção" required />
          <input className="form-control mb-3 input-base" name="perguntaId" value={form.perguntaId} onChange={handleChange} placeholder="ID da Pergunta" required type="number" />
          <button type="submit" className="global-button" disabled={loading}>{loading ? 'Enviando...' : 'Cadastrar'}</button>
          {success && <p style={{ color: 'green' }}>Opção cadastrada com sucesso!</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default CadastroOpcao;
