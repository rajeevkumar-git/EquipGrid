import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('equipgrid_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If authenticated request receives 401, purge stale/expired token so user can re-authenticate
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || '';
      if (!url.includes('/api/auth/login') && !url.includes('/api/auth/register')) {
        console.warn('[EquipGrid API] Session token expired or invalid. Purging stale token.');
        localStorage.removeItem('equipgrid_token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
