import React, { useEffect, useState } from 'react';
import { Users, Search, Shield, ShieldOff, Eye, UserPlus, GraduationCap, School, CheckCircle2, Lock, Mail, User } from 'lucide-react';
import { studentService } from '../../services/studentService';
import { authService } from '../../services/authService';
import { addStoredUser } from '../../services/localStore';
import { StudentProfile } from '../../types/student';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { TableSkeleton } from '../../components/ui/Skeleton';

export const UserDirectoryPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'directory' | 'provision'>('directory');

  // Staff Account Provisioning Form State
  const [staffRole, setStaffRole] = useState<'FACULTY' | 'ADMIN'>('FACULTY');
  const [staffFirstName, setStaffFirstName] = useState('');
  const [staffLastName, setStaffLastName] = useState('');
  const [staffUsername, setStaffUsername] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffDepartment, setStaffDepartment] = useState('Computer Science & Engineering');
  const [staffPassword, setStaffPassword] = useState('Password123!');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const sList = await studentService.getAllStudents();
        setStudents(sList);
      } catch (e) {
        console.warn('User directory fallback:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
    const handleUpdate = () => loadUsers();
    window.addEventListener('nexus_users_updated', handleUpdate);
    return () => window.removeEventListener('nexus_users_updated', handleUpdate);
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

  const handleProvisionStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await authService.provisionStaffAccount({
        username: staffUsername,
        email: staffEmail,
        password: staffPassword,
        firstName: staffFirstName,
        lastName: staffLastName,
        role: staffRole,
        department: staffDepartment,
      });

      const newStaffProfile: StudentProfile = {
        id: Date.now(),
        userId: Date.now(),
        studentIdNumber: `${staffRole === 'FACULTY' ? 'FAC' : 'ADM'}-${Date.now().toString().slice(-4)}`,
        firstName: staffFirstName,
        lastName: staffLastName,
        email: staffEmail,
        major: staffDepartment,
        enrollmentYear: 2025,
        academicStanding: 'GOOD_STANDING',
        gpa: 4.00,
      };

      addStoredUser(newStaffProfile);
      setStudents((prev) => [newStaffProfile, ...prev]);

      showToast(
        `${staffRole === 'FACULTY' ? 'Faculty' : 'Administrator'} account for ${staffFirstName} ${staffLastName} created successfully!`,
        'success'
      );

      // Reset Form
      setStaffFirstName('');
      setStaffLastName('');
      setStaffUsername('');
      setStaffEmail('');
      setStaffPassword('Password123!');
      setActiveTab('directory');
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to create account.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      (s.firstName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (s.lastName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (s.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (s.studentIdNumber?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <TableSkeleton rows={8} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
            User Directory & Account Provisioning
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Inspect student rosters, view profiles, and provision new Faculty or Admin accounts
          </p>
        </div>

        {/* Tab Selector */}
        <div className="inline-flex p-1 rounded-xl bg-slate-200 border border-slate-300">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'directory'
                ? 'bg-[#006666] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" /> User Directory
          </button>
          <button
            onClick={() => setActiveTab('provision')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'provision'
                ? 'bg-[#006666] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Provision Staff / Admin
          </button>
        </div>
      </div>

      {activeTab === 'directory' ? (
        /* Directory Table */
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
                {filteredStudents.map((s: any) => {
                  const firstName = s.firstName || s.user?.firstName || s.name?.split(' ')[0] || 'User';
                  const lastName = s.lastName || s.user?.lastName || s.name?.split(' ')[1] || 'Account';
                  const email = s.email || s.user?.email || `${firstName.toLowerCase()}@nexus.edu`;
                  const studentId = s.studentIdNumber || s.studentId || s.idNumber || `NEX-2024-${s.id || 1000}`;
                  const major = s.major || s.majorName || s.department || 'Computer Science & Engineering';
                  const standing = s.academicStanding || s.status || s.standing || 'GOOD_STANDING';
                  const gpa = s.gpa ?? 3.5;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-teal-700">{studentId}</td>
                      <td className="p-3.5 font-bold text-[#333333]">
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=006666&color=fff&rounded=true`}
                            alt={`${firstName} ${lastName}`}
                            className="w-6 h-6 rounded-full shrink-0 shadow-sm"
                          />
                          <span>{firstName} {lastName}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-medium">{email}</td>
                      <td className="p-3.5 font-medium">{major}</td>
                      <td className="p-3.5 font-bold text-[#333333]">{gpa}</td>
                      <td className="p-3.5">
                        <Badge variant={standing === 'SUSPENDED' ? 'danger' : 'success'}>
                          {standing}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedStudent({
                                ...s,
                                firstName,
                                lastName,
                                email,
                                studentIdNumber: studentId,
                                major,
                                academicStanding: standing,
                                gpa,
                              });
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
                              standing === 'SUSPENDED'
                                ? 'bg-teal-50 text-teal-700 hover:bg-teal-700 hover:text-white'
                                : 'bg-coral-50 text-coral-600 hover:bg-coral-600 hover:text-white'
                            }`}
                            title={standing === 'SUSPENDED' ? 'Reactivate Account' : 'Deactivate Account'}
                          >
                            {standing === 'SUSPENDED' ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Staff Provisioning Form Tab */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-[#333333] flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-teal-700" /> Create Faculty or Administrator Account
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Public self-registration is reserved for students. Provision authorized staff credentials here.
            </p>
          </div>

          <form onSubmit={handleProvisionStaff} className="space-y-4 text-xs">
            {/* Account Role Preset */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">Account Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStaffRole('FACULTY')}
                  className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    staffRole === 'FACULTY'
                      ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-600/20 text-[#006666]'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${staffRole === 'FACULTY' ? 'bg-[#006666] text-white' : 'bg-slate-200 text-slate-600'}`}>
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Faculty / Instructor</h4>
                    <p className="text-[10px] text-slate-500">Access class rosters & grade management</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStaffRole('ADMIN')}
                  className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    staffRole === 'ADMIN'
                      ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-600/20 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${staffRole === 'ADMIN' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">University Administrator</h4>
                    <p className="text-[10px] text-slate-500">Full system governance & oversight</p>
                  </div>
                </button>
              </div>
            </div>

            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-600 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alice"
                  value={staffFirstName}
                  onChange={(e) => setStaffFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smith"
                  value={staffLastName}
                  onChange={(e) => setStaffLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-teal-500 outline-none"
                />
              </div>
            </div>

            {/* Username & Email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-teal-700" />
                  <input
                    type="text"
                    required
                    placeholder="prof_smith or admin_vance"
                    value={staffUsername}
                    onChange={(e) => setStaffUsername(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-teal-700" />
                  <input
                    type="email"
                    required
                    placeholder="smith@nexus.edu"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block font-bold text-slate-600 mb-1">Department / Division</label>
              <select
                value={staffDepartment}
                onChange={(e) => setStaffDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-teal-500 outline-none"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Mathematics & Statistics">Mathematics & Statistics</option>
                <option value="Physics & Applied Sciences">Physics & Applied Sciences</option>
                <option value="Business Administration">Business Administration</option>
                <option value="Academic Registrar Office">Academic Registrar Office</option>
              </select>
            </div>

            {/* Initial Password */}
            <div>
              <label className="block font-bold text-slate-600 mb-1">Initial Temporary Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-teal-700" />
                <input
                  type="password"
                  required
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-teal-500 outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#006666] hover:bg-[#005555] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Provision {staffRole} Account
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Student Profile Drawer Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title={`Student Profile: ${selectedStudent?.firstName} ${selectedStudent?.lastName}`}
      >
        <div className="space-y-4 text-xs text-slate-600">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent((selectedStudent?.firstName || '') + ' ' + (selectedStudent?.lastName || ''))}&background=006666&color=fff&rounded=true&size=128`}
              alt="Student Avatar"
              className="w-16 h-16 rounded-full shadow-md object-cover ring-2 ring-teal-500/20 shrink-0"
            />
            <div className="space-y-2 flex-1">
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
        </div>
      </Modal>
    </div>
  );
};
