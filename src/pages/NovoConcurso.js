// import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { globalStyles } from './globalStyles';
import { useConcursos } from '../context/ConcursosContext';

const tiposProva = [
  'Objetiva',
  'Discursiva',
  'Redação',
  
];
const tiposGabarito = [
  'ABCD',
  'ABCDE',
];

const NovoConcurso = () => {
  const [form, setForm] = useState({
    nome: '',
    organizadora: '',
    encerramento: '',
    vagas: '',
    inscritos: '',
    qtdQuestoes: '',
    tipoGabarito: '',
    logo: '', // url base64
  });
  const [editId, setEditId] = useState(null);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const { concursos, adicionarConcurso, excluirConcurso, atualizarConcurso } = useConcursos();

  // Simulação de verificação de admin
  const isAdmin = true; // Trocar por lógica real de autenticação

  if (!isAdmin) {
    return <main style={globalStyles.pageContent}><h2 style={globalStyles.h2}>Acesso restrito</h2><p>Somente administradores podem acessar esta página.</p></main>;
  }

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'logo' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.nome || !form.organizadora || !form.encerramento || !form.vagas || !form.inscritos || !form.qtdQuestoes || !form.tipoGabarito) {
      setErro('Preencha todos os campos!');
      return;
    }
    // Formatar data para dd/mm/aaaa
    let data = form.encerramento;
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      const [yyyy, mm, dd] = data.split('-');
      data = `${dd}/${mm}/${yyyy}`;
    }
    if (editId) {
      atualizarConcurso({
        id: editId,
        nome: form.nome,
        organizadora: form.organizadora,
        encerramento: data,
        vagas: form.vagas,
        inscritos: form.inscritos,
        qtdQuestoes: form.qtdQuestoes,
        tipoGabarito: form.tipoGabarito,
        logo: form.logo,
      });
      alert('Concurso atualizado com sucesso!');
    } else {
      adicionarConcurso({
        nome: form.nome,
        organizadora: form.organizadora,
        encerramento: data,
        vagas: form.vagas,
        inscritos: form.inscritos,
        qtdQuestoes: form.qtdQuestoes,
        tipoGabarito: form.tipoGabarito,
        logo: form.logo,
      });
      alert('Concurso cadastrado com sucesso!');
    }
    setForm({
      nome: '',
      organizadora: '',
      encerramento: '',
      vagas: '',
      inscritos: '',
      qtdQuestoes: '',
      tipoGabarito: '',
      logo: '',
    });
    setEditId(null);
    setErro('');
  };

  return (
    <main style={globalStyles.pageContent}>
      <h2 style={globalStyles.h2}>Cadastrar Novo Concurso</h2>
  <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }} encType="multipart/form-data">
        <label>
          Logo do Concurso:
          <input type="file" name="logo" accept="image/*" onChange={handleChange} style={{ marginTop: 6 }} />
          {form.logo && (
            <img src={form.logo} alt="Logo preview" style={{ maxWidth: 80, maxHeight: 80, marginTop: 12, borderRadius: 8, border: '1px solid #ccc' }} />
          )}
        </label>
        <label>
          Nome do Concurso:
          <input type="text" name="nome" value={form.nome} onChange={handleChange} style={inputStyle} />
        </label>
        <label>
          Banca Organizadora:
          <input type="text" name="organizadora" value={form.organizadora} onChange={handleChange} style={inputStyle} />
        </label>
        <label>
          Data de Encerramento:
          <input type="date" name="encerramento" value={form.encerramento} onChange={handleChange} style={inputStyle} />
        </label>
        <label>
          Número de Vagas:
          <input type="number" name="vagas" value={form.vagas} onChange={handleChange} style={inputStyle} min={1} />
        </label>
        <label>
          Número de Inscritos:
          <input type="number" name="inscritos" value={form.inscritos} onChange={handleChange} style={inputStyle} min={0} />
        </label>
        <label>
          {/* Campo Tipo de Prova removido */}
          Quantidade de Questões:
          <input type="number" name="qtdQuestoes" value={form.qtdQuestoes} onChange={handleChange} style={inputStyle} min={1} />
        </label>
        <label>
          Tipo de Gabarito:
          <select name="tipoGabarito" value={form.tipoGabarito} onChange={handleChange} style={inputStyle}>
            <option value="">Selecione</option>
            {tiposGabarito.map(tg => <option key={tg} value={tg}>{tg}</option>)}
          </select>
        </label>
        {erro && <p style={{ color: 'red', marginTop: -16 }}>{erro}</p>}
        <button type="submit" style={globalStyles.button}>Cadastrar Concurso</button>
      </form>

      <h3 style={{ marginTop: '48px', marginBottom: '24px', color: '#7C5C3B' }}>Concursos Cadastrados</h3>
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {concursos.map((c) => (
          <div key={c.id} style={{ ...globalStyles.card, position: 'relative', minHeight: 180 }}>
            {c.logo && (
              <img src={c.logo} alt="Logo" style={{ maxWidth: 80, maxHeight: 80, position: 'absolute', top: 12, left: 12, borderRadius: 8, border: '1px solid #ccc' }} />
            )}
            <h4 style={{ marginBottom: '8px', color: '#402F1D', marginLeft: c.logo ? 100 : 0 }}>{c.nome}</h4>
            <p><strong>Organizadora:</strong> {c.organizadora}</p>
            <p><strong>Encerramento:</strong> {c.encerramento}</p>
            <p><strong>Vagas:</strong> {c.vagas}</p>
            <p><strong>Inscritos:</strong> {c.inscritos}</p>
            {/* Campo Tipo de Prova removido */}
            <p><strong>Questões:</strong> {c.qtdQuestoes}</p>
            <p><strong>Tipo de Gabarito:</strong> {c.tipoGabarito}</p>
            <button onClick={() => excluirConcurso(c.id)} style={{ position: 'absolute', top: 12, right: 12, background: '#c00', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>Excluir</button>
            <button onClick={() => {
              setEditId(c.id);
              setForm({
                nome: c.nome || '',
                organizadora: c.organizadora || '',
                encerramento: c.encerramento || '',
                vagas: c.vagas || '',
                inscritos: c.inscritos || '',
                qtdQuestoes: c.qtdQuestoes || '',
                tipoGabarito: c.tipoGabarito || '',
                logo: c.logo || '',
              });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} style={{ position: 'absolute', top: 12, right: 90, background: '#f7b731', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>Editar</button>
            <button onClick={() => navigate(`/formulario?concurso=${c.id}&definitivo=true`)} style={{ position: 'absolute', top: 12, right: 180, background: '#2d9cdb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>Gabarito Definitivo</button>
          </div>
        ))}
      </div>
    </main>
  );
};

const inputStyle = {
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  marginTop: '6px',
  fontSize: '1rem',
  width: '100%',
};

export default NovoConcurso;
