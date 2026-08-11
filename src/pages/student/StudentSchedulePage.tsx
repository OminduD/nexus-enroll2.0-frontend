/**
 * Student's current schedule/timetable with a drop-course flow. Calls
 * studentService.getSchedule (GET /api/students/{id}/schedule) and
 * dropCourse (DELETE /api/enrollments/{enrollmentId}).
 */
import React, { useEffect, useState } from 'react';
import { Calendar, Trash2, MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { studentService } from '../../services/studentService';
import { StudentEnrollment } from '../../types/student';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';

export const StudentSchedulePage: React.FC = () => {
  const [schedule, setSchedule] = useState<StudentEnrollment[]>([]);
  const [dropTarget, setDropTarget] = useState<StudentEnrollment | null>(null);
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const [isDropping, setIsDropping] = useState(false);

  const { user } = useAuth();
  const { showToast } = useToast();

  const loadSchedule = async () => {
    const p = await studentService.getProfile(user?.id || 1);
    const actualStudentId = p?.id || user?.id || 1;
    const data = await studentService.getSchedule(actualStudentId);
    setSchedule(data);
  };

  useEffect(() => {
    loadSchedule();
  }, [user]);

  const handleConfirmDrop = async () => {
    if (!dropTarget) return;
    setIsDropping(true);
    try {
      await studentService.dropCourse(dropTarget.id);
      showToast(`Dropped course ${dropTarget.courseCode} successfully.`, 'info');
      setIsDropModalOpen(false);
      await loadSchedule();
    } catch {
      showToast('Failed to drop course. Try again.', 'error');
    } finally {
      setIsDropping(false);
    }
  };

  // Days for Timetable Grid
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const timeSlots = ['09:00 AM', '11:00 AM', '02:00 PM'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
          My Enrollments & Weekly Schedule
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          View your active registered sections, weekly class timetable grid, and manage enrollment status
        </p>
      </div>

      {/* Active Enrollments Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
        <h3 className="font-bold text-lg text-[#333333] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-teal-700" /> Active Course Registrations
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Course Code</th>
                <th className="p-3.5">Title & Instructor</th>
                <th className="p-3.5">Schedule</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedule.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    No active course enrollments found.
                  </td>
                </tr>
              ) : (
                schedule.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-teal-700">
                      {item.courseCode}
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-[#333333]">{item.courseTitle}</p>
                      <p className="text-[11px] text-slate-500">{item.instructorName}</p>
                    </td>
                    <td className="p-3.5 font-medium">
                      {item.scheduleDays} • {item.scheduleTime}
                    </td>
                    <td className="p-3.5 font-medium">{item.location}</td>
                    <td className="p-3.5">
                      <Badge variant={item.status === 'ENROLLED' ? 'success' : 'warning'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setDropTarget(item);
                          setIsDropModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-coral-50 hover:bg-coral-600 text-coral-600 hover:text-white font-bold text-xs transition-all flex items-center gap-1 ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Drop
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Timetable Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
        <h3 className="font-bold text-lg text-[#333333] flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-700" /> Interactive Weekly Timetable Grid
        </h3>

        <div className="grid grid-cols-6 gap-2 text-center text-xs">
          <div className="p-2.5 font-bold text-slate-500 bg-slate-100 rounded-xl">Time</div>
          {days.map((day) => (
            <div key={day} className="p-2.5 font-bold text-[#333333] bg-slate-100 rounded-xl">
              {day}
            </div>
          ))}

          {timeSlots.map((time) => (
            <React.Fragment key={time}>
              <div className="p-3 font-semibold text-slate-500 flex items-center justify-center bg-slate-50 rounded-xl text-[11px]">
                {time}
              </div>
              {days.map((day) => {
                const match = schedule.find(
                  (s) => s.scheduleDays.includes(day) && s.scheduleTime.startsWith(time.slice(0, 2))
                );
                return (
                  <div
                    key={`${day}-${time}`}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between min-h-[90px] transition-all ${
                      match
                        ? 'bg-teal-50 border-teal-200 text-[#333333] shadow-sm'
                        : 'border-dashed border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    {match ? (
                      <>
                        <div>
                          <span className="font-extrabold font-mono text-xs block text-teal-700">
                            {match.courseCode}
                          </span>
                          <p className="text-[11px] font-semibold leading-tight line-clamp-2">{match.courseTitle}</p>
                        </div>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-coral-500 shrink-0" /> {match.location}
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono italic">Free</span>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isDropModalOpen}
        onClose={() => setIsDropModalOpen(false)}
        title="Confirm Drop Course"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-coral-50 border border-coral-200 text-coral-800 text-xs">
            <AlertTriangle className="w-5 h-5 text-coral-500 shrink-0" />
            <p>
              Are you sure you want to drop <span className="font-bold">{dropTarget?.courseCode} ({dropTarget?.courseTitle})</span>? This action will remove it from your schedule.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setIsDropModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-[#333333]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDrop}
              disabled={isDropping}
              className="px-4 py-2 rounded-xl bg-coral-600 hover:bg-coral-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
            >
              {isDropping ? 'Dropping...' : 'Yes, Drop Course'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

