import { apiClient, withMockFallback } from './api';
import { AuthResponse, Role } from '../types/auth';

export const authService = {
  login: async (identifier: string, password: string, selectedRole?: Role): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/api/auth/login', { identifier, password });
      const resData = response.data;
      if (resData && resData.data && resData.data.token) {
        return resData.data;
      }
      if (resData && resData.token) {
        return resData;
      }
      return resData && resData.data ? resData.data : resData;
    } catch (error: any) {
      if (error?.response?.status === 400 || error?.response?.status === 401) {
        throw error;
      }
      return withMockFallback(error, {
        token: `mock-jwt-token-${Date.now()}`,
        userId: 1,
        username: identifier.includes('@') ? identifier.split('@')[0] : identifier,
        email: identifier.includes('@') ? identifier : `${identifier}@nexus.edu`,
        firstName: identifier.charAt(0).toUpperCase() + identifier.slice(1),
        lastName: 'User',
        role: (selectedRole || (identifier.toLowerCase().includes('admin') ? 'ADMIN' : identifier.toLowerCase().includes('faculty') ? 'FACULTY' : 'STUDENT')) as Role,
      });
    }
  },

  register: async (data: { username: string; email: string; password: string; firstName: string; lastName: string; role: Role }): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/api/auth/register', data);
      const resData = response.data;
      if (resData && resData.data && resData.data.token) {
        return resData.data;
      }
      if (resData && resData.token) {
        return resData;
      }
      return resData && resData.data ? resData.data : resData;
    } catch (error: any) {
      if (error?.response?.status === 400 && error?.response?.data?.message) {
        throw error;
      }
      return withMockFallback(error, {
        token: `mock-jwt-token-${Date.now()}`,
        userId: Date.now(),
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'STUDENT',
      });
    }
  },

  provisionStaffAccount: async (data: { username: string; email: string; password: string; firstName: string; lastName: string; role: 'FACULTY' | 'ADMIN'; department?: string }) => {
    const response = await apiClient.post('/api/auth/provision-staff', data);
    return response.data;
  },

  getRoles: async () => {
    const response = await apiClient.get('/api/auth/roles');
    return response.data;
  }
};
