import { apiClient, ensureArray, withMockFallback } from './api';
import { NotificationItem } from '../types/notification';
import { MOCK_NOTIFICATIONS } from './mockData';

export const notificationService = {
  getUserNotifications: async (userId = 1): Promise<NotificationItem[]> => {
    try {
      const response = await apiClient.get(`/api/notifications/user/${userId}`);
      return ensureArray(response.data, MOCK_NOTIFICATIONS);
    } catch (error) {
      return withMockFallback(error, MOCK_NOTIFICATIONS);
    }
  },

  getUnreadCount: async (userId = 1): Promise<number> => {
    try {
      const response = await apiClient.get(`/api/notifications/user/${userId}/unread-count`);
      return typeof response.data === 'number' ? response.data : MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;
    } catch (error) {
      return withMockFallback(error, MOCK_NOTIFICATIONS.filter(n => !n.isRead).length);
    }
  },

  markAsRead: async (notificationId: number) => {
    try {
      const response = await apiClient.post(`/api/notifications/${notificationId}/read`);
      window.dispatchEvent(new CustomEvent('nexus_notifications_updated'));
      return response.data;
    } catch (error) {
      const res = withMockFallback(error, (() => {
        const item = MOCK_NOTIFICATIONS.find(n => n.id === notificationId);
        if (item) item.isRead = true;
        return { success: true };
      })());
      window.dispatchEvent(new CustomEvent('nexus_notifications_updated'));
      return res;
    }
  },

  markAllAsRead: async (userId = 1) => {
    try {
      const response = await apiClient.post(`/api/notifications/user/${userId}/read-all`);
      window.dispatchEvent(new CustomEvent('nexus_notifications_updated'));
      return response.data;
    } catch (error) {
      const res = withMockFallback(error, (() => {
        MOCK_NOTIFICATIONS.forEach(n => { n.isRead = true; });
        return { success: true };
      })());
      window.dispatchEvent(new CustomEvent('nexus_notifications_updated'));
      return res;
    }
  },

  sendNotification: async (payload: Partial<NotificationItem>) => {
    try {
      const response = await apiClient.post('/api/notifications', payload);
      window.dispatchEvent(new CustomEvent('nexus_notifications_updated'));
      return response.data;
    } catch (error) {
      const res = withMockFallback(error, (() => {
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
      })());
      window.dispatchEvent(new CustomEvent('nexus_notifications_updated'));
      return res;
    }
  }
};
