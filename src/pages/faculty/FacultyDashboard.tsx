import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/ui/StatCard';
import { Users, BookOpen, Clock, MapPin, Mail, CheckSquare, GraduationCap } from 'lucide-react';
import { facultyService } from '../../services/facultyService';
import { FacultyProfile, GradeRecord } from '../../types/faculty';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<FacultyProfile | null>(null);
  const [gradesQueue, setGradesQueue] = useState<GradeRecord[]>([]);

  useEffect(() => {
    const loadFacultyData = async () => {
      const p = await facultyService.getProfile(user?.id || 2);
      const g = await facultyService.getGrades(1);
      setProfile(p);
      setGradesQueue(g);
    };
    loadFacultyData();
  }, [user]);

  const pendingSubmissions = gradesQueue.filter((g) => g.status === 'DRAFT' || g.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Mesh Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-800 via-teal-700 to-teal-900 p-6 sm:p-8 text-white shadow-lg border border-teal-600/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-coral-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <Badge variant="warning">FACULTY PROFESSOR PORTAL</Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Welcome, <span className="text-coral-300">{profile?.title || 'Prof.'} {user?.lastName || 'Smith'}!</span> 🎓
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-2xl leading-relaxed">
            {profile?.department} • Office Location: <span className="font-bold text-white px-2 py-0.5 bg-white/15 rounded-lg border border-white/20">{profile?.officeLocation}</span>
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Sections"
          value="3 Sections"
          subtitle="Fall 2025 Semester"
          icon={BookOpen}
          color="teal"
        />
        <StatCard
          title="Total Enrolled Students"
          value="99 Students"
          subtitle="Across 3 sections"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Pending Grade Queue"
          value={pendingSubmissions}
          subtitle="Draft & Submitted"
          icon={CheckSquare}
          color="coral"
        />
        <StatCard
          title="Teaching Hours"
          value="12 hrs/wk"
          subtitle="Lecture & Lab hours"
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
          <h3 className="font-bold text-lg text-[#333333] flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-coral-500" /> Faculty Profile Summary
          </h3>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-700" />
              <span>Department: <span className="font-bold text-[#333333]">{profile?.department}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-coral-500" />
              <span>Office: <span className="font-bold text-[#333333]">{profile?.officeLocation}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-600" />
              <span>Email: <span className="font-bold text-[#333333]">{profile?.email}</span></span>
            </div>
            <div className="pt-2">
              <Badge variant="primary">{profile?.title}</Badge>
            </div>
          </div>
        </div>

        {/* Pending Action Items Queue */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-[#333333] flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-teal-700" /> Pending Grade Submissions
            </h3>
            <Link
              to="/faculty/grades"
              className="text-xs font-bold text-teal-700 hover:underline"
            >
              Open Grading Workflow →
            </Link>
          </div>

          <div className="space-y-3">
            {gradesQueue.map((g) => (
              <div
                key={g.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#333333]">{g.studentName}</span>
                    <Badge
                      variant={g.status === 'APPROVED' ? 'success' : g.status === 'PENDING' ? 'warning' : 'danger'}
                    >
                      {g.status}
                    </Badge>
                  </div>
                  <p className="text-slate-500 mt-1">
                    {g.courseCode} • {g.assignmentTitle}: Score <span className="font-mono font-bold text-[#333333]">{g.pointsEarned}/{g.maxPoints}</span> ({g.letterGrade})
                  </p>
                </div>

                <Link
                  to="/faculty/grades"
                  className="px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-700 text-teal-700 hover:text-white font-bold text-xs border border-teal-200 transition-all shrink-0"
                >
                  Edit Grade
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

