import { apiClient, ensureArray } from './api';
import { NotificationItem } from '../types/notification';
import { MOCK_NOTIFICATIONS } from './mockData';

export const notificationService = {
  getUserNotifications: async (userId = 1): Promise<NotificationItem[]> => {
    try {
      const response = await apiClient.get(`/api/notifications/user/${userId}`);
      return ensureArray(response.data, MOCK_NOTIFICATIONS);
    } catch {
      return MOCK_NOTIFICATIONS;
    }
  },

  getUnreadCount: async (userId = 1): Promise<number> => {
    try {
      const response = await apiClient.get(`/api/notifications/user/${userId}/unread-count`);
      return typeof response.data === 'number' ? response.data : MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;
    } catch {
      return MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;
    }
  },

  markAsRead: async (notificationId: number) => {
    try {
      const response = await apiClient.post(`/api/notifications/${notificationId}/read`);
      return response.data;
    } catch {
      const item = MOCK_NOTIFICATIONS.find(n => n.id === notificationId);
      if (item) item.isRead = true;
      return { success: true };
    }
  },

  markAllAsRead: async (userId = 1) => {
    try {
      const response = await apiClient.post(`/api/notifications/user/${userId}/read-all`);
      return response.data;
    } catch {
      MOCK_NOTIFICATIONS.forEach(n => { n.isRead = true; });
      return { success: true };
    }
  },

  sendNotification: async (payload: Partial<NotificationItem>) => {
    try {
      const response = await apiClient.post('/api/notifications', payload);
      return response.data;
    } catch {
      const newNotif: NotificationItem = {
        id: Date.now(),
        recipientUserId: payload.recipientUserId || 1,
        title: payload.title || 'System Announcement',
        message: payload.message || 'Notification content',
        notificationType: payload.notificationType || 'SYSTEM',
        priority: payload.priority || 'MEDIUM',
        isRead: false,
        createdAt: 'Just now',
      };
      MOCK_NOTIFICATIONS.unshift(newNotif);
      return newNotif;
    }
  }
};
