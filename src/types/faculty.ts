export interface FacultyProfile {
  id: number;
  userId: number;
  facultyIdNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  officeLocation: string;
  title: string;
}

export interface ClassRosterStudent {
  enrollmentId: number;
  studentId: number;
  studentName: string;
  studentIdNumber: string;
  email: string;
  major: string;
  status: string;
  photoUrl?: string;
}

export type GradeStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface GradeRecord {
  id: number;
  enrollmentId: number;
  studentId: number;
  studentName?: string;
  sectionId: number;
  courseCode?: string;
  assignmentTitle: string;
  pointsEarned: number;
  maxPoints: number;
  letterGrade: string;
  effectiveGrade?: string;
  comments?: string;
  status: GradeStatus;
  gradedBy: string;
  createdAt: string;
}
