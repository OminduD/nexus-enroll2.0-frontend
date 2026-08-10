import React, { useState, useEffect } from 'react';
import { Search, LogOut, Menu, Sparkles, Command, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import { NotificationPopover } from '../common/NotificationPopover';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { useLocation, Link } from 'react-router-dom';
import { getUserAvatar } from '../../lib/avatars';
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '../ui/resizable-navbar';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  const getAccountLink = () => {
    if (user?.role === 'ADMIN') return '/admin/account';
    if (user?.role === 'FACULTY') return '/faculty/account';
    return '/student/account';
  };

  // Derive current page title from path
  const getPageTitle = (pathname: string) => {
    if (pathname.includes('/dashboard')) return 'Dashboard Overview';
    if (pathname.includes('/account')) return 'Account Settings';
    if (pathname.includes('/courses')) return 'Course Directory';
    if (pathname.includes('/schedule')) return 'Timetable & Schedule';
    if (pathname.includes('/progress')) return 'Degree Audit';
    if (pathname.includes('/records')) return 'Academic Transcripts';
    if (pathname.includes('/roster')) return 'Class Roster';
    if (pathname.includes('/grades')) return 'Grade Management';
    if (pathname.includes('/change-requests')) return 'Change Requests';
    if (pathname.includes('/users')) return 'User Directory';
    if (pathname.includes('/reports')) return 'Analytics Reports';
    if (pathname.includes('/notifications')) return 'Notifications';
    return 'Portal Overview';
  };

  const avatarUrl = getUserAvatar(user);

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      <Navbar className="w-full">
      {/* Desktop Resizable Navigation */}
      <NavBody className="flex items-center justify-between transition-all duration-300">
        {/* Left section: Sidebar toggle & Context Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-[#333333] dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{getPageTitle(location.pathname)}</span>
          </div>
        </div>

        {/* Center section: Command Palette Search */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-500 hover:text-[#333333] dark:hover:text-slate-100 hover:border-teal-500/50 transition-all text-xs group"
        >
          <Search className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
          <span className="font-medium truncate">Search courses, metrics...</span>
          <kbd className="flex items-center gap-0.5 ml-auto px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 shadow-2xs">
            <Command className="w-3 h-3 text-slate-400" /> K
          </kbd>
        </button>

        {/* Right section: System Pill, Notification Bell, User Avatar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Fall 2025 Active
          </div>

          <NotificationPopover userId={user?.id} role={user?.role} />

          <div className="relative pl-2 border-l border-slate-200/80 dark:border-slate-800">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={avatarUrl}
                alt="User Avatar"
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-teal-500/40 shadow-sm"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold leading-tight">
                  {user?.firstName}
                </p>
              </div>
            </button>

            {isUserMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsUserMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl z-40 border border-slate-200/90 dark:border-slate-800 animate-slide-up">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1 bg-slate-50/60 dark:bg-slate-800/60 rounded-xl flex items-center gap-3">
                    <img
                      src={avatarUrl}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-teal-500/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user?.email}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <Badge variant={getRoleVariant(user?.role)} size="sm">
                          {user?.role} PORTAL
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={getAccountLink()}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Account Settings
                  </Link>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" /> Sign Out of Nexus
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSidebar}
              className="p-1.5 rounded-xl text-[#333333] dark:text-slate-200 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="truncate max-w-[140px]">{getPageTitle(location.pathname)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationPopover userId={user?.id} role={user?.role} />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsSearchOpen(true);
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Search Nexus System...
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded">
              ⌘K
            </kbd>
          </button>

          <Link
            to={getAccountLink()}
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <UserIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" /> My Account Settings
          </Link>

          <div className="w-full pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={avatarUrl}
                alt="User Avatar"
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-teal-500/40"
              />
              <div>
                <p className="text-xs font-bold">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                logout();
              }}
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-100 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </MobileNavMenu>
      </MobileNav>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </Navbar>
    </header>
  );
};




