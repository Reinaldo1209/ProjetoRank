import React, { createContext, useContext, useState } from 'react';

const PaymentContext = createContext();

export function PaymentProvider({ children }) {
  // Estado: se o pagamento foi confirmado
  const [isPaid, setIsPaid] = useState(false);
  // Salva concursos que o usuário já pagou e cadastrou gabarito
  const [paidConcursoIds, setPaidConcursoIds] = useState([]);

  function confirmPayment(concursoId) {
    setIsPaid(true);
    setPaidConcursoIds(prev => [...new Set([...prev, concursoId])]);
  }

  function resetPayment() {
    setIsPaid(false);
  }

  return (
    <PaymentContext.Provider value={{ isPaid, paidConcursoIds, confirmPayment, resetPayment }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  return useContext(PaymentContext);
}
