/**
 * Shared page shell for authenticated dashboard routes: renders Sidebar,
 * Header, and the ambient background around a page-transition-animated
 * <Outlet />. No backend or context calls of its own.
 */
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GradientBackground } from '../ui/jade-sky';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="relative min-h-screen flex bg-slate-50/80 dark:bg-slate-950 text-[#333333] dark:text-slate-100 transition-colors selection:bg-teal-500 selection:text-white">
      {/* System Jade Sky Ambient Canvas */}
      <GradientBackground className="fixed inset-0 pointer-events-none z-0 opacity-60 dark:opacity-40" />

      {/* Decorative ambient glowing radial spots & grid overlay */}
      <div className="fixed inset-0 bg-dot-pattern pointer-events-none z-0 opacity-30 dark:opacity-20" />
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-teal-500/15 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse-slow" />
      <div className="fixed bottom-[-10%] left-[15%] w-[700px] h-[700px] bg-coral-400/15 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse-slow" />
      <div className="fixed top-[40%] left-[-10%] w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 flex min-h-screen w-full">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              initial={{ opacity: 0, y: 12, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.995 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto relative z-10"
            >
              <Outlet />
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};



