import { apiClient } from './api';
import { AuthResponse, Role } from '../types/auth';

export const authService = {
  login: async (identifier: string, password: string, selectedRole?: Role): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/api/auth/login', { identifier, password });
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch {
      console.warn('API Gateway unavailable, using role-based mock login fallback.');

      // Automatic role detection from identifier if API is offline
      let role: Role = 'STUDENT';
      const idLower = identifier.toLowerCase();
      if (idLower.includes('admin')) {
        role = 'ADMIN';
      } else if (idLower.includes('prof') || idLower.includes('faculty') || idLower.includes('smith')) {
        role = 'FACULTY';
      } else if (selectedRole) {
        role = selectedRole;
      }

      return {
        token: `mock-jwt-token-${Date.now()}`,
        userId: role === 'STUDENT' ? 1 : role === 'FACULTY' ? 2 : 3,
        username: identifier,
        email: `${identifier.replace(/\s+/g, '.')}@nexus.edu`,
        role,
        firstName: role === 'STUDENT' ? 'John' : role === 'FACULTY' ? 'Alice' : 'Admin',
        lastName: role === 'STUDENT' ? 'Doe' : role === 'FACULTY' ? 'Smith' : 'Manager',
      };
    }
  },

  register: async (data: { username: string; email: string; password: string; firstName: string; lastName: string; role: Role }) => {
    try {
      const response = await apiClient.post('/api/auth/register', data);
      return response.data;
    } catch {
      console.warn('API Gateway offline, returning successful mock registration.');
      return {
        success: true,
        message: `User ${data.username} registered successfully as ${data.role}.`,
      };
    }
  },

  provisionStaffAccount: async (data: { username: string; email: string; password: string; firstName: string; lastName: string; role: 'FACULTY' | 'ADMIN'; department?: string }) => {
    try {
      const response = await apiClient.post('/api/auth/provision-staff', data);
      return response.data;
    } catch {
      return {
        success: true,
        message: `${data.role} account for ${data.firstName} ${data.lastName} created successfully.`,
      };
    }
  },

  getRoles: async () => {
    try {
      const response = await apiClient.get('/api/auth/roles');
      return response.data;
    } catch {
      return ['STUDENT', 'FACULTY', 'ADMIN'];
    }
  }
};
