import { apiClient, ensureArray, withMockFallback, USE_MOCK_FALLBACK } from './api';
import { Course, CourseSection, Department, DegreeProgram, ChangeRequest } from '../types/course';
import { MOCK_COURSES, MOCK_SECTIONS, MOCK_DEPARTMENTS, MOCK_PROGRAMS, MOCK_CHANGE_REQUESTS } from './mockData';
import { getStoredChangeRequests, addStoredChangeRequest, updateStoredChangeRequestStatus } from './localStore';

export const courseService = {
  getCourses: async (keyword?: string, departmentId?: number, page = 0, size = 50): Promise<Course[]> => {
    try {
      const params: Record<string, string | number> = { page, size };
      if (keyword) params.keyword = keyword;
      if (departmentId) params.departmentId = departmentId;

      const response = await apiClient.get('/api/courses', { params });
      const rawList = ensureArray<any>(response.data, []);
      if (rawList.length > 0) {
        return rawList.map((c: any) => ({
          id: c.id,
          courseCode: c.courseCode,
          courseNumber: c.courseNumber || parseInt(c.courseCode?.replace(/\D/g, '') || '101', 10),
          title: c.title,
          description: c.description || '',
          credits: c.credits || 3,
          capacity: c.capacity || 30,
          enrolledCount: c.enrolledCount || 0,
          departmentId: c.departmentId || (c.department?.id) || 1,
          departmentName: c.departmentName || (c.department?.name) || 'Academic Department',
          level: c.level || 'UNDERGRADUATE',
          status: c.status || 'ACTIVE',
        }));
      }
      return USE_MOCK_FALLBACK ? MOCK_COURSES : [];
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
      const c = response.data?.data || response.data;
      return {
        id: c.id,
        courseCode: c.courseCode,
        courseNumber: c.courseNumber || 101,
        title: c.title,
        description: c.description || '',
        credits: c.credits || 3,
        capacity: c.capacity || 30,
        enrolledCount: c.enrolledCount || 0,
        departmentId: c.departmentId || 1,
        departmentName: c.departmentName || 'Academic Department',
        level: c.level || 'UNDERGRADUATE',
        status: c.status || 'ACTIVE',
      };
    } catch (error) {
      return withMockFallback(error, MOCK_COURSES.find(c => c.id === id) || MOCK_COURSES[0]);
    }
  },

  createCourse: async (courseData: Partial<Course>): Promise<Course> => {
    try {
      const response = await apiClient.post('/api/courses', courseData);
      return response.data?.data || response.data;
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
      return response.data?.data || response.data;
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
      const [sectionsRes, coursesRes] = await Promise.all([
        apiClient.get(`/api/courses/sections?semester=${semester}&year=${year}`),
        apiClient.get('/api/courses').catch(() => ({ data: { data: [] } })),
      ]);

      const rawSections = ensureArray<any>(sectionsRes.data, []);
      const coursesList = ensureArray<any>(coursesRes.data, []);
      const coursesMap = new Map<number, any>(coursesList.map((c: any) => [c.id, c]));

      if (rawSections.length > 0) {
        return rawSections.map((s: any) => {
          const matchedCourse = coursesMap.get(s.courseId);
          const courseCode = s.courseCode || matchedCourse?.courseCode || `CS-${s.courseId}`;
          const courseTitle = s.courseTitle || matchedCourse?.title || 'Academic Course';
          const instructorName = s.instructorName || 
            (s.instructorId === 2 ? 'Sarah Connor' : s.instructorId === 3 ? 'Albert Einstein' : 'Faculty Staff');

          const startTimeStr = s.startTime ? s.startTime.toString().slice(0, 5) : '09:00';
          const endTimeStr = s.endTime ? s.endTime.toString().slice(0, 5) : '10:00';
          const scheduleTime = s.scheduleTime || (s.startTime && s.endTime ? `${startTimeStr} - ${endTimeStr}` : 'MWF 09:00 - 10:00');

          return {
            id: s.id,
            courseId: s.courseId,
            courseCode,
            courseTitle,
            sectionNumber: s.sectionNumber || '01',
            instructorName,
            semester: s.semester || semester,
            year: s.year || year,
            scheduleDays: s.scheduleDays || 'MWF',
            scheduleTime,
            location: s.location || 'Science Hall 101',
            capacity: s.capacity || 30,
            enrolledCount: s.enrolledCount || 0,
            waitlistCount: s.waitlistCount || 0,
          };
        });
      }
      return USE_MOCK_FALLBACK ? MOCK_SECTIONS : [];
    } catch (error) {
      return withMockFallback(error, MOCK_SECTIONS);
    }
  },

  getDepartments: async (): Promise<Department[]> => {
    try {
      const response = await apiClient.get('/api/courses/departments');
      const data = ensureArray<Department>(response.data, []);
      return data.length > 0 ? data : (USE_MOCK_FALLBACK ? MOCK_DEPARTMENTS : []);
    } catch (error) {
      return withMockFallback(error, MOCK_DEPARTMENTS);
    }
  },

  getDegreePrograms: async (): Promise<DegreeProgram[]> => {
    try {
      const response = await apiClient.get('/api/courses/programs');
      const data = ensureArray<DegreeProgram>(response.data, []);
      return data.length > 0 ? data : (USE_MOCK_FALLBACK ? MOCK_PROGRAMS : []);
    } catch (error) {
      return withMockFallback(error, MOCK_PROGRAMS);
    }
  },

  getChangeRequests: async (): Promise<ChangeRequest[]> => {
    try {
      const response = await apiClient.get('/api/courses/change-requests');
      const data = ensureArray<ChangeRequest>(response.data, []);
      const local = getStoredChangeRequests();
      const combined = [...data, ...local];
      return Array.from(new Map(combined.map(n => [n.id || Date.now(), n])).values())
                  .sort((a, b) => (b.id || 0) - (a.id || 0));
    } catch (error) {
      const local = getStoredChangeRequests();
      return withMockFallback(error, local.length > 0 ? local : MOCK_CHANGE_REQUESTS);
    }
  },

  createChangeRequest: async (req: Partial<ChangeRequest>): Promise<ChangeRequest> => {
    try {
      const payload = {
        courseId: req.courseId || 1,
        courseCode: req.courseCode || 'CS-101',
        requestType: req.requestType || 'CAPACITY_CHANGE',
        proposedValue: req.proposedValue || '50',
        justification: req.details || 'Capacity expansion request',
        requestedBy: typeof req.requestedBy === 'string' ? 2 : (req.requestedBy || 2),
      };
      const response = await apiClient.post('/api/courses/change-requests', payload);
      const newReq = response.data?.data || response.data;
      addStoredChangeRequest(newReq || req);
      return newReq;
    } catch (error) {
      return withMockFallback(error, addStoredChangeRequest(req));
    }
  },

  approveChangeRequest: async (id: number, comment: string) => {
    try {
      const response = await apiClient.put(`/api/courses/change-requests/${id}/approve`, {
        adminUserId: 1,
        comment: comment || 'Approved by system administrator'
      });
      updateStoredChangeRequestStatus(id, 'APPROVED', comment);
      return response.data;
    } catch (error) {
      updateStoredChangeRequestStatus(id, 'APPROVED', comment);
      return withMockFallback(error, { success: true });
    }
  },

  rejectChangeRequest: async (id: number, comment: string) => {
    try {
      const response = await apiClient.put(`/api/courses/change-requests/${id}/reject`, {
        adminUserId: 1,
        comment: comment || 'Rejected'
      });
      updateStoredChangeRequestStatus(id, 'REJECTED', comment);
      return response.data;
    } catch (error) {
      updateStoredChangeRequestStatus(id, 'REJECTED', comment);
      return withMockFallback(error, { success: true });
    }
  }
};
