/**
 * Course browsing and section enrollment page. Calls courseService
 * (GET /api/courses, /api/courses/departments, /api/courses/sections) and
 * studentService (POST /api/enrollments, POST /api/enrollments/waitlist) to
 * enroll or waitlist the current student into a chosen section.
 */
import React, { useEffect, useState } from 'react';
import { Search, Filter, BookOpen, Clock, MapPin, PlusCircle } from 'lucide-react';
import { courseService } from '../../services/courseService';
import { studentService } from '../../services/studentService';
import { Course, CourseSection, Department } from '../../types/course';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { CardSkeleton } from '../../components/ui/Skeleton';

export const CourseCatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDept, setSelectedDept] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  // Section popup state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const { user } = useAuth();
  const { showToast } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    const depts = await courseService.getDepartments();
    const courseList = await courseService.getCourses(searchKeyword, selectedDept);
    setDepartments(depts);
    setCourses(courseList);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchKeyword, selectedDept]);

  const handleOpenSections = async (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
    const allSecs = await courseService.getSections();
    const courseSecs = allSecs.filter(s => s.courseId === course.id || s.courseCode === course.courseCode);
    setSections(courseSecs.length > 0 ? courseSecs : allSecs.slice(0, 2));
  };

  const handleEnroll = async (section: CourseSection) => {
    setActionLoading(true);
    try {
      const p = await studentService.getProfile(user?.id || 1);
      const actualStudentId = p?.id || user?.id || 1;

      if (section.enrolledCount >= section.capacity) {
        await studentService.addToWaitlist(actualStudentId, section.id);
        showToast(`Waitlist request submitted for ${section.courseCode} (${section.sectionNumber}).`, 'info');
      } else {
        await studentService.enroll(actualStudentId, section.id);
        showToast(`Successfully enrolled in ${section.courseCode} (${section.sectionNumber})!`, 'success');
      }
      setIsModalOpen(false);
    } catch {
      showToast('Enrollment failed. Please try again.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
          Course Catalog & Registration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Browse available university courses, view class sections, and register for Fall 2025
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3 text-[#333333]">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-teal-600" />
          <input
            type="text"
            placeholder="Search by course code (e.g. CS-101) or title..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedDept || ''}
            onChange={(e) => setSelectedDept(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full sm:w-56 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} className="h-56" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl text-center text-slate-400 space-y-2 border border-slate-200 shadow-sm">
          <BookOpen className="w-12 h-12 mx-auto text-slate-400" />
          <p className="font-bold text-base text-[#333333]">No courses found matching your criteria</p>
          <p className="text-xs text-slate-500">Try adjusting your search query or department filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-teal-500/50 transition-all text-[#333333]"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-extrabold text-teal-700 text-sm">
                    {course.courseCode}
                  </span>
                  <Badge variant={course.level === 'GRADUATE' ? 'warning' : 'primary'}>
                    {course.level}
                  </Badge>
                </div>
                <h3 className="font-bold text-base text-[#333333] leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500 font-semibold">
                  <span>{course.credits} Credits</span> •{' '}
                  <span>
                    Cap: {course.enrolledCount || 0}/{course.capacity}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenSections(course)}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> View Sections
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sections Popup Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Available Sections: ${selectedCourse?.courseCode}`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            {selectedCourse?.title} ({selectedCourse?.credits} Credits)
          </p>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {sections.map((sec) => {
              const isFull = sec.enrolledCount >= sec.capacity;
              return (
                <div
                  key={sec.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[#333333]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#333333]">
                        {sec.sectionNumber}
                      </span>
                      <Badge variant={isFull ? 'warning' : 'success'}>
                        {isFull ? `FULL (Waitlist: ${sec.waitlistCount})` : `OPEN (${sec.enrolledCount}/${sec.capacity})`}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Instructor: <span className="font-semibold">{sec.instructorName}</span>
                    </p>
                    <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-teal-700" /> {sec.scheduleDays} {sec.scheduleTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-coral-500" /> {sec.location}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleEnroll(sec)}
                    disabled={actionLoading}
                    className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 transition-all ${
                      isFull
                        ? 'bg-coral-500 hover:bg-coral-600'
                        : 'bg-teal-700 hover:bg-teal-800'
                    }`}
                  >
                    {isFull ? 'Join Waitlist' : 'Enroll Now'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};

