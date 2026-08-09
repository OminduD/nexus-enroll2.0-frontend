import React, { useState, useEffect } from 'react';
import { Search, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import { NotificationPopover } from '../common/NotificationPopover';
import { GlobalSearchModal } from '../common/GlobalSearchModal';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getRoleVariant = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'danger';
      case 'FACULTY':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between transition-colors shadow-sm">
      {/* Left side */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-[#333333] hover:bg-slate-100 lg:hidden transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-[#333333] hover:border-teal-500/50 w-48 sm:w-64 transition-all text-xs"
        >
          <Search className="w-4 h-4 text-teal-600" />
          <span className="hidden sm:inline">Search courses, users...</span>
          <span className="sm:hidden">Search...</span>
          <kbd className="hidden md:inline-block ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <NotificationPopover userId={user?.id} role={user?.role} />

        {/* Profile Avatar Dropdown */}
        <div className="relative pl-2 border-l border-slate-200">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-[#333333] leading-tight">
                  {user?.firstName} {user?.lastName}
                </p>
                <Badge variant={getRoleVariant(user?.role)}>{user?.role}</Badge>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                {user?.email}
              </p>
            </div>
          </button>

          {isUserMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsUserMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl p-2 shadow-xl z-40 border border-slate-200 animate-slide-up">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-[#333333]">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {user?.email}
                  </p>
                  <div className="mt-1.5">
                    <Badge variant={getRoleVariant(user?.role)} size="sm">
                      {user?.role} ACCOUNT
                    </Badge>
                  </div>
                </div>

                <div className="px-3 py-1 text-[11px] text-slate-400 font-mono">
                  ID: #{user?.id || 1}
                </div>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-coral-600 hover:bg-coral-50 transition-colors mt-1"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};


