import { apiClient, ensureArray } from './api';
import { CompletedCourseRecord } from '../types/student';
import { MOCK_COMPLETED_RECORDS } from './mockData';

export const recordService = {
  getCompletedCourses: async (studentId = 1): Promise<CompletedCourseRecord[]> => {
    try {
      const response = await apiClient.get(`/api/records/completed-courses?studentId=${studentId}`);
      return ensureArray(response.data, MOCK_COMPLETED_RECORDS);
    } catch {
      return MOCK_COMPLETED_RECORDS;
    }
  },

  getAllRecords: async (studentId = 1) => {
    try {
      const response = await apiClient.get(`/api/records?studentId=${studentId}`);
      return ensureArray(response.data, MOCK_COMPLETED_RECORDS);
    } catch {
      return MOCK_COMPLETED_RECORDS;
    }
  }
};
