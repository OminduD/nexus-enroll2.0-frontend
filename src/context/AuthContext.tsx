/**
 * Provides AuthContext (user, token, login/logout/updateUser) to the app,
 * persisting the session to localStorage. Does not call the backend itself
 * -- the actual POST /api/auth/login request happens in
 * src/services/authService.ts, which then hands its result to login() here.
 */
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
    let storedToken = localStorage.getItem('nexus_token');
    let storedUser = localStorage.getItem('nexus_user');

    if (storedToken === 'mock-jwt-token-initial' || (storedToken && storedToken.startsWith('mock-jwt-token-'))) {
      // Clear out the old mock token to prevent auto-login
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_user');
      storedToken = null;
      storedUser = null;
    }

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
    }
    // No stored session, just continue as unauthenticated
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    let overrides: Partial<User> = {};
    try {
      const savedById = newUser.id ? localStorage.getItem(`nexus_user_profile_${newUser.id}`) : null;
      const savedByEmail = newUser.email ? localStorage.getItem(`nexus_user_profile_${newUser.email}`) : null;
      const savedByUsername = newUser.username ? localStorage.getItem(`nexus_user_profile_${newUser.username}`) : null;

      const saved = savedById || savedByEmail || savedByUsername;
      if (saved) {
        overrides = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved user profile overrides:', e);
    }

    const userWithAvatar = {
      ...newUser,
      ...overrides,
      avatarUrl: overrides.avatarUrl || newUser.avatarUrl || getDefaultAvatarForRole(newUser.role),
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

      try {
        const existingOverridesStr = prev.id ? localStorage.getItem(`nexus_user_profile_${prev.id}`) : null;
        const existingOverrides = existingOverridesStr ? JSON.parse(existingOverridesStr) : {};
        const mergedOverrides = { ...existingOverrides, ...updatedFields };
        const overridesStr = JSON.stringify(mergedOverrides);

        if (prev.id) localStorage.setItem(`nexus_user_profile_${prev.id}`, overridesStr);
        if (prev.email) localStorage.setItem(`nexus_user_profile_${prev.email}`, overridesStr);
        if (prev.username) localStorage.setItem(`nexus_user_profile_${prev.username}`, overridesStr);
        if (updated.id) localStorage.setItem(`nexus_user_profile_${updated.id}`, overridesStr);
        if (updated.email) localStorage.setItem(`nexus_user_profile_${updated.email}`, overridesStr);
        if (updated.username) localStorage.setItem(`nexus_user_profile_${updated.username}`, overridesStr);
      } catch (e) {
        console.warn('Failed to save user profile overrides:', e);
      }

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
