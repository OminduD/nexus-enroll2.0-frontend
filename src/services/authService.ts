import { apiClient } from './api';
import { AuthResponse, Role } from '../types/auth';

export const authService = {
  login: async (identifier: string, password: string, selectedRole?: Role): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/login', { identifier, password });
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  register: async (data: { username: string; email: string; password: string; firstName: string; lastName: string; role: Role }) => {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
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
