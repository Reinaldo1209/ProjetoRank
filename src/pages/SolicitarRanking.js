import React, { useState } from 'react';
// styles moved to src/pages/global.css (CSS variables + utility classes)
// styles moved to src/pages/global.css (CSS variables + utility classes)
import { useNavigate } from 'react-router-dom';

const pageStyles = {
  formContainer: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '40px',
    background: 'var(--white)',
    borderRadius: 12,
    boxShadow: '0 4px 25px var(--shadow)',
    border: '1px solid var(--border)',
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
    outline: 'none',
  },
  buttonDisabled: {
    backgroundColor: 'var(--text-medium)',
    cursor: 'not-allowed',
    boxShadow: 'none',
  }
};

function SolicitarRanking() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    concurso: '',
    organizadora: '',
    dataProva: '',
    mensagem: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Solicitação enviada com sucesso! Em breve analisaremos seu pedido.');
      navigate('/');
    }, 1500);
  };

  return (
    <div className="page-content">
      <div className="global-card" style={pageStyles.formContainer}>
        <h1 className="global-h1">📢 Solicitar Abertura de Ranking</h1>
        <p style={{ color: 'var(--text-medium)', marginBottom: 24 }}>
          Preencha o formulário abaixo para sugerir a abertura de um ranking para um concurso que ainda não está cadastrado na plataforma. Nossa equipe irá analisar sua solicitação!
        </p>
        <form onSubmit={handleSubmit}>
          <div style={pageStyles.formGroup}>
            <label htmlFor="nome" style={pageStyles.label}>Seu Nome</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              style={pageStyles.inputBase}
              required
            />
          </div>
          <div style={pageStyles.formGroup}>
            <label htmlFor="email" style={pageStyles.label}>E-mail para contato</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              style={pageStyles.inputBase}
              required
            />
          </div>
          <div style={pageStyles.formGroup}>
            <label htmlFor="concurso" style={pageStyles.label}>Nome do Concurso</label>
            <input
              id="concurso"
              name="concurso"
              type="text"
              value={formData.concurso}
              onChange={handleChange}
              style={pageStyles.inputBase}
              required
            />
          </div>
          <div style={pageStyles.formGroup}>
            <label htmlFor="organizadora" style={pageStyles.label}>Organizadora</label>
            <input
              id="organizadora"
              name="organizadora"
              type="text"
              value={formData.organizadora}
              onChange={handleChange}
              style={pageStyles.inputBase}
              required
            />
          </div>
          <div style={pageStyles.formGroup}>
            <label htmlFor="dataProva" style={pageStyles.label}>Data da Prova</label>
            <input
              id="dataProva"
              name="dataProva"
              type="date"
              value={formData.dataProva}
              onChange={handleChange}
              style={pageStyles.inputBase}
              required
            />
          </div>
          <div style={pageStyles.formGroup}>
            <label htmlFor="mensagem" style={pageStyles.label}>Mensagem adicional (opcional)</label>
            <textarea
              id="mensagem"
              name="mensagem"
              value={formData.mensagem}
              onChange={handleChange}
              style={{ ...pageStyles.inputBase, minHeight: 80 }}
            />
          </div>
          <button 
            type="submit" 
            className={isLoading ? 'global-button-disabled' : 'global-button'}
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Solicitar Ranking'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SolicitarRanking;
