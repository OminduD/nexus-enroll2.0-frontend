import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertOctagon,
  RefreshCw,
  Copy,
  Check,
  Home,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Terminal,
  LifeBuoy,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ServerErrorPage: React.FC<{ errorDetails?: string }> = ({ errorDetails }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [copied, setCopied] = useState<boolean>(false);
  const [showLogs, setShowLogs] = useState<boolean>(false);

  // Generate deterministic/unique incident reference code
  const incidentId = React.useMemo(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'NEX-ERR-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }, []);

  const getDashboardPath = () => {
    if (!isAuthenticated || !user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'FACULTY') return '/faculty/dashboard';
    return '/student/dashboard';
  };

  const handleCopyIncident = () => {
    navigator.clipboard.writeText(`Incident Reference ID: ${incidentId}\nTimestamp: ${new Date().toISOString()}\nError: ${errorDetails || 'Internal 500 Error'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden bg-grid-pattern selection:bg-rose-500 selection:text-white">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-5 border-b border-slate-800/80 backdrop-blur-md bg-slate-950/70 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 p-1 flex items-center justify-center shadow-lg shadow-rose-900/30">
            <img src="/nexuslogo.webp" alt="Nexus Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight">
              Nexus <span className="text-rose-400">Enroll</span>
            </span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Error Handler
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate(getDashboardPath())}
          className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors bg-slate-900/80 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-800"
        >
          <Home className="w-4 h-4 text-teal-400" />
          Dashboard
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-xl w-full text-center space-y-8">
          
          {/* Header Graphic */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative inline-block"
          >
            <div className="text-[100px] sm:text-[140px] font-extrabold leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-rose-300 to-amber-400 drop-shadow-2xl font-mono select-none">
              500
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Internal Server Error
            </h1>
            
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              Our server encountered an unexpected exception while processing your request. The engineering team has been automatically alerted.
            </p>
          </motion.div>

          {/* Incident ID Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          >
            <div className="text-left">
              <div className="text-slate-400 font-medium">Incident Reference ID:</div>
              <div className="font-mono font-bold text-rose-400 text-sm mt-0.5">{incidentId}</div>
            </div>

            <button
              onClick={handleCopyIncident}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 font-medium transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              {copied ? 'Copied ID!' : 'Copy Incident Details'}
            </button>
          </motion.div>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Reload & Try Again
            </button>

            <button
              onClick={() => navigate(getDashboardPath())}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Home className="w-4 h-4 text-teal-400" />
              Return to Dashboard
            </button>
          </motion.div>

          {/* Collapsible Error Log Trace */}
          {errorDetails && (
            <div className="pt-2">
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="text-xs font-medium text-slate-400 hover:text-slate-200 inline-flex items-center gap-1.5 transition-colors"
              >
                <Terminal className="w-3.5 h-3.5 text-rose-400" />
                {showLogs ? 'Hide Stack Exception Log' : 'View Exception Log Details'}
                {showLogs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <AnimatePresence>
                {showLogs && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-3 text-left"
                  >
                    <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-rose-300 max-h-48 overflow-y-auto whitespace-pre-wrap break-all">
                      {errorDetails}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-900 relative z-10">
        &copy; {new Date().getFullYear()} Nexus Enroll 2.0 &bull; Exception Handling & Diagnostics
      </footer>
    </div>
  );
};
