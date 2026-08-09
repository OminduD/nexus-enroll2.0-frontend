import React, { useState } from 'react';
import { Send, Bell } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { NotificationPriority, NotificationType } from '../../types/notification';
import { useToast } from '../../components/ui/Toast';

export const NotificationBroadcastPage: React.FC = () => {
  const [title, setTitle] = useState('Fall 2025 Registration Update');
  const [message, setMessage] = useState('Course add/drop deadline has been extended to September 1st.');
  const [notificationType, setNotificationType] = useState<NotificationType>('SYSTEM');
  const [priority, setPriority] = useState<NotificationPriority>('HIGH');
  const [targetUser, setTargetUser] = useState('ALL');
  const [isSending, setIsSending] = useState(false);

  const { showToast } = useToast();

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      await notificationService.sendNotification({
        recipientUserId: 1,
        title,
        message,
        notificationType,
        priority,
      });

      showToast(`Broadcast notification "${title}" sent successfully!`, 'success');
      setTitle('');
      setMessage('');
    } catch {
      showToast('Failed to send broadcast announcement.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
          System Notification Broadcast
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Publish system-wide academic announcements or dispatch targeted alerts to active student and faculty accounts
        </p>
      </div>

      {/* Broadcast Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 text-[#333333]">
        <h3 className="font-bold text-lg text-[#333333] flex items-center gap-2">
          <Bell className="w-5 h-5 text-teal-700" /> Compose Announcement
        </h3>

        <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-1">Target Recipient Scope</label>
            <select
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
            >
              <option value="ALL">All Active Users (Students, Faculty, Admins)</option>
              <option value="STUDENT">All Enrolled Students Only</option>
              <option value="FACULTY">All Faculty Members Only</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Notification Type</label>
              <select
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value as NotificationType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
              >
                <option value="SYSTEM">SYSTEM (General Announcement)</option>
                <option value="ENROLLMENT">ENROLLMENT (Registration Alert)</option>
                <option value="GRADE">GRADE (Grade Release Alert)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as NotificationPriority)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] font-bold focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
              >
                <option value="HIGH">HIGH (Urgent Alert)</option>
                <option value="MEDIUM">MEDIUM (Standard)</option>
                <option value="LOW">LOW (Informational)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">Announcement Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Fall Registration Deadline Extension"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">Message Content</label>
            <textarea
              required
              rows={4}
              placeholder="Detailed announcement text..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSending ? 'Sending...' : <><Send className="w-4 h-4" /> Broadcast Announcement Now</>}
          </button>
        </form>
      </div>
    </div>
  );
};

