import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ServerOff,
  RefreshCw,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Radio,
  WifiOff,
  Terminal,
  ExternalLink,
  Clock,
  Home,
} from 'lucide-react';
import { useBackendHealth } from '../../context/BackendHealthContext';
import { useAuth } from '../../context/AuthContext';

const AUTO_RETRY_INTERVAL = 15; // seconds

export const ServerDownPage: React.FC = () => {
  const navigate = useNavigate();
  const { isBackendDown, lastError, lastChecked, isChecking, checkHealth } = useBackendHealth();
  const { user, isAuthenticated } = useAuth();

  const [countdown, setCountdown] = useState<number>(AUTO_RETRY_INTERVAL);
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);
  const [retryStatus, setRetryStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  const getDashboardPath = () => {
    if (!isAuthenticated || !user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'FACULTY') return '/faculty/dashboard';
    return '/student/dashboard';
  };

  const handleManualCheck = useCallback(async () => {
    setCountdown(AUTO_RETRY_INTERVAL);
    const isUp = await checkHealth();
    if (isUp) {
      setRetryStatus('success');
      setTimeout(() => {
        navigate(getDashboardPath());
      }, 1200);
    } else {
      setRetryStatus('failed');
      setTimeout(() => setRetryStatus('idle'), 3000);
    }
  }, [checkHealth, navigate, isAuthenticated, user]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleManualCheck();
          return AUTO_RETRY_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleManualCheck]);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden bg-grid-pattern selection:bg-coral-500 selection:text-white">
      {/* Glow Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-5 border-b border-slate-800/80 backdrop-blur-md bg-slate-950/70 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 p-1 flex items-center justify-center shadow-lg shadow-rose-900/30">
            <img src="/nexuslogo.webp" alt="Nexus Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight">
              Nexus <span className="text-rose-400">Enroll</span>
            </span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
              System Alert
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            Backend Offline
          </div>
          <button
            onClick={() => navigate(getDashboardPath())}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors bg-slate-900/80 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-800"
          >
            <Home className="w-4 h-4 text-teal-400" />
            Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-xl w-full text-center space-y-8">
          
          {/* Animated Server Off Graphics */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative inline-block"
          >
            <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-3xl bg-slate-900/90 border border-rose-500/30 flex items-center justify-center shadow-2xl shadow-rose-950/60 backdrop-blur-xl relative">
              <ServerOff className="w-16 h-16 sm:w-20 sm:h-20 text-rose-400" />
              
              <div className="absolute -bottom-2 -right-2 bg-rose-950 border border-rose-600/50 p-2 rounded-xl text-rose-400 shadow-md">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          </motion.div>

          {/* Heading & Subtitle */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" /> Error 503 &bull; Backend Offline
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Backend Connection Lost
            </h1>
            
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              We can't connect to the Nexus backend application service. The server may be restarting, undergoing scheduled maintenance, or temporarily down.
            </p>
          </motion.div>

          {/* Reconnection Status Card & Timer */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Auto-reconnect attempt:</span>
              </div>
              <div className="font-mono font-bold text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                {countdown}s
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleManualCheck}
                disabled={isChecking}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 disabled:opacity-50 text-white shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                {isChecking ? 'Checking Connection...' : 'Retry Connection Now'}
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto py-3.5 px-5 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                Reload App
              </button>
            </div>

            {retryStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Backend restored! Redirecting to application...
              </motion.div>
            )}

            {retryStatus === 'failed' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-rose-950/60 border border-rose-800/80 text-rose-300 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Backend is still unreachable. Will auto-try again shortly.
              </motion.div>
            )}
          </motion.div>

          {/* Service Health Breakdown Mock */}
          <div className="grid grid-cols-3 gap-3 text-left">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <div className="text-[11px] text-slate-400 font-medium">API Gateway</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Offline
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <div className="text-[11px] text-slate-400 font-medium">Auth Service</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Offline
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <div className="text-[11px] text-slate-400 font-medium">Enroll Service</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Offline
              </div>
            </div>
          </div>

          {/* Toggle Diagnostics Drawer */}
          <div className="pt-2">
            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="text-xs font-medium text-slate-400 hover:text-slate-200 inline-flex items-center gap-1.5 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-teal-400" />
              {showDiagnostics ? 'Hide Diagnostic Details' : 'View Diagnostic Technical Details'}
              {showDiagnostics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <AnimatePresence>
              {showDiagnostics && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-3 text-left"
                >
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                    <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-2">
                      <span>Target API:</span>
                      <span className="text-teal-300 font-semibold">{apiBaseUrl}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Last Ping Check:</span>
                      <span className="text-slate-200">
                        {lastChecked ? lastChecked.toLocaleTimeString() : 'Never'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Error Message:</span>
                      <span className="text-rose-400 truncate max-w-[240px]">
                        {lastError || 'ERR_NETWORK / Connection Refused'}
                      </span>
                    </div>
                    <div className="pt-2 text-[11px] text-slate-500">
                      Tip: Check if the backend application process (`nexus-enroll2.0` Spring Boot backend on port 8080) is running locally or if Docker containers are active.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-900 relative z-10">
        &copy; {new Date().getFullYear()} Nexus Enroll 2.0 &bull; Network & System Monitor
      </footer>
    </div>
  );
};
