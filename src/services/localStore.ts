import { ChangeRequest } from '../types/course';
import { GradeRecord } from '../types/faculty';
import { NotificationItem } from '../types/notification';
import { StudentProfile } from '../types/student';

const KEYS = {
  CHANGE_REQUESTS: 'nexus_change_requests_v2',
  GRADES: 'nexus_grades_v2',
  NOTIFICATIONS: 'nexus_notifications_v2',
  USERS: 'nexus_users_v2',
};

// Clean legacy mock seeds if present
export const clearLegacyMockStorage = () => {
  try {
    const usersRaw = localStorage.getItem(KEYS.USERS);
    if (usersRaw && usersRaw.includes('Clark Kent')) {
      localStorage.removeItem(KEYS.USERS);
    }
    const notifsRaw = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (notifsRaw && notifsRaw.includes('Welcome to NexusEnroll 2.0')) {
      localStorage.removeItem(KEYS.NOTIFICATIONS);
    }
    const crRaw = localStorage.getItem(KEYS.CHANGE_REQUESTS);
    if (crRaw && crRaw.includes('prof_smith')) {
      localStorage.removeItem(KEYS.CHANGE_REQUESTS);
    }
  } catch (e) {
    console.warn('Failed to clear legacy mock storage:', e);
  }
};

// --- Change Requests Store ---
export const getStoredChangeRequests = (): ChangeRequest[] => {
  try {
    const raw = localStorage.getItem(KEYS.CHANGE_REQUESTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveStoredChangeRequests = (requests: ChangeRequest[]) => {
  try {
    localStorage.setItem(KEYS.CHANGE_REQUESTS, JSON.stringify(requests));
  } catch (e) {
    console.warn('Failed to save change requests to localStorage:', e);
  }
};

export const addStoredChangeRequest = (req: Partial<ChangeRequest>): ChangeRequest => {
  const current = getStoredChangeRequests();
  const newReq: ChangeRequest = {
    id: req.id || Date.now(),
    courseId: req.courseId || 1,
    courseCode: req.courseCode || 'CS-101',
    requestType: req.requestType || 'CAPACITY_CHANGE',
    requestedBy: req.requestedBy || 'faculty1',
    proposedValue: req.proposedValue || '50',
    details: req.details || 'Capacity expansion request',
    status: req.status || 'PENDING',
    createdAt: req.createdAt || new Date().toISOString().split('T')[0],
  };
  const updated = [newReq, ...current.filter(c => c.id !== newReq.id)];
  saveStoredChangeRequests(updated);
  window.dispatchEvent(new CustomEvent('nexus_change_requests_updated'));
  return newReq;
};

export const updateStoredChangeRequestStatus = (id: number, status: 'APPROVED' | 'REJECTED', comment?: string) => {
  const current = getStoredChangeRequests();
  const updated = current.map(item => {
    if (item.id === id) {
      return { ...item, status, reviewComment: comment || item.reviewComment };
    }
    return item;
  });
  saveStoredChangeRequests(updated);
  window.dispatchEvent(new CustomEvent('nexus_change_requests_updated'));
};

// --- Grades Store ---
export const getStoredGrades = (): GradeRecord[] => {
  try {
    const raw = localStorage.getItem(KEYS.GRADES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveStoredGrades = (grades: GradeRecord[]) => {
  try {
    localStorage.setItem(KEYS.GRADES, JSON.stringify(grades));
  } catch (e) {
    console.warn('Failed to save grades to localStorage:', e);
  }
};

export const addStoredGrade = (gradeData: Partial<GradeRecord>): GradeRecord => {
  const current = getStoredGrades();
  const newGrade: GradeRecord = {
    id: gradeData.id || Date.now(),
    enrollmentId: gradeData.enrollmentId || 1,
    studentId: gradeData.studentId || 1,
    studentName: gradeData.studentName || 'Student',
    sectionId: gradeData.sectionId || 1,
    courseCode: gradeData.courseCode || 'CS-101',
    assignmentTitle: gradeData.assignmentTitle || 'Assignment',
    pointsEarned: gradeData.pointsEarned ?? 85,
    maxPoints: gradeData.maxPoints ?? 100,
    letterGrade: gradeData.letterGrade || 'B',
    comments: gradeData.comments || '',
    status: gradeData.status || 'DRAFT',
    gradedBy: gradeData.gradedBy || 'FACULTY',
    createdAt: gradeData.createdAt || new Date().toISOString().split('T')[0],
  };
  const updated = [newGrade, ...current.filter(g => g.id !== newGrade.id)];
  saveStoredGrades(updated);
  window.dispatchEvent(new CustomEvent('nexus_grades_updated'));
  return newGrade;
};

export const updateStoredGradeStatus = (id: number, status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED') => {
  const current = getStoredGrades();
  const updated = current.map(item => {
    if (item.id === id) {
      return { ...item, status };
    }
    return item;
  });
  saveStoredGrades(updated);
  window.dispatchEvent(new CustomEvent('nexus_grades_updated'));
};

// --- Notifications Store ---
export const getStoredNotifications = (): NotificationItem[] => {
  try {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveStoredNotifications = (notifications: NotificationItem[]) => {
  try {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (e) {
    console.warn('Failed to save notifications to localStorage:', e);
  }
};

export const addStoredNotification = (payload: Partial<NotificationItem>): NotificationItem => {
  const current = getStoredNotifications();
  const newNotif: NotificationItem = {
    id: payload.id || Date.now(),
    recipientUserId: payload.recipientUserId || 1,
    title: payload.title || 'System Announcement',
    message: payload.message || 'Notification content',
    notificationType: payload.notificationType || 'SYSTEM',
    priority: payload.priority || 'MEDIUM',
    isRead: payload.isRead || false,
    createdAt: payload.createdAt || 'Just now',
  };
  const updated = [newNotif, ...current.filter(n => n.id !== newNotif.id)];
  saveStoredNotifications(updated);
  window.dispatchEvent(new CustomEvent('nexus_notifications_updated'));
  return newNotif;
};

export const markAllStoredNotificationsRead = () => {
  const current = getStoredNotifications();
  const updated = current.map(n => ({ ...n, isRead: true }));
  saveStoredNotifications(updated);
  window.dispatchEvent(new CustomEvent('nexus_notifications_updated'));
};

export const markStoredNotificationRead = (id: number) => {
  const current = getStoredNotifications();
  const updated = current.map(n => n.id === id ? { ...n, isRead: true } : n);
  saveStoredNotifications(updated);
  window.dispatchEvent(new CustomEvent('nexus_notifications_updated'));
};

// --- Users Store ---
export const getStoredUsers = (): StudentProfile[] => {
  try {
    const raw = localStorage.getItem(KEYS.USERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveStoredUsers = (users: StudentProfile[]) => {
  try {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.warn('Failed to save users to localStorage:', e);
  }
};

export const addStoredUser = (userProfile: StudentProfile): StudentProfile => {
  const current = getStoredUsers();
  const updated = [userProfile, ...current.filter(u => u.id !== userProfile.id && u.email !== userProfile.email)];
  saveStoredUsers(updated);
  window.dispatchEvent(new CustomEvent('nexus_users_updated'));
  return userProfile;
};
