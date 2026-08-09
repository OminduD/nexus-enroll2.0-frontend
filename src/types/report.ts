export interface EnrollmentTrendItem {
  month: string;
  enrolled: number;
  waitlisted: number;
  dropped: number;
}

export interface DepartmentDistributionItem {
  department: string;
  courses: number;
  students: number;
}

export interface CoursePopularityItem {
  courseCode: string;
  title: string;
  enrolled: number;
  capacity: number;
  waitlist: number;
}

export interface FacultyWorkloadItem {
  facultyName: string;
  department: string;
  sectionsCount: number;
  totalStudents: number;
  teachingHours: number;
}
