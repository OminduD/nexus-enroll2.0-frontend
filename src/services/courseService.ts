import { apiClient, ensureArray, withMockFallback } from './api';
import { Course, CourseSection, Department, DegreeProgram, ChangeRequest } from '../types/course';
import { MOCK_COURSES, MOCK_SECTIONS, MOCK_DEPARTMENTS, MOCK_PROGRAMS, MOCK_CHANGE_REQUESTS } from './mockData';

export const courseService = {
  getCourses: async (keyword?: string, departmentId?: number, page = 0, size = 10): Promise<Course[]> => {
    try {
      const params: Record<string, string | number> = { page, size };
      if (keyword) params.keyword = keyword;
      if (departmentId) params.departmentId = departmentId;

      const response = await apiClient.get('/api/courses', { params });
      return ensureArray(response.data, MOCK_COURSES);
    } catch (error) {
      return withMockFallback(error, (() => {
        let filtered = [...MOCK_COURSES];
        if (keyword) {
          const k = keyword.toLowerCase();
          filtered = filtered.filter(c =>
            c.title.toLowerCase().includes(k) ||
            c.courseCode.toLowerCase().includes(k) ||
            c.description.toLowerCase().includes(k)
          );
        }
        if (departmentId) {
          filtered = filtered.filter(c => c.departmentId === Number(departmentId));
        }
        return filtered;
      })());
    }
  },

  getCourseById: async (id: number): Promise<Course> => {
    try {
      const response = await apiClient.get(`/api/courses/${id}`);
      return response.data;
    } catch (error) {
      return withMockFallback(error, MOCK_COURSES.find(c => c.id === id) || MOCK_COURSES[0]);
    }
  },

  createCourse: async (courseData: Partial<Course>): Promise<Course> => {
    try {
      const response = await apiClient.post('/api/courses', courseData);
      return response.data;
    } catch (error) {
      return withMockFallback(error, (() => {
        const newCourse: Course = {
          id: Date.now(),
          courseCode: courseData.courseCode || 'CS-999',
          courseNumber: courseData.courseNumber || 999,
          title: courseData.title || 'New Course',
          description: courseData.description || 'Course description',
          credits: courseData.credits || 3,
          capacity: courseData.capacity || 30,
          enrolledCount: 0,
          departmentId: courseData.departmentId || 1,
          departmentName: MOCK_DEPARTMENTS.find(d => d.id === courseData.departmentId)?.name || 'Computer Science',
          level: courseData.level || 'UNDERGRADUATE',
          status: courseData.status || 'ACTIVE',
        };
        MOCK_COURSES.unshift(newCourse);
        return newCourse;
      })());
    }
  },

  updateCourse: async (id: number, courseData: Partial<Course>): Promise<Course> => {
    try {
      const response = await apiClient.put(`/api/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      return withMockFallback(error, (() => {
        const idx = MOCK_COURSES.findIndex(c => c.id === id);
        if (idx !== -1) {
          MOCK_COURSES[idx] = { ...MOCK_COURSES[idx], ...courseData };
          return MOCK_COURSES[idx];
        }
        return MOCK_COURSES[0];
      })());
    }
  },

  getSections: async (semester = 'FALL', year = 2025): Promise<CourseSection[]> => {
    try {
      const response = await apiClient.get(`/api/courses/sections?semester=${semester}&year=${year}`);
      return ensureArray(response.data, MOCK_SECTIONS);
    } catch (error) {
      return withMockFallback(error, MOCK_SECTIONS);
    }
  },

  getDepartments: async (): Promise<Department[]> => {
    try {
      const response = await apiClient.get('/api/courses/departments');
      return ensureArray(response.data, MOCK_DEPARTMENTS);
    } catch (error) {
      return withMockFallback(error, MOCK_DEPARTMENTS);
    }
  },

  getDegreePrograms: async (): Promise<DegreeProgram[]> => {
    try {
      const response = await apiClient.get('/api/courses/programs');
      return ensureArray(response.data, MOCK_PROGRAMS);
    } catch (error) {
      return withMockFallback(error, MOCK_PROGRAMS);
    }
  },

  getChangeRequests: async (): Promise<ChangeRequest[]> => {
    try {
      const response = await apiClient.get('/api/courses/change-requests');
      return ensureArray(response.data, MOCK_CHANGE_REQUESTS);
    } catch (error) {
      return withMockFallback(error, MOCK_CHANGE_REQUESTS);
    }
  },

  createChangeRequest: async (req: Partial<ChangeRequest>): Promise<ChangeRequest> => {
    try {
      const response = await apiClient.post('/api/courses/change-requests', req);
      return response.data;
    } catch (error) {
      return withMockFallback(error, (() => {
        const newReq: ChangeRequest = {
          id: Date.now(),
          courseId: req.courseId || 1,
          courseCode: req.courseCode || 'CS-101',
          requestType: req.requestType || 'CAPACITY_CHANGE',
          requestedBy: req.requestedBy || 'prof_smith',
          proposedValue: req.proposedValue || '50',
          details: req.details || 'Capacity increase justification',
          status: 'PENDING',
          createdAt: new Date().toISOString().split('T')[0],
        };
        MOCK_CHANGE_REQUESTS.unshift(newReq);
        return newReq;
      })());
    }
  },

  approveChangeRequest: async (id: number, comment: string) => {
    try {
      const response = await apiClient.put(`/api/courses/change-requests/${id}/approve`, {
        reviewedBy: 3,
        reviewComment: comment
      });
      return response.data;
    } catch (error) {
      return withMockFallback(error, (() => {
        const item = MOCK_CHANGE_REQUESTS.find(r => r.id === id);
        if (item) {
          item.status = 'APPROVED';
          item.reviewComment = comment;
        }
        return { success: true };
      })());
    }
  },

  rejectChangeRequest: async (id: number, comment: string) => {
    try {
      const response = await apiClient.put(`/api/courses/change-requests/${id}/reject`, {
        reviewedBy: 3,
        reviewComment: comment
      });
      return response.data;
    } catch (error) {
      return withMockFallback(error, (() => {
        const item = MOCK_CHANGE_REQUESTS.find(r => r.id === id);
        if (item) {
          item.status = 'REJECTED';
          item.reviewComment = comment;
        }
        return { success: true };
      })());
    }
  }
};
