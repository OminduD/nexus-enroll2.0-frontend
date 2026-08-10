import { apiClient, ensureArray, withMockFallback } from './api';
import { FacultyProfile, ClassRosterStudent, GradeRecord } from '../types/faculty';
import { MOCK_FACULTY_PROFILE, MOCK_ROSTER_STUDENTS, MOCK_GRADES } from './mockData';

export const facultyService = {
  getProfile: async (userId = 1): Promise<FacultyProfile> => {
    try {
      const response = await apiClient.get(`/api/faculty/user/${userId}`);
      return response.data.data || response.data || MOCK_FACULTY_PROFILE;
    } catch (error) {
      return withMockFallback(error, MOCK_FACULTY_PROFILE);
    }
  },

  getRoster: async (sectionId = 1): Promise<ClassRosterStudent[]> => {
    try {
      const response = await apiClient.get(`/api/faculty/roster?sectionId=${sectionId}`);
      return ensureArray(response.data, MOCK_ROSTER_STUDENTS);
    } catch (error) {
      return withMockFallback(error, MOCK_ROSTER_STUDENTS);
    }
  },

  getGrades: async (sectionId = 1): Promise<GradeRecord[]> => {
    try {
      const response = await apiClient.get(`/api/faculty/grades?sectionId=${sectionId}`);
      return ensureArray(response.data, MOCK_GRADES);
    } catch (error) {
      return withMockFallback(error, MOCK_GRADES);
    }
  },

  saveDraftGrade: async (gradeData: Partial<GradeRecord>): Promise<GradeRecord> => {
    try {
      const response = await apiClient.post('/api/faculty/grades/draft', gradeData);
      return response.data;
    } catch (error) {
      return withMockFallback(error, (() => {
        const newGrade: GradeRecord = {
          id: Date.now(),
          enrollmentId: gradeData.enrollmentId || 101,
          studentId: gradeData.studentId || 1,
          studentName: gradeData.studentName || 'Student Name',
          sectionId: gradeData.sectionId || 1,
          courseCode: gradeData.courseCode || 'CS-101',
          assignmentTitle: gradeData.assignmentTitle || 'Assignment',
          pointsEarned: gradeData.pointsEarned || 85,
          maxPoints: gradeData.maxPoints || 100,
          letterGrade: gradeData.letterGrade || 'B',
          comments: gradeData.comments || 'Draft grade',
          status: 'DRAFT',
          gradedBy: 'prof_smith',
          createdAt: new Date().toISOString().split('T')[0],
        };
        MOCK_GRADES.push(newGrade);
        return newGrade;
      })());
    }
  },

  submitGrade: async (gradeId: number) => {
    try {
      const response = await apiClient.post('/api/faculty/grades/submit', { gradeId });
      return response.data;
    } catch (error) {
      return withMockFallback(error, (() => {
        const grade = MOCK_GRADES.find(g => g.id === gradeId);
        if (grade) {
          grade.status = 'PENDING';
        }
        return { success: true };
      })());
    }
  },

  approveGrade: async (gradeId: number) => {
    try {
      const response = await apiClient.post('/api/faculty/grades/approve', { gradeId });
      return response.data;
    } catch (error) {
      return withMockFallback(error, (() => {
        const grade = MOCK_GRADES.find(g => g.id === gradeId);
        if (grade) {
          grade.status = 'APPROVED';
        }
        return { success: true };
      })());
    }
  },

  rejectGrade: async (gradeId: number) => {
    try {
      const response = await apiClient.post('/api/faculty/grades/reject', { gradeId });
      return response.data;
    } catch (error) {
      return withMockFallback(error, (() => {
        const grade = MOCK_GRADES.find(g => g.id === gradeId);
        if (grade) {
          grade.status = 'DRAFT';
        }
        return { success: true };
      })());
    }
  }
};
