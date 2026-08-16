import { apiClient, ensureArray, withMockFallback, USE_MOCK_FALLBACK } from './api';
import { NotificationItem } from '../types/notification';
import { MOCK_NOTIFICATIONS } from './mockData';
import {
  getStoredNotifications,
  addStoredNotification,
  markAllStoredNotificationsRead,
  markStoredNotificationRead,
} from './localStore';

export const notificationService = {
  getUserNotifications: async (userId = 4): Promise<NotificationItem[]> => {
    try {
      const response = await apiClient.get(`/api/notifications/user/${userId}`);
      const rawList = ensureArray<any>(response.data, []);
      if (rawList.length > 0) {
        return rawList.map((n: any) => ({
          id: n.id,
          recipientUserId: n.recipientUserId || userId,
          title: n.title || 'Notification',
          message: n.message || '',
          notificationType: n.notificationType || 'SYSTEM',
          priority: n.priority || 'MEDIUM',
          isRead: n.isRead ?? false,
          createdAt: n.createdAt ? (typeof n.createdAt === 'string' ? n.createdAt.replace('T', ' ').slice(0, 16) : 'Recently') : 'Just now',
        })).sort((a, b) => b.id - a.id);
      }
      return USE_MOCK_FALLBACK ? MOCK_NOTIFICATIONS : [];
    } catch (error) {
      const local = getStoredNotifications();
      return withMockFallback(error, local.length > 0 ? local : MOCK_NOTIFICATIONS);
    }
  },

  getUnreadCount: async (userId = 4): Promise<number> => {
    try {
      const response = await apiClient.get(`/api/notifications/user/${userId}/unread-count`);
      const count = response.data?.data?.count ?? response.data?.count;
      if (typeof count === 'number') return count;
      const notifs = await notificationService.getUserNotifications(userId);
      return notifs.filter(n => !n.isRead).length;
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

  markAllAsRead: async (userId = 4) => {
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
        recipientUserId: payload.recipientUserId || 4,
        title: payload.title || 'System Notification',
        message: payload.message || 'Notification details',
        notificationType: payload.notificationType || 'SYSTEM',
        priority: payload.priority || 'MEDIUM',
        relatedEntityType: 'USER',
        relatedEntityId: payload.recipientUserId || 4,
        eventType: (payload.notificationType || 'SYSTEM') + '_UPDATE'
      };
      const response = await apiClient.post('/api/notifications', requestPayload);
      const newNotif = response.data?.data || payload;
      addStoredNotification(newNotif);
      return response.data;
    } catch (error: any) {
      const newNotif = addStoredNotification(payload);
      return withMockFallback(error, newNotif);
    }
  }
};
