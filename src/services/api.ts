/**
 * Shared HTTP layer for all `src/services/*.ts` calls: builds the axios
 * client against VITE_API_BASE_URL (the Spring Cloud Gateway on :8080) and
 * attaches the JWT from localStorage to every outgoing request. Also
 * dispatches the nexus:backend-up/backend-down window events that
 * BackendHealthContext listens for.
 */
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
  timeout: 8000,
});

// Use in service catch blocks: `catch (error) { return withMockFallback(error, MOCK_X); }`
// Returns mockValue if fallback enabled or when endpoint returns error/timeout so UI stays functional
export function withMockFallback<T>(error: any, mockValue: T): T {
  if (
    USE_MOCK_FALLBACK ||
    !error?.response ||
    error?.response?.status === 404 ||
    error?.response?.status === 500 ||
    error?.response?.status === 400 ||
    error?.code === 'ECONNABORTED' ||
    error?.code === 'ERR_NETWORK' ||
    error?.message?.includes('timeout') ||
    error?.message?.includes('Network Error')
  ) {
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

type ArrayEnvelope<T> = T[] | { content?: T[]; data?: T[] } | null | undefined;

export const ensureArray = <T>(data: ArrayEnvelope<T>, fallback: T[] = []): T[] => {
  if (Array.isArray(data)) return data;
  const d = data as any;
  if (d && Array.isArray(d.content)) return d.content;
  if (d && Array.isArray(d.data)) return d.data;
  if (d && d.data && Array.isArray(d.data.content)) return d.data.content;
  if (d && d.data && Array.isArray(d.data.data)) return d.data.data;
  return fallback;
};

// Raw shapes returned by the backend before a service maps them onto the
// frontend's `src/types/*.ts` interfaces. Fields are optional since the
// backend DTO doesn't guarantee every one is populated.
export interface RawScheduleItem {
  sectionId?: number;
  courseCode?: string;
  courseTitle?: string;
  scheduleDays?: string;
  startTime?: string;
  endTime?: string;
  scheduleTime?: string;
  location?: string;
  status?: string;
}

export interface RawCompletedCourseItem {
  id?: number;
  studentId?: number;
  courseCode?: string;
  courseTitle?: string;
  grade?: string;
  letterGrade?: string;
  gradePoints?: number;
  semester?: string;
  year?: number;
  credits?: number;
  creditsEarned?: number;
}
