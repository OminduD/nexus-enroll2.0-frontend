import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Role } from '../types/auth';
import { getDefaultAvatarForRole } from '../lib/avatars';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('nexus_token');
    const storedUser = localStorage.getItem('nexus_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        const parsed = JSON.parse(storedUser);
        if (!parsed.avatarUrl) {
          parsed.avatarUrl = getDefaultAvatarForRole(parsed.role);
        }
        setUser(parsed);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('nexus_token');
        localStorage.removeItem('nexus_user');
      }
    } else {
      const defaultUser: User = {
        id: 1,
        username: 'john_doe',
        email: 'john.doe@nexus.edu',
        firstName: 'John',
        lastName: 'Doe',
        role: 'STUDENT',
        avatarUrl: getDefaultAvatarForRole('STUDENT'),
      };
      const defaultToken = 'mock-jwt-token-initial';
      setUser(defaultUser);
      setToken(defaultToken);
      localStorage.setItem('nexus_token', defaultToken);
      localStorage.setItem('nexus_user', JSON.stringify(defaultUser));
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    const userWithAvatar = {
      ...newUser,
      avatarUrl: newUser.avatarUrl || getDefaultAvatarForRole(newUser.role),
    };
    setToken(newToken);
    setUser(userWithAvatar);
    localStorage.setItem('nexus_token', newToken);
    localStorage.setItem('nexus_user', JSON.stringify(userWithAvatar));
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('nexus_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token && !!user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
