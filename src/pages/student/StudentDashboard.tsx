/**
 * Student portal landing page: overview, timetable, and academic tabs.
 * Consumes AuthContext for the current user, and calls studentService
 * (GET /api/students, /api/students/{id}/schedule) and notificationService
 * (GET /api/notifications/user/{id}) to populate its widgets.
 */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/ui/StatCard';
import {
  BookOpen,
  Calendar,
  Award,
  Bell,
  ArrowRight,
  Clock,
  MapPin,
  Sparkles,
  Zap,
  GraduationCap,
  ChevronRight,
  CheckCircle2,
  BookmarkPlus,
  LayoutGrid,
  CalendarDays,
  Target,
  FileCheck
} from 'lucide-react';
import { studentService } from '../../services/studentService';
import { notificationService } from '../../services/notificationService';
import { StudentEnrollment, StudentProfile } from '../../types/student';
import { NotificationItem } from '../../types/notification';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [schedule, setSchedule] = useState<StudentEnrollment[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'timetable' | 'academic'>('overview');
  const [notificationFilter, setNotificationFilter] = useState<'ALL' | 'HIGH'>('ALL');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const p = await studentService.getProfile(user?.id || 1);
        const actualStudentId = p?.id || user?.id || 1;
        const s = await studentService.getSchedule(actualStudentId);
        const n = await notificationService.getUserNotifications(user?.id || 1);
        const uc = await notificationService.getUnreadCount(user?.id || 1);

        setProfile(p);
        const sArray = Array.isArray(s) ? s : ((s as unknown as { content?: StudentEnrollment[] })?.content || []);
        setSchedule(sArray);
        const nArray = Array.isArray(n) ? n : ((n as unknown as { content?: NotificationItem[] })?.content || []);
        setNotifications(nArray);
        setUnreadCount(typeof uc === 'number' ? uc : 0);
      } catch (err) {
        console.error('Failed to load student dashboard data:', err);
      }
    };
    fetchData();
  }, [user]);

  const scheduleList = Array.isArray(schedule) ? schedule : [];
  const totalCredits = scheduleList.reduce((acc, curr) => acc + (curr?.credits || 0), 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const nextClass = scheduleList[0];
  const completedCredits = 84;
  const totalRequiredCredits = 120;
  const progressPercent = Math.round((completedCredits / totalRequiredCredits) * 100);

  const filteredNotifications = notificationFilter === 'HIGH'
    ? notifications.filter(n => n.priority === 'HIGH')
    : notifications.slice(0, 5);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getDaySchedule = (dayShort: string) => {
    return scheduleList.filter(item => {
      const days = item.scheduleDays || '';
      if (dayShort === 'Mon' && (days.includes('MWF') || days.includes('Mon') || days.includes('M'))) return true;
      if (dayShort === 'Tue' && (days.includes('TR') || days.includes('Tue') || days.includes('T'))) return true;
      if (dayShort === 'Wed' && (days.includes('MWF') || days.includes('Wed') || days.includes('W'))) return true;
      if (dayShort === 'Thu' && (days.includes('TR') || days.includes('Thu') || days.includes('R'))) return true;
      if (dayShort === 'Fri' && (days.includes('MWF') || days.includes('Fri') || days.includes('F'))) return true;
      return false;
    });
  };

  const degreeRequirements = [
    { title: 'Core Computer Science', completed: 36, required: 48, status: 'IN_PROGRESS' },
    { title: 'Mathematics & Science', completed: 24, required: 24, status: 'COMPLETED' },
    { title: 'General Education', completed: 18, required: 30, status: 'IN_PROGRESS' },
    { title: 'Technical Electives', completed: 6, required: 18, status: 'IN_PROGRESS' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 text-[#333333] dark:text-slate-100"
    >
      {/* Bento Glassmorphic Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-950 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-teal-500/30">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-coral-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Header Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-coral-300 shadow-xs">
                <Zap className="w-3.5 h-3.5 text-coral-400 animate-pulse" /> Standing: {profile?.academicStanding || 'NULL'}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono font-medium text-teal-200">
                <Clock className="w-3.5 h-3.5 text-teal-300" /> {currentTime}
              </div>
            </div>

            <div className="text-xs font-mono font-medium text-teal-200/90 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/15 shadow-xs">
              ID: <span className="font-extrabold text-white">{profile?.studentIdNumber || 'NULL'}</span>
            </div>
          </div>

          {/* Welcome & Program Info */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {getGreeting()}, <span className="text-coral-300">{user?.firstName || 'NULL'}!</span>
              </h1>
              <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl leading-relaxed mt-1">
                Enrolled in <span className="font-bold text-white">{profile?.major || 'NULL'} B.S. Program</span> • Semester Term: <span className="text-teal-300 font-semibold">Fall 2025</span>
              </p>
            </div>

            {/* View Mode Switcher Pills */}
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-white text-teal-950 shadow-md scale-105'
                    : 'text-teal-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Overview
              </button>
              <button
                onClick={() => setActiveTab('timetable')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'timetable'
                    ? 'bg-white text-teal-950 shadow-md scale-105'
                    : 'text-teal-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" /> Timetable
              </button>
              <button
                onClick={() => setActiveTab('academic')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'academic'
                    ? 'bg-white text-teal-950 shadow-md scale-105'
                    : 'text-teal-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <Target className="w-3.5 h-3.5" /> Progress
              </button>
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="pt-1 flex flex-wrap items-center gap-2 border-t border-white/10">
            <Link
              to="/student/courses"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-all backdrop-blur-md hover:scale-105"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-coral-300" /> Course Catalog
            </Link>
            <Link
              to="/student/schedule"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-all backdrop-blur-md hover:scale-105"
            >
              <Calendar className="w-3.5 h-3.5 text-teal-300" /> My Schedule
            </Link>
            <Link
              to="/student/progress"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-all backdrop-blur-md hover:scale-105"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" /> Degree Progress
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Enrolled Credits"
          value={`${totalCredits} hrs`}
          subtitle="Fall 2025 Registered"
          icon={BookOpen}
          color="teal"
          progress={(totalCredits / 18) * 100}
        />
        <StatCard
          title="Enrolled Courses"
          value={scheduleList.length}
          subtitle="Confirmed Course Sections"
          icon={Calendar}
          color="emerald"
        />
        <StatCard
          title="Cumulative GPA"
          value={profile?.gpa || 'NULL'}
          subtitle="Scale 4.00 (Honor List)"
          icon={Award}
          trend="+0.12 this term"
          trendUp={true}
          color="coral"
        />
        <StatCard
          title="Unread Notifications"
          value={unreadCount}
          subtitle="Pending Announcements"
          icon={Bell}
          color="purple"
        />
      </div>

      {/* Main Dynamic View Content */}
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
            {/* Left 2 Columns: Next Class & Today's Schedule */}
            <div className="lg:col-span-2 space-y-6">
              {/* Next Class Highlight Banner */}
              {nextClass && (
                <div className="relative overflow-hidden bg-gradient-to-r from-teal-900/90 via-teal-800/90 to-teal-950/90 text-white border border-teal-500/40 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 z-10">
                    <div className="p-3 rounded-2xl bg-coral-500 text-white shrink-0 shadow-md">
                      <Clock className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold uppercase text-teal-200 tracking-wider">Next Upcoming Class</span>
                        <Badge variant="success">IN 45 MINS</Badge>
                      </div>
                      <p className="text-base font-black text-white mt-0.5">
                        {nextClass.courseCode || 'NULL'} — {nextClass.courseTitle || 'NULL'}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-teal-100 sm:text-right z-10">
                    <p className="font-extrabold text-white text-sm">{nextClass.scheduleTime || 'NULL'}</p>
                    <p className="flex items-center gap-1 text-teal-200 sm:justify-end mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-coral-400" /> {nextClass.location || 'NULL'}
                    </p>
                  </div>
                </div>
              )}

              {/* Enrolled Course Schedule */}
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Registered Course Timetable
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Current active enrolled course sections</p>
                  </div>
                  <Link
                    to="/student/schedule"
                    className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/70 dark:border-teal-800/80"
                  >
                    Full Timetable <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {scheduleList.length === 0 ? (
                    <p className="text-sm text-slate-500 py-8 text-center">No enrolled courses for this term.</p>
                  ) : (
                    scheduleList.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 border-l-4 border-l-teal-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all hover:shadow-md hover:border-teal-500/40"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-teal-700 dark:text-teal-400">{c.courseCode || 'NULL'}</span>
                            <Badge variant={c.status === 'ENROLLED' ? 'success' : 'warning'}>{c.status || 'NULL'}</Badge>
                            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">{c.credits || 0} Credits</span>
                          </div>
                          <p className="text-xs font-extrabold">{c.courseTitle || 'NULL'}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Instructor: {c.instructorName || 'NULL'}</p>
                        </div>

                        <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700 shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> {c.scheduleDays || 'NULL'} {c.scheduleTime || 'NULL'}
                          </div>
                          <div className="flex items-center gap-1.5 font-medium pt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-coral-500" /> {c.location || 'NULL'}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Degree Completion & Recent Updates */}
            <div className="space-y-6">
              {/* Degree Audit Gauge Widget */}
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-extrabold flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-coral-500" /> Degree Completion
                  </h3>
                  <Link to="/student/progress" className="text-[11px] font-bold text-teal-700 dark:text-teal-400 hover:underline">
                    Audit Details
                  </Link>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600 dark:text-slate-400">Overall Completion</span>
                    <span className="font-mono font-extrabold text-teal-700 dark:text-teal-400 text-sm">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
                    <div
                      className="bg-gradient-to-r from-teal-600 via-teal-500 to-coral-500 h-full rounded-full transition-all duration-1000 shadow-xs"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
                    <span>{completedCredits} Credits Completed</span>
                    <span>{totalRequiredCredits} Total Req.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                    <span className="font-bold text-teal-900 dark:text-teal-200">Senior Standing Achieved</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-teal-700 dark:text-teal-300">YEAR 4</span>
                </div>
              </div>

              {/* Notifications Feed Widget */}
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-extrabold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-coral-500" /> Notifications Feed
                  </h3>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
                    <button
                      onClick={() => setNotificationFilter('ALL')}
                      className={`px-2 py-0.5 rounded-md transition-all ${
                        notificationFilter === 'ALL'
                          ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs'
                          : 'text-slate-500'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setNotificationFilter('HIGH')}
                      className={`px-2 py-0.5 rounded-md transition-all ${
                        notificationFilter === 'HIGH'
                          ? 'bg-white dark:bg-slate-700 text-coral-600 dark:text-coral-400 shadow-2xs'
                          : 'text-slate-500'
                      }`}
                    >
                      High
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredNotifications.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">No notifications found.</p>
                  ) : (
                    filteredNotifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1.5 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold">{n.title}</span>
                          <Badge variant={n.priority === 'HIGH' ? 'danger' : 'info'} size="sm">
                            {n.priority}
                          </Badge>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{n.message}</p>
                        <span className="text-[10px] text-slate-400 font-mono block pt-1">{n.createdAt}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'timetable' && (
          <motion.div
            key="timetable"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Mon-Fri Visual Schedule Matrix
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Weekly class timeslot layout for Fall 2025 term</p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {scheduleList.length} Active Courses Scheduled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((dayShort, idx) => {
                const dayCourses = getDaySchedule(dayShort);
                return (
                  <div key={dayShort} className="bg-slate-50/80 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200/70 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700 pb-2">
                      <span className="font-extrabold text-xs text-slate-700 dark:text-slate-300">{daysOfWeek[idx]}</span>
                      <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400">{dayCourses.length} Classes</span>
                    </div>

                    <div className="space-y-2">
                      {dayCourses.length === 0 ? (
                        <div className="py-8 text-center text-[11px] text-slate-400 italic">No classes scheduled</div>
                      ) : (
                        dayCourses.map((c) => (
                          <div
                            key={`${dayShort}-${c.id}`}
                            className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-teal-500/30 shadow-2xs space-y-1 hover:border-teal-500 transition-colors"
                          >
                            <span className="font-mono font-black text-xs text-teal-700 dark:text-teal-400">{c.courseCode || 'NULL'}</span>
                            <p className="text-[11px] font-bold line-clamp-1">{c.courseTitle || 'NULL'}</p>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                              <Clock className="w-3 h-3 text-coral-500" /> {c.scheduleTime || 'NULL'}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              <MapPin className="w-3 h-3 text-teal-600" /> {c.location || 'NULL'}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'academic' && (
          <motion.div
            key="academic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Degree Breakdown Requirements */}
            <div className="lg:col-span-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Program Requirements Audit Breakdown
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Computer Science B.S. degree graduation requirements</p>
              </div>

              <div className="space-y-4">
                {degreeRequirements.map((req) => {
                  const reqPercent = Math.round((req.completed / req.required) * 100);
                  return (
                    <div key={req.title} className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{req.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-teal-700 dark:text-teal-400">{req.completed} / {req.required} Credits</span>
                          <Badge variant={req.status === 'COMPLETED' ? 'success' : 'info'} size="sm">
                            {req.status === 'COMPLETED' ? 'COMPLETED' : 'IN PROGRESS'}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            req.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-teal-600'
                          }`}
                          style={{ width: `${reqPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GPA Target & Milestone Cards */}
            <div className="space-y-6">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Target className="w-4 h-4 text-coral-500" /> Academic Target Radar
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Current GPA</span>
                    <span className="font-mono font-black text-teal-700 dark:text-teal-400 text-sm">3.82</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Graduation Goal GPA</span>
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">3.85</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs">
                    Dean's List Honor Status active for 3 consecutive terms!
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
