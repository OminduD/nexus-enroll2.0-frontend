export type CourseLevel = 'UNDERGRADUATE' | 'GRADUATE';
export type CourseStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Department {
  id: number;
  code: string;
  name: string;
}

export interface Course {
  id: number;
  courseCode: string;
  courseNumber: number;
  title: string;
  description: string;
  credits: number;
  capacity: number;
  enrolledCount?: number;
  departmentId: number;
  departmentName?: string;
  level: CourseLevel;
  status: CourseStatus;
}

export interface CourseSection {
  id: number;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  sectionNumber: string;
  instructorName: string;
  semester: string;
  year: number;
  scheduleDays: string;
  scheduleTime: string;
  location: string;
  capacity: number;
  enrolledCount: number;
  waitlistCount: number;
}

export interface DegreeProgram {
  id: number;
  name: string;
  code: string;
  department: string;
  totalCreditsRequired: number;
  description: string;
}

export type ChangeRequestType = 'CAPACITY_CHANGE' | 'SCHEDULE_CHANGE' | 'COURSE_UPDATE';
export type ChangeRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ChangeRequest {
  id: number;
  courseId: number;
  courseCode: string;
  requestType: ChangeRequestType;
  requestedBy: string;
  proposedValue: string;
  details: string;
  status: ChangeRequestStatus;
  reviewedBy?: number;
  reviewComment?: string;
  createdAt: string;
}
