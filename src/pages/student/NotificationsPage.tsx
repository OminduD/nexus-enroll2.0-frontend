/**
 * Student notifications inbox with type/priority filters. Calls
 * notificationService.getUserNotifications (GET /api/notifications/user/{id})
 * and markAllAsRead (POST /api/notifications/user/{id}/read-all).
 */
import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, Filter, AlertTriangle, BookCheck, Info } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { NotificationItem } from '../../types/notification';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { TableSkeleton } from '../../components/ui/Skeleton';

export const NotificationsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const { user } = useAuth();

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const list = await notificationService.getUserNotifications(user?.id || 1);
      setNotifications(list);
    } catch (e) {
      console.warn('Notifications fallback:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    const handleUpdate = () => loadNotifications();
    window.addEventListener('nexus_notifications_updated', handleUpdate);
    return () => window.removeEventListener('nexus_notifications_updated', handleUpdate);
  }, [user]);

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead(user?.id || 1);
    await loadNotifications();
  };

  const filtered = notifications.filter((n) => {
    if (typeFilter !== 'ALL' && n.notificationType !== typeFilter) return false;
    if (priorityFilter !== 'ALL' && n.priority !== priorityFilter) return false;
    return true;
  });

  if (isLoading) {
    return <TableSkeleton rows={6} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
            Notifications Inbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            System announcements, grade posting alerts, and registration status updates
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#333333] flex items-center gap-1.5 transition-colors border border-slate-200"
        >
          <CheckCheck className="w-4 h-4 text-teal-700" /> Mark All as Read
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3 text-[#333333]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="ENROLLMENT">Enrollment</option>
            <option value="GRADE">Grade</option>
            <option value="SYSTEM">System</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center text-slate-400 border border-slate-200 shadow-sm">
            <Bell className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <p className="font-bold text-[#333333]">No notifications match your filters.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all flex items-start gap-4 ${
                item.isRead
                  ? 'opacity-80'
                  : 'border-l-4 border-l-teal-700 bg-teal-50/30'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-100 shrink-0">
                {item.notificationType === 'ENROLLMENT' && <BookCheck className="w-5 h-5 text-teal-700" />}
                {item.notificationType === 'GRADE' && <Info className="w-5 h-5 text-teal-700" />}
                {item.notificationType === 'SYSTEM' && <AlertTriangle className="w-5 h-5 text-coral-500" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#333333]">{item.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.priority === 'HIGH' ? 'danger' : item.priority === 'MEDIUM' ? 'warning' : 'secondary'}>
                      {item.priority}
                    </Badge>
                    <span className="text-[11px] text-slate-400">{item.createdAt}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

