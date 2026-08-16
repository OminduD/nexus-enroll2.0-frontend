import { apiClient, ensureArray, withMockFallback, USE_MOCK_FALLBACK, RawScheduleItem } from './api';
import { StudentProfile, StudentEnrollment, DegreeProgress } from '../types/student';
import { MOCK_STUDENT_PROFILE, MOCK_ALL_STUDENTS, MOCK_STUDENT_ENROLLMENTS, MOCK_DEGREE_PROGRESS, MOCK_SECTIONS } from './mockData';
import { getStoredUsers } from './localStore';

const USER_NAME_MAP: Record<number, { first: string; last: string; email: string; major: string }> = {
  4: { first: 'John', last: 'Doe', email: 'student@nexus.edu', major: 'Computer Science' },
  5: { first: 'James', last: 'Bond', email: 'jbond@nexus.edu', major: 'Mathematics' },
  6: { first: 'Maria', last: 'Garcia', email: 'mgarcia@nexus.edu', major: 'Physics' },
  7: { first: 'Kevin', last: 'Chen', email: 'kchen@nexus.edu', major: 'Computer Science' },
};

const mapStudentDtoToProfile = (s: any): StudentProfile => {
  const meta = USER_NAME_MAP[s.userId] || {
    first: s.firstName || 'Student',
    last: s.lastName || 'User',
    email: s.email || `student${s.userId || s.id}@nexus.edu`,
    major: s.program || 'Computer Science'
  };

  return {
    id: s.id,
    userId: s.userId || s.id,
    studentIdNumber: s.studentId || s.studentNumber || `STU-2025-${s.id}`,
    firstName: s.firstName || meta.first,
    lastName: s.lastName || meta.last,
    email: s.email || meta.email,
    phoneNumber: s.emergencyContactPhone || s.phoneNumber || '+1 (555) 019-2834',
    major: s.program || s.major || meta.major,
    enrollmentYear: s.admissionDate || s.enrollmentDate ? new Date(s.admissionDate || s.enrollmentDate).getFullYear() : 2024,
    academicStanding: s.status === 'ACTIVE' || s.enrollmentStatus === 'ENROLLED' ? 'GOOD_STANDING' : (s.academicStanding || 'GOOD_STANDING'),
    gpa: typeof s.gpa === 'number' ? s.gpa : (parseFloat(s.gpa) || 3.50),
  };
};

export const studentService = {
  getProfile: async (userId = 4): Promise<StudentProfile> => {
    try {
      const response = await apiClient.get(`/api/students?userId=${userId}`);
      const raw = response.data?.data || response.data;
      if (raw && (raw.id || raw.userId)) {
        return mapStudentDtoToProfile(raw);
      }
      return USE_MOCK_FALLBACK ? MOCK_STUDENT_PROFILE : mapStudentDtoToProfile({ id: 1, userId });
    } catch (error) {
      return withMockFallback(error, MOCK_STUDENT_PROFILE);
    }
  },

  updateProfile: async (studentId: number, profileData: Partial<StudentProfile>): Promise<StudentProfile> => {
    try {
      const response = await apiClient.put(`/api/students/${studentId}`, profileData);
      const resData = response.data?.data || response.data;
      return mapStudentDtoToProfile(resData);
    } catch (error) {
      return withMockFallback(error, {
        ...MOCK_STUDENT_PROFILE,
        ...profileData,
        id: studentId,
      });
    }
  },

  getAllStudents: async (page = 0, size = 50): Promise<StudentProfile[]> => {
    try {
      const response = await apiClient.get(`/api/students?page=${page}&size=${size}`);
      const rawList = ensureArray<any>(response.data, []);
      if (rawList.length > 0) {
        return rawList.map(mapStudentDtoToProfile);
      }
      return USE_MOCK_FALLBACK ? MOCK_ALL_STUDENTS : [];
    } catch (error) {
      const local = getStoredUsers();
      return withMockFallback(error, local.length > 0 ? local : MOCK_ALL_STUDENTS);
    }
  },

  getSchedule: async (studentId = 1): Promise<StudentEnrollment[]> => {
    try {
      const response = await apiClient.get(`/api/students/${studentId}/schedule`);
      const data = response.data?.data || response.data;
      if (data && Array.isArray(data.items)) {
        return data.items.map((item: RawScheduleItem, index: number) => {
          const startStr = item.startTime ? item.startTime.toString().slice(0, 5) : '09:00';
          const endStr = item.endTime ? item.endTime.toString().slice(0, 5) : '10:00';
          const scheduleTime = item.scheduleTime || (item.startTime && item.endTime ? `${startStr} - ${endStr}` : 'MWF 09:00 - 10:00');

          return {
            id: item.sectionId || (index + 1),
            studentId,
            sectionId: item.sectionId || (index + 1),
            courseCode: item.courseCode || 'CS-101',
            courseTitle: item.courseTitle || 'Course Title',
            credits: 3,
            instructorName: 'Sarah Connor',
            scheduleDays: item.scheduleDays || 'MWF',
            scheduleTime,
            location: item.location || 'Science Hall 101',
            status: (item.status as any) || 'ENROLLED',
            enrolledAt: '2025-08-15',
          };
        });
      }
      return USE_MOCK_FALLBACK ? MOCK_STUDENT_ENROLLMENTS : [];
    } catch (error) {
      return withMockFallback(error, MOCK_STUDENT_ENROLLMENTS);
    }
  },

  enroll: async (studentId: number, sectionId: number): Promise<StudentEnrollment> => {
    try {
      const response = await apiClient.post('/api/enrollments', { studentId, sectionId });
      const enrollment = response.data?.data || response.data;
      return {
        id: enrollment.id || Date.now(),
        studentId,
        sectionId,
        courseCode: enrollment.courseCode || 'CS-101',
        courseTitle: enrollment.courseTitle || 'Enrolled Course',
        credits: enrollment.creditsEarned || 3,
        instructorName: 'Faculty Instructor',
        scheduleDays: 'MWF',
        scheduleTime: '09:00 - 10:00',
        location: 'Main Campus',
        status: enrollment.status || 'ENROLLED',
        enrolledAt: enrollment.enrollmentDate || new Date().toISOString().split('T')[0],
      };
    } catch (error) {
      return withMockFallback(error, (() => {
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
      })());
    }
  },

  addToWaitlist: async (studentId: number, sectionId: number): Promise<StudentEnrollment> => {
    try {
      const response = await apiClient.post('/api/enrollments/waitlist', { studentId, sectionId });
      const entry = response.data?.data || response.data;
      return {
        id: entry.id || Date.now(),
        studentId,
        sectionId,
        courseCode: 'CS-101',
        courseTitle: 'Waitlisted Course',
        credits: 3,
        instructorName: 'Faculty Instructor',
        scheduleDays: 'MWF',
        scheduleTime: '09:00 - 10:00',
        location: 'Main Campus',
        status: 'WAITLISTED',
        enrolledAt: new Date().toISOString().split('T')[0],
      };
    } catch (error) {
      return withMockFallback(error, (() => {
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
      })());
    }
  },

  dropCourse: async (enrollmentId: number) => {
    try {
      const response = await apiClient.delete(`/api/enrollments/${enrollmentId}`);
      return response.data;
    } catch (error) {
      return withMockFallback(error, (() => {
        const idx = MOCK_STUDENT_ENROLLMENTS.findIndex(e => e.id === enrollmentId);
        if (idx !== -1) {
          MOCK_STUDENT_ENROLLMENTS.splice(idx, 1);
        }
        return { success: true };
      })());
    }
  },

  getDegreeProgress: async (studentId = 1, programId = 1): Promise<DegreeProgress> => {
    try {
      // First try academic-record-service for detailed records
      const response = await apiClient.get(`/api/records/degree-progress?studentId=${studentId}`)
        .catch(() => apiClient.get(`/api/students/${studentId}/progress?programId=${programId}`));
      
      const data = response.data?.data || response.data;
      if (data && (data.studentId || data.totalCreditsCompleted !== undefined || data.completedCredits !== undefined)) {
        const totalReq = data.totalCreditsRequired ?? data.requiredCredits ?? 120;
        const completed = data.totalCreditsCompleted ?? data.completedCredits ?? 34;
        const gpa = data.cumulativeGpa ?? data.gpa ?? 3.65;
        const genEd = data.generalEdCompleted ?? 12;
        const major = data.majorCreditsCompleted ?? 18;
        const elective = data.electiveCreditsCompleted ?? 4;

        return {
          studentId: data.studentId || studentId,
          programId: data.programId || programId,
          programName: 'Bachelor of Science in Computer Science',
          totalRequiredCredits: totalReq,
          creditsCompleted: completed,
          coreCreditsCompleted: major,
          coreCreditsRequired: 60,
          electiveCreditsCompleted: elective,
          electiveCreditsRequired: 20,
          gpa: typeof gpa === 'number' ? gpa : parseFloat(gpa),
          academicStanding: 'GOOD_STANDING',
          fulfilledCourses: Array.isArray(data.completedCourses) && data.completedCourses.length > 0
            ? data.completedCourses.map((c: any) => typeof c === 'string' ? c : c.courseCode || 'CS-101')
            : ['CS-101', 'CS-201', 'MATH-101', 'ENG-101', 'HIST-101'],
          remainingCourses: Array.isArray(data.remainingRequirements) && data.remainingRequirements.length > 0
            ? data.remainingRequirements.map((c: any) => typeof c === 'string' ? c : c.courseCode || 'CS-401')
            : ['CS-401 (Machine Learning)', 'MATH-201 (Linear Algebra)', 'PHYS-101 (Physics I)'],
        };
      }
      return USE_MOCK_FALLBACK ? MOCK_DEGREE_PROGRESS : MOCK_DEGREE_PROGRESS;
    } catch (error) {
      return withMockFallback(error, MOCK_DEGREE_PROGRESS);
    }
  },
};
