/**
 * Faculty-facing course change request form and list. Calls
 * courseService.getChangeRequests (GET /api/courses/change-requests) and
 * createChangeRequest (POST /api/courses/change-requests).
 */
import React, { useEffect, useState } from 'react';
import { FileCode, Send, Plus } from 'lucide-react';
import { courseService } from '../../services/courseService';
import { ChangeRequest, ChangeRequestType } from '../../types/course';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

export const ChangeRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    courseId: 1,
    courseCode: 'CS-301',
    requestType: 'CAPACITY_CHANGE' as ChangeRequestType,
    proposedValue: '50',
    details: 'Need more capacity due to high student demand in Fall registration.',
  });

  const { showToast } = useToast();

  const loadRequests = async () => {
    const data = await courseService.getChangeRequests();
    setRequests(data);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleSubmitRequest = async () => {
    try {
      await courseService.createChangeRequest({
        ...formData,
        requestedBy: 'prof_smith',
      });
      showToast('Course change request submitted for Admin review!', 'success');
      setIsModalOpen(false);
      await loadRequests();
    } catch {
      showToast('Failed to submit change request.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
            Course Change Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Submit section capacity updates or schedule change proposals for administrative review
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Submit Change Request
        </button>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
        <h3 className="font-bold text-lg text-[#333333] flex items-center gap-2">
          <FileCode className="w-5 h-5 text-teal-700" /> Submitted Request History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Course Code</th>
                <th className="p-3.5">Request Type</th>
                <th className="p-3.5">Proposed Value</th>
                <th className="p-3.5">Details & Justification</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right rounded-r-xl">Submitted Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-teal-700">
                    {r.courseCode}
                  </td>
                  <td className="p-3.5">
                    <Badge variant="secondary">{r.requestType}</Badge>
                  </td>
                  <td className="p-3.5 font-bold text-[#333333]">{r.proposedValue}</td>
                  <td className="p-3.5 max-w-xs truncate text-slate-500">{r.details}</td>
                  <td className="p-3.5">
                    <Badge variant={r.status === 'APPROVED' ? 'success' : r.status === 'REJECTED' ? 'danger' : 'warning'}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-right text-slate-400 font-mono text-[11px]">{r.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Course Change Request"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Target Course Code</label>
            <input
              type="text"
              value={formData.courseCode}
              onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] font-mono focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Request Type</label>
            <select
              value={formData.requestType}
              onChange={(e) => setFormData({ ...formData, requestType: e.target.value as ChangeRequestType })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
            >
              <option value="CAPACITY_CHANGE">CAPACITY_CHANGE (Room Expansion)</option>
              <option value="SCHEDULE_CHANGE">SCHEDULE_CHANGE (Lecture Hours Adjustment)</option>
              <option value="COURSE_UPDATE">COURSE_UPDATE (Syllabus/Prerequisites)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Proposed Value</label>
            <input
              type="text"
              placeholder="e.g. 50 seats or Mon, Wed 10:30 AM"
              value={formData.proposedValue}
              onChange={(e) => setFormData({ ...formData, proposedValue: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Justification / Details</label>
            <textarea
              rows={3}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-[#333333]"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitRequest}
              className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Submit Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

