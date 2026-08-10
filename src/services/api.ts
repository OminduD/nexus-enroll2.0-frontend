import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Request interceptor to attach bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexus_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Notify health system backend is responsive
    window.dispatchEvent(new CustomEvent('nexus:backend-up'));
    return response;
  },
  (error) => {
    if (
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      [502, 503, 504].includes(error.response?.status)
    ) {
      // Backend is unreachable or down
      window.dispatchEvent(
        new CustomEvent('nexus:backend-down', {
          detail: {
            message: error.message || 'Unable to connect to Nexus Backend Services.',
            status: error.response?.status || 503,
          },
        })
      );
    } else if (error.response && error.response.status === 401) {
      // Unauthorized fallback logic if token expired
      console.warn('Unauthorized access detected or session expired.');
    }
    return Promise.reject(error);
  }
);

export const ensureArray = <T>(data: any, fallback: T[] = []): T[] => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  if (data && Array.isArray(data.data)) return data.data;
  return fallback;
};
