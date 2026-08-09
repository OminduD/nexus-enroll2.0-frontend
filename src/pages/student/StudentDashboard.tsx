import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/ui/StatCard';
import { BookOpen, Calendar, Award, Bell, ArrowRight, Clock, MapPin, Sparkles, Zap } from 'lucide-react';
import { studentService } from '../../services/studentService';
import { notificationService } from '../../services/notificationService';
import { StudentEnrollment, StudentProfile } from '../../types/student';
import { NotificationItem } from '../../types/notification';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [schedule, setSchedule] = useState<StudentEnrollment[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const p = await studentService.getProfile(user?.id || 1);
        const s = await studentService.getSchedule(user?.id || 1);
        const n = await notificationService.getUserNotifications(user?.id || 1);
        const uc = await notificationService.getUnreadCount(user?.id || 1);

        setProfile(p);
        const sArray = Array.isArray(s) ? s : ((s as any)?.content || []);
        setSchedule(sArray);
        const nArray = Array.isArray(n) ? n : ((n as any)?.content || []);
        setNotifications(nArray.slice(0, 3));
        setUnreadCount(typeof uc === 'number' ? uc : 0);
      } catch (err) {
        console.error('Failed to load student dashboard data:', err);
      }
    };
    fetchData();
  }, [user]);

  const scheduleList = Array.isArray(schedule) ? schedule : [];
  const totalCredits = scheduleList.reduce((acc, curr) => acc + (curr?.credits || 3), 0);

  return (
    <div className="space-y-6">
      {/* Mesh Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-800 via-teal-700 to-teal-900 p-6 sm:p-8 text-white shadow-lg border border-teal-600/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-coral-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-coral-300">
            <Zap className="w-3.5 h-3.5 text-coral-400 animate-pulse" /> Status: {profile?.academicStanding || 'GOOD STANDING'}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Welcome back, <span className="text-coral-300">{user?.firstName || 'Student'}!</span> 👋
          </h1>

          <p className="text-xs sm:text-sm text-teal-100 max-w-2xl leading-relaxed">
            {profile?.major} Program • Student ID: <span className="font-mono font-extrabold text-white px-2 py-0.5 bg-white/15 rounded-lg border border-white/20">{profile?.studentIdNumber || 'NEX-2024-8842'}</span>
          </p>
        </div>

        <div className="absolute right-6 bottom-6 opacity-15 pointer-events-none">
          <BookOpen className="w-48 h-48 text-white" />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Enrolled Credits"
          value={`${totalCredits} hrs`}
          subtitle="Fall 2025 Semester"
          icon={BookOpen}
          color="teal"
        />
        <StatCard
          title="Enrolled Courses"
          value={schedule.length}
          subtitle="Registered sections"
          icon={Calendar}
          color="emerald"
        />
        <StatCard
          title="Cumulative GPA"
          value={profile?.gpa || '3.82'}
          subtitle="Scale 4.00"
          icon={Award}
          trend="+0.12 this term"
          trendUp={true}
          color="coral"
        />
        <StatCard
          title="Unread Notifications"
          value={unreadCount}
          subtitle="Action items"
          icon={Bell}
          color="purple"
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Schedule Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#333333] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-700" /> Today's Class Schedule
              </h3>
              <p className="text-xs text-slate-500">Enrolled courses for current week</p>
            </div>
            <Link
              to="/student/schedule"
              className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 transition-colors"
            >
              Full Timetable <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {schedule.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No enrolled courses for this term.</p>
            ) : (
              schedule.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 border-l-4 border-l-teal-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-teal-700">{c.courseCode}</span>
                      <Badge variant={c.status === 'ENROLLED' ? 'success' : 'warning'}>{c.status}</Badge>
                    </div>
                    <p className="text-xs font-bold text-[#333333]">{c.courseTitle}</p>
                    <p className="text-xs text-slate-500">Instructor: {c.instructorName}</p>
                  </div>

                  <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 font-bold text-[#333333]">
                      <Clock className="w-3.5 h-3.5 text-teal-700" /> {c.scheduleDays} {c.scheduleTime}
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-coral-500" /> {c.location}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notifications feed widget */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#333333] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-coral-500" /> Recent Updates
            </h3>
            <Link
              to="/student/notifications"
              className="text-xs font-bold text-teal-700 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 hover:border-teal-500/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#333333]">{n.title}</span>
                  <Badge variant={n.priority === 'HIGH' ? 'danger' : 'info'} size="sm">
                    {n.priority}
                  </Badge>
                </div>
                <p className="text-slate-600 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-400 font-mono block pt-1">{n.createdAt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

