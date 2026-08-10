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
      
      // If backend succeeds, use its data. Merge with local just in case there are offline items.
      const local = getStoredNotifications();
      const combined = [...local, ...data];
      return Array.from(new Map(combined.map(n => [n.id, n])).values())
                  .sort((a, b) => b.id - a.id);
    } catch (error) {
      return withMockFallback(error, getStoredNotifications());
    }
  },

  getUnreadCount: async (userId = 1): Promise<number> => {
    try {
      const response = await apiClient.get(`/api/notifications/user/${userId}/unread-count`);
      const notifs = getStoredNotifications();
      const count = response.data?.data?.count ?? response.data?.count;
      return typeof count === 'number' ? count : notifs.filter(n => !n.isRead).length;
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
      const requestPayload = {
        ...payload,
        eventType: (payload.notificationType || 'SYSTEM') + '_STUDENT'
      };
      const response = await apiClient.post('/api/notifications', requestPayload);
      addStoredNotification(payload);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 400 && error?.response?.data?.message) {
        throw error;
      }
      const newNotif = addStoredNotification(payload);
      return withMockFallback(error, newNotif);
    }
  }
};
