import axios from 'axios';

// `??` (not `||`) so an explicitly empty string is respected: in Docker the
// build sets VITE_API_BASE_URL="" so requests go same-origin through the
// nginx /api/ proxy. Only fall back to localhost:8080 when the var is unset
// entirely, e.g. `npm run dev` against a locally running gateway.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export const USE_MOCK_FALLBACK = import.meta.env.VITE_USE_MOCK_FALLBACK === 'true';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Use in service catch blocks: `catch (error) { return withMockFallback(error, MOCK_X); }`
// Returns the mock value only when VITE_USE_MOCK_FALLBACK=true; otherwise rethrows
// so a dead backend surfaces as a visible error instead of a fake-looking UI.
export function withMockFallback<T>(error: unknown, mockValue: T): T {
  if (USE_MOCK_FALLBACK) {
    return mockValue;
  }
  throw error;
}

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
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
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
