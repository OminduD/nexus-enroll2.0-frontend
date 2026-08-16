import { apiClient, ensureArray, withMockFallback, USE_MOCK_FALLBACK } from './api';
import { FacultyProfile, ClassRosterStudent, GradeRecord } from '../types/faculty';
import { MOCK_FACULTY_PROFILE, MOCK_ROSTER_STUDENTS, MOCK_GRADES } from './mockData';
import { getStoredGrades, addStoredGrade, updateStoredGradeStatus } from './localStore';

export const facultyService = {
  getProfile: async (userId = 2): Promise<FacultyProfile> => {
    try {
      const response = await apiClient.get(`/api/faculty/user/${userId}`);
      const raw = response.data?.data || response.data;
      if (raw && (raw.id || raw.userId)) {
        return {
          id: raw.id,
          userId: raw.userId || userId,
          facultyIdNumber: raw.facultyId || `FAC-00${raw.id || 1}`,
          firstName: raw.firstName || (userId === 2 ? 'Sarah' : userId === 3 ? 'Albert' : 'Faculty'),
          lastName: raw.lastName || (userId === 2 ? 'Connor' : userId === 3 ? 'Einstein' : 'Professor'),
          email: raw.email || (userId === 2 ? 'faculty@nexus.edu' : userId === 3 ? 'einstein@nexus.edu' : 'faculty@nexus.edu'),
          department: raw.departmentName || (raw.departmentId === 2 ? 'Mathematics & Statistics' : 'Computer Science & Engineering'),
          title: raw.title || 'Associate Professor',
          officeLocation: raw.officeLocation || 'Tech Hall 101',
        };
      }
      return USE_MOCK_FALLBACK ? MOCK_FACULTY_PROFILE : MOCK_FACULTY_PROFILE;
    } catch (error) {
      return withMockFallback(error, MOCK_FACULTY_PROFILE);
    }
  },

  getRoster: async (sectionId = 1): Promise<ClassRosterStudent[]> => {
    try {
      const response = await apiClient.get(`/api/faculty/roster?sectionId=${sectionId}`);
      const rawRoster = response.data?.data || response.data;
      const rawStudents = rawRoster?.students || (Array.isArray(rawRoster) ? rawRoster : []);

      if (rawStudents.length > 0) {
        return rawStudents.map((s: any, index: number) => ({
          enrollmentId: s.enrollmentId || (index + 1),
          studentId: s.studentId || (index + 1),
          studentName: s.firstName && s.lastName ? `${s.firstName} ${s.lastName}` : (s.studentName || 'Student Name'),
          studentIdNumber: s.studentNumber || `STU-2024-00${s.studentId || (index + 1)}`,
          email: s.email || `student${s.studentId || (index + 1)}@nexus.edu`,
          major: 'Computer Science',
          status: (s.enrollmentStatus as any) || 'ENROLLED',
        }));
      }
      return USE_MOCK_FALLBACK ? MOCK_ROSTER_STUDENTS : [];
    } catch (error) {
      return withMockFallback(error, MOCK_ROSTER_STUDENTS);
    }
  },

  getGrades: async (sectionId = 1): Promise<GradeRecord[]> => {
    try {
      let allGrades: GradeRecord[] = [];
      try {
        const rosterRes = await apiClient.get(`/api/faculty/roster?sectionId=${sectionId}`);
        const roster = rosterRes.data?.data || rosterRes.data;
        const students = roster?.students || (Array.isArray(roster) ? roster : []);
        const courseCode = roster?.courseCode || 'CS-101';

        for (const student of students) {
          if (student.enrollmentId) {
            try {
              const gradesRes = await apiClient.get(`/api/faculty/grades?enrollmentId=${student.enrollmentId}`);
              const studentGrades = ensureArray<any>(gradesRes.data, []);
              studentGrades.forEach(g => {
                allGrades.push({
                  id: g.id,
                  enrollmentId: g.enrollmentId || student.enrollmentId,
                  studentId: g.studentId || student.studentId,
                  studentName: student.firstName ? `${student.firstName} ${student.lastName}` : (student.studentName || 'Student'),
                  sectionId: g.sectionId || sectionId,
                  courseCode: courseCode,
                  assignmentTitle: g.assignmentTitle || 'Final Grade',
                  pointsEarned: g.pointsEarned ?? 90,
                  maxPoints: g.maxPoints ?? 100,
                  letterGrade: g.letterGrade || 'A',
                  effectiveGrade: g.letterGrade || 'A',
                  comments: g.comments || '',
                  status: (g.status as any) || 'DRAFT',
                  gradedBy: g.gradedBy || 'FACULTY',
                  createdAt: new Date().toISOString().split('T')[0],
                });
              });
            } catch {
              // Ignore individual student grade lookup errors
            }
          }
        }
      } catch {
        // Ignore roster errors
      }

      const local = getStoredGrades();
      const combined = [...allGrades, ...local];
      const result = Array.from(new Map(combined.map(n => [n.id || Date.now(), n])).values())
                        .sort((a, b) => (b.id || 0) - (a.id || 0));

      if (result.length > 0) return result;
      return USE_MOCK_FALLBACK ? MOCK_GRADES : [];
    } catch (error) {
      const local = getStoredGrades();
      return withMockFallback(error, local.length > 0 ? local : MOCK_GRADES);
    }
  },

  saveDraftGrade: async (gradeData: Partial<GradeRecord>): Promise<GradeRecord> => {
    try {
      const payload = {
        id: gradeData.id,
        enrollmentId: gradeData.enrollmentId || 1,
        studentId: gradeData.studentId || 1,
        sectionId: gradeData.sectionId || 1,
        assignmentTitle: gradeData.assignmentTitle || 'Final Grade',
        pointsEarned: gradeData.pointsEarned ?? 85.0,
        maxPoints: gradeData.maxPoints ?? 100.0,
        letterGrade: gradeData.letterGrade || 'B',
        comments: gradeData.comments || '',
        gradedBy: gradeData.gradedBy || 'FACULTY'
      };
      const response = await apiClient.post('/api/faculty/grades/draft', payload);
      const newGrade = response.data?.data || response.data;
      const localGrade: GradeRecord = {
        id: newGrade.id || Date.now(),
        enrollmentId: payload.enrollmentId,
        studentId: payload.studentId,
        sectionId: payload.sectionId,
        assignmentTitle: payload.assignmentTitle,
        pointsEarned: payload.pointsEarned,
        maxPoints: payload.maxPoints,
        letterGrade: payload.letterGrade,
        status: 'DRAFT',
        gradedBy: payload.gradedBy,
        comments: payload.comments,
        createdAt: new Date().toISOString().split('T')[0],
      };
      addStoredGrade(localGrade);
      return localGrade;
    } catch (error) {
      const fallbackGrade: GradeRecord = {
        id: Date.now(),
        enrollmentId: gradeData.enrollmentId || 1,
        studentId: gradeData.studentId || 1,
        sectionId: gradeData.sectionId || 1,
        assignmentTitle: gradeData.assignmentTitle || 'Final Grade',
        pointsEarned: gradeData.pointsEarned ?? 85.0,
        maxPoints: gradeData.maxPoints ?? 100.0,
        letterGrade: gradeData.letterGrade || 'B',
        status: 'DRAFT',
        gradedBy: gradeData.gradedBy || 'FACULTY',
        comments: gradeData.comments || '',
        createdAt: new Date().toISOString().split('T')[0],
      };
      return withMockFallback(error, addStoredGrade(fallbackGrade));
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
