export function getApiBase() {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      return 'http://localhost:3000/api';
    }
  }

  const envBase = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL;
  if (envBase) return envBase.endsWith('/api') ? envBase : `${envBase.replace(/\/$/, '')}/api`;

  return 'https://alumni-connect-backend-hrsc.onrender.com/api';
}

export function getSocketBase() {
  const apiBase = getApiBase();
  return apiBase.replace(/\/api$/, '');
}
