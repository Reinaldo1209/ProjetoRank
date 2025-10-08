// src/api.js
// Utilitário para URL base da API

export const API_BASE_URL = "http://localhost:8080/api";

export function getApiUrl(path) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
}
