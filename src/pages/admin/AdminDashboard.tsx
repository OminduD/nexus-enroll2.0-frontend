import React, { useEffect, useState } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { Users, GraduationCap, BookOpen, Activity, TrendingUp, PieChart as PieIcon, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { reportService } from '../../services/reportService';
import { EnrollmentTrendItem, DepartmentDistributionItem } from '../../types/report';
import { Badge } from '../../components/ui/Badge';

export const AdminDashboard: React.FC = () => {
  const [trends, setTrends] = useState<EnrollmentTrendItem[]>([]);
  const [distribution, setDistribution] = useState<DepartmentDistributionItem[]>([]);

  useEffect(() => {
    const loadReports = async () => {
      const t = await reportService.getEnrollmentStats();
      const d = await reportService.getDepartmentDistribution();
      setTrends(t);
      setDistribution(d);
    };
    loadReports();
  }, []);

  const COLORS = ['#006666', '#FF7F50', '#339696', '#ff9970', '#333333'];

  return (
    <div className="space-y-6">
      {/* Admin Mesh Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-800 via-teal-700 to-teal-900 p-6 sm:p-8 text-white shadow-lg border border-teal-600/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-coral-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <Badge variant="warning">ENTERPRISE ADMIN PORTAL</Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            System Executive <span className="text-coral-300">Command Center</span> 🛡️
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-2xl leading-relaxed flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-coral-400 shrink-0" />
            Gateway Status: <span className="font-mono font-bold text-white px-2 py-0.5 bg-white/15 rounded-lg border border-white/20">http://localhost:8080 (HEALTHY)</span>
          </p>
        </div>
      </div>

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
          title="System Microservices Health"
          value="99.98%"
          subtitle="All 8 services online"
          icon={Activity}
          trend="API Gateway :8080 Active"
          trendUp={true}
          color="cyan"
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Enrollment Trends Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#333333] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-700" /> Student Enrollment Trends (2025)
              </h3>
              <p className="text-xs text-slate-500">Monthly breakdown of enrolled vs waitlisted students</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
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
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    color: '#333333',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  }}
                />
                <Area type="monotone" dataKey="enrolled" stroke="#006666" strokeWidth={3} fillOpacity={1} fill="url(#colorEnrolled)" name="Enrolled Students" />
                <Area type="monotone" dataKey="waitlisted" stroke="#FF7F50" strokeWidth={2} fillOpacity={1} fill="url(#colorWaitlist)" name="Waitlisted" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recharts Department Distribution Pie Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
          <div>
            <h3 className="text-lg font-bold text-[#333333] flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-coral-500" /> Department Distribution
            </h3>
            <p className="text-xs text-slate-500">Student enrollment by department</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
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
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    color: '#333333',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {distribution.map((d, i) => (
              <div key={d.department} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-600 font-medium">{d.department}</span>
                </div>
                <span className="font-mono font-bold text-teal-700">{d.students}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

