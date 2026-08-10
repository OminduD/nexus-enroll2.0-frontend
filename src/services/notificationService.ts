import { apiClient, ensureArray, withMockFallback } from './api';
import { NotificationItem } from '../types/notification';
import { MOCK_NOTIFICATIONS } from './mockData';
import {
  getStoredNotifications,
  addStoredNotification,
  markAllStoredNotificationsRead,
  markStoredNotificationRead,
} from './localStore';

export const notificationService = {
  getUserNotifications: async (userId = 1): Promise<NotificationItem[]> => {
    try {
      const response = await apiClient.get(`/api/notifications/user/${userId}`);
      const data = ensureArray<NotificationItem>(response.data);
      const local = getStoredNotifications();
      if (data.length > 0) {
        const combined = [...local, ...data];
        return Array.from(new Map(combined.map(n => [n.id, n])).values())
                    .sort((a, b) => b.id - a.id);
      }
      return local;
    } catch (error) {
      return withMockFallback(error, getStoredNotifications());
    }
  },

  getUnreadCount: async (userId = 1): Promise<number> => {
    try {
      const response = await apiClient.get(`/api/notifications/user/${userId}/unread-count`);
      const notifs = getStoredNotifications();
      return typeof response.data === 'number' ? response.data : notifs.filter(n => !n.isRead).length;
    } catch (error) {
      const notifs = getStoredNotifications();
      return withMockFallback(error, notifs.filter(n => !n.isRead).length);
    }
  },

  markAsRead: async (notificationId: number) => {
    try {
      const response = await apiClient.post(`/api/notifications/${notificationId}/read`);
      markStoredNotificationRead(notificationId);
      return response.data;
    } catch (error) {
      markStoredNotificationRead(notificationId);
      return withMockFallback(error, { success: true });
    }
  },

  markAllAsRead: async (userId = 1) => {
    try {
      const response = await apiClient.post(`/api/notifications/user/${userId}/read-all`);
      markAllStoredNotificationsRead();
      return response.data;
    } catch (error) {
      markAllStoredNotificationsRead();
      return withMockFallback(error, { success: true });
    }
  },

  sendNotification: async (payload: Partial<NotificationItem>) => {
    try {
      const response = await apiClient.post('/api/notifications', payload);
      addStoredNotification(payload);
      return response.data;
    } catch (error) {
      const newNotif = addStoredNotification(payload);
      return withMockFallback(error, newNotif);
    }
  }
};
