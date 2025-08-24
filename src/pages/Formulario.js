// src/pages/Formulario.js
import React, { useState } from 'react';
import { usePayment } from '../context/PaymentContext';
import { useNavigate } from 'react-router-dom';
// Supondo que globalStyles.js está em ../styles/globalStyles.js
import { PALETTE, globalStyles } from './globalStyles';
import { useConcursos } from '../context/ConcursosContext';

// --- ESTILOS ESPECÍFICOS DA PÁGINA ---
const pageStyles = {
  formContainer: {
    ...globalStyles.card, // Reutiliza o estilo base de card
    maxWidth: '700px',
    margin: '2rem auto', // Centraliza o card do formulário
    padding: '40px',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    fontWeight: '600',
    marginBottom: '8px',
    display: 'block',
    color: PALETTE.textDark,
  },
  // Estilo base para todos os campos de entrada
  inputBase: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: `2px solid ${PALETTE.border}`,
    backgroundColor: PALETTE.backgroundLight,
    fontSize: '1rem',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    outline: 'none', // Remove o outline padrão do navegador
  },
  // Estilo para quando o campo está em foco
  inputFocus: {
    borderColor: PALETTE.primary,
    boxShadow: `0 0 0 3px rgba(124, 92, 59, 0.15)`,
  },
  helperText: {
    fontSize: '0.85rem',
    color: PALETTE.textMedium,
    marginTop: '6px',
  },
  // Estilo para o botão desabilitado
  buttonDisabled: {
    ...globalStyles.button,
    backgroundColor: PALETTE.textMedium,
    cursor: 'not-allowed',
    boxShadow: 'none',
  }
};

function Formulario() {
  const navigate = useNavigate();
  const { concursos } = useConcursos();
  const { isPaid, confirmPayment } = usePayment();
  // Detecta se é gabarito definitivo via query param
  const params = new URLSearchParams(window.location.search);
  const isDefinitivo = params.get('definitivo') === 'true';
  const concursoParam = params.get('concurso');

  
  // --- ESTADOS DO FORMULÁRIO ---
  const [formData, setFormData] = useState({
  nome: '',
  concurso: concursoParam || '',
  gabarito: [],
  });
  // Estado para busca e filtro de concursos
  const [buscaConcurso, setBuscaConcurso] = useState('');
  const concursosFiltrados = buscaConcurso
    ? concursos.filter(c => c.nome.toLowerCase().includes(buscaConcurso.toLowerCase()))
    : concursos;
  const [isLoading, setIsLoading] = useState(false);
  // Estado para controlar o foco de cada campo
  const [focus, setFocus] = useState({});

  const handleFocus = (field) => setFocus({ ...focus, [field]: true });
  const handleBlur = (field) => setFocus({ ...focus, [field]: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGabaritoChange = (questaoIdx, alternativa) => {
    setFormData(prev => {
      const novoGabarito = [...prev.gabarito];
      novoGabarito[questaoIdx] = alternativa;
      return { ...prev, gabarito: novoGabarito };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Monta o JSON para envio
    const concursoSelecionado = concursos.find(c => String(c.id) === String(formData.concurso));
    const dadosEnvio = {
      usuario: {
        nome: formData.nome,
      },
      concurso: {
        id: concursoSelecionado?.id,
        nome: concursoSelecionado?.nome,
        organizadora: concursoSelecionado?.organizadora,
        encerramento: concursoSelecionado?.encerramento,
        vagas: concursoSelecionado?.vagas,
        qtdQuestoes: concursoSelecionado?.qtdQuestoes,
      },
      gabarito: formData.gabarito,
      definitivo: isDefinitivo,
    };
    if (isDefinitivo) {
      // Simula envio especial para backend
      setTimeout(() => {
        console.log("Gabarito definitivo enviado:", JSON.stringify(dadosEnvio, null, 2));
        setIsLoading(false);
        alert('Gabarito definitivo cadastrado com sucesso!');
        navigate('/concursos');
      }, 1500);
    } else {
      setTimeout(() => {
        console.log("JSON para envio:", JSON.stringify(dadosEnvio, null, 2));
        setIsLoading(false);
        navigate('/checkout');
      }, 1500);
    }
  };

  // Obter concurso selecionado
  const concursoSelecionado = concursos.find(c => String(c.id) === String(formData.concurso));
  const qtdQuestoes = concursoSelecionado?.qtdQuestoes ? Number(concursoSelecionado.qtdQuestoes) : 0;
  const alternativas = ['A', 'B', 'C', 'D', 'E'];

  // Agrupar questões em colunas de 20
  const gruposQuestoes = [];
  for (let i = 0; i < qtdQuestoes; i += 20) {
    gruposQuestoes.push(Array.from({ length: Math.min(20, qtdQuestoes - i) }, (_, idx) => i + idx));
  }

  return (
    <div style={globalStyles.pageContent}>
      <div style={{
        ...pageStyles.formContainer,
        border: isDefinitivo ? '3px solid #2d9cdb' : undefined,
        background: isDefinitivo ? '#eaf6fb' : undefined,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={globalStyles.h1}>{isDefinitivo ? '📝 Gabarito Definitivo' : '📝 Enviar Gabarito'}</h1>
          {isDefinitivo ? (
            <p style={{ color: '#2d9cdb', fontWeight: 'bold' }}>Este gabarito será usado como base para o cálculo da nota de corte do concurso.</p>
          ) : (
            <p>Preencha os dados abaixo para calcular sua nota e entrar no ranking.</p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={pageStyles.formGroup}>
            <label htmlFor="nome" style={pageStyles.label}>Seu Nome ou Apelido</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              onFocus={() => handleFocus('nome')}
              onBlur={() => handleBlur('nome')}
              placeholder="Como você quer aparecer no ranking?"
              style={{ ...pageStyles.inputBase, ...(focus.nome && pageStyles.inputFocus) }}
              required
            />
          </div>

          <div style={pageStyles.formGroup}>
            <label htmlFor="concurso" style={pageStyles.label}>Selecione o Concurso</label>
            <input
              id="concurso"
              name="concurso"
              type="text"
              placeholder="Digite para buscar e escolha uma opção..."
              value={buscaConcurso}
              onChange={e => {
                setBuscaConcurso(e.target.value);
                // Se o usuário escolher uma opção da lista, atualiza o id do concurso
                const selecionado = concursos.find(c => c.nome === e.target.value);
                setFormData(prev => ({ ...prev, concurso: selecionado ? selecionado.id : '' }));
              }}
              list="lista-concursos"
              style={{ ...pageStyles.inputBase }}
              required
            />
            <datalist id="lista-concursos">
              {(buscaConcurso.trim() === '' ? concursos : concursosFiltrados).map(c => (
                <option key={c.id} value={c.nome} />
              ))}
            </datalist>
          </div>

          {qtdQuestoes > 0 && (
            <div style={{ margin: '32px 0' }}>
              <label style={pageStyles.label}>Preencha seu gabarito:</label>
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                {gruposQuestoes.map((grupo, colIdx) => (
                  <div key={colIdx} style={{ minWidth: 120 }}>
                    {grupo.map((qIdx) => (
                      <div key={qIdx} style={{ marginBottom: 12 }}>
                        <span style={{ fontWeight: 600, marginRight: 8 }}>Q{qIdx + 1}</span>
                        {alternativas.map(alt => (
                          <label key={alt} style={{ marginRight: 8 }}>
                            <input
                              type="radio"
                              name={`questao-${qIdx}`}
                              value={alt}
                              checked={formData.gabarito[qIdx] === alt}
                              onChange={() => handleGabaritoChange(qIdx, alt)}
                              required={qIdx === 0}
                            /> {alt}
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit" 
            style={isLoading ? pageStyles.buttonDisabled : globalStyles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : (isDefinitivo ? 'Cadastrar Gabarito Definitivo' : 'Enviar e Ver Minha Posição')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Formulario;