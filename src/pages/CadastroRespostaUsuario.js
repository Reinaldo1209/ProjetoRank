import React, { useState } from 'react';
import { getApiUrl } from '../api';
import { useAuth } from '../context/AuthContext';
import { globalStyles } from './globalStyles';

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
    const res = await fetch(getApiUrl('/respostausuario'), {
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
    <div style={globalStyles.pageContent}>
      <h2>Cadastro de Resposta do Usuário</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <input name="concursoId" value={form.concursoId} onChange={handleChange} placeholder="ID do Concurso" required type="number" style={globalStyles.inputBase} />
        <input name="disciplinaId" value={form.disciplinaId} onChange={handleChange} placeholder="ID da Disciplina" required type="number" style={globalStyles.inputBase} />
        <input name="perguntaId" value={form.perguntaId} onChange={handleChange} placeholder="ID da Pergunta" required type="number" style={globalStyles.inputBase} />
        <input name="opcaoId" value={form.opcaoId} onChange={handleChange} placeholder="ID da Opção" required type="number" style={globalStyles.inputBase} />
        <button type="submit" style={globalStyles.button} disabled={loading}>{loading ? 'Enviando...' : 'Cadastrar'}</button>
        {success && <p style={{ color: 'green' }}>Resposta cadastrada com sucesso!</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default CadastroRespostaUsuario;
