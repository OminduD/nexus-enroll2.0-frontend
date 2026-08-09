import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GradientBackground } from '../ui/jade-sky';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex bg-slate-50/60 text-[#333333] transition-colors overflow-x-hidden">
      {/* System Jade Sky Background Layer */}
      <GradientBackground className="fixed inset-0 pointer-events-none z-0 opacity-80" />

      <div className="relative z-10 flex min-h-screen w-full">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in relative z-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};


