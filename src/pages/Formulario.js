// src/pages/Formulario.js
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePayment } from '../context/PaymentContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useConcursos } from '../context/ConcursosContext';
import { authFetch } from '../api'; // Importar o authFetch

// --- ESTILOS ESPECÍFICOS DA PÁGINA ---
const pageStyles = {
  formContainer: {
    maxWidth: '700px',
    margin: '2rem auto',
    padding: '40px',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    fontWeight: '600',
    marginBottom: '8px',
    display: 'block',
    color: 'var(--text-dark)',
  },
  inputBase: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: `2px solid var(--border)`,
    backgroundColor: 'var(--background-light)',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    outline: 'none',
  },
  inputFocus: {
    borderColor: 'var(--primary)',
    boxShadow: `0 0 0 3px rgba(124, 92, 59, 0.15)`,
  },
  buttonDisabled: {
    backgroundColor: 'var(--text-medium)',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  // Estilos para o gabarito por disciplina
  fieldsetDisciplina: {
    border: '1px solid #ddd',
    padding: '16px 24px 24px 24px',
    borderRadius: '8px',
    margin: 0,
  },
  legendDisciplina: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    color: 'var(--primary, #333)',
    padding: '0 8px',
    width: 'auto',
    margin: '0 0 0 16px',
  },
  // Estilos para as perguntas e opções
  questaoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  questaoCard: {
    padding: '16px',
    background: '#fff',
    border: '1px solid var(--border)',
    borderRadius: '8px',
  },
  questaoTexto: {
    fontWeight: '600',
    color: 'var(--text-dark)',
    marginBottom: '12px',
    lineHeight: '1.5',
    fontSize: '1.1rem',
  },
  opcoesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  opcaoLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
  },
  opcaoLabelSelected: {
    backgroundColor: 'var(--beige-contrast)',
    borderColor: 'var(--primary)',
    fontWeight: '600',
  }
};

function Formulario() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const { concursos } = useConcursos();
  const { paidConcursoIds, confirmPayment } = usePayment();
  const params = new URLSearchParams(window.location.search);
  const isDefinitivo = params.get('definitivo') === 'true';
  const concursoParam = params.get('concurso'); 

  
  const [formData, setFormData] = useState({
    concurso: concursoParam || '',
    gabarito: [],
    tipoConcorrencia: '',
  });
  
  const [concursoDetalhado, setConcursoDetalhado] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    if (!concursoParam) {
      setPageError('Nenhum concurso selecionado. Volte e escolha um concurso.');
      setPageLoading(false);
      return;
    }

    const fetchConcursoCompleto = async () => {
      setPageLoading(true);
      setPageError('');
      setConcursoDetalhado(null); 

      try {
        const res = await authFetch(`/Concurso/${concursoParam}/completo`);
        if (res.ok) {
          const data = await res.json();
          setConcursoDetalhado(data);
        } else {
          const txt = await res.text();
          setPageError('Não foi possível carregar os detalhes do concurso. ' + txt);
          console.error("Erro ao buscar concurso completo:", txt);
        }
      } catch (err) {
        setPageError('Erro de rede ao carregar concurso.');
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchConcursoCompleto();
  }, [concursoParam]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGabaritoChange = (questaoIdx, alternativa) => {
    setFormData(prev => {
      const novoGabarito = [...prev.gabarito];
      novoGabarito[questaoIdx] = alternativa;
      return { ...prev, gabarito: novoGabarito };
    });
  };

  const concursoBase = concursos.find(c => String(c.id) === String(formData.concurso));
  
  const concursoSelecionado = useMemo(() => {
    if (!concursoBase && !concursoDetalhado) return null;
    return {
      ...concursoBase,   
      ...concursoDetalhado, 
    };
  }, [concursoBase, concursoDetalhado]);

  const totalQuestoes = useMemo(() => {
    if (!concursoSelecionado || !concursoSelecionado.disciplinas) return 0;
    return concursoSelecionado.disciplinas.reduce((acc, d) => acc + (d.perguntas?.length || 0), 0);
  }, [concursoSelecionado]);

  const totalVagas = useMemo(() => {
    if (!concursoSelecionado) return 0;
    return (concursoSelecionado.vagasAmpla || 0) + 
           (concursoSelecionado.vagasPPP || 0) + 
           (concursoSelecionado.vagasPCD || 0) + 
           (concursoSelecionado.vagasPI || 0);
  }, [concursoSelecionado]);


  // ==================================================================
  // FUNÇÃO HANDLESUBMIT ATUALIZADA
  // ==================================================================
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!concursoSelecionado) {
      alert("Erro: Concurso não foi carregado.");
      setIsLoading(false);
      return;
    }

    if (isDefinitivo) {
      // --- LÓGICA DO GABARITO DEFINITIVO (MANTIDA COMO MOCK) ---
      // A API fornecida (/api/RespostaUsuario) não parece ser para
      // o gabarito definitivo. Mantendo a lógica antiga de mock.
      
      // Este é o payload antigo, apenas para fins de log
      const dadosEnvioDefinitivo = {
        concurso: {
          id: concursoSelecionado?.id,
          nome: concursoSelecionado?.nome,
          organizadora: concursoSelecionado?.banca || concursoSelecionado?.organizadora,
          dataProva: concursoSelecionado?.dataProva,
          vagasAmpla: concursoSelecionado?.vagasAmpla,
          vagasPPP: concursoSelecionado?.vagasPPP,
          vagasPCD: concursoSelecionado?.vagasPCD,
          vagasPI: concursoSelecionado?.vagasPI,
          qtdQuestoes: totalQuestoes,
        },
        gabarito: formData.gabarito,
        tipoConcorrencia: formData.tipoConcorrencia,
        definitivo: isDefinitivo,
        usuarioId: user ? user.id : null, 
      };

      setTimeout(() => {
        console.log("Gabarito definitivo enviado (MOCK):", JSON.stringify(dadosEnvioDefinitivo, null, 2));
        setIsLoading(false);
        alert('Gabarito definitivo cadastrado com sucesso!');
        navigate('/concursos');
      }, 1500);

    } else {
      // --- LÓGICA DE ENVIO DO GABARITO DO USUÁRIO (ATUALIZADA) ---
      
      // 1. Mapear o gabarito (flat array de letras) para o formato da API
      let currentQuestaoIdx = 0;
      const disciplinasPayload = concursoSelecionado.disciplinas.map(disciplina => ({
        disciplinaId: disciplina.id,
        perguntas: disciplina.perguntas.map(pergunta => {
          
          const selectedLetter = formData.gabarito[currentQuestaoIdx];
          let selectedOpcaoId = null;

          if (selectedLetter && pergunta.opcoes) {
            // Converte a letra (A, B, C...) para o índice do array (0, 1, 2...)
            const optionIndex = selectedLetter.charCodeAt(0) - 65;
            
            if (pergunta.opcoes[optionIndex]) {
              // Pega o ID da opção selecionada
              selectedOpcaoId = pergunta.opcoes[optionIndex].id;
            }
          }
          
          currentQuestaoIdx++; // Avança o índice global para a próxima questão

          return {
            perguntaId: pergunta.id,
            opcaoId: selectedOpcaoId
          };
        })
      }));

      // 2. Montar o payload final EXATAMENTE como pedido pela API
      const apiPayload = {
        usuarioId: user ? parseInt(user.id, 10) : 0,
        concursoId: parseInt(concursoSelecionado.id, 10),
        disciplinas: disciplinasPayload
      };
      
      console.log("Enviando para /api/RespostaUsuario/gabarito:", JSON.stringify(apiPayload, null, 2));

      // 3. Fazer a chamada de API real (substituindo o setTimeout)
      authFetch('/api/RespostaUsuario/gabarito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      })
      .then(res => {
        if (res.ok) {
          // Sucesso
          console.log("Gabarito de usuário enviado com sucesso.");
          // Lógica original de navegação pós-sucesso
          const isAdmin = false; 
          if (isAdmin || paidConcursoIds.includes(concursoSelecionado?.id)) {
            navigate(`/ranking/${concursoSelecionado?.id}`);
          } else {
            // navigate('/checkout'); // Ative para paywall
            navigate(`/ranking/${concursoSelecionado?.id}`); // Linha de teste
          }
        } else {
          // Erro do servidor
          return res.text().then(text => {
            throw new Error(text || 'Falha ao enviar gabarito. O servidor não retornou um erro específico.');
          });
        }
      })
      .catch(err => {
        // Erro de rede ou erro do .then()
        console.error("Erro ao enviar gabarito:", err);
        alert(`Erro ao enviar seu gabarito: ${err.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  };
  // ==================================================================
  // FIM DA FUNÇÃO HANDLESUBMIT
  // ==================================================================
  

  // --- LÓGICA DE RENDERIZAÇÃO DE GABARITO (ATUALIZADA) ---
  // A variável 'alternativas' (['A', 'B', 'C']) foi REMOVIDA.
  
  // Verifica se o concurso tem disciplinas com perguntas
  const hasDisciplinas = concursoSelecionado && concursoSelecionado.disciplinas && concursoSelecionado.disciplinas.length > 0;
  
  let globalQuestaoIdx = 0;
  // --- Fim da Lógica de Renderização ---


  return (
    <div className="page-content">
      <div style={{
        ...pageStyles.formContainer,
        border: isDefinitivo ? '3px solid #2d9cdb' : undefined,
        background: isDefinitivo ? '#eaf6fb' : undefined,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="global-h1">{isDefinitivo ? '📝 Gabarito Definitivo' : '📝 Enviar Gabarito'}</h1>
          {isDefinitivo ? (
            <p style={{ color: '#2d9cdb', fontWeight: 'bold' }}>Este gabarito será usado como base para o cálculo da nota de corte.</p>
          ) : (
            <p>Preencha os dados abaixo para calcular sua nota e entrar no ranking.</p>
          )}
        </div>

        {/* --- BLOCO DE LOADING, ERRO OU INFO DO CONCURSO --- */}
        {pageLoading && (
          <div style={{ textAlign: 'center', margin: '32px 0', padding: '20px' }} className="global-card">
            <p style={{ fontSize: '1.2rem', color: 'var(--primary)', margin: 0 }}>Carregando prova...</p>
          </div>
        )}
        {pageError && (
          <div style={{ color: '#c00', margin: '1rem 0', padding: '20px', background: '#fbeeee', borderRadius: '8px', textAlign: 'center' }}>
            <strong>Erro:</strong> {pageError}
          </div>
        )}
        {!pageLoading && !pageError && concursoSelecionado && (
          <div className="global-card" style={{ marginBottom: '2rem', background: 'var(--beige-contrast)' }}>
            <h2 style={{...pageStyles.legendDisciplina, margin: 0, padding: 0, fontSize: '1.5rem'}}>{concursoSelecionado.nome}</h2>
            <p style={{ margin: '8px 0 0 0' }}><strong>Banca:</strong> {concursoSelecionado.banca}</p>
            <p style={{ margin: '4px 0 0 0' }}><strong>Vagas Totais:</strong> {totalVagas}</p>
            <p style={{ margin: '4px 0 0 0' }}><strong>Questões:</strong> {totalQuestoes}</p>
          </div>
        )}
        {/* --- FIM DO BLOCO --- */}


        {/* O formulário só é exibido se não houver loading ou erro */}
        {!pageLoading && !pageError && concursoSelecionado && (
          <form onSubmit={handleSubmit}>
            
            <div style={pageStyles.formGroup}>
              <label htmlFor="tipoConcorrencia" style={pageStyles.label}>Selecione seu Tipo de Concorrência</label>
              <select
                id="tipoConcorrencia"
                name="tipoConcorrencia"
                value={formData.tipoConcorrencia || ''}
                onChange={handleChange}
                className="input-base"
                required
                disabled={isDefinitivo} // Desativa se for gabarito definitivo
              >
                <option value="">Selecione...</option>
                <option value="Ampla">Ampla Concorrência</option>
                <option value="PPP">PPP (Pretos/Pardos)</option>
                <option value="PCD">PCD (Pessoa c/ Def.)</option>
                <option value="Indigena">Indígena</option>
              </select>
            </div>

            {/* --- BLOCO DE RENDERIZAÇÃO DE GABARITO (ATUALIZADO) --- */}
            {/* A checagem de 'alternativas.length > 0' foi removida */}
            {hasDisciplinas ? (
              <div style={{ margin: '32px 0' }}>
                <label style={pageStyles.label}>Preencha seu gabarito:</label>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {concursoSelecionado.disciplinas.map((disciplina, dIdx) => {
                    // Reseta o contador global *antes* do map de disciplinas
                    // globalQuestaoIdx = 0; // -> Comentado. O índice deve ser contínuo.
                    
                    return (
                      <fieldset key={dIdx} style={pageStyles.fieldsetDisciplina}>
                        <legend style={pageStyles.legendDisciplina}>
                          {disciplina.nome}
                        </legend>
                        <div style={pageStyles.questaoContainer}>
                          {disciplina.perguntas.map((pergunta, pIdx) => {
                            const currentGlobalIdx = globalQuestaoIdx;
                            globalQuestaoIdx++;

                            return (
                              <div key={pIdx} style={pageStyles.questaoCard}>
                                <p style={pageStyles.questaoTexto}>
                                  <strong>Q{currentGlobalIdx + 1}: </strong>
                                  {pergunta.texto || '(Questão sem texto cadastrado)'}
                                </p>
                                
                                <div style={pageStyles.opcoesContainer}>
                                  {/* --- LÓGICA DE RENDERIZAÇÃO ATUALIZADA --- */}
                                  {/* Itera sobre as opções da API, não mais sobre 'alternativas' */}
                                  {pergunta.opcoes && pergunta.opcoes.map((opcao, altIndex) => {
                                    // Gera a letra dinamicamente (0=A, 1=B, 2=C)
                                    const altLetter = String.fromCharCode(65 + altIndex);
                                    const optionText = opcao.texto;
                                    const isChecked = formData.gabarito[currentGlobalIdx] === altLetter;
                                    
                                    return (
                                      <label 
                                        key={altIndex} 
                                        style={isChecked ? {...pageStyles.opcaoLabel, ...pageStyles.opcaoLabelSelected} : pageStyles.opcaoLabel}
                                      >
                                        <input
                                          type="radio"
                                          name={`questao-${currentGlobalIdx}`}
                                          value={altLetter} // O valor salvo é a letra (A, B, C...)
                                          checked={isChecked}
                                          onChange={() => handleGabaritoChange(currentGlobalIdx, altLetter)}
                                          required={currentGlobalIdx === 0}
                                          style={{ flexShrink: 0 }}
                                        />
                                        <span>
T                                      <strong>{altLetter})</strong> {optionText || '(Opção sem texto cadastrado)'}
                                        </span>
                                      </label>
                                    );
                                  })}
                                  {/* Mensagem de fallback se a pergunta não tiver opções */}
                                  {(!pergunta.opcoes || pergunta.opcoes.length === 0) && (
                                    <p style={{color: 'var(--text-medium)', fontSize: '0.9rem', margin: 0}}>
                                      Esta pergunta não possui opções cadastradas.
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                D        </div>
                      </fieldset>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Mensagem de fallback se 'disciplinas' estiver vazio
              <div style={{ color: '#e74c3c', marginTop: '1rem', padding: '10px', background: '#fbeeee', borderRadius: '8px' }}>
                Este concurso não possui disciplinas ou perguntas cadastradas.
              </div>
            )}
            {/* --- FIM DO BLOCO DE GABARITO --- */}


            {/* MENSAGEM DE ERRO 'TIPO DE GABARITO' REMOVIDA */}


            <button 
              type="submit" 
              className={isLoading ? 'global-button-disabled' : 'global-button'}
              // Condição de 'disabled' atualizada
              disabled={isLoading || pageLoading || !concursoSelecionado || !hasDisciplinas}
style={(isLoading || pageLoading || !concursoSelecionado || !hasDisciplinas) ? pageStyles.buttonDisabled : {}}
            >
              {isLoading ? 'Enviando...' : (isDefinitivo ? 'Cadastrar Gabarito Definitivo' : 'Enviar e Ver Minha Posição')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Formulario;