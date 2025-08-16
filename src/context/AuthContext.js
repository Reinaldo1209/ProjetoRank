import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Simulação: troque por lógica real depois
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Funções para login/logout (mock)
  function login() { setIsLoggedIn(true); }
  function logout() { setIsLoggedIn(false); }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
