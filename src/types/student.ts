export interface StudentProfile {
  id: number;
  userId: number;
  studentIdNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  major: string;
  enrollmentYear: number;
  academicStanding: string;
  gpa: number;
}

export type EnrollmentStatus = 'ENROLLED' | 'WAITLISTED' | 'DROPPED' | 'COMPLETED';

export interface StudentEnrollment {
  id: number;
  studentId: number;
  sectionId: number;
  courseCode: string;
  courseTitle: string;
  credits: number;
  instructorName: string;
  scheduleDays: string;
  scheduleTime: string;
  location: string;
  status: EnrollmentStatus;
  enrolledAt: string;
}

export interface DegreeProgress {
  studentId: number;
  programId: number;
  programName: string;
  totalRequiredCredits: number;
  creditsCompleted: number;
  coreCreditsCompleted: number;
  coreCreditsRequired: number;
  electiveCreditsCompleted: number;
  electiveCreditsRequired: number;
  gpa: number;
  academicStanding: string;
  fulfilledCourses: string[];
  remainingCourses: string[];
}

export interface CompletedCourseRecord {
  id: number;
  studentId: number;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  letterGrade: string;
  gradePoints: number;
  semester: string;
  year: number;
  creditsEarned: number;
}
