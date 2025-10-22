import React from 'react';
import { Link } from 'react-router-dom';
// styles moved to src/pages/global.css (CSS variables + utility classes)
import { useConcursos } from '../context/ConcursosContext';
import { useAuth } from '../context/AuthContext';

/**
 * Card de Concurso atualizado para refletir os dados da API
 * e ter um design mais limpo.
 */
const ConcursoCard = ({ concurso }) => {
  const { isLoggedIn } = useAuth();

  // Calcula o total de vagas com base nos dados da API
  const totalVagas = (concurso.vagasAmpla || 0) +
                     (concurso.vagasPPP || 0) +
                     (concurso.vagasPCD || 0) +
                     (concurso.vagasPI || 0);

  // Corrige o link para passar o ID do concurso como query param
  const gabaritoLink = isLoggedIn
    ? `/formulario?concurso=${concurso.id}`
    : "/login";

  // Estilo do botão secundário (outline)
  const secondaryButtonStyle = {
    flex: 1,
    textAlign: 'center',
    background: 'transparent',
    color: 'var(--primary)',
    border: '2px solid var(--primary)',
    padding: '10px 24px', // Ajusta padding para alinhar com o global-button
  };

  return (
    <div className="global-card" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 240 // Altura mínima para acomodar as infos
    }}>
      
      {/* Seção de Informações */}
      <div>
        <h3 style={{
          marginBottom: '12px',
          color: 'var(--text-dark)',
          fontSize: '1.25rem'
        }}>
          {concurso.nome}
        </h3>
        {/* Usa "banca" e "inscritos" da API */}
        <p style={{ margin: '4px 0' }}><strong>Banca:</strong> {concurso.banca}</p>
        <p style={{ margin: '4px 0' }}><strong>Vagas Totais:</strong> {totalVagas}</p>
        <p style={{ margin: '4px 0' }}><strong>Inscritos:</strong> {concurso.inscritos || 'N/A'}</p>
        <p style={{ margin: '4px 0' }}><strong>Tipo:</strong> {concurso.tipoProva}</p>
      </div>

      {/* Seção de Ações */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid var(--border)' // Divisor
      }}>
        <Link
          to={gabaritoLink}
          className="global-button"
          style={{ flex: 1, textAlign: 'center' }}
        >
          Enviar Gabarito
        </Link>
        <Link
          to={`/ranking/${concurso.id}`}
          className="global-button" // Reusa a classe base para fontes/tamanho
          style={secondaryButtonStyle}
        >
          Ver Ranking
        </Link>
      </div>
    </div>
  );
};

// Componente EnviarGabaritoButton foi removido
// pois sua lógica foi movida para dentro do ConcursoCard.

function Concursos() {
  const { concursos } = useConcursos();
  const [buscaConcurso, setBuscaConcurso] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [highlightedIdx, setHighlightedIdx] = React.useState(-1);
  const inputRef = React.useRef();

  // Filtra concursos localmente
  const concursosFiltrados = buscaConcurso
    ? concursos.filter(c => c.nome.toLowerCase().includes(buscaConcurso.toLowerCase()))
    : concursos;

  // Autocomplete avançado: navegação por teclado
  const handleInputKeyDown = (e) => {
    if (!showSuggestions || concursosFiltrados.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault(); // Impede a página de rolar
      setHighlightedIdx(idx => Math.min(idx + 1, concursosFiltrados.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); // Impede a página de rolar
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
      <h1 className="global-h1" style={{ textAlign: 'center' }}>📚 Concursos Abertos</h1>
      <p className="subtitle" style={{ textAlign: 'center', margin: '0 auto 32px auto' }}>
        Confira abaixo os concursos com ranking ativo. Escolha um e envie seu gabarito!
      </p>
      
      {/* Barra de pesquisa com autocomplete */}
      <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto 48px auto' }}>
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
          className="input-base" // Usa a classe global
          style={{
            padding: '14px 20px',
            fontSize: '1.1rem',
            boxShadow: '0 4px 25px var(--shadow)', // Sombra mais pronunciada
          }}
          autoComplete="off"
          ref={inputRef}
        />
        {showSuggestions && concursosFiltrados.length > 0 && (
          <ul style={{
            listStyle: 'none',
            margin: '4px 0 0 0',
            padding: 0,
            border: '1px solid var(--border)',
            borderRadius: 8,
            background: 'var(--white)',
            maxHeight: 240,
            overflowY: 'auto',
            position: 'absolute',
            zIndex: 10,
            width: '100%',
            boxShadow: '0 8px 20px var(--shadow)',
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
                  padding: '12px 20px',
                  background: highlightedIdx === idx ? 'var(--beige-contrast)' : 'var(--white)',
                  color: highlightedIdx === idx ? 'var(--primary)' : 'var(--text-dark)',
                  cursor: 'pointer',
                  fontWeight: highlightedIdx === idx ? '600' : '400',
                }}
                onMouseEnter={() => setHighlightedIdx(idx)}
              >
                {c.nome}
              </li>
            ))}
          </ul>
        )}
        {showSuggestions && buscaConcurso.length > 0 && concursosFiltrados.length === 0 && (
          <div style={{ 
            color: 'var(--text-medium)', 
            marginTop: 8, 
            padding: '10px', 
            background: 'var(--beige-contrast)', 
            borderRadius: 8 
          }}>
            Nenhum concurso encontrado com o termo "{buscaConcurso}".
          </div>
        )}
      </div>
      
      {/* Lista de cards filtrados */}
      {concursosFiltrados.length === 0 && !buscaConcurso ? (
         <p style={{ textAlign: 'center', color: 'var(--text-medium)', fontSize: '1.1rem' }}>
           Nenhum concurso cadastrado no momento.
         </p>
      ) : (
        <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {concursosFiltrados.map((c) => (
            <ConcursoCard key={c.id} concurso={c} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Concursos;
