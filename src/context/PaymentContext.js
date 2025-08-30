import React, { createContext, useContext, useState } from 'react';

const PaymentContext = createContext();

export function PaymentProvider({ children }) {
  // Salva concursos que o usuário já pagou e cadastrou gabarito
  const [paidConcursoIds, setPaidConcursoIds] = useState([]);

  function confirmPayment(concursoId) {
    setPaidConcursoIds(prev => [...new Set([...prev, concursoId])]);
  }

  function resetPayment(concursoId) {
    setPaidConcursoIds(prev => prev.filter(id => id !== concursoId));
  }

  return (
    <PaymentContext.Provider value={{ paidConcursoIds, confirmPayment, resetPayment }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  return useContext(PaymentContext);
}
