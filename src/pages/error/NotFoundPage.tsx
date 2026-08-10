import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileQuestion,
  Home,
  ArrowLeft,
  Compass,
  Search,
  BookOpen,
  LifeBuoy,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const getDashboardPath = () => {
    if (!isAuthenticated || !user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'FACULTY') return '/faculty/dashboard';
    return '/student/dashboard';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Redirect logically based on search
    const query = searchQuery.toLowerCase();
    if (query.includes('course') || query.includes('class')) {
      navigate('/student/courses');
    } else if (query.includes('account') || query.includes('profile')) {
      navigate(user?.role ? `/${user.role.toLowerCase()}/account` : '/login');
    } else {
      navigate(getDashboardPath());
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden bg-grid-pattern selection:bg-teal-500 selection:text-white">
      {/* Background Animated Glow Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-coral-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Navigation */}
      <header className="px-6 py-5 border-b border-slate-800/80 backdrop-blur-md bg-slate-950/70 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-800 to-slate-900 p-1 flex items-center justify-center shadow-lg shadow-teal-900/30 border border-teal-500/30">
            <img src="/nexuslogo.webp" alt="Nexus Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight">Nexus <span className="text-teal-400">Enroll</span></span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-slate-700">v2.0</span>
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

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-2xl w-full text-center space-y-8">
          
          {/* Animated 404 Visual Header */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative inline-block"
          >
            <div className="text-[120px] sm:text-[160px] font-extrabold leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-teal-200 to-coral-400 drop-shadow-2xl select-none font-mono">
              404
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 sm:top-2 sm:right-2 p-3 bg-slate-900/90 border border-teal-500/30 rounded-2xl shadow-xl shadow-teal-950/50 backdrop-blur-xl text-teal-400"
            >
              <FileQuestion className="w-8 h-8 sm:w-10 sm:h-10" />
            </motion.div>
          </motion.div>

          {/* Text Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-3"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Oops! Page Lost in Cyberspace
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              We couldn't find the page you were looking for. It might have been moved, renamed, or no longer exists.
            </p>
          </motion.div>

          {/* Quick Search Box */}
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            onSubmit={handleSearchSubmit}
            className="max-w-md mx-auto relative flex items-center"
          >
            <Search className="w-5 h-5 absolute left-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, pages, or system options..."
              className="w-full pl-12 pr-24 py-3.5 bg-slate-900/90 border border-slate-800 focus:border-teal-500 rounded-2xl text-slate-100 text-sm placeholder:text-slate-500 outline-none focus:ring-4 focus:ring-teal-500/20 transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-md shadow-teal-900/30"
            >
              Search
            </button>
          </motion.form>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl border border-slate-800 transition-all duration-200 shadow-md hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-4 h-4 text-teal-400" />
              Go Back
            </button>

            <button
              onClick={() => navigate(getDashboardPath())}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-teal-900/40 hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4" />
              Go to Dashboard
            </button>
          </motion.div>

          {/* Quick Helpful Links Cards */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-xl mx-auto text-left"
          >
            <Link
              to={isAuthenticated ? '/student/courses' : '/login'}
              className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-teal-500/40 transition-all group"
            >
              <BookOpen className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform mb-2" />
              <div className="font-semibold text-sm text-slate-200">Course Catalog</div>
              <div className="text-xs text-slate-400 mt-1">Browse available subjects & schedules</div>
            </Link>

            <Link
              to={getDashboardPath()}
              className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-teal-500/40 transition-all group"
            >
              <Home className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform mb-2" />
              <div className="font-semibold text-sm text-slate-200">Home Portal</div>
              <div className="text-xs text-slate-400 mt-1">Access your main role workspace</div>
            </Link>

            <a
              href="mailto:support@nexusenroll.edu"
              className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-teal-500/40 transition-all group"
            >
              <LifeBuoy className="w-5 h-5 text-coral-400 group-hover:scale-110 transition-transform mb-2" />
              <div className="font-semibold text-sm text-slate-200">Help & Support</div>
              <div className="text-xs text-slate-400 mt-1">Report a broken link or issue</div>
            </a>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-900 relative z-10">
        &copy; {new Date().getFullYear()} Nexus Enroll 2.0 Academic Portal &bull; All Rights Reserved
      </footer>
    </div>
  );
};
