import { apiClient } from './api';
import { EnrollmentTrendItem, DepartmentDistributionItem, CoursePopularityItem, FacultyWorkloadItem } from '../types/report';
import { MOCK_ENROLLMENT_TRENDS, MOCK_DEPARTMENT_DISTRIBUTION, MOCK_COURSE_POPULARITY, MOCK_FACULTY_WORKLOAD } from './mockData';

export const reportService = {
  getEnrollmentStats: async (semester = 'FALL', year = 2025): Promise<EnrollmentTrendItem[]> => {
    try {
      const response = await apiClient.get(`/api/reports/enrollment-stats?semester=${semester}&year=${year}`);
      return response.data || MOCK_ENROLLMENT_TRENDS;
    } catch {
      return MOCK_ENROLLMENT_TRENDS;
    }
  },

  getDepartmentDistribution: async (): Promise<DepartmentDistributionItem[]> => {
    return MOCK_DEPARTMENT_DISTRIBUTION;
  },

  getCoursePopularity: async (semester = 'FALL', year = 2025): Promise<CoursePopularityItem[]> => {
    try {
      const response = await apiClient.get(`/api/reports/course-popularity?semester=${semester}&year=${year}`);
      return response.data || MOCK_COURSE_POPULARITY;
    } catch {
      return MOCK_COURSE_POPULARITY;
    }
  },

  getFacultyWorkload: async (semester = 'FALL', year = 2025): Promise<FacultyWorkloadItem[]> => {
    try {
      const response = await apiClient.get(`/api/reports/faculty-workload?semester=${semester}&year=${year}`);
      return response.data || MOCK_FACULTY_WORKLOAD;
    } catch {
      return MOCK_FACULTY_WORKLOAD;
    }
  }
};
