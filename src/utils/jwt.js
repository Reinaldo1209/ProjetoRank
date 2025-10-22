// src/utils/jwt.js
// Utilitário para manipulação e validação de JWT

export function setToken(token) {
  localStorage.setItem('jwtToken', token);
}

export function getToken() {
  return localStorage.getItem('jwtToken');
}

export function removeToken() {
  localStorage.removeItem('jwtToken');
}

export function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// Return decoded JWT payload (or null)
export function getPayload(token) {
  const t = token || getToken();
  if (!t) return null;
  try {
    return JSON.parse(atob(t.split('.')[1]));
  } catch {
    return null;
  }
}

// Try to extract role from payload. Supports common claim names.
export function getRoleFromToken(token) {
  const p = getPayload(token);
  if (!p) return null;
  // common claim names
  return p.role || p.roles || p.Roles || p['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || p['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'] || null;
}

// Build a light user object from token payload (best-effort).
export function getUserFromToken(token) {
  const p = getPayload(token);
  if (!p) return null;
  return {
    nome: p.unique_name || p.name || p.nome || p.sub || null,
    email: p.email || p.upn || null,
    role: getRoleFromToken(token) || null,
  };
}
