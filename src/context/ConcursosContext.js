import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl, authFetch } from '../api';

const ConcursosContext = createContext();

// Remover mock, usar API

export function ConcursosProvider({ children }) {
  const [concursos, setConcursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConcursos() {
      setLoading(true);
  const res = await authFetch('/concurso');
      if (res.ok) {
        const data = await res.json();
        setConcursos(data);
      }
      setLoading(false);
    }
    fetchConcursos();
  }, []);

  async function adicionarConcurso(novo) {
    const res = await authFetch('/concurso', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novo)
    });
    if (res.ok) {
      const concurso = await res.json();
      setConcursos(prev => [...prev, concurso]);
      return true;
    }
    return false;
  }

  async function excluirConcurso(id) {
    const res = await authFetch(`/concurso/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      setConcursos(prev => prev.filter(c => c.id !== id));
      return true;
    }
    return false;
  }

  async function atualizarConcurso(concursoEditado) {
    const res = await authFetch(`/concurso/${concursoEditado.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(concursoEditado)
    });
    if (res.ok) {
      const concurso = await res.json();
      setConcursos(prev => prev.map(c => c.id === concurso.id ? concurso : c));
      return true;
    }
    return false;
  }

  return (
    <ConcursosContext.Provider value={{ concursos, loading, adicionarConcurso, excluirConcurso, atualizarConcurso }}>
      {children}
    </ConcursosContext.Provider>
  );
}

export function useConcursos() {
  return useContext(ConcursosContext);
}
