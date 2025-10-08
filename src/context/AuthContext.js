import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from '../api';
import { setToken, getToken, removeToken, isTokenValid } from '../utils/jwt';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token && isTokenValid(token)) {
      fetch(getApiUrl('/auth'), {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => {
          removeToken();
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, senha) {
    const res = await fetch(getApiUrl('/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    if (res.ok) {
      const { token, usuario } = await res.json();
      setToken(token);
      setUser(usuario);
      return true;
    }
    return false;
  }

  function logout() {
    removeToken();
    setUser(null);
  }

  async function cadastro(data, isAdmin = false) {
    const url = isAdmin ? '/auth/cadastro-admin' : '/auth/cadastro';
    const res = await fetch(getApiUrl(url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, cadastro }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
