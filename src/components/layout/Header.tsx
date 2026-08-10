import React, { useState, useEffect } from 'react';
import {
  Search,
  LogOut,
  Sparkles,
  Command,
  User as UserIcon,
  ChevronRight,
  PanelLeft,
  LayoutDashboard,
  BookOpen,
  Calendar,
  GraduationCap,
  FileText,
  Users,
  CheckSquare,
  Sliders,
  ShieldCheck,
  Activity,
  Bell
} from 'lucide-react';
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

interface PageMeta {
  title: string;
  section: string;
  icon: React.ComponentType<{ className?: string }>;
  chipText?: string;
}

const getPageMeta = (pathname: string, role?: string): PageMeta => {
  const portalName = role === 'ADMIN' ? 'Admin Portal' : role === 'FACULTY' ? 'Faculty Portal' : 'Student Portal';

  if (pathname.includes('/dashboard')) {
    return {
      title: 'Dashboard Overview',
      section: portalName,
      icon: LayoutDashboard,
      chipText: 'Real-Time Sync',
    };
  }
  if (pathname.includes('/account')) {
    return {
      title: 'Account Settings',
      section: portalName,
      icon: UserIcon,
      chipText: 'Verified Profile',
    };
  }
  if (pathname.includes('/courses')) {
    return {
      title: 'Course Catalog',
      section: 'Academic Engine',
      icon: BookOpen,
      chipText: 'Spring 2026',
    };
  }
  if (pathname.includes('/schedule')) {
    return {
      title: 'Timetable & Schedule',
      section: portalName,
      icon: Calendar,
      chipText: 'Weekly Matrix',
    };
  }
  if (pathname.includes('/progress')) {
    return {
      title: 'Degree Audit',
      section: 'Academic Engine',
      icon: GraduationCap,
      chipText: 'Audit Ready',
    };
  }
  if (pathname.includes('/records')) {
    return {
      title: 'Academic Transcripts',
      section: 'Records Office',
      icon: FileText,
      chipText: 'Official Records',
    };
  }
  if (pathname.includes('/roster')) {
    return {
      title: 'Class Roster',
      section: 'Faculty Suite',
      icon: Users,
      chipText: 'Live Student Roll',
    };
  }
  if (pathname.includes('/grades')) {
    return {
      title: 'Grade Management',
      section: 'Faculty Suite',
      icon: CheckSquare,
      chipText: 'Grades Open',
    };
  }
  if (pathname.includes('/change-requests')) {
    return {
      title: 'Change Requests',
      section: 'Administration',
      icon: Sliders,
      chipText: 'Approvals Queue',
    };
  }
  if (pathname.includes('/users')) {
    return {
      title: 'User Directory',
      section: 'Administration',
      icon: ShieldCheck,
      chipText: 'Access Control',
    };
  }
  if (pathname.includes('/reports')) {
    return {
      title: 'Analytics Reports',
      section: 'Administration',
      icon: Activity,
      chipText: 'Live Metrics',
    };
  }
  if (pathname.includes('/notifications')) {
    return {
      title: 'Notifications',
      section: 'System Center',
      icon: Bell,
      chipText: 'Alert Center',
    };
  }
  return {
    title: 'Portal Overview',
    section: portalName,
    icon: Sparkles,
    chipText: 'System Active',
  };
};

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

  const pageMeta = getPageMeta(location.pathname, user?.role);
  const PageIcon = pageMeta.icon;
  const avatarUrl = getUserAvatar(user);

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      <Navbar className="w-full">
      {/* Desktop Resizable Navigation */}
      <NavBody className="flex items-center justify-between transition-all duration-300">
        {/* Left section: Sleek Glass Sidebar Toggle & Interactive Breadcrumb */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-md hover:border-teal-500/40 transition-all duration-200 group flex items-center justify-center shrink-0"
            title="Toggle Navigation Sidebar"
          >
            <PanelLeft className="w-4.5 h-4.5 text-slate-600 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:scale-110 transition-transform duration-200" />
          </button>

          {/* Breadcrumb & Dynamic Context Bar */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 backdrop-blur-md shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            {/* Small Brand Logo */}
            <Link to="/" className="flex items-center gap-1.5 shrink-0 group/logo" title="Nexus Enroll Portal">
              <img src="/nexuslogo.webp" alt="Nexus Logo" className="w-5 h-5 object-contain group-hover/logo:scale-110 transition-transform" />
            </Link>

            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />

            {/* Category Portal Root */}
            <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden sm:inline-block">
              {pageMeta.section}
            </span>

            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0 hidden sm:inline-block" />

            {/* Current Page Title with Category Icon */}
            <div className="flex items-center gap-1.5">
              <PageIcon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span className="text-xs font-black tracking-tight text-slate-800 dark:text-white">
                {pageMeta.title}
              </span>
            </div>

            {/* Useful Live Status Chip */}
            {pageMeta.chipText && (
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                {pageMeta.chipText}
              </span>
            )}
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
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700"
              title="Toggle Navigation Menu"
            >
              <PanelLeft className="w-4.5 h-4.5 text-slate-700 dark:text-slate-300" />
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-white shadow-2xs">
              <img src="/nexuslogo.webp" alt="Nexus Logo" className="w-4.5 h-4.5 object-contain shrink-0" />
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate max-w-[130px] font-extrabold">{pageMeta.title}</span>
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




