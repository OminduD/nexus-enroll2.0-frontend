import React, { useEffect, useState } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import {
  Users,
  GraduationCap,
  BookOpen,
  Activity,
  TrendingUp,
  PieChart as PieIcon,
  ShieldCheck,
  Server,
  CheckCircle2,
  Send,
  BarChart3,
  RefreshCw,
  Zap,
  Terminal,
  Cpu
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { reportService } from '../../services/reportService';
import { healthService, SystemHealthStatus } from '../../services/healthService';
import { EnrollmentTrendItem, DepartmentDistributionItem } from '../../types/report';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardSkeleton } from '../../components/ui/Skeleton';

export const AdminDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [trends, setTrends] = useState<EnrollmentTrendItem[]>([]);
  const [distribution, setDistribution] = useState<DepartmentDistributionItem[]>([]);
  const [timeframe, setTimeframe] = useState<'2025' | '2024'>('2025');
  const [activeTab, setActiveTab] = useState<'analytics' | 'telemetry' | 'audit'>('analytics');
  const [isPinging, setIsPinging] = useState(false);

  const [systemHealth, setSystemHealth] = useState<SystemHealthStatus>({
    isOnline: true,
    onlineCount: 8,
    totalCount: 8,
    gatewayLatency: '12ms',
    services: [
      { name: 'API Gateway', port: ':8080', status: 'HEALTHY', latency: '12ms' },
      { name: 'Auth Service', port: ':8081', status: 'HEALTHY', latency: '8ms' },
      { name: 'Student Service', port: ':8082', status: 'HEALTHY', latency: '14ms' },
      { name: 'Faculty Service', port: ':8083', status: 'HEALTHY', latency: '11ms' },
      { name: 'Course Service', port: ':8084', status: 'HEALTHY', latency: '9ms' },
      { name: 'Enrollment Service', port: ':8085', status: 'HEALTHY', latency: '16ms' },
      { name: 'Academic Record Service', port: ':8086', status: 'HEALTHY', latency: '10ms' },
      { name: 'Notification Service', port: ':8087', status: 'HEALTHY', latency: '7ms' },
    ]
  });

  const auditLogs = [
    { timestamp: '10:42:15', service: 'API Gateway', event: 'JWT Authentication Token Verified', status: 'SUCCESS' },
    { timestamp: '10:40:02', service: 'Enrollment Service', event: 'Course Section NEX-CS301 Enrolled (User #842)', status: 'SUCCESS' },
    { timestamp: '10:38:44', service: 'Grade Service', event: 'Grade Submission Batch Approved by Admin', status: 'SUCCESS' },
    { timestamp: '10:35:10', service: 'Auth Service', event: 'User Session Refresh Completed', status: 'SUCCESS' },
    { timestamp: '10:31:00', service: 'Notification Service', event: 'Broadcast Notification Dispatched (Target: All Students)', status: 'SUCCESS' },
  ];

  const refreshHealth = async () => {
    setIsPinging(true);
    const health = await healthService.checkSystemHealth();
    setSystemHealth(health);
    setIsPinging(false);
  };

  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      try {
        const t = await reportService.getEnrollmentStats();
        const d = await reportService.getDepartmentDistribution();
        setTrends(t);
        setDistribution(d);
        await refreshHealth();
      } catch (e) {
        console.warn('Dashboard reports fallback:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadReports();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const pingAllServices = () => {
    refreshHealth();
  };

  const COLORS = ['#006666', '#FF7F50', '#339696', '#ff9970', '#0f172a'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 text-[#333333] dark:text-slate-100"
    >
      {/* Executive Command Bento Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-950 via-teal-900 to-slate-950 p-6 sm:p-8 text-white shadow-2xl border border-teal-500/30">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-coral-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="danger">ENTERPRISE COMMAND CENTER</Badge>
              {systemHealth.isOnline ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-xs font-semibold text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  8/8 Microservices Operational ({systemHealth.gatewayLatency})
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 backdrop-blur-md border border-red-400/30 text-xs font-semibold text-red-300">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  Backend Offline (Fallback Mode Active)
                </div>
              )}
            </div>

            <div className="text-xs font-mono font-medium text-teal-200/90 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/15">
              Gateway: <span className={`font-extrabold ${systemHealth.isOnline ? 'text-emerald-400' : 'text-red-400'}`}>{systemHealth.isOnline ? 'http://localhost:8080 (UP)' : 'Offline / Unreachable'}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                System Executive <span className="text-coral-300">Dashboard</span>
              </h1>
              <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl leading-relaxed mt-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-coral-400 shrink-0" />
                Real-time distributed cluster telemetry & university administration portal
              </p>
            </div>

            {/* Admin View Mode Switcher Pills */}
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shrink-0">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-white text-teal-950 shadow-md scale-105'
                    : 'text-teal-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" /> Analytics
              </button>
              <button
                onClick={() => setActiveTab('telemetry')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'telemetry'
                    ? 'bg-white text-teal-950 shadow-md scale-105'
                    : 'text-teal-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" /> Cluster Health
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'audit'
                    ? 'bg-white text-teal-950 shadow-md scale-105'
                    : 'text-teal-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" /> Audit Logs
              </button>
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="pt-1 flex flex-wrap items-center gap-2 border-t border-white/10">
            <Link
              to="/admin/courses"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-all backdrop-blur-md hover:scale-105"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-300" /> Course Admin
            </Link>
            <Link
              to="/admin/grade-approvals"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-all backdrop-blur-md hover:scale-105"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Grade Approvals
            </Link>
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-all backdrop-blur-md hover:scale-105"
            >
              <Users className="w-3.5 h-3.5 text-coral-300" /> User Directory
            </Link>
            <Link
              to="/admin/reports"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-all backdrop-blur-md hover:scale-105"
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-300" /> System Reports
            </Link>
            <Link
              to="/admin/notifications"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-all backdrop-blur-md hover:scale-105"
            >
              <Send className="w-3.5 h-3.5 text-cyan-300" /> Broadcast
            </Link>
          </div>
        </div>
      </div>

      {!systemHealth.isOnline && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 text-amber-700 dark:text-amber-300 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">⚠️</span>
            <div>
              <h4 className="font-extrabold text-sm">Backend Services Offline</h4>
              <p className="text-xs opacity-90">The API Gateway (port 8080) is currently unreachable. The application is running in local fallback mode using cached data.</p>
            </div>
          </div>
          <button
            onClick={pingAllServices}
            disabled={isPinging}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} /> Retry Connection
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Active Students"
          value="3,420"
          subtitle="Enrolled Fall 2025"
          icon={GraduationCap}
          trend="+14% vs last year"
          trendUp={true}
          color="teal"
          progress={78}
        />
        <StatCard
          title="Faculty Members"
          value="184 Profs"
          subtitle="Across 5 departments"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Active Course Catalog"
          value="142 Courses"
          subtitle="320 Sections scheduled"
          icon={BookOpen}
          color="coral"
        />
        <StatCard
          title="Microservices Uptime"
          value={systemHealth.isOnline ? "99.98%" : "0.00%"}
          subtitle={systemHealth.isOnline ? "Gateway :8080 Active" : "Gateway Unreachable"}
          icon={Activity}
          trend={systemHealth.isOnline ? "8/8 Online" : "0/8 Offline"}
          trendUp={systemHealth.isOnline}
          color={systemHealth.isOnline ? "cyan" : "coral"}
          progress={systemHealth.isOnline ? 99.9 : 0}
        />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Microservices Cluster Quick Telemetry Bar */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-extrabold flex items-center gap-2">
                    <Server className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Microservices Cluster Status
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Live heartbeat probe across Spring Boot microservices</p>
                </div>
                <button
                  onClick={pingAllServices}
                  disabled={isPinging}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-teal-600' : ''}`} /> Ping Cluster
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {systemHealth.services.map((svc) => (
                  <div
                    key={svc.name}
                    className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/80 hover:border-teal-500/40 transition-all shadow-2xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{svc.name}</span>
                      {svc.status === 'HEALTHY' ? (
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      ) : (
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      <span>{svc.port}</span>
                      <span className={svc.status === 'HEALTHY' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-red-500 font-bold'}>{svc.latency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recharts Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-extrabold flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Student Enrollment Trends
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Monthly breakdown of enrolled vs waitlisted students</p>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setTimeframe('2025')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        timeframe === '2025' ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      2025
                    </button>
                    <button
                      onClick={() => setTimeframe('2024')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        timeframe === '2024' ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      2024
                    </button>
                  </div>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trends}>
                      <defs>
                        <linearGradient id="colorEnrolled" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#006666" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#006666" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorWaitlist" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF7F50" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#FF7F50" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '12px',
                        }}
                      />
                      <Area type="monotone" dataKey="enrolled" stroke="#006666" strokeWidth={3} fillOpacity={1} fill="url(#colorEnrolled)" name="Enrolled Students" />
                      <Area type="monotone" dataKey="waitlisted" stroke="#FF7F50" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWaitlist)" name="Waitlisted" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Department Distribution */}
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-lg font-extrabold flex items-center gap-2">
                    <PieIcon className="w-5 h-5 text-coral-500" /> Department Distribution
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Student enrollment proportion</p>
                </div>

                <div className="h-52 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="students"
                        nameKey="department"
                      >
                        {distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {distribution.map((d, i) => (
                    <div key={d.department} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-slate-600 dark:text-slate-300 font-medium">{d.department}</span>
                      </div>
                      <span className="font-mono font-bold text-teal-700 dark:text-teal-400">{d.students}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'telemetry' && (
          <motion.div
            key="telemetry"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Microservices Cluster Health Telemetry
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Detailed metric telemetry for all backend services</p>
              </div>
              {systemHealth.isOnline ? (
                <Badge variant="success">8 / 8 ONLINE ({systemHealth.gatewayLatency})</Badge>
              ) : (
                <Badge variant="danger">0 / 8 ONLINE (BACKEND OFFLINE)</Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {systemHealth.services.map((svc) => (
                <div key={svc.name} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{svc.name}</span>
                    <Badge variant={svc.status === 'HEALTHY' ? 'success' : 'danger'} size="sm">{svc.status}</Badge>
                  </div>
                  <div className="space-y-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <div className="flex justify-between"><span>Port:</span><span className="font-bold text-slate-800 dark:text-slate-200">{svc.port}</span></div>
                    <div className="flex justify-between"><span>Latency:</span><span className={`font-bold ${svc.status === 'HEALTHY' ? 'text-teal-600 dark:text-teal-400' : 'text-red-500'}`}>{svc.latency}</span></div>
                    <div className="flex justify-between"><span>Status:</span><span className={`font-bold ${svc.status === 'HEALTHY' ? 'text-emerald-600' : 'text-red-500'}`}>{svc.status === 'HEALTHY' ? 'Active' : 'Unreachable'}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'audit' && (
          <motion.div
            key="audit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-extrabold flex items-center gap-2">
                <Terminal className="w-5 h-5 text-coral-500" /> System Audit Event Stream
              </h3>
              <span className="text-xs font-mono text-slate-500">Live Gateway Ticker</span>
            </div>

            <div className="space-y-2">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{log.timestamp}</span>
                    <span className="text-teal-400 font-bold">{log.service}</span>
                    <span className="text-slate-300">{log.event}</span>
                  </div>
                  <Badge variant="success" size="sm">{log.status}</Badge>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
