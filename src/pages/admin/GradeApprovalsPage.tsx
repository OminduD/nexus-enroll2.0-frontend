import React, { useEffect, useState } from 'react';
import { CheckSquare, CheckCircle2, XCircle } from 'lucide-react';
import { facultyService } from '../../services/facultyService';
import { GradeRecord } from '../../types/faculty';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';

export const GradeApprovalsPage: React.FC = () => {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const { showToast } = useToast();

  const loadPendingGrades = async () => {
    const list = await facultyService.getGrades(1);
    setGrades(list);
  };

  useEffect(() => {
    loadPendingGrades();
  }, []);

  const handleApprove = async (gradeId: number) => {
    try {
      await facultyService.approveGrade(gradeId);
      showToast('Grade approved and posted to academic record! Status: APPROVED.', 'success');
      await loadPendingGrades();
    } catch {
      showToast('Approval action failed.', 'error');
    }
  };

  const handleReject = async (gradeId: number) => {
    try {
      await facultyService.rejectGrade(gradeId);
      showToast('Grade rejected and returned to faculty draft.', 'info');
      await loadPendingGrades();
    } catch {
      showToast('Rejection failed.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
          Grade Approvals Queue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Review pending faculty grade submissions and approve or reject before final transcript posting
        </p>
      </div>

      {/* Approvals Data Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
        <h3 className="font-bold text-lg text-[#333333] flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-teal-700" /> Pending Submissions Inbox
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Student Name</th>
                <th className="p-3.5">Course & Assignment</th>
                <th className="p-3.5">Score Points</th>
                <th className="p-3.5">Letter Grade</th>
                <th className="p-3.5">Graded By</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right rounded-r-xl">Decision Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-[#333333]">
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(g.studentName || 'Student')}&background=006666&color=fff&rounded=true`}
                        alt={g.studentName}
                        className="w-6 h-6 rounded-full shrink-0 shadow-sm"
                      />
                      <span>{g.studentName}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-medium">
                    {g.courseCode} • {g.assignmentTitle}
                  </td>
                  <td className="p-3.5 font-mono font-semibold">
                    {g.pointsEarned} / {g.maxPoints} pts
                  </td>
                  <td className="p-3.5 font-extrabold text-teal-700">{g.letterGrade}</td>
                  <td className="p-3.5 font-medium text-slate-500">{g.gradedBy}</td>
                  <td className="p-3.5">
                    <Badge variant={g.status === 'APPROVED' ? 'success' : g.status === 'PENDING' ? 'warning' : 'danger'}>
                      {g.status}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-right">
                    {g.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleReject(g.id)}
                          className="px-3 py-1.5 rounded-xl bg-coral-50 hover:bg-coral-600 text-coral-600 hover:text-white font-bold text-xs transition-all flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                        <button
                          onClick={() => handleApprove(g.id)}
                          className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve Grade
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-semibold italic">Processed</span>
                    )}
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

