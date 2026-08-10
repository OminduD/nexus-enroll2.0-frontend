import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Edit3, Search } from 'lucide-react';
import { courseService } from '../../services/courseService';
import { Course, CourseLevel, DegreeProgram } from '../../types/course';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { TableSkeleton } from '../../components/ui/Skeleton';

export const CourseAdminPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [programs, setPrograms] = useState<DegreeProgram[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [formData, setFormData] = useState({
    courseCode: 'CS-501',
    courseNumber: 501,
    title: 'Advanced Microservices & Cloud Systems',
    description: 'Cloud native software architecture, REST API design, Docker, Kubernetes, and event-driven patterns.',
    credits: 3,
    capacity: 30,
    departmentId: 1,
    level: 'GRADUATE' as CourseLevel,
  });

  const { showToast } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const cList = await courseService.getCourses();
      const pList = await courseService.getDegreePrograms();
      setCourses(cList);
      setPrograms(pList);
    } catch (e) {
      console.warn('Course admin fallback:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCourse(null);
    setFormData({
      courseCode: 'CS-501',
      courseNumber: 501,
      title: 'Advanced Microservices & Cloud Systems',
      description: 'Cloud native software architecture, REST API design, Docker, and Kubernetes.',
      credits: 3,
      capacity: 30,
      departmentId: 1,
      level: 'GRADUATE',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (c: Course) => {
    setEditingCourse(c);
    setFormData({
      courseCode: c.courseCode,
      courseNumber: c.courseNumber,
      title: c.title,
      description: c.description,
      credits: c.credits,
      capacity: c.capacity,
      departmentId: c.departmentId,
      level: c.level,
    });
    setIsModalOpen(true);
  };

  const handleSaveCourse = async () => {
    try {
      if (editingCourse) {
        await courseService.updateCourse(editingCourse.id, formData);
        showToast(`Course ${formData.courseCode} updated successfully!`, 'success');
      } else {
        await courseService.createCourse({
          ...formData,
          status: 'ACTIVE',
        });
        showToast(`New course ${formData.courseCode} created successfully!`, 'success');
      }
      setIsModalOpen(false);
      await loadData();
    } catch {
      showToast('Action failed. Try again.', 'error');
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      (c.courseCode?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (c.title?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <TableSkeleton rows={8} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
            Course & Section Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create new courses, edit section capacities, and configure university degree requirements
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Create New Course
        </button>
      </div>

      {/* Courses Data Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="font-bold text-lg text-[#333333] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-700" /> Active Course Directory
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-teal-600" />
            <input
              type="text"
              placeholder="Search code or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Course Code</th>
                <th className="p-3.5">Title</th>
                <th className="p-3.5">Credits</th>
                <th className="p-3.5">Capacity</th>
                <th className="p-3.5">Level</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-teal-700">{c.courseCode}</td>
                  <td className="p-3.5 font-bold text-[#333333]">{c.title}</td>
                  <td className="p-3.5 font-semibold">{c.credits} Hrs</td>
                  <td className="p-3.5 font-semibold">{c.enrolledCount || 0} / {c.capacity}</td>
                  <td className="p-3.5">
                    <Badge variant={c.level === 'GRADUATE' ? 'warning' : 'primary'}>{c.level}</Badge>
                  </td>
                  <td className="p-3.5">
                    <Badge variant="success">{c.status}</Badge>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleOpenEditModal(c)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-teal-700 hover:text-white text-slate-600 transition-colors"
                      title="Edit Course"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? `Edit Course: ${editingCourse.courseCode}` : 'Create New University Course'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Course Code</label>
              <input
                type="text"
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] font-mono focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Course Number</label>
              <input
                type="number"
                value={formData.courseNumber}
                onChange={(e) => setFormData({ ...formData, courseNumber: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Course Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Credits</label>
              <input
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as CourseLevel })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
              >
                <option value="UNDERGRADUATE">UNDERGRADUATE</option>
                <option value="GRADUATE">GRADUATE</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-[#333333]"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCourse}
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md"
            >
              {editingCourse ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

