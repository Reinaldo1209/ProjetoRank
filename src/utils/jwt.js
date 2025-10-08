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
