/**
 * Provides BackendHealthContext, tracking whether the API gateway is
 * reachable. checkHealth() probes GET /actuator/health (falling back to
 * /api/v1/health, then an OPTIONS request); it also listens for the
 * nexus:backend-up/backend-down window events dispatched by the axios
 * interceptors in src/services/api.ts.
 */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

interface BackendHealthContextType {
  isBackendDown: boolean;
  lastError: string | null;
  lastChecked: Date | null;
  isChecking: boolean;
  checkHealth: () => Promise<boolean>;
  setBackendDown: (down: boolean, error?: string) => void;
}

const BackendHealthContext = createContext<BackendHealthContextType | undefined>(undefined);

export const BackendHealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBackendDown, setIsBackendDown] = useState<boolean>(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const setBackendDown = useCallback((down: boolean, error?: string) => {
    setIsBackendDown(down);
    if (error) setLastError(error);
    setLastChecked(new Date());
  }, []);

  const checkHealth = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      // Ping health endpoint or root API URL with small timeout
      await axios.get(`${API_BASE_URL}/actuator/health`, { timeout: 4000 }).catch(async () => {
        // Fallback to checking root or auth endpoint if actuator is not present
        return await axios.get(`${API_BASE_URL}/api/v1/health`, { timeout: 4000 }).catch(async () => {
          return await axios.options(`${API_BASE_URL}`, { timeout: 3000 });
        });
      });

      setIsBackendDown(false);
      setLastError(null);
      setLastChecked(new Date());
      setIsChecking(false);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unable to connect to backend server';
      setIsBackendDown(true);
      setLastError(errorMsg);
      setLastChecked(new Date());
      setIsChecking(false);
      return false;
    }
  }, []);

  useEffect(() => {
    const handleBackendDownEvent = (event: CustomEvent<{ message?: string }>) => {
      setIsBackendDown(true);
      setLastError(event.detail?.message || 'Backend connection offline');
      setLastChecked(new Date());
    };

    const handleBackendUpEvent = () => {
      setIsBackendDown(false);
      setLastError(null);
      setLastChecked(new Date());
    };

    window.addEventListener('nexus:backend-down', handleBackendDownEvent as EventListener);
    window.addEventListener('nexus:backend-up', handleBackendUpEvent as EventListener);

    return () => {
      window.removeEventListener('nexus:backend-down', handleBackendDownEvent as EventListener);
      window.removeEventListener('nexus:backend-up', handleBackendUpEvent as EventListener);
    };
  }, []);

  return (
    <BackendHealthContext.Provider
      value={{
        isBackendDown,
        lastError,
        lastChecked,
        isChecking,
        checkHealth,
        setBackendDown,
      }}
    >
      {children}
    </BackendHealthContext.Provider>
  );
};

export const useBackendHealth = () => {
  const context = useContext(BackendHealthContext);
  if (!context) throw new Error('useBackendHealth must be used within a BackendHealthProvider');
  return context;
};
