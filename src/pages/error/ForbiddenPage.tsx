import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  UserCheck,
  LogOut,
  Compass,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const getDashboardPath = () => {
    if (!isAuthenticated || !user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'FACULTY') return '/faculty/dashboard';
    return '/student/dashboard';
  };

  const handleSwitchAccount = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden bg-grid-pattern selection:bg-amber-500 selection:text-white">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-5 border-b border-slate-800/80 backdrop-blur-md bg-slate-950/70 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-500 p-1 flex items-center justify-center shadow-lg shadow-amber-900/30">
            <img src="/nexuslogo.webp" alt="Nexus Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight">
              Nexus <span className="text-amber-400">Enroll</span>
            </span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
              Access Security
            </span>
          </div>
        </div>

        {isAuthenticated && user && (
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Logged in as:</span>
            <span className="font-semibold text-teal-400">{user.firstName || user.username}</span>
            <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 font-mono text-[10px] border border-teal-800">
              {user.role}
            </span>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-md w-full text-center space-y-8">
          
          {/* Animated 403 Lock Graphic */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative inline-block"
          >
            <div className="w-32 h-32 mx-auto rounded-3xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-center shadow-2xl shadow-amber-950/50 backdrop-blur-xl relative">
              <ShieldAlert className="w-16 h-16 text-amber-400" />
            </div>

            <div className="absolute -bottom-3 -right-3 bg-amber-950 border border-amber-700/60 p-2 rounded-2xl text-amber-300 shadow-md">
              <KeyRound className="w-6 h-6" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              HTTP 403 &bull; Restricted Portal
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Access Forbidden
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
              You do not have the administrative or security clearance required to view this module.
            </p>
          </motion.div>

          {/* Role Status Card */}
          {isAuthenticated && user && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left text-xs space-y-2"
            >
              <div className="text-slate-400 font-medium">Your Session Account:</div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-teal-400" />
                  <span className="font-semibold text-slate-200">{user.email || user.username}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[11px]">
                  {user.role} ROLE
                </span>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              Go Back
            </button>

            <button
              onClick={() => navigate(getDashboardPath())}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 text-sm"
            >
              <Compass className="w-4 h-4" />
              Return to My Dashboard
            </button>
          </motion.div>

          <div className="pt-4 border-t border-slate-900">
            <button
              onClick={handleSwitchAccount}
              className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              Sign Out & Switch Account
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-900 relative z-10">
        &copy; {new Date().getFullYear()} Nexus Enroll 2.0 &bull; Security & RBAC Enforcement
      </footer>
    </div>
  );
};
