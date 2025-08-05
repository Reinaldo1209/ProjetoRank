// src/pages/Formulario.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Supondo que globalStyles.js está em ../styles/globalStyles.js
import { PALETTE, globalStyles } from './globalStyles';

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
  
  // --- ESTADOS DO FORMULÁRIO ---
  const [formData, setFormData] = useState({
    nome: '',
    concurso: '',
    gabarito: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  // Estado para controlar o foco de cada campo
  const [focus, setFocus] = useState({});

  const handleFocus = (field) => setFocus({ ...focus, [field]: true });
  const handleBlur = (field) => setFocus({ ...focus, [field]: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gabarito' ? value.toUpperCase().replace(/[^A-Z]/g, '') : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Enviando dados:", formData);

    // --- SIMULAÇÃO DE ENVIO PARA API ---
    setTimeout(() => {
      // Aqui você faria um POST real para a API
      console.log("Dados enviados com sucesso!");
      setIsLoading(false);
      // Redireciona para a página de ranking após o sucesso
      navigate('/ranking');
    }, 1500); // Simula 1.5 segundos de espera da rede
  };

  return (
    <div style={globalStyles.pageContent}>
      <div style={pageStyles.formContainer}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={globalStyles.h1}>📝 Enviar Gabarito</h1>
          <p>Preencha os dados abaixo para calcular sua nota e entrar no ranking.</p>
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
            <select
              id="concurso"
              name="concurso"
              value={formData.concurso}
              onChange={handleChange}
              onFocus={() => handleFocus('concurso')}
              onBlur={() => handleBlur('concurso')}
              style={{ ...pageStyles.inputBase, ...(focus.concurso && pageStyles.inputFocus) }}
              required
            >
              <option value="" disabled>Escolha uma opção...</option>
              <option value="tj-sp-2025">TJ-SP Escrevente Técnico 2025</option>
              <option value="pm-sp-2025">PM-SP Soldado 2025</option>
              <option value="pc-sp-2025">PC-SP Investigador 2025</option>
            </select>
          </div>

          <div style={pageStyles.formGroup}>
            <label htmlFor="gabarito" style={pageStyles.label}>Seu Gabarito</label>
            <textarea
              id="gabarito"
              name="gabarito"
              value={formData.gabarito}
              onChange={handleChange}
              onFocus={() => handleFocus('gabarito')}
              onBlur={() => handleBlur('gabarito')}
              placeholder="Insira as respostas em sequência, sem espaços. Ex: ABCDEABCDE..."
              style={{ ...pageStyles.inputBase, ...(focus.gabarito && pageStyles.inputFocus), minHeight: '120px' }}
              rows="5"
              required
            />
            <p style={pageStyles.helperText}>Somente letras de A-Z serão aceitas. Outros caracteres serão removidos.</p>
          </div>

          <button 
            type="submit" 
            style={isLoading ? pageStyles.buttonDisabled : globalStyles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar e Ver Minha Posição'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Formulario;