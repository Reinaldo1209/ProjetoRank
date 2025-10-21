import React, { useState } from 'react';
import { getApiUrl, authFetch } from '../api';
import { useAuth } from '../context/AuthContext';
// styles moved to src/pages/global.css (CSS variables + utility classes)

function CadastroRespostaUsuario() {
  const { user } = useAuth();
  const [form, setForm] = useState({ concursoId: '', disciplinaId: '', perguntaId: '', opcaoId: '' });
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
    if (!user) {
      setError('Você precisa estar logado para cadastrar respostas.');
      setLoading(false);
      return;
    }

    const res = await authFetch('/respostausuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuarioId: user?.id,
        concursoId: parseInt(form.concursoId),
        disciplinaId: parseInt(form.disciplinaId),
        perguntaId: parseInt(form.perguntaId),
        opcaoId: parseInt(form.opcaoId)
      })
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setForm({ concursoId: '', disciplinaId: '', perguntaId: '', opcaoId: '' });
    } else {
      setError('Erro ao cadastrar resposta.');
    }
  };

  return (
    <div className="container py-4">
      <div className="page-content">
        <h2>Cadastro de Resposta do Usuário</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
          <input className="form-control mb-3 input-base" name="concursoId" value={form.concursoId} onChange={handleChange} placeholder="ID do Concurso" required type="number" />
          <input className="form-control mb-3 input-base" name="disciplinaId" value={form.disciplinaId} onChange={handleChange} placeholder="ID da Disciplina" required type="number" />
          <input className="form-control mb-3 input-base" name="perguntaId" value={form.perguntaId} onChange={handleChange} placeholder="ID da Pergunta" required type="number" />
          <input className="form-control mb-3 input-base" name="opcaoId" value={form.opcaoId} onChange={handleChange} placeholder="ID da Opção" required type="number" />
          <button type="submit" className="global-button" disabled={loading}>{loading ? 'Enviando...' : 'Cadastrar'}</button>
          {success && <p style={{ color: 'green' }}>Resposta cadastrada com sucesso!</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default CadastroRespostaUsuario;
