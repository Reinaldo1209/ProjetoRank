import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl, authFetch } from '../api';
import { setToken, getToken, removeToken, isTokenValid } from '../utils/jwt';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token && isTokenValid(token)) {
      // Try to fetch current user using authFetch (backend should return user info at GET /auth)
      authFetch('/auth')
        .then(res => {
          if (!res.ok) throw new Error('Unauthorized');
          return res.json();
        })
        .then(data => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => {
          // If fetching user failed, remove token and treat as logged out
          removeToken();
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, senha) {
    const res = await fetch(getApiUrl('/Auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    if (res.ok) {
      const data = await res.json();
      // backend returns { token } according to your controller; attempt to extract user if provided
      const token = data.token || data;
      setToken(token);
      // after storing token, fetch user profile
      try {
        const userRes = await authFetch('/auth');
        if (userRes.ok) {
          const usuario = await userRes.json();
          setUser(usuario);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
      return true;
    }
    return false;
  }

  function logout() {
    removeToken();
    setUser(null);
  }

  async function cadastro(data, isAdmin = false) {
    const url = isAdmin ? '/Auth/cadastro-admin' : '/auth/cadastro';
    const res = await fetch(getApiUrl(url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, cadastro, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
