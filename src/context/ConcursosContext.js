import React, { createContext, useContext, useState } from 'react';

const ConcursosContext = createContext();

const concursosMock = [
  {
    id: 1,
    nome: 'Concurso Prefeitura de São Paulo 2025',
    organizadora: 'Vunesp',
    encerramento: '15/09/2025', // já está no padrão
    qtdQuestoes: 60,
    vagas: 1000, 
  },
  {
    id: 2,
    nome: 'Concurso TRF-3ª Região',
    organizadora: 'FCC',
    encerramento: '30/08/2025', // já está no padrão
    qtdQuestoes: 80,
  },
  {
    id: 3,
    nome: 'Concurso Banco Central',
    organizadora: 'Cesgranrio',
    encerramento: '01/10/2025', // já está no padrão
    qtdQuestoes: 100,
  },
];

export function ConcursosProvider({ children }) {
  const [concursos, setConcursos] = useState(concursosMock);

  function adicionarConcurso(novo) {
    setConcursos(prev => [
      ...prev,
      { ...novo, id: prev.length + 1 }
    ]);
  }

  function excluirConcurso(id) {
    setConcursos(prev => prev.filter(c => c.id !== id));
  }

  return (
    <ConcursosContext.Provider value={{ concursos, adicionarConcurso, excluirConcurso }}>
      {children}
    </ConcursosContext.Provider>
  );
}

export function useConcursos() {
  return useContext(ConcursosContext);
}
