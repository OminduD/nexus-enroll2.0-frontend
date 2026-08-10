import React, { useEffect, useState } from 'react';
import { FileCode, CheckCircle2, XCircle } from 'lucide-react';
import { courseService } from '../../services/courseService';
import { ChangeRequest } from '../../types/course';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { TableSkeleton } from '../../components/ui/Skeleton';

export const AdminChangeRequestsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [selectedReq, setSelectedReq] = useState<ChangeRequest | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'APPROVE' | 'REJECT'>('APPROVE');

  const { showToast } = useToast();

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await courseService.getChangeRequests();
      setRequests(data);
    } catch (e) {
      console.warn('Admin change requests fallback:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    const handleUpdate = () => loadRequests();
    window.addEventListener('nexus_change_requests_updated', handleUpdate);
    return () => window.removeEventListener('nexus_change_requests_updated', handleUpdate);
  }, []);

  const handleOpenActionModal = (req: ChangeRequest, action: 'APPROVE' | 'REJECT') => {
    setSelectedReq(req);
    setModalAction(action);
    setReviewComment(
      action === 'APPROVE'
        ? 'Approved - capacity increase verified with registrar.'
        : 'Rejected - insufficient room capacity justification.'
    );
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedReq) return;
    try {
      if (modalAction === 'APPROVE') {
        await courseService.approveChangeRequest(selectedReq.id, reviewComment);
        showToast(`Approved change request for ${selectedReq.courseCode}!`, 'success');
      } else {
        await courseService.rejectChangeRequest(selectedReq.id, reviewComment);
        showToast(`Rejected change request for ${selectedReq.courseCode}.`, 'info');
      }
      setIsModalOpen(false);
      await loadRequests();
    } catch {
      showToast('Action failed.', 'error');
    }
  };

  if (isLoading) {
    return <TableSkeleton rows={6} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
          Change Request Approvals Inbox
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Review and decide on section capacity expansion and schedule modification requests submitted by faculty
        </p>
      </div>

      {/* Requests Inbox Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
        <h3 className="font-bold text-lg text-[#333333] flex items-center gap-2">
          <FileCode className="w-5 h-5 text-teal-700" /> Pending Change Proposals
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Course Code</th>
                <th className="p-3.5">Request Type</th>
                <th className="p-3.5">Requested By</th>
                <th className="p-3.5">Proposed Value</th>
                <th className="p-3.5">Justification</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-teal-700">{r.courseCode}</td>
                  <td className="p-3.5">
                    <Badge variant="secondary">{r.requestType}</Badge>
                  </td>
                  <td className="p-3.5 font-bold text-[#333333]">{r.requestedBy}</td>
                  <td className="p-3.5 font-semibold text-[#333333]">{r.proposedValue}</td>
                  <td className="p-3.5 max-w-xs truncate text-slate-500">{r.details}</td>
                  <td className="p-3.5">
                    <Badge variant={r.status === 'APPROVED' ? 'success' : r.status === 'REJECTED' ? 'danger' : 'warning'}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-right">
                    {r.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenActionModal(r, 'REJECT')}
                          className="px-3 py-1 rounded-xl bg-coral-50 hover:bg-coral-600 text-coral-600 hover:text-white font-bold text-xs transition-all flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                        <button
                          onClick={() => handleOpenActionModal(r, 'APPROVE')}
                          className="px-3 py-1 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-semibold italic">Decision Finalized</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Comments Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${modalAction === 'APPROVE' ? 'Approve' : 'Reject'} Change Request: ${selectedReq?.courseCode}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Request Type: <span className="font-bold text-[#333333]">{selectedReq?.requestType}</span> • Proposed: <span className="font-bold text-[#333333]">{selectedReq?.proposedValue}</span>
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Administrative Review Comment</label>
            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-[#333333]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAction}
              className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md ${
                modalAction === 'APPROVE' ? 'bg-teal-700 hover:bg-teal-800' : 'bg-coral-600 hover:bg-coral-700'
              }`}
            >
              Confirm {modalAction}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

