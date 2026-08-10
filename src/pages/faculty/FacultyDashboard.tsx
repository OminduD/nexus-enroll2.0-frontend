import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/ui/StatCard';
import { Users, BookOpen, Clock, MapPin, Mail, CheckSquare, GraduationCap, ArrowRight, Sparkles, FileCode, BarChart2, CalendarCheck, Check, X } from 'lucide-react';
import { facultyService } from '../../services/facultyService';
import { FacultyProfile, GradeRecord } from '../../types/faculty';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardSkeleton } from '../../components/ui/Skeleton';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<FacultyProfile | null>(null);
  const [gradesQueue, setGradesQueue] = useState<GradeRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'curve' | 'office-hours'>('overview');

  const [appointments, setAppointments] = useState([
    { id: 1, student: 'Sarah Jenkins', time: '2:15 PM - 2:30 PM', topic: 'Algorithm Homework #3 Debugging', status: 'PENDING' },
    { id: 2, student: 'Michael Chang', time: '2:30 PM - 2:45 PM', topic: 'Recommendation Letter Request', status: 'APPROVED' },
    { id: 3, student: 'Emily Watson', time: '3:00 PM - 3:15 PM', topic: 'Midterm Grade Review CS-301', status: 'PENDING' },
  ]);

  useEffect(() => {
    const loadFacultyData = async () => {
      setIsLoading(true);
      try {
        const p = await facultyService.getProfile(user?.id || 2);
        const g = await facultyService.getGrades(1);
        setProfile(p);
        setGradesQueue(g);
      } catch (e) {
        console.warn('Faculty dashboard fallback:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadFacultyData();
  }, [user]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const pendingSubmissions = gradesQueue.filter((g) => g.status === 'DRAFT' || g.status === 'PENDING').length;

  const handleApproveAppointment = (id: number) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a));
  };

  const handleDeclineAppointment = (id: number) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'DECLINED' } : a));
  };

  const gradeCurve = [
    { grade: 'A', percent: 38, count: 37, color: 'bg-emerald-500' },
    { grade: 'B', percent: 42, count: 41, color: 'bg-teal-500' },
    { grade: 'C', percent: 14, count: 14, color: 'bg-amber-500' },
    { grade: 'D', percent: 4, count: 4, color: 'bg-coral-500' },
    { grade: 'F', percent: 2, count: 2, color: 'bg-rose-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 text-[#333333] dark:text-slate-100"
    >
      {/* Faculty Glassmorphic Bento Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-950 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-teal-500/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-coral-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-72 h-72 bg-teal-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge variant="warning">FACULTY PROFESSOR PORTAL</Badge>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> Office Hours Today: 2:00 PM - 4:00 PM
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Welcome, <span className="text-coral-300">
                  {user?.firstName || profile?.firstName || 'Faculty'} {user?.lastName || profile?.lastName || 'Professor'}!
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl leading-relaxed mt-1">
                Department of {profile?.department || 'Computer Science & Engineering'} • Office Location: <span className="font-bold text-white px-2.5 py-0.5 bg-white/15 rounded-lg border border-white/20">{profile?.officeLocation || 'Turing Hall Room 304'}</span>
              </p>
            </div>

            {/* View Switcher Pills */}
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-white text-teal-950 shadow-md scale-105'
                    : 'text-teal-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Overview
              </button>
              <button
                onClick={() => setActiveTab('curve')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'curve'
                    ? 'bg-white text-teal-950 shadow-md scale-105'
                    : 'text-teal-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" /> Grade Curve
              </button>
              <button
                onClick={() => setActiveTab('office-hours')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'office-hours'
                    ? 'bg-white text-teal-950 shadow-md scale-105'
                    : 'text-teal-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5" /> Office Hours
              </button>
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="pt-1 flex flex-wrap items-center gap-2 border-t border-white/10">
            <Link
              to="/faculty/roster"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-all backdrop-blur-md hover:scale-105"
            >
              <Users className="w-3.5 h-3.5 text-teal-300" /> Class Rosters
            </Link>
            <Link
              to="/faculty/grades"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-all backdrop-blur-md hover:scale-105"
            >
              <CheckSquare className="w-3.5 h-3.5 text-coral-300" /> Grade Management
            </Link>
            <Link
              to="/faculty/change-requests"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-all backdrop-blur-md hover:scale-105"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-300" /> Submit Change Request
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Sections"
          value="3 Sections"
          subtitle="Fall 2025 Active Terms"
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
          subtitle="Draft & Pending Submissions"
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

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Profile Summary Card */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-lg flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <GraduationCap className="w-5 h-5 text-coral-500" /> Faculty Profile Summary
              </h3>
              <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700">
                  <Users className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Department: <span className="font-bold text-slate-900 dark:text-slate-100">{profile?.department || 'Computer Science & Engineering'}</span></span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700">
                  <MapPin className="w-4 h-4 text-coral-500 shrink-0" />
                  <span>Office: <span className="font-bold text-slate-900 dark:text-slate-100">{profile?.officeLocation || 'Turing Hall Room 304'}</span></span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700">
                  <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Email: <span className="font-bold text-slate-900 dark:text-slate-100">{profile?.email || user?.email || 'faculty@nexus.edu'}</span></span>
                </div>
                <div className="pt-1 flex items-center justify-between">
                  <Badge variant="primary">{profile?.title || 'Faculty Professor'}</Badge>
                  <span className="text-[10px] font-mono text-slate-400">ID #{user?.id || 2}</span>
                </div>
              </div>
            </div>

            {/* Pending Action Items Queue */}
            <div className="lg:col-span-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-lg flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Pending Grade Submissions Workflow
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Student submissions awaiting final approval & posting</p>
                </div>
                <Link
                  to="/faculty/grades"
                  className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/70 dark:border-teal-800/80"
                >
                  Grading Workflow <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {gradesQueue.map((g) => (
                  <div
                    key={g.id}
                    className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs transition-all hover:shadow-md hover:border-teal-500/40"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(g.studentName || 'NULL')}&background=006666&color=fff&rounded=true`}
                          alt={g.studentName}
                          className="w-6 h-6 rounded-full shrink-0 shadow-sm"
                        />
                        <span className="font-extrabold text-slate-900 dark:text-slate-100">{g.studentName || 'NULL'}</span>
                        <Badge
                          variant={g.status === 'APPROVED' ? 'success' : g.status === 'PENDING' ? 'warning' : 'danger'}
                        >
                          {g.status}
                        </Badge>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400">
                        {g.courseCode || 'NULL'} • {g.assignmentTitle || 'NULL'}: Score <span className="font-mono font-extrabold text-teal-700 dark:text-teal-400">{g.pointsEarned ?? 'NULL'}/{g.maxPoints ?? 'NULL'}</span> ({g.letterGrade || 'NULL'})
                      </p>
                    </div>

                    <Link
                      to="/faculty/grades"
                      className="px-3.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/80 hover:bg-teal-700 dark:hover:bg-teal-600 text-teal-700 dark:text-teal-300 hover:text-white font-bold text-xs border border-teal-200 dark:border-teal-800 transition-all shrink-0 shadow-2xs"
                    >
                      Edit Grade
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'curve' && (
          <motion.div
            key="curve"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6"
          >
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-extrabold flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Grade Distribution Curve (Fall 2025)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Aggregated grade proportions across assigned course sections</p>
            </div>

            <div className="space-y-4 max-w-2xl">
              {gradeCurve.map((gc) => (
                <div key={gc.grade} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>Grade {gc.grade}</span>
                    <span className="font-mono text-teal-700 dark:text-teal-400">{gc.count} Students ({gc.percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
                    <div
                      className={`h-full rounded-full ${gc.color} transition-all duration-500`}
                      style={{ width: `${gc.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'office-hours' && (
          <motion.div
            key="office-hours"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-coral-500" /> Student Office Hours Appointment Queue
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Today's scheduled student consultation slots</p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Today 2:00 PM - 4:00 PM
              </span>
            </div>

            <div className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(apt.student)}&background=006666&color=fff&rounded=true`}
                        alt={apt.student}
                        className="w-6 h-6 rounded-full shrink-0 shadow-sm"
                      />
                      <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{apt.student}</span>
                      <Badge variant={apt.status === 'APPROVED' ? 'success' : apt.status === 'DECLINED' ? 'danger' : 'warning'} size="sm">
                        {apt.status}
                      </Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">{apt.topic}</p>
                    <p className="text-[11px] font-mono text-teal-600 dark:text-teal-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-coral-500" /> {apt.time}
                    </p>
                  </div>

                  {apt.status === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveAppointment(apt.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button
                        onClick={() => handleDeclineAppointment(apt.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-200 dark:border-rose-800 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
