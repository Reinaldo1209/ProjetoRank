import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl, authFetch } from '../api';
import { setToken, getToken, removeToken, isTokenValid, getRoleFromToken, getUserFromToken } from '../utils/jwt';

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
      // If token exists but backend not reachable, try to seed minimal user from token payload
      if (token) {
        const seeded = getUserFromToken(token);
        if (seeded) setUser(seeded);
      }
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
          // fallback to token-derived user
          const seeded = getUserFromToken(token);
          setUser(seeded || null);
        }
      } catch {
        const seeded = getUserFromToken(token);
        setUser(seeded || null);
      }
      return true;
    }
    return false;
  }

  function logout() {
    removeToken();
    setUser(null);
  }

  // Refresh user data from backend (returns true if refreshed)
  async function refreshUser() {
    const token = getToken();
    if (!token) return false;
    try {
      const res = await authFetch('/auth');
      if (!res.ok) return false;
      const data = await res.json();
      setUser(data);
      return true;
    } catch {
      return false;
    }
  }

  // optimistic local update of user object
  function updateUser(patch) {
    setUser(prev => ({ ...(prev || {}), ...patch }));
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
    <AuthContext.Provider value={{ user, loading, login, logout, cadastro, isLoggedIn: !!user, isAdmin: (user?.role && String(user.role).toLowerCase() === 'Admin') || Boolean(getRoleFromToken(getToken()) === 'Admin'), refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
