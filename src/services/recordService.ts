import { apiClient, ensureArray, withMockFallback, RawCompletedCourseItem } from './api';
import { CompletedCourseRecord } from '../types/student';
import { MOCK_COMPLETED_RECORDS } from './mockData';

export const recordService = {
  getCompletedCourses: async (studentId = 1): Promise<CompletedCourseRecord[]> => {
    try {
      const response = await apiClient.get(`/api/records/completed-courses?studentId=${studentId}`);
      const data = response.data.data || response.data;
      if (Array.isArray(data)) {
        return data.map((item: RawCompletedCourseItem, index: number) => {
          let pts = 0.0;
          if (item.grade?.startsWith('A')) pts = 4.0;
          else if (item.grade?.startsWith('B')) pts = 3.0;
          else if (item.grade?.startsWith('C')) pts = 2.0;
          else if (item.grade?.startsWith('D')) pts = 1.0;

          return {
            ...MOCK_COMPLETED_RECORDS[0],
            id: item.id || index,
            studentId: item.studentId || studentId,
            courseCode: item.courseCode || 'N/A',
            courseTitle: item.courseTitle || 'N/A',
            letterGrade: item.grade || item.letterGrade || 'N/A',
            gradePoints: item.gradePoints ?? pts,
            semester: item.semester || 'N/A',
            year: item.year || 2024,
            creditsEarned: item.credits || item.creditsEarned || 0,
          };
        });
      }
      return ensureArray(data, MOCK_COMPLETED_RECORDS);
    } catch (error) {
      return withMockFallback(error, MOCK_COMPLETED_RECORDS);
    }
  },

  getAllRecords: async (studentId = 1) => {
    try {
      const response = await apiClient.get(`/api/records?studentId=${studentId}`);
      return ensureArray(response.data, MOCK_COMPLETED_RECORDS);
    } catch (error) {
      return withMockFallback(error, MOCK_COMPLETED_RECORDS);
    }
  }
};
