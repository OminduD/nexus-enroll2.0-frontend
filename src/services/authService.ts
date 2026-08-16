import { apiClient, withMockFallback, USE_MOCK_FALLBACK } from './api';
import { AuthResponse, Role } from '../types/auth';
import { getStoredUsers, addStoredUser } from './localStore';

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
      if (!USE_MOCK_FALLBACK) {
        throw error;
      }
      const storedUsers = getStoredUsers();
      const matchedUser = storedUsers.find(
        (u: any) => 
          u.email.toLowerCase() === identifier.toLowerCase() || 
          (u.studentIdNumber && u.studentIdNumber.toLowerCase() === identifier.toLowerCase()) ||
          (u.username && u.username.toLowerCase() === identifier.toLowerCase())
      );
      
      const roleAssigned = matchedUser 
        ? (matchedUser.studentIdNumber?.startsWith('FAC') ? 'FACULTY' : matchedUser.studentIdNumber?.startsWith('ADM') ? 'ADMIN' : 'STUDENT')
        : (selectedRole || (identifier.toLowerCase().includes('admin') ? 'ADMIN' : identifier.toLowerCase().includes('faculty') ? 'FACULTY' : 'STUDENT'));

      return withMockFallback(error, {
        token: `mock-jwt-token-${Date.now()}`,
        userId: matchedUser ? matchedUser.userId || matchedUser.id : 1,
        username: identifier.includes('@') ? identifier.split('@')[0] : identifier,
        email: matchedUser ? matchedUser.email : (identifier.includes('@') ? identifier : `${identifier}@nexus.edu`),
        firstName: matchedUser ? matchedUser.firstName : (identifier.charAt(0).toUpperCase() + identifier.slice(1)),
        lastName: matchedUser ? matchedUser.lastName : 'User',
        role: roleAssigned as Role,
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
      if (!USE_MOCK_FALLBACK) {
        throw error;
      }
      const newUser = {
        id: Date.now(),
        userId: Date.now(),
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        studentIdNumber: data.role === 'FACULTY' ? 'FAC' + Date.now() : data.role === 'ADMIN' ? 'ADM' + Date.now() : 'STU' + Date.now(),
        role: data.role || 'STUDENT',
      };
      
      const mockResult = withMockFallback(error, {
        token: `mock-jwt-token-${Date.now()}`,
        ...newUser
      });
      addStoredUser(newUser as any);
      return mockResult;
    }
  },

  provisionStaffAccount: async (data: { username: string; email: string; password: string; firstName: string; lastName: string; role: 'FACULTY' | 'ADMIN'; department?: string }) => {
    try {
      const response = await apiClient.post('/api/auth/provision-staff', data);
      return response.data;
    } catch (error: any) {
      if (!USE_MOCK_FALLBACK) {
        throw error;
      }
      const newUser = {
        id: Date.now(),
        userId: Date.now(),
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        studentIdNumber: data.role === 'FACULTY' ? 'FAC' + Date.now() : 'ADM' + Date.now(),
        role: data.role,
        department: data.department,
      };
      
      const mockResult = withMockFallback(error, {
        success: true,
        message: 'Staff account provisioned successfully',
        data: newUser
      });
      addStoredUser(newUser as any);
      return mockResult;
    }
  },

  getRoles: async () => {
    const response = await apiClient.get('/api/auth/roles');
    return response.data?.data || response.data;
  }
};
