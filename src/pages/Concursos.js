// src/pages/Concursos.js
import React from 'react';
import { Link } from 'react-router-dom';
// styles moved to src/pages/global.css (CSS variables + utility classes)
import { useConcursos } from '../context/ConcursosContext';
import { useAuth } from '../context/AuthContext';

const ConcursoCard = ({ concurso }) => (
  <div className="global-card" style={{ minHeight: 180, position: 'relative' }}>
    {concurso.logo && (
      <img src={concurso.logo} alt="Logo" style={{ maxWidth: 80, maxHeight: 80, position: 'absolute', top: 12, left: 12, borderRadius: 8, border: '1px solid #ccc' }} />
    )}
  <h3 style={{ marginBottom: '8px', color: 'var(--text-dark)', marginLeft: concurso.logo ? 100 : 0 }}>{concurso.nome}</h3>
    <p><strong>Organizadora:</strong> {concurso.organizadora}</p>
    <p><strong>Data da Prova:</strong> {concurso.dataProva}</p>
    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
      <EnviarGabaritoButton />
      <Link to={`/ranking/${concurso.id}`} className="global-button" style={{ background: '#7C5C3B', color: '#fff', display: 'inline-block' }}>
        Ver Ranking
      </Link>
    </div>
  </div>
);

function EnviarGabaritoButton() {
  const { isLoggedIn } = useAuth();
  return (
    <Link
      to={isLoggedIn ? "/formulario" : "/login"}
      className="global-button"
      style={{ display: 'inline-block' }}
    >
      Enviar Gabarito
    </Link>
  );
}

function Concursos() {
  const { concursos } = useConcursos();
  const [buscaConcurso, setBuscaConcurso] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [highlightedIdx, setHighlightedIdx] = React.useState(-1);
  const inputRef = React.useRef();
  const concursosFiltrados = buscaConcurso
    ? concursos.filter(c => c.nome.toLowerCase().includes(buscaConcurso.toLowerCase()))
    : concursos;

  // Autocomplete avançado: navegação por teclado
  const handleInputKeyDown = (e) => {
    if (!showSuggestions || concursosFiltrados.length === 0) return;
    if (e.key === 'ArrowDown') {
      setHighlightedIdx(idx => Math.min(idx + 1, concursosFiltrados.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightedIdx(idx => Math.max(idx - 1, 0));
    } else if (e.key === 'Enter' && highlightedIdx >= 0) {
      const concursoSelecionado = concursosFiltrados[highlightedIdx];
      setBuscaConcurso(concursoSelecionado.nome);
      setShowSuggestions(false);
      setHighlightedIdx(-1);
      inputRef.current.blur();
    }
  };

  return (
    <div className="page-content">
      <h1 className="global-h1">📚 Concursos Abertos</h1>
      <p className="subtitle">Confira abaixo os concursos com ranking ativo. Escolha um e envie seu gabarito!</p>
      {/* Barra de pesquisa com autocomplete */}
      <div style={{ position: 'relative', maxWidth: 400, marginBottom: 32 }}>
          <input
          type="text"
          placeholder="Buscar concurso pelo nome..."
          value={buscaConcurso}
          onChange={e => {
            setBuscaConcurso(e.target.value);
            setShowSuggestions(true);
            setHighlightedIdx(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={handleInputKeyDown}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
              border: `2px solid var(--border)`,
              backgroundColor: 'var(--background-light)',
            fontSize: '1rem',
            outline: 'none',
            marginBottom: 0,
          }}
          autoComplete="off"
          ref={inputRef}
        />
        {showSuggestions && concursosFiltrados.length > 0 && (
          <ul style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            border: '1px solid #eee',
            borderRadius: 8,
            background: '#fff',
            maxHeight: 180,
            overflowY: 'auto',
            position: 'absolute',
            zIndex: 10,
            width: '100%',
            boxShadow: '0 2px 8px #eee',
          }}>
            {concursosFiltrados.map((c, idx) => (
              <li
                key={c.id}
                onMouseDown={() => {
                  setBuscaConcurso(c.nome);
                  setShowSuggestions(false);
                  setHighlightedIdx(-1);
                }}
                style={{
                  padding: '10px 16px',
                  background: highlightedIdx === idx ? '#eaf6fb' : '#fff',
                  color: highlightedIdx === idx ? 'var(--primary)' : 'var(--text-dark)',
                  cursor: 'pointer',
                  fontWeight: highlightedIdx === idx ? 'bold' : 'normal',
                }}
                onMouseEnter={() => setHighlightedIdx(idx)}
              >
                {c.nome}
              </li>
            ))}
          </ul>
        )}
        {showSuggestions && concursosFiltrados.length === 0 && (
          <div style={{ color: '#e74c3c', marginTop: 8 }}>Nenhum concurso encontrado.</div>
        )}
      </div>
      {/* Lista de cards filtrados */}
      {concursosFiltrados.length === 0 ? (
        <div style={{ color: '#e74c3c', marginTop: 8 }}>Nenhum concurso encontrado.</div>
      ) : (
        <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {concursosFiltrados.map((c) => (
            <ConcursoCard key={c.id} concurso={c} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Concursos;
