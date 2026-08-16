import { apiClient, ensureArray, withMockFallback, USE_MOCK_FALLBACK, RawCompletedCourseItem } from './api';
import { CompletedCourseRecord } from '../types/student';
import { MOCK_COMPLETED_RECORDS } from './mockData';

export const recordService = {
  getCompletedCourses: async (studentId = 1): Promise<CompletedCourseRecord[]> => {
    try {
      const response = await apiClient.get(`/api/records/completed-courses?studentId=${studentId}`);
      const data = response.data?.data || response.data;
      const list = Array.isArray(data) ? data : ensureArray<RawCompletedCourseItem>(data, []);

      if (list.length > 0) {
        return list.map((item: RawCompletedCourseItem, index: number) => {
          let pts = 4.0;
          const g = (item.grade || item.letterGrade || 'A').toUpperCase();
          if (g.startsWith('A')) pts = 4.0;
          else if (g.startsWith('B')) pts = 3.0;
          else if (g.startsWith('C')) pts = 2.0;
          else if (g.startsWith('D')) pts = 1.0;
          else pts = 0.0;

          return {
            id: item.id || (index + 1),
            studentId: item.studentId || studentId,
            courseId: (index + 1),
            courseCode: item.courseCode || 'ENG-101',
            courseTitle: item.courseTitle || 'College Course',
            letterGrade: item.grade || item.letterGrade || 'A',
            gradePoints: item.gradePoints ?? pts,
            semester: item.semester || 'SPRING',
            year: item.year || 2025,
            creditsEarned: item.credits || item.creditsEarned || 3,
          };
        });
      }
      return USE_MOCK_FALLBACK ? MOCK_COMPLETED_RECORDS : [];
    } catch (error) {
      return withMockFallback(error, MOCK_COMPLETED_RECORDS);
    }
  },

  getAllRecords: async (studentId = 1) => {
    try {
      const response = await apiClient.get(`/api/records?studentId=${studentId}`);
      const data = response.data?.data || response.data;
      return data || (USE_MOCK_FALLBACK ? MOCK_COMPLETED_RECORDS : null);
    } catch (error) {
      return withMockFallback(error, MOCK_COMPLETED_RECORDS);
    }
  }
};
