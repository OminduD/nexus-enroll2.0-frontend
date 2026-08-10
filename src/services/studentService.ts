import { apiClient, ensureArray, withMockFallback } from './api';
import { StudentProfile, StudentEnrollment, DegreeProgress } from '../types/student';
import { MOCK_STUDENT_PROFILE, MOCK_ALL_STUDENTS, MOCK_STUDENT_ENROLLMENTS, MOCK_DEGREE_PROGRESS, MOCK_SECTIONS } from './mockData';
import { getStoredUsers } from './localStore';

export const studentService = {
  getProfile: async (userId = 1): Promise<StudentProfile> => {
    try {
      const response = await apiClient.get(`/api/students?userId=${userId}`);
      return response.data.data || response.data || MOCK_STUDENT_PROFILE;
    } catch (error) {
      return withMockFallback(error, MOCK_STUDENT_PROFILE);
    }
  },

  updateProfile: async (studentId: number, profileData: Partial<StudentProfile>): Promise<StudentProfile> => {
    try {
      const response = await apiClient.put(`/api/students/${studentId}`, profileData);
      return response.data.data || response.data;
    } catch (error) {
      return withMockFallback(error, {
        ...MOCK_STUDENT_PROFILE,
        ...profileData,
        id: studentId,
      });
    }
  },

  getAllStudents: async (page = 0, size = 10): Promise<StudentProfile[]> => {
    try {
      const response = await apiClient.get(`/api/students?page=${page}&size=${size}`);
      const data = ensureArray<StudentProfile>(response.data);
      const local = getStoredUsers();
      if (data.length > 0) {
        const combined = [...local, ...data];
        return Array.from(new Map(combined.map(s => [s.email || s.id, s])).values());
      }
      return local;
    } catch (error) {
      return withMockFallback(error, getStoredUsers());
    }
  },

  getSchedule: async (studentId = 1): Promise<StudentEnrollment[]> => {
    try {
      const response = await apiClient.get(`/api/students/${studentId}/schedule`);
      const data = response.data.data || response.data;
      if (data && Array.isArray(data.items)) {
        return data.items.map((item: any, index: number) => ({
          ...MOCK_STUDENT_ENROLLMENTS[0],
          id: item.sectionId || index,
          sectionId: item.sectionId,
          courseCode: item.courseCode,
          courseTitle: item.courseTitle,
          scheduleDays: item.scheduleDays,
          scheduleTime: item.startTime && item.endTime ? `${item.startTime} - ${item.endTime}` : item.scheduleTime || 'TBA',
          location: item.location || 'TBA',
          status: item.status || 'ENROLLED',
        }));
      }
      return ensureArray(data, MOCK_STUDENT_ENROLLMENTS);
    } catch (error) {
      return withMockFallback(error, MOCK_STUDENT_ENROLLMENTS);
    }
  },

  enroll: async (studentId: number, sectionId: number): Promise<StudentEnrollment> => {
    try {
      const response = await apiClient.post('/api/enrollments', { studentId, sectionId });
      return response.data;
    } catch (error) {
      return withMockFallback(error, (() => {
        const sec = MOCK_SECTIONS.find(s => s.id === sectionId) || MOCK_SECTIONS[0];
        const newEnrollment: StudentEnrollment = {
          id: Date.now(),
          studentId,
          sectionId,
          courseCode: sec.courseCode,
          courseTitle: sec.courseTitle,
          credits: 3,
          instructorName: sec.instructorName,
          scheduleDays: sec.scheduleDays,
          scheduleTime: sec.scheduleTime,
          location: sec.location,
          status: 'ENROLLED',
          enrolledAt: new Date().toISOString().split('T')[0],
        };
        MOCK_STUDENT_ENROLLMENTS.push(newEnrollment);
        return newEnrollment;
      })());
    }
  },

  addToWaitlist: async (studentId: number, sectionId: number): Promise<StudentEnrollment> => {
    try {
      const response = await apiClient.post('/api/enrollments/waitlist', { studentId, sectionId });
      return response.data;
    } catch (error) {
      return withMockFallback(error, (() => {
        const sec = MOCK_SECTIONS.find(s => s.id === sectionId) || MOCK_SECTIONS[0];
        const newWaitlist: StudentEnrollment = {
          id: Date.now(),
          studentId,
          sectionId,
          courseCode: sec.courseCode,
          courseTitle: sec.courseTitle,
          credits: 3,
          instructorName: sec.instructorName,
          scheduleDays: sec.scheduleDays,
          scheduleTime: sec.scheduleTime,
          location: sec.location,
          status: 'WAITLISTED',
          enrolledAt: new Date().toISOString().split('T')[0],
        };
        MOCK_STUDENT_ENROLLMENTS.push(newWaitlist);
        return newWaitlist;
      })());
    }
  },

  dropCourse: async (enrollmentId: number) => {
    try {
      const response = await apiClient.delete(`/api/enrollments/${enrollmentId}`);
      return response.data;
    } catch (error) {
      return withMockFallback(error, (() => {
        const idx = MOCK_STUDENT_ENROLLMENTS.findIndex(e => e.id === enrollmentId);
        if (idx !== -1) {
          MOCK_STUDENT_ENROLLMENTS.splice(idx, 1);
        }
        return { success: true };
      })());
    }
  },

  getDegreeProgress: async (studentId = 1, programId = 1): Promise<DegreeProgress> => {
    try {
      const response = await apiClient.get(`/api/students/${studentId}/progress?programId=${programId}`);
      const data = response.data.data || response.data;
      if (data && data.studentId) {
        // Map backend DTO to frontend interface
        return {
          ...MOCK_DEGREE_PROGRESS,
          studentId: data.studentId,
          totalRequiredCredits: data.requiredCredits ?? MOCK_DEGREE_PROGRESS.totalRequiredCredits,
          creditsCompleted: data.completedCredits ?? MOCK_DEGREE_PROGRESS.creditsCompleted,
          gpa: data.gpa ?? MOCK_DEGREE_PROGRESS.gpa,
          fulfilledCourses: data.completedCourses || MOCK_DEGREE_PROGRESS.fulfilledCourses,
          remainingCourses: data.remainingRequirements || MOCK_DEGREE_PROGRESS.remainingCourses,
        };
      }
      return data || MOCK_DEGREE_PROGRESS;
    } catch (error) {
      return withMockFallback(error, MOCK_DEGREE_PROGRESS);
    }
  },
};
