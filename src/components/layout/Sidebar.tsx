/**
 * Role-based navigation sidebar (student/faculty/admin nav items) and sign
 * out control. Consumes AuthContext (useAuth) for the current user's role
 * and logout(); no direct backend calls.
 */
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  GraduationCap,
  FileSpreadsheet,
  Bell,
  Users,
  CheckSquare,
  FileCode,
  BarChart3,
  Send,
  Sparkles,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Sidebar as AcetSidebar, SidebarBody, SidebarLink, useSidebar } from '../ui/sidebar';
import { cn } from '@/lib/utils';
import { getUserAvatar } from '../../lib/avatars';

interface AppSidebarProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  onClose?: () => void;
}

export const Sidebar: React.FC<AppSidebarProps> = ({ isOpen, setIsOpen, onClose }) => {
  const handleSetOpen = setIsOpen
    ? (val: boolean | ((prev: boolean) => boolean)) => {
        setIsOpen(typeof val === 'function' ? val(!!isOpen) : val);
      }
    : undefined;

  return (
    <AcetSidebar open={isOpen} setOpen={handleSetOpen}>
      <SidebarContent onClose={onClose} />
    </AcetSidebar>
  );
};

const SidebarContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { open } = useSidebar();
  const role = user?.role || 'STUDENT';

  const accountHref = role === 'ADMIN' ? '/admin/account' : role === 'FACULTY' ? '/faculty/account' : '/student/account';

  const studentNav = [
    { label: 'Overview', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Course Catalog', href: '/student/courses', icon: BookOpen },
    { label: 'Schedule & Timetable', href: '/student/schedule', icon: Calendar },
    { label: 'Degree Progress', href: '/student/progress', icon: GraduationCap },
    { label: 'Academic Records', href: '/student/records', icon: FileSpreadsheet },
    { label: 'Notifications', href: '/student/notifications', icon: Bell },
    { label: 'My Account', href: '/student/account', icon: UserIcon },
  ];

  const facultyNav = [
    { label: 'Overview', href: '/faculty/dashboard', icon: LayoutDashboard },
    { label: 'My Courses & Rosters', href: '/faculty/roster', icon: Users },
    { label: 'Grade Management', href: '/faculty/grades', icon: CheckSquare },
    { label: 'Change Requests', href: '/faculty/change-requests', icon: FileCode },
    { label: 'My Account', href: '/faculty/account', icon: UserIcon },
  ];

  const adminNav = [
    { label: 'Analytics Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Course Administration', href: '/admin/courses', icon: BookOpen },
    { label: 'Grade Approvals', href: '/admin/grade-approvals', icon: CheckSquare },
    { label: 'Change Requests', href: '/admin/change-requests', icon: FileCode },
    { label: 'User Directory', href: '/admin/users', icon: Users },
    { label: 'System Reports', href: '/admin/reports', icon: BarChart3 },
    { label: 'Broadcast Notification', href: '/admin/notifications', icon: Send },
    { label: 'My Account', href: '/admin/account', icon: UserIcon },
  ];

  const navItems = role === 'ADMIN' ? adminNav : role === 'FACULTY' ? facultyNav : studentNav;
  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'User Profile';
  const avatarUrl = getUserAvatar(user);

  return (
    <SidebarBody className="justify-between gap-6 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm h-screen">
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <LogoHeader open={open} role={role} />
        
        <div className="mt-6 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <SidebarLink
                key={item.href}
                onClick={onClose}
                link={{
                  label: item.label,
                  href: item.href,
                  icon: (
                    <Icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0 transition-colors",
                        isActive ? "text-teal-700 dark:text-teal-400 font-bold" : "text-slate-500 group-hover/sidebar:text-teal-700"
                      )}
                    />
                  ),
                }}
                className={cn(
                  "py-2.5 transition-all duration-200",
                  isActive
                    ? "bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 font-bold border border-teal-200/80 dark:border-teal-800/60 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Footer User Info & Sign Out */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1.5">
        <SidebarLink
          onClick={onClose}
          link={{
            label: userName,
            href: accountHref,
            icon: (
              <img
                src={avatarUrl}
                className="h-7 w-7 flex-shrink-0 rounded-full object-cover ring-2 ring-teal-500/40"
                alt="User Avatar"
              />
            ),
          }}
          className="hover:bg-slate-100 dark:hover:bg-slate-800/60"
        />
        <button
          onClick={() => {
            if (onClose) onClose();
            logout();
          }}
          className={cn(
            "flex items-center gap-3 py-2 px-2.5 text-xs text-slate-500 hover:text-rose-600 transition-colors rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 w-full text-left",
            open ? "justify-start" : "justify-center"
          )}
          title="Sign Out"
        >
          <LogOut className="h-5 w-5 text-slate-400 hover:text-rose-600 flex-shrink-0" />
          <motion.span
            animate={{
              display: open ? "inline-block" : "none",
              opacity: open ? 1 : 0,
            }}
            className="text-slate-600 dark:text-slate-300 hover:text-rose-600 font-medium whitespace-pre"
          >
            Sign Out
          </motion.span>
        </button>
      </div>
    </SidebarBody>
  );
};

const LogoHeader = ({ open, role }: { open: boolean; role: string }) => {
  return (
    <Link
      to="#"
      className={cn(
        "flex items-center gap-3 py-2 relative z-20 overflow-hidden transition-all duration-200",
        open ? "justify-start px-1" : "justify-center"
      )}
    >
      <div className="relative flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-600 text-white font-black text-lg shadow-md flex-shrink-0">
        N
      </div>
      <motion.div
        animate={{
          display: open ? "flex" : "none",
          opacity: open ? 1 : 0,
        }}
        className="flex flex-col whitespace-pre min-w-0"
      >
        <h2 className="font-extrabold text-sm tracking-tight text-[#333333] dark:text-white leading-tight">
          Nexus<span className="text-teal-700 dark:text-teal-400">Enroll</span>
        </h2>
        <p className="text-[9px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-amber-500" /> {role} PORTAL
        </p>
      </motion.div>
    </Link>
  );
};
