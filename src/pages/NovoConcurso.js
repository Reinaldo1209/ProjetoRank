import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConcursos } from '../context/ConcursosContext';
import { useAuth } from '../context/AuthContext';
import { authFetch } from '../api';

const tiposGabarito = ['ABCD', 'ABCDE'];

const NovoConcurso = () => {
  const [form, setForm] = useState({ nome: '', organizadora: '', dataProva: '', vagas: '', inscritos: '', qtdQuestoes: '', tipoGabarito: '', logo: '' });
  const [editId, setEditId] = useState(null);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const { concursos, adicionarConcurso, excluirConcurso, atualizarConcurso } = useConcursos();
  const { user, loading } = useAuth();
  const [discs, setDiscs] = useState([]);

  if (loading) return <main className="page-content"><h2 className="global-h2">Carregando...</h2></main>;
  const isAdmin = user?.role && user.role.toLowerCase() === 'admin';
  if (!isAdmin) return <main className="page-content"><h2 className="global-h2">Acesso restrito</h2><p>Somente administradores podem acessar esta página.</p></main>;

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'logo' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setForm(prev => ({ ...prev, logo: reader.result }));
      reader.readAsDataURL(files[0]);
    } else setForm({ ...form, [name]: value });
  };

  function addDisciplina() { setDiscs(prev => [...prev, { nome: '', peso: 1, perguntas: [] }]); }
  function removeDisciplina(idx) { setDiscs(prev => prev.filter((_, i) => i !== idx)); }
  function updateDisciplina(idx, patch) { setDiscs(prev => prev.map((d, i) => i === idx ? { ...d, ...patch } : d)); }
  function addPergunta(dIdx) { setDiscs(prev => prev.map((d, i) => i === dIdx ? { ...d, perguntas: [...d.perguntas, { texto: '', peso: 1, opcoes: [] }] } : d)); }
  function removePergunta(dIdx, pIdx) { setDiscs(prev => prev.map((d, i) => i === dIdx ? { ...d, perguntas: d.perguntas.filter((_, j) => j !== pIdx) } : d)); }
  function updatePergunta(dIdx, pIdx, patch) { setDiscs(prev => prev.map((d, i) => i === dIdx ? { ...d, perguntas: d.perguntas.map((p, j) => j === pIdx ? { ...p, ...patch } : p) } : d)); }
  function addOpcao(dIdx, pIdx) { setDiscs(prev => prev.map((d, i) => i === dIdx ? { ...d, perguntas: d.perguntas.map((p, j) => j === pIdx ? { ...p, opcoes: [...p.opcoes, { texto: '' }] } : p) } : d)); }
  function removeOpcao(dIdx, pIdx, oIdx) { setDiscs(prev => prev.map((d, i) => i === dIdx ? { ...d, perguntas: d.perguntas.map((p, j) => j === pIdx ? { ...p, opcoes: p.opcoes.filter((_, k) => k !== oIdx) } : p) } : d)); }
  function updateOpcao(dIdx, pIdx, oIdx, texto) { setDiscs(prev => prev.map((d, i) => i === dIdx ? { ...d, perguntas: d.perguntas.map((p, j) => j === pIdx ? { ...p, opcoes: p.opcoes.map((o, k) => k === oIdx ? { ...o, texto } : o) } : p) } : d)); }

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.nome || !form.organizadora || !form.dataProva || !form.vagas || !form.inscritos || !form.qtdQuestoes || !form.tipoGabarito) {
      setErro('Preencha todos os campos!');
      return;
    }
    let data = form.dataProva;
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      const [yyyy, mm, dd] = data.split('-');
      data = `${dd}/${mm}/${yyyy}`;
    }

    if (discs.length > 0) {
      const payload = {
        nome: form.nome,
        banca: form.organizadora,
        numeroVagas: Number(form.vagas || 0),
        tipoProva: form.tipoGabarito,
        disciplinas: discs.map(d => ({ nome: d.nome, peso: Number(d.peso || 1), perguntas: (d.perguntas || []).map(p => ({ texto: p.texto, peso: Number(p.peso || 1), opcoes: (p.opcoes || []).map(o => ({ texto: o.texto })) })) }))
      };
      (async () => {
        const res = await authFetch('/concurso/completo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (res.ok) {
          const created = await res.json();
          if (created) adicionarConcurso(created);
          alert('Concurso completo cadastrado com sucesso!');
          navigate('/concursos');
        } else {
          const txt = await res.text();
          setErro('Erro ao cadastrar: ' + (txt || res.statusText));
        }
      })();
    } else if (editId) {
      atualizarConcurso({ id: editId, nome: form.nome, organizadora: form.organizadora, dataProva: data, vagas: form.vagas, inscritos: form.inscritos, qtdQuestoes: form.qtdQuestoes, tipoGabarito: form.tipoGabarito, logo: form.logo });
      alert('Concurso atualizado com sucesso!');
    } else {
      adicionarConcurso({ nome: form.nome, organizadora: form.organizadora, dataProva: data, vagas: form.vagas, inscritos: form.inscritos, qtdQuestoes: form.qtdQuestoes, tipoGabarito: form.tipoGabarito, logo: form.logo });
      alert('Concurso cadastrado com sucesso!');
    }

    setForm({ nome: '', organizadora: '', dataProva: '', vagas: '', inscritos: '', qtdQuestoes: '', tipoGabarito: '', logo: '' });
    setEditId(null); setErro(''); setDiscs([]);
  };

  return (
    <main className="page-content">
      <h2 className="global-h2">Cadastrar Novo Concurso</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }} encType="multipart/form-data">
        <label>Logo do Concurso:
          <input type="file" name="logo" accept="image/*" onChange={handleChange} style={{ marginTop: 6 }} />
          {form.logo && (<img src={form.logo} alt="Logo preview" style={{ maxWidth: 80, maxHeight: 80, marginTop: 12, borderRadius: 8, border: '1px solid #ccc' }} />)}
        </label>
        <label>Nome do Concurso:<input type="text" name="nome" value={form.nome} onChange={handleChange} style={inputStyle} /></label>
        <label>Banca Organizadora:<input type="text" name="organizadora" value={form.organizadora} onChange={handleChange} style={inputStyle} /></label>
        <label>Data da Prova:<input type="date" name="dataProva" value={form.dataProva} onChange={handleChange} style={inputStyle} /></label>
        <label>Número de Vagas:<input type="number" name="vagas" value={form.vagas} onChange={handleChange} style={inputStyle} min={1} /></label>
        <label>Número de Inscritos:<input type="number" name="inscritos" value={form.inscritos} onChange={handleChange} style={inputStyle} min={0} /></label>
        <label>Quantidade de Questões:<input type="number" name="qtdQuestoes" value={form.qtdQuestoes} onChange={handleChange} style={inputStyle} min={1} /></label>
        <label>Tipo de Gabarito:
          <select name="tipoGabarito" value={form.tipoGabarito} onChange={handleChange} style={inputStyle}><option value="">Selecione</option>{tiposGabarito.map(tg => <option key={tg} value={tg}>{tg}</option>)}</select>
        </label>

        <div style={{ border: '1px dashed #ddd', padding: 12, borderRadius: 8 }}>
          <h4 style={{ margin: '6px 0' }}>Disciplinas (opcional)</h4>
          {discs.map((d, di) => (
            <div key={di} style={{ marginBottom: 12, padding: 8, background: '#fafafa', borderRadius: 6 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input placeholder="Nome da disciplina" value={d.nome} onChange={e => updateDisciplina(di, { nome: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                <input type="number" step="0.1" min={0} placeholder="Peso" value={d.peso} onChange={e => updateDisciplina(di, { peso: e.target.value })} style={{ width: 120 }} />
                <button type="button" onClick={() => removeDisciplina(di)} style={{ background: '#c00', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Remover</button>
              </div>
              <div style={{ marginTop: 8 }}>
                <h5>Perguntas</h5>
                {(d.perguntas || []).map((p, pi) => (
                  <div key={pi} style={{ marginBottom: 8, padding: 8, border: '1px solid #eee', borderRadius: 6 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input placeholder="Texto da pergunta" value={p.texto} onChange={e => updatePergunta(di, pi, { texto: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                      <input type="number" step="0.1" min={0} placeholder="Peso" value={p.peso} onChange={e => updatePergunta(di, pi, { peso: e.target.value })} style={{ width: 120 }} />
                      <button type="button" onClick={() => removePergunta(di, pi)} style={{ background: '#c00', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Remover</button>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <h6>Opções</h6>
                      {(p.opcoes || []).map((o, oi) => (
                        <div key={oi} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                          <input placeholder="Texto da opção" value={o.texto} onChange={e => updateOpcao(di, pi, oi, e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                          <button type="button" onClick={() => removeOpcao(di, pi, oi)} style={{ background: '#c00', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Remover</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addOpcao(di, pi)} style={{ background: '#2d9cdb', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Adicionar Opção</button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addPergunta(di)} style={{ marginTop: 8, background: '#2d9cdb', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Adicionar Pergunta</button>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            <button type="button" onClick={addDisciplina} style={{ background: '#27ae60', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6 }}>Adicionar Disciplina</button>
          </div>
        </div>

        {erro && <p style={{ color: 'red', marginTop: -16 }}>{erro}</p>}
        <button type="submit" className="global-button">Cadastrar Concurso</button>
      </form>

      <h3 style={{ marginTop: '48px', marginBottom: '24px', color: 'var(--primary)' }}>Concursos Cadastrados</h3>
      <div className="row gx-4 gy-4">
        {concursos.map((c) => (
          <div key={c.id} className="col-12 col-md-6 col-lg-4">
            <div className="global-card" style={{ position: 'relative', minHeight: 180 }}>
              {c.logo && (<img src={c.logo} alt="Logo" style={{ maxWidth: 80, maxHeight: 80, position: 'absolute', top: 12, left: 12, borderRadius: 8, border: '1px solid #ccc' }} />)}
              <h4 style={{ marginBottom: '8px', color: '#402F1D', marginLeft: c.logo ? 100 : 0 }}>{c.nome}</h4>
              <p><strong>Organizadora:</strong> {c.organizadora}</p>
              <p><strong>Data da Prova:</strong> {c.dataProva}</p>
              <p><strong>Vagas:</strong> {c.vagas}</p>
              <p><strong>Inscritos:</strong> {c.inscritos}</p>
              <p><strong>Questões:</strong> {c.qtdQuestoes}</p>
              <p><strong>Tipo de Gabarito:</strong> {c.tipoGabarito}</p>
              <button onClick={() => excluirConcurso(c.id)} style={{ position: 'absolute', top: 12, right: 12, background: '#c00', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>Excluir</button>
              <button onClick={() => { setEditId(c.id); setForm({ nome: c.nome || '', organizadora: c.organizadora || '', dataProva: c.dataProva || '', vagas: c.vagas || '', inscritos: c.inscritos || '', qtdQuestoes: c.qtdQuestoes || '', tipoGabarito: c.tipoGabarito || '', logo: c.logo || '' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ position: 'absolute', top: 12, right: 90, background: '#f7b731', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>Editar</button>
              <button onClick={() => navigate(`/formulario?concurso=${c.id}&definitivo=true`)} style={{ position: 'absolute', top: 12, right: 180, background: '#2d9cdb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>Gabarito Definitivo</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '6px', fontSize: '1rem', width: '100%' };

export default NovoConcurso;
