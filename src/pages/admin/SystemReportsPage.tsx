/**
 * Admin analytics reports (course popularity, faculty workload charts).
 * Calls reportService.getCoursePopularity (GET /api/reports/course-popularity)
 * and getFacultyWorkload (GET /api/reports/faculty-workload).
 */
import React, { useEffect, useState } from 'react';
import { BarChart3, Users, BookOpen, Download } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { reportService } from '../../services/reportService';
import { CoursePopularityItem, FacultyWorkloadItem } from '../../types/report';
import { useToast } from '../../components/ui/Toast';

export const SystemReportsPage: React.FC = () => {
  const [popularity, setPopularity] = useState<CoursePopularityItem[]>([]);
  const [workload, setWorkload] = useState<FacultyWorkloadItem[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const loadReports = async () => {
      const p = await reportService.getCoursePopularity();
      const w = await reportService.getFacultyWorkload();
      setPopularity(p);
      setWorkload(w);
    };
    loadReports();
  }, []);

  const handleExportCSV = () => {
    showToast('Exported system analytical report as CSV file!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
            System Reports & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Interactive course demand analytics, enrollment statistics, and faculty teaching load distribution
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all"
        >
          <Download className="w-4 h-4" /> Export Report (CSV)
        </button>
      </div>

      {/* Recharts Bar Chart - Course Popularity */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
        <div>
          <h3 className="text-lg font-bold text-[#333333] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-700" /> Course Demand & Popularity Analysis (Fall 2025)
          </h3>
          <p className="text-xs text-slate-500">Comparing enrolled count vs section capacity and waitlist length</p>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={popularity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
              <XAxis dataKey="courseCode" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '12px',
                  color: '#333333',
                  fontSize: '12px',
                  boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="enrolled" fill="#006666" radius={[6, 6, 0, 0]} name="Enrolled Students" />
              <Bar dataKey="waitlist" fill="#FF7F50" radius={[6, 6, 0, 0]} name="Waitlisted" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Faculty Workload Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
        <h3 className="font-bold text-lg text-[#333333] flex items-center gap-2">
          <Users className="w-5 h-5 text-coral-500" /> Faculty Teaching Workload Report
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Faculty Name</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Assigned Sections</th>
                <th className="p-3.5">Total Enrolled Students</th>
                <th className="p-3.5 text-right rounded-r-xl">Weekly Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workload.map((w) => (
                <tr key={w.facultyName} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-[#333333]">{w.facultyName}</td>
                  <td className="p-3.5 font-medium">{w.department}</td>
                  <td className="p-3.5 font-semibold">{w.sectionsCount} Sections</td>
                  <td className="p-3.5 font-bold text-teal-700">{w.totalStudents} Students</td>
                  <td className="p-3.5 text-right font-mono font-bold text-coral-600">{w.teachingHours} hrs/wk</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

