import React, { useEffect, useState } from 'react';
import { FileSpreadsheet, Award, Download } from 'lucide-react';
import { recordService } from '../../services/recordService';
import { CompletedCourseRecord } from '../../types/student';
import { Badge } from '../../components/ui/Badge';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

export const AcademicRecordsPage: React.FC = () => {
  const [records, setRecords] = useState<CompletedCourseRecord[]>([]);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const loadRecords = async () => {
      const p = await studentService.getProfile(user?.id || 1);
      const actualStudentId = p?.id || user?.id || 1;
      const data = await recordService.getCompletedCourses(actualStudentId);
      setRecords(data);
    };
    loadRecords();
  }, [user]);

  const handleDownloadTranscript = () => {
    showToast('Official Transcript PDF requested! Download started.', 'success');
  };

  const getGradeVariant = (grade?: string) => {
    if (!grade) return 'danger';
    if (grade.startsWith('A')) return 'success';
    if (grade.startsWith('B')) return 'primary';
    if (grade.startsWith('C')) return 'warning';
    return 'danger';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
            Academic Records & Transcript
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View completed coursework, semester letter grades, and request official academic transcripts
          </p>
        </div>

        <button
          onClick={handleDownloadTranscript}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all"
        >
          <Download className="w-4 h-4" /> Download Official PDF
        </button>
      </div>

      {/* GPA Summary Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-6 text-[#333333]">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cumulative GPA</p>
            <h3 className="text-3xl font-extrabold text-teal-700">3.82 / 4.00</h3>
          </div>
        </div>

        <div className="flex items-center gap-8 text-xs font-semibold text-slate-600">
          <div>
            <p className="text-slate-500">Completed Credits</p>
            <p className="text-base font-bold text-[#333333]">48 Hours</p>
          </div>
          <div>
            <p className="text-slate-500">Honors Status</p>
            <p className="text-base font-bold text-coral-600">Dean's List</p>
          </div>
        </div>
      </div>

      {/* Completed Courses Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
        <h3 className="font-bold text-lg text-[#333333] flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-teal-700" /> Completed Course History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Course Code</th>
                <th className="p-3.5">Course Title</th>
                <th className="p-3.5">Term / Semester</th>
                <th className="p-3.5">Credits Earned</th>
                <th className="p-3.5">Letter Grade</th>
                <th className="p-3.5 text-right rounded-r-xl">Grade Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-teal-700">
                    {r.courseCode}
                  </td>
                  <td className="p-3.5 font-bold text-[#333333]">{r.courseTitle}</td>
                  <td className="p-3.5 font-medium">
                    {r.semester} {r.year}
                  </td>
                  <td className="p-3.5 font-medium">{r.creditsEarned} Credits</td>
                  <td className="p-3.5">
                    <Badge variant={getGradeVariant(r.letterGrade)}>{r.letterGrade}</Badge>
                  </td>
                  <td className="p-3.5 text-right font-bold text-[#333333]">
                    {r.gradePoints.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

