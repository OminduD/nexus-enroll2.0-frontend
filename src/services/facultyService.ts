import { apiClient, ensureArray, withMockFallback } from './api';
import { FacultyProfile, ClassRosterStudent, GradeRecord } from '../types/faculty';
import { MOCK_FACULTY_PROFILE, MOCK_ROSTER_STUDENTS, MOCK_GRADES } from './mockData';
import { getStoredGrades, addStoredGrade, updateStoredGradeStatus } from './localStore';

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
      const data = ensureArray<GradeRecord>(response.data);
      return data.length > 0 ? data : getStoredGrades();
    } catch (error) {
      return withMockFallback(error, getStoredGrades());
    }
  },

  saveDraftGrade: async (gradeData: Partial<GradeRecord>): Promise<GradeRecord> => {
    try {
      const response = await apiClient.post('/api/faculty/grades/draft', gradeData);
      addStoredGrade(gradeData);
      return response.data;
    } catch (error) {
      return withMockFallback(error, addStoredGrade(gradeData));
    }
  },

  submitGrade: async (gradeId: number) => {
    try {
      const response = await apiClient.post('/api/faculty/grades/submit', { gradeId });
      updateStoredGradeStatus(gradeId, 'PENDING');
      return response.data;
    } catch (error) {
      updateStoredGradeStatus(gradeId, 'PENDING');
      return withMockFallback(error, { success: true });
    }
  },

  approveGrade: async (gradeId: number) => {
    try {
      const response = await apiClient.post('/api/faculty/grades/approve', { gradeId });
      updateStoredGradeStatus(gradeId, 'APPROVED');
      return response.data;
    } catch (error) {
      updateStoredGradeStatus(gradeId, 'APPROVED');
      return withMockFallback(error, { success: true });
    }
  },

  rejectGrade: async (gradeId: number) => {
    try {
      const response = await apiClient.post('/api/faculty/grades/reject', { gradeId });
      updateStoredGradeStatus(gradeId, 'REJECTED');
      return response.data;
    } catch (error) {
      updateStoredGradeStatus(gradeId, 'REJECTED');
      return withMockFallback(error, { success: true });
    }
  }
};
