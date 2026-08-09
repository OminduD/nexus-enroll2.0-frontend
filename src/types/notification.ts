export type NotificationType = 'ENROLLMENT' | 'GRADE' | 'SYSTEM' | 'COURSE_CHANGE';
export type NotificationPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface NotificationItem {
  id: number;
  recipientUserId: number;
  title: string;
  message: string;
  notificationType: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
}
