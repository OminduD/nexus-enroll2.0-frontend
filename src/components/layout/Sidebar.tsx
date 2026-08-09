import React from 'react';
import { NavLink } from 'react-router-dom';
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
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  const studentNav = [
    { title: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
    { title: 'Course Catalog', path: '/student/courses', icon: BookOpen },
    { title: 'Schedule & Timetable', path: '/student/schedule', icon: Calendar },
    { title: 'Degree Progress', path: '/student/progress', icon: GraduationCap },
    { title: 'Academic Records', path: '/student/records', icon: FileSpreadsheet },
    { title: 'Notifications', path: '/student/notifications', icon: Bell },
  ];

  const facultyNav = [
    { title: 'Overview', path: '/faculty/dashboard', icon: LayoutDashboard },
    { title: 'My Courses & Rosters', path: '/faculty/roster', icon: Users },
    { title: 'Grade Management', path: '/faculty/grades', icon: CheckSquare },
    { title: 'Course Change Requests', path: '/faculty/change-requests', icon: FileCode },
  ];

  const adminNav = [
    { title: 'Analytics Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Course Administration', path: '/admin/courses', icon: BookOpen },
    { title: 'Grade Approvals Queue', path: '/admin/grade-approvals', icon: CheckSquare },
    { title: 'Change Requests Inbox', path: '/admin/change-requests', icon: FileCode },
    { title: 'User Directory', path: '/admin/users', icon: Users },
    { title: 'System Reports', path: '/admin/reports', icon: BarChart3 },
    { title: 'Broadcast Notification', path: '/admin/notifications', icon: Send },
  ];

  const navItems = role === 'ADMIN' ? adminNav : role === 'FACULTY' ? facultyNav : studentNav;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-600 text-white font-black text-xl shadow-md glow-box-teal">
              N
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight text-[#333333] leading-tight">
                Nexus<span className="text-teal-700">Enroll</span>
              </h2>
              <p className="text-[9px] font-bold text-teal-700 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-coral-500" /> Enterprise v2.0
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-[#333333] lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Banner */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Active Portal
            </span>
            <Badge
              variant={role === 'ADMIN' ? 'danger' : role === 'FACULTY' ? 'warning' : 'primary'}
            >
              {role} MODE
            </Badge>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 mb-2">
            Main Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-md font-bold'
                      : 'text-[#333333] hover:bg-slate-100 hover:text-teal-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white shadow-sm" />
                    )}
                    <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-teal-700'}`} />
                    <span>{item.title}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 text-[11px] text-slate-500 text-center bg-slate-50/50">
          <p className="font-bold text-[#333333]">NexusEnroll System</p>
          <p className="text-[10px] text-slate-400 font-mono">Microservices Architecture</p>
        </div>
      </aside>
    </>
  );
};

