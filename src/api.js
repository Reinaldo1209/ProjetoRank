// src/api.js
// Utilitário para URL base da API
import { getToken } from './utils/jwt';

export const API_BASE_URL = "https://localhost:7228/api";

export function getApiUrl(path) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
}

export function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// authFetch accepts a path (like '/auth' or '/respostausuario') and options
// It resolves the full URL via getApiUrl and injects the Authorization header
export async function authFetch(path, options = {}) {
  const url = getApiUrl(path);
  options.headers = {
    ...(options.headers || {}),
    ...getAuthHeaders()
  };
  return fetch(url, options);
}
