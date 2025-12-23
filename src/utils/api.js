const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function apiFetch(path, options = {}) {
  return fetch(`${API_BASE}${path}`, options);
}
