import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConcursos } from '../context/ConcursosContext';
import { useAuth } from '../context/AuthContext';
import { authFetch } from '../api';

const tiposGabarito = ['ABCD', 'ABCDE'];

// --- Seção de Estilos para o formulário ---
const formContainerStyle = {
  maxWidth: 900,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
};

const gridContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '24px',
};

const fieldsetStyle = {
  border: '1px solid #eee',
  padding: '16px 24px 24px 24px',
  borderRadius: '8px',
  margin: 0,
};

const legendStyle = {
  fontWeight: 'bold',
  color: 'var(--primary, #333)',
  padding: '0 8px',
  fontSize: '1.1rem',
  width: 'auto',
  margin: '0 0 0 16px', // Ajuste para alinhar com o padding do fieldset
};

const disciplinaCardStyle = {
  marginBottom: 16,
  padding: 16,
  background: '#fafafa',
  borderRadius: 8,
  border: '1px solid #eee',
};

const perguntaCardStyle = {
  marginTop: 12,
  padding: 12,
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: 6,
  marginLeft: 16,
};

const opcaoItemStyle = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  marginBottom: 6,
  marginLeft: 16, // Indentação
};

const baseButtonStyle = {
  border: 'none',
  padding: '8px 12px',
  borderRadius: 6,
  color: '#fff',
  cursor: 'pointer',
  fontSize: '0.9rem',
};

const removeBtnStyle = {
  ...baseButtonStyle,
  background: '#c00',
};

const addBtnStyle = {
  ...baseButtonStyle,
  background: '#2d9cdb',
};

const addDisciplinaBtnStyle = {
  ...baseButtonStyle,
  background: '#27ae60',
  padding: '10px 16px',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  marginTop: '6px',
  fontSize: '1rem',
  width: '100%',
  boxSizing: 'border-box', // Garante que o padding não quebre o layout
};
// --- Fim da Seção de Estilos ---

// Helper para formatar data 'dd/mm/yyyy' para 'yyyy-mm-dd' (para o input type="date")
const formatarDataParaInput = (dataStr) => {
  if (!dataStr || !/^\d{2}\/\d{2}\/\d{4}$/.test(dataStr)) return '';
  const [dd, mm, yyyy] = dataStr.split('/');
  return `${yyyy}-${mm}-${dd}`;
};

const NovoConcurso = () => {
  const [form, setForm] = useState({ nome: '', organizadora: '', dataProva: '', vagasAmpla: '', vagasPPP: '', vagasPCD: '', vagasPI: '', inscritos: '', ausentes: '', guerreiros: '', qtdQuestoes: '', tipoGabarito: '', logo: '' });
  const [editId, setEditId] = useState(null);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const { concursos, adicionarConcurso, excluirConcurso, atualizarConcurso } = useConcursos();
  const { user, loading } = useAuth();
  const [discs, setDiscs] = useState([]);

  if (loading) return <main className="page-content"><h2 className="global-h2">Carregando...</h2></main>;

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
    if (!form.nome || !form.organizadora || !form.dataProva || !form.qtdQuestoes || !form.tipoGabarito) {
      setErro('Preencha os campos principais: Nome, Organizadora, Data, Qtd. Questões e Tipo de Gabarito!');
      return;
    }
    let data = form.dataProva;
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      const [yyyy, mm, dd] = data.split('-');
      data = `${dd}/${mm}/${yyyy}`;
    }

    // Objeto comum para adicionar/atualizar
    const concursoData = {
      nome: form.nome,
      organizadora: form.organizadora,
      dataProva: data,
      vagasAmpla: Number(form.vagasAmpla || 0),
      vagasPPP: Number(form.vagasPPP || 0),
      vagasPCD: Number(form.vagasPCD || 0),
      vagasPI: Number(form.vagasPI || 0),
      inscritos: Number(form.inscritos || 0),
      ausentes: Number(form.ausentes || 0),
      guerreiros: Number(form.guerreiros || 0),
      qtdQuestoes: Number(form.qtdQuestoes || 0),
      tipoGabarito: form.tipoGabarito,
      logo: form.logo,
    };

    if (discs.length > 0) {
      const payload = {
        nome: form.nome,
        banca: form.organizadora,
        vagasAmpla: Number(form.vagasAmpla || 0),
        vagasPPP: Number(form.vagasPPP || 0),
        vagasPCD: Number(form.vagasPCD || 0),
        vagasPI: Number(form.vagasPI || 0),
        inscritos: Number(form.inscritos || 0),
        ausentes: Number(form.ausentes || 0),
        guerreiros: Number(form.guerreiros || 0),
        tipoProva: form.tipoGabarito,
        disciplinas: discs.map(d => ({ nome: d.nome, peso: Number(d.peso || 1), perguntas: (d.perguntas || []).map(p => ({ texto: p.texto, peso: Number(p.peso || 1), opcoes: (p.opcoes || []).map(o => ({ texto: o.texto })) })) }))
      };
      (async () => {
        const res = await authFetch('/concurso', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (res.ok) {
          const created = await res.json();
          if (created) adicionarConcurso(created); // Assumindo que o 'created' tem a estrutura certa
          alert('Concurso completo cadastrado com sucesso!');
          navigate('/concursos');
        } else {
          const txt = await res.text();
          setErro('Erro ao cadastrar: ' + (txt || res.statusText));
        }
      })();
    } else if (editId) {
      atualizarConcurso({ id: editId, ...concursoData });
      alert('Concurso atualizado com sucesso!');
    } else {
      adicionarConcurso(concursoData);
      alert('Concurso cadastrado com sucesso!');
    }

    setForm({ nome: '', organizadora: '', dataProva: '', vagasAmpla: '', vagasPPP: '', vagasPCD: '', vagasPI: '', inscritos: '', ausentes: '', guerreiros: '', qtdQuestoes: '', tipoGabarito: '', logo: '' });
    setEditId(null); setErro(''); setDiscs([]);
  };

  const handleEditClick = (c) => {
    setForm({
      nome: c.nome || '',
      organizadora: c.organizadora || '',
      dataProva: formatarDataParaInput(c.dataProva), // Converte 'dd/mm/yyyy' para 'yyyy-mm-dd'
      vagasAmpla: c.vagasAmpla || '',
      vagasPPP: c.vagasPPP || '',
      vagasPCD: c.vagasPCD || '',
      vagasPI: c.vagasPI || '',
      inscritos: c.inscritos || '',
      ausentes: c.ausentes || '',
      guerreiros: c.guerreiros || '',
      qtdQuestoes: c.qtdQuestoes || '',
      tipoGabarito: c.tipoGabarito || '',
      logo: c.logo || ''
    });
    setEditId(c.id);
    setDiscs([]); // Limpa disciplinas ao editar (a edição de disciplinas não estava implementada)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calcula o total de vagas para exibição no card
  const calcularTotalVagas = (c) => {
    const total = (Number(c.vagasAmpla) || 0) + (Number(c.vagasPPP) || 0) + (Number(c.vagasPCD) || 0) + (Number(c.vagasPI) || 0);
    return total > 0 ? total : (c.vagas || 'N/A'); // Fallback para o 'c.vagas' antigo
  };

  return (
    <main className="page-content">
      <h2 className="global-h2">{editId ? 'Editar Concurso' : 'Cadastrar Novo Concurso'}</h2>
      <form onSubmit={handleSubmit} style={formContainerStyle} encType="multipart/form-data">

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Informações Básicas</legend>
          <div style={gridContainerStyle}>
            <label>Nome do Concurso:<input type="text" name="nome" value={form.nome} onChange={handleChange} style={inputStyle} /></label>
            <label>Banca Organizadora:<input type="text" name="organizadora" value={form.organizadora} onChange={handleChange} style={inputStyle} /></label>
            <label>Data da Prova:<input type="date" name="dataProva" value={form.dataProva} onChange={handleChange} style={inputStyle} /></label>
            <label>Quantidade de Questões:<input type="number" name="qtdQuestoes" value={form.qtdQuestoes} onChange={handleChange} style={inputStyle} min={1} /></label>
            <label>Tipo de Gabarito:
              <select name="tipoGabarito" value={form.tipoGabarito} onChange={handleChange} style={inputStyle}><option value="">Selecione</option>{tiposGabarito.map(tg => <option key={tg} value={tg}>{tg}</option>)}</select>
            </label>
            <label>Logo do Concurso (Opcional):
              <input type="file" name="logo" accept="image/*" onChange={handleChange} style={{ ...inputStyle, padding: '10px 0 0 0', border: 'none' }} />
              {form.logo && (<img src={form.logo} alt="Logo preview" style={{ maxWidth: 80, maxHeight: 80, marginTop: 12, borderRadius: 8, border: '1px solid #ccc' }} />)}
            </label>
          </div>
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Quadro de Vagas (Opcional)</legend>
          <div style={gridContainerStyle}>
            <label>Vagas (Ampla Concorrência):<input type="number" name="vagasAmpla" value={form.vagasAmpla} onChange={handleChange} style={inputStyle} min={0} /></label>
            <label>Vagas (PPP - Pretos/Pardos):<input type="number" name="vagasPPP" value={form.vagasPPP} onChange={handleChange} style={inputStyle} min={0} /></label>
            <label>Vagas (PCD - Pessoa c/ Def.):<input type="number" name="vagasPCD" value={form.vagasPCD} onChange={handleChange} style={inputStyle} min={0} /></label>
            <label>Vagas (PI - Indígenas):<input type="number" name="vagasPI" value={form.vagasPI} onChange={handleChange} style={inputStyle} min={0} /></label>
          </div>
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Estatísticas de Inscrição (Opcional)</legend>
          <div style={{ ...gridContainerStyle, gridTemplateColumns: '1fr 1fr 1fr' }}>
            <label>Total de Inscritos:<input type="number" name="inscritos" value={form.inscritos} onChange={handleChange} style={inputStyle} min={0} /></label>
            <label>Ausentes:<input type="number" name="ausentes" value={form.ausentes} onChange={handleChange} style={inputStyle} min={0} /></label>
            <label>Guerreiros (Presentes):<input type="number" name="guerreiros" value={form.guerreiros} onChange={handleChange} style={inputStyle} min={0} /></label>
          </div>
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Disciplinas e Questões (Opcional)</legend>
          <p style={{ marginTop: 0, color: '#555', fontSize: '0.9rem' }}>
            Preencha esta seção para cadastrar a prova completa e gerar gabaritos detalhados.
          </p>
          {discs.map((d, di) => (
            <div key={di} style={disciplinaCardStyle}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input placeholder="Nome da disciplina" value={d.nome} onChange={e => updateDisciplina(di, { nome: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                <input type="number" step="0.1" min={0} placeholder="Peso" value={d.peso} onChange={e => updateDisciplina(di, { peso: e.target.value })} style={{ ...inputStyle, width: 100 }} />
                <button type="button" onClick={() => removeDisciplina(di)} style={removeBtnStyle}>Remover</button>
              </div>
              <div style={{ marginTop: 12 }}>
                <h5 style={{ margin: '0 0 8px 16px' }}>Perguntas</h5>
                {(d.perguntas || []).map((p, pi) => (
                  <div key={pi} style={perguntaCardStyle}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input placeholder="Texto da pergunta (opcional)" value={p.texto} onChange={e => updatePergunta(di, pi, { texto: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                      <input type="number" step="0.1" min={0} placeholder="Peso" value={p.peso} onChange={e => updatePergunta(di, pi, { peso: e.target.value })} style={{ ...inputStyle, width: 100 }} />
                      <button type="button" onClick={() => removePergunta(di, pi)} style={removeBtnStyle}>Remover</button>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <h6 style={{ margin: '0 0 8px 16px' }}>Opções</h6>
                      {(p.opcoes || []).map((o, oi) => (
                        <div key={oi} style={opcaoItemStyle}>
                          <span style={{ fontWeight: 500, minWidth: 20 }}>{String.fromCharCode(65 + oi)}:</span>
                          <input placeholder="Texto da opção (opcional)" value={o.texto} onChange={e => updateOpcao(di, pi, oi, e.target.value)} style={{ ...inputStyle, flex: 1, marginTop: 0 }} />
                          <button type="button" onClick={() => removeOpcao(di, pi, oi)} style={{ ...removeBtnStyle, padding: '4px 8px', fontSize: '0.8rem' }}>X</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addOpcao(di, pi)} style={{ ...addBtnStyle, marginLeft: 16, marginTop: 4 }}>Adicionar Opção</button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addPergunta(di)} style={{ ...addBtnStyle, marginLeft: 16, marginTop: 12 }}>Adicionar Pergunta</button>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <button type="button" onClick={addDisciplina} style={addDisciplinaBtnStyle}>Adicionar Disciplina</button>
          </div>
        </fieldset>

        {erro && <p style={{ color: 'red', textAlign: 'center' }}>{erro}</p>}
        <button type="submit" className="global-button" style={{ padding: '12px 20px', fontSize: '1.1rem' }}>
          {editId ? 'Atualizar Concurso' : 'Cadastrar Concurso'}
        </button>
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
              <p><strong>Vagas:</strong> {calcularTotalVagas(c)}</p>
              <p><strong>Inscritos:</strong> {c.inscritos || 'N/A'}</p>
              <p><strong>Questões:</strong> {c.qtdQuestoes}</p>
              <p><strong>Tipo de Gabarito:</strong> {c.tipoGabarito}</p>
              <button onClick={() => excluirConcurso(c.id)} style={{ position: 'absolute', top: 12, right: 12, background: '#c00', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>Excluir</button>
              <button onClick={() => handleEditClick(c)} style={{ position: 'absolute', top: 12, right: 90, background: '#f7b731', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>Editar</button>
              <button onClick={() => navigate(`/formulario?concurso=${c.id}&definitivo=true`)} style={{ position: 'absolute', top: 12, right: 180, background: '#2d9cdb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>Gabarito Definitivo</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

// O inputStyle original não está mais no fim do arquivo, foi movido para a seção de estilos no topo.

export default NovoConcurso;