import React, { useEffect, useState } from 'react';
import { CheckSquare, Save, Send, Plus, CheckCircle2 } from 'lucide-react';
import { facultyService } from '../../services/facultyService';
import { GradeRecord } from '../../types/faculty';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

export const GradeManagementPage: React.FC = () => {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentName: 'John Doe',
    assignmentTitle: 'Final Exam',
    pointsEarned: 88,
    maxPoints: 100,
    letterGrade: 'B+',
    comments: 'Good overall performance.',
  });

  const { showToast } = useToast();

  const loadGrades = async () => {
    const list = await facultyService.getGrades(1);
    setGrades(list);
  };

  useEffect(() => {
    loadGrades();
  }, []);

  const handleSaveDraft = async () => {
    try {
      await facultyService.saveDraftGrade({
        enrollmentId: 101,
        studentId: 1,
        sectionId: 1,
        studentName: formData.studentName,
        courseCode: 'CS-101',
        assignmentTitle: formData.assignmentTitle,
        pointsEarned: Number(formData.pointsEarned),
        maxPoints: Number(formData.maxPoints),
        letterGrade: formData.letterGrade,
        comments: formData.comments,
      });
      showToast('Grade draft saved successfully! Status: DRAFT.', 'info');
      setIsModalOpen(false);
      await loadGrades();
    } catch {
      showToast('Failed to save draft grade.', 'error');
    }
  };

  const handleSubmitForApproval = async (gradeId: number) => {
    try {
      await facultyService.submitGrade(gradeId);
      showToast('Grade submitted for Admin approval! Status changed to PENDING.', 'success');
      await loadGrades();
    } catch {
      showToast('Submission failed.', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success">APPROVED</Badge>;
      case 'PENDING':
        return <Badge variant="info">PENDING</Badge>;
      default:
        return <Badge variant="warning">DRAFT</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
            Grade Management Workflow
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Save draft student scores, submit grades to the Admin approval queue, and track status transitions
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Enter New Student Grade
        </button>
      </div>

      {/* Grading Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
        <h3 className="font-bold text-lg text-[#333333] flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-teal-700" /> Student Grade Roster (CS-101)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Student Name</th>
                <th className="p-3.5">Assignment</th>
                <th className="p-3.5">Score Points</th>
                <th className="p-3.5">Letter Grade</th>
                <th className="p-3.5">Workflow Status</th>
                <th className="p-3.5 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-[#333333]">{g.studentName}</td>
                  <td className="p-3.5 font-medium">{g.assignmentTitle}</td>
                  <td className="p-3.5 font-mono font-semibold">
                    {g.pointsEarned} / {g.maxPoints} pts
                  </td>
                  <td className="p-3.5 font-extrabold text-teal-700">{g.letterGrade}</td>
                  <td className="p-3.5">{getStatusBadge(g.status)}</td>
                  <td className="p-3.5 text-right">
                    {g.status === 'DRAFT' && (
                      <button
                        onClick={() => handleSubmitForApproval(g.id)}
                        className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 ml-auto transition-all"
                      >
                        <Send className="w-3.5 h-3.5" /> Submit to Admin
                      </button>
                    )}
                    {g.status === 'PENDING' && (
                      <span className="text-[11px] text-teal-700 font-semibold italic">Awaiting Admin Review</span>
                    )}
                    {g.status === 'APPROVED' && (
                      <span className="text-[11px] text-teal-700 font-semibold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Grade Finalized
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Entry Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record / Edit Student Grade Draft"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Student Name</label>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Assignment / Exam Title</label>
            <input
              type="text"
              value={formData.assignmentTitle}
              onChange={(e) => setFormData({ ...formData, assignmentTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Points Earned</label>
              <input
                type="number"
                value={formData.pointsEarned}
                onChange={(e) => setFormData({ ...formData, pointsEarned: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Max Points</label>
              <input
                type="number"
                value={formData.maxPoints}
                onChange={(e) => setFormData({ ...formData, maxPoints: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Letter Grade</label>
              <input
                type="text"
                value={formData.letterGrade}
                onChange={(e) => setFormData({ ...formData, letterGrade: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] font-bold focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
              />
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
              onClick={handleSaveDraft}
              className="px-4 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save as DRAFT
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

