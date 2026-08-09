import React, { useEffect, useState } from 'react';
import { Users, Search, Shield, ShieldOff, Eye } from 'lucide-react';
import { studentService } from '../../services/studentService';
import { StudentProfile } from '../../types/student';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

export const UserDirectoryPage: React.FC = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const loadUsers = async () => {
      const sList = await studentService.getAllStudents();
      setStudents(sList);
    };
    loadUsers();
  }, []);

  const handleToggleUserStatus = (student: StudentProfile) => {
    const isDeactivating = student.academicStanding !== 'SUSPENDED';
    student.academicStanding = isDeactivating ? 'SUSPENDED' : 'GOOD_STANDING';
    setStudents([...students]);
    showToast(
      `User account ${student.firstName} ${student.lastName} ${isDeactivating ? 'deactivated' : 'reactivated'}.`,
      isDeactivating ? 'info' : 'success'
    );
  };

  const filteredStudents = students.filter(
    (s) =>
      s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentIdNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
          User & Roster Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage system student and faculty accounts, inspect academic profiles, and toggle account activation
        </p>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="font-bold text-lg text-[#333333] flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-700" /> Student & User Accounts
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-teal-600" />
            <input
              type="text"
              placeholder="Search user name, email, ID..."
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
                <th className="p-3.5 rounded-l-xl">Student ID</th>
                <th className="p-3.5">Full Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Major</th>
                <th className="p-3.5">GPA</th>
                <th className="p-3.5">Standing / Status</th>
                <th className="p-3.5 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-teal-700">{s.studentIdNumber}</td>
                  <td className="p-3.5 font-bold text-[#333333]">
                    {s.firstName} {s.lastName}
                  </td>
                  <td className="p-3.5 font-medium">{s.email}</td>
                  <td className="p-3.5 font-medium">{s.major}</td>
                  <td className="p-3.5 font-bold text-[#333333]">{s.gpa}</td>
                  <td className="p-3.5">
                    <Badge variant={s.academicStanding === 'SUSPENDED' ? 'danger' : 'success'}>
                      {s.academicStanding}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedStudent(s);
                          setIsProfileModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-teal-700 hover:text-white text-slate-600 transition-colors"
                        title="View Profile Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(s)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          s.academicStanding === 'SUSPENDED'
                            ? 'bg-teal-50 text-teal-700 hover:bg-teal-700 hover:text-white'
                            : 'bg-coral-50 text-coral-600 hover:bg-coral-600 hover:text-white'
                        }`}
                        title={s.academicStanding === 'SUSPENDED' ? 'Reactivate Account' : 'Deactivate Account'}
                      >
                        {s.academicStanding === 'SUSPENDED' ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile Drawer Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title={`Student Profile: ${selectedStudent?.firstName} ${selectedStudent?.lastName}`}
      >
        <div className="space-y-4 text-xs text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50 space-y-2 border border-slate-200">
            <p>
              Student Number: <span className="font-mono font-bold text-[#333333]">{selectedStudent?.studentIdNumber}</span>
            </p>
            <p>
              Email Address: <span className="font-bold text-[#333333]">{selectedStudent?.email}</span>
            </p>
            <p>
              Major: <span className="font-bold text-[#333333]">{selectedStudent?.major}</span>
            </p>
            <p>
              Enrollment Year: <span className="font-bold text-[#333333]">{selectedStudent?.enrollmentYear}</span>
            </p>
            <p>
              Cumulative GPA: <span className="font-bold text-teal-700">{selectedStudent?.gpa}</span>
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

