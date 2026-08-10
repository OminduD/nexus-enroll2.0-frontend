import React, { useEffect, useState, useRef } from 'react';
import { Bell, CheckCheck, Info, BookCheck, AlertTriangle } from 'lucide-react';
import { NotificationItem } from '../../types/notification';
import { notificationService } from '../../services/notificationService';
import { Badge } from '../ui/Badge';
import { useNavigate } from 'react-router-dom';

interface NotificationPopoverProps {
  userId?: number;
  role?: string;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({ userId = 1, role = 'STUDENT' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const popoverRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    const list = await notificationService.getUserNotifications(userId);
    const count = await notificationService.getUnreadCount(userId);
    setNotifications(list);
    setUnreadCount(count);
  };

  useEffect(() => {
    loadNotifications();
    const handleUpdate = () => {
      loadNotifications();
    };
    window.addEventListener('nexus_notifications_updated', handleUpdate);
    return () => window.removeEventListener('nexus_notifications_updated', handleUpdate);
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead(userId);
    await loadNotifications();
  };

  const handleViewAll = () => {
    setIsOpen(false);
    if (role === 'STUDENT') navigate('/student/notifications');
    else if (role === 'ADMIN') navigate('/admin/notifications');
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-[#333333] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-coral-500 text-[10px] font-bold text-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-2xl z-50 border border-slate-200 dark:border-slate-800 animate-slide-up text-[#333333] dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-[#333333]">Notifications</h4>
                <Badge variant="warning">{unreadCount} New</Badge>
              </div>
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-teal-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No notifications.</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl border text-xs transition-colors ${
                      n.isRead
                        ? 'bg-slate-50 border-slate-200 text-slate-600'
                        : 'bg-teal-50/70 border-teal-200 text-[#333333] font-medium'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {n.notificationType === 'ENROLLMENT' && <BookCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />}
                      {n.notificationType === 'GRADE' && <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />}
                      {n.notificationType === 'SYSTEM' && <AlertTriangle className="w-4 h-4 text-coral-500 shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <p className="font-bold text-[#333333]">{n.title}</p>
                        <p className="mt-0.5 leading-snug">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.createdAt}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 text-center">
              <button
                onClick={handleViewAll}
                className="text-xs font-bold text-teal-700 hover:underline"
              >
                View Notifications Feed →
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

