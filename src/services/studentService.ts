import { apiClient, ensureArray } from './api';
import { StudentProfile, StudentEnrollment, DegreeProgress } from '../types/student';
import { MOCK_STUDENT_PROFILE, MOCK_STUDENT_ENROLLMENTS, MOCK_DEGREE_PROGRESS, MOCK_SECTIONS } from './mockData';

export const studentService = {
  getProfile: async (studentId = 1): Promise<StudentProfile> => {
    try {
      const response = await apiClient.get(`/api/students/${studentId}`);
      return response.data || MOCK_STUDENT_PROFILE;
    } catch {
      return MOCK_STUDENT_PROFILE;
    }
  },

  getAllStudents: async (page = 0, size = 10): Promise<StudentProfile[]> => {
    try {
      const response = await apiClient.get(`/api/students?page=${page}&size=${size}`);
      return ensureArray(response.data, [MOCK_STUDENT_PROFILE]);
    } catch {
      return [
        MOCK_STUDENT_PROFILE,
        {
          id: 2,
          userId: 5,
          studentIdNumber: 'NEX-2024-7711',
          firstName: 'Sarah',
          lastName: 'Jenkins',
          email: 'sarah.j@nexus.edu',
          major: 'Electrical Engineering',
          enrollmentYear: 2024,
          academicStanding: 'GOOD_STANDING',
          gpa: 3.65,
        },
        {
          id: 3,
          userId: 6,
          studentIdNumber: 'NEX-2023-9090',
          firstName: 'Marcus',
          lastName: 'Vance',
          email: 'marcus.vance@nexus.edu',
          major: 'Mathematics',
          enrollmentYear: 2023,
          academicStanding: 'DEANS_LIST',
          gpa: 3.95,
        }
      ];
    }
  },

  getSchedule: async (studentId = 1): Promise<StudentEnrollment[]> => {
    try {
      const response = await apiClient.get(`/api/students/${studentId}/schedule`);
      return ensureArray(response.data, MOCK_STUDENT_ENROLLMENTS);
    } catch {
      return MOCK_STUDENT_ENROLLMENTS;
    }
  },

  enroll: async (studentId: number, sectionId: number): Promise<StudentEnrollment> => {
    try {
      const response = await apiClient.post('/api/enrollments', { studentId, sectionId });
      return response.data;
    } catch {
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
    }
  },

  addToWaitlist: async (studentId: number, sectionId: number): Promise<StudentEnrollment> => {
    try {
      const response = await apiClient.post('/api/enrollments/waitlist', { studentId, sectionId });
      return response.data;
    } catch {
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
    }
  },

  dropCourse: async (enrollmentId: number) => {
    try {
      const response = await apiClient.delete(`/api/enrollments/${enrollmentId}`);
      return response.data;
    } catch {
      const idx = MOCK_STUDENT_ENROLLMENTS.findIndex(e => e.id === enrollmentId);
      if (idx !== -1) {
        MOCK_STUDENT_ENROLLMENTS.splice(idx, 1);
      }
      return { success: true };
    }
  },

  getDegreeProgress: async (studentId = 1, programId = 1): Promise<DegreeProgress> => {
    try {
      const response = await apiClient.get(`/api/students/${studentId}/progress?programId=${programId}`);
      return response.data || MOCK_DEGREE_PROGRESS;
    } catch {
      return MOCK_DEGREE_PROGRESS;
    }
  }
};
