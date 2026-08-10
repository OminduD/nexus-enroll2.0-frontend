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
      let allGrades: GradeRecord[] = [];
      try {
        const rosterRes = await apiClient.get(`/api/faculty/roster?sectionId=${sectionId}`);
        const students = rosterRes.data?.data?.students || rosterRes.data?.students || rosterRes.data || [];
        for (const student of students) {
          if (student.enrollmentId) {
            try {
              const gradesRes = await apiClient.get(`/api/faculty/grades?enrollmentId=${student.enrollmentId}`);
              const studentGrades = ensureArray<GradeRecord>(gradesRes.data);
              studentGrades.forEach(g => {
                g.studentName = student.firstName ? `${student.firstName} ${student.lastName}` : student.studentName;
                g.courseCode = 'CS-101'; // Fallback for UI if not stored
              });
              allGrades.push(...studentGrades);
            } catch (e) { } // Ignore individual student errors
          }
        }
      } catch (e) {
         // Ignore roster fetch errors
      }

      const local = getStoredGrades();
      const combined = [...local, ...allGrades];
      return Array.from(new Map(combined.map(n => [n.id || Date.now(), n])).values())
                  .sort((a, b) => (b.id || 0) - (a.id || 0));
    } catch (error) {
      return withMockFallback(error, getStoredGrades());
    }
  },

  saveDraftGrade: async (gradeData: Partial<GradeRecord>): Promise<GradeRecord> => {
    try {
      // Ensure gradedBy is set
      const payload = {
        ...gradeData,
        gradedBy: gradeData.gradedBy || 'FACULTY'
      };
      const response = await apiClient.post('/api/faculty/grades/draft', payload);
      const newGrade = response.data?.data || response.data;
      // Preserve frontend-only fields in local storage just in case
      const localGrade = { ...gradeData, ...newGrade };
      addStoredGrade(localGrade);
      return localGrade;
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
