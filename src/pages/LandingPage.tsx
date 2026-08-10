import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FluidFlowGrid from '../components/ui/fluid-flow-grid';
import {
  GraduationCap,
  BookOpen,
  Users,
  CheckCircle2,
  Zap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Search,
  Award,
  BarChart3,
  Bell,
  Cpu,
  ChevronRight,
  Clock,
  Check
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, badge }) => (
  <div className="group relative p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:shadow-teal-900/10 hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-xl bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shadow-sm">
        {icon}
      </div>
      {badge && (
        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-100/80 text-teal-800 font-semibold border border-teal-200">
          {badge}
        </span>
      )}
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
      {title}
    </h3>
    <p className="text-sm text-slate-600 leading-relaxed">
      {description}
    </p>
  </div>
);

const MOCK_TEASER_COURSES = [
  {
    code: 'CS-101',
    title: 'Introduction to Computer Science',
    dept: 'Computer Science',
    credits: 3,
    capacity: 45,
    enrolled: 42,
    level: 'Undergraduate',
    tags: ['Python', 'Algorithms', 'Core']
  },
  {
    code: 'CS-301',
    title: 'Data Structures and Algorithms',
    dept: 'Computer Science',
    credits: 4,
    capacity: 35,
    enrolled: 35,
    level: 'Undergraduate',
    tags: ['Trees', 'Graphs', 'High Demand']
  },
  {
    code: 'CS-501',
    title: 'Advanced Software Architecture',
    dept: 'Computer Science',
    credits: 3,
    capacity: 30,
    enrolled: 22,
    level: 'Graduate',
    tags: ['Cloud', 'Microservices', 'Architecture']
  },
  {
    code: 'MATH-201',
    title: 'Multivariable Calculus & Linear Algebra',
    dept: 'Mathematics',
    credits: 4,
    capacity: 40,
    enrolled: 31,
    level: 'Undergraduate',
    tags: ['Vectors', 'Matrices', 'STEM Core']
  },
  {
    code: 'PHYS-301',
    title: 'Quantum Mechanics & Modern Physics',
    dept: 'Physics',
    credits: 3,
    capacity: 25,
    enrolled: 18,
    level: 'Undergraduate',
    tags: ['Quantum', 'Wave Equation', 'Lab']
  },
  {
    code: 'BUS-401',
    title: 'Strategic Corporate Management',
    dept: 'Business',
    credits: 3,
    capacity: 50,
    enrolled: 46,
    level: 'Undergraduate',
    tags: ['Strategy', 'Leadership', 'Case Studies']
  }
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'student' | 'faculty' | 'admin'>('student');

  const filteredCourses = MOCK_TEASER_COURSES.filter((course) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      (selectedCategory === 'CS' && course.code.startsWith('CS')) ||
      (selectedCategory === 'MATH' && course.code.startsWith('MATH')) ||
      (selectedCategory === 'GRAD' && course.level === 'Graduate');

    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.dept.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Top Floating Glass Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-white/85 backdrop-blur-xl border-b border-slate-200/90 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-500 p-0.5 shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-teal-600" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                NEXUS<span className="text-coral-500 font-mono">.ENROLL</span>
              </span>
              <span className="block text-[10px] font-mono tracking-widest text-slate-500 uppercase leading-none">
                Academic Portal v2.0
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-teal-700 transition-colors">
              Features
            </a>
            <a href="#catalog-preview" className="hover:text-teal-700 transition-colors">
              Course Catalog
            </a>
            <a href="#workflows" className="hover:text-teal-700 transition-colors">
              Role Workflows
            </a>
            <a href="#metrics" className="hover:text-teal-700 transition-colors">
              Live Stats
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-teal-700 transition-colors"
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Modern Futuristic Campus Wallpaper & Full-Height Vector Animation */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Breathtaking High-Tech University Campus Wallpaper */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=2400"
            alt="Futuristic University Campus Architecture"
            className="w-full h-full object-cover object-center"
          />
          {/* Soft White Glass Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/75 to-slate-50 backdrop-blur-[1.5px]" />

          {/* Full Hero Transparent Fluid Vector Flow Canvas */}
          <div className="absolute inset-0 w-full h-full opacity-90">
            <FluidFlowGrid forceLightMode={true} transparentBackground={true} showDefaultOverlay={false} />
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-10">
          {/* Pulsing Academic Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/90 border border-teal-300 shadow-md mb-6 animate-pulse">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-mono font-bold tracking-wide text-teal-900 uppercase">
              NEXT-GEN ACADEMIC ENROLLMENT ENGINE
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 leading-tight drop-shadow-sm">
            SMART REGISTRATION & <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-800 via-teal-600 to-teal-900">
              ACADEMIC DISCOVERY
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed font-normal">
            Empowering university students, faculty, and administrators with automated degree auditing, instant prerequisite validation, and real-time class schedule management.
          </p>

          {/* Search Bar Teaser */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center rounded-2xl bg-white/95 border border-slate-300 p-2 shadow-2xl shadow-slate-900/10 backdrop-blur-xl focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-500/15 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 mr-2" />
              <input
                type="text"
                placeholder="Search course code, title, or department (e.g. CS-301, Data Structures)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none py-2"
              />
              <button
                onClick={() => {
                  const el = document.getElementById('catalog-preview');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs tracking-wider uppercase shadow-md transition-all shrink-0 ml-2"
              >
                Search
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-700">
              <span className="font-mono text-slate-500">Popular:</span>
              <button
                onClick={() => setSearchQuery('CS-301')}
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 shadow-sm transition-colors"
              >
                CS-301 Data Structures
              </button>
              <button
                onClick={() => setSearchQuery('MATH')}
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 shadow-sm transition-colors"
              >
                MATH Courses
              </button>
              <button
                onClick={() => setSearchQuery('Graduate')}
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 shadow-sm transition-colors"
              >
                Graduate Programs
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xl shadow-teal-600/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Enter Portal</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
            <a
              href="#catalog-preview"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 shadow-md transition-all hover:scale-105 flex items-center justify-center space-x-2"
            >
              <BookOpen className="w-5 h-5 text-teal-600" />
              <span>Explore Course Teaser</span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-slate-300/80 flex flex-wrap justify-center items-center gap-8 text-xs font-mono text-slate-700 font-medium">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Real-Time Seat Reservation</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Role-Based Access Governance</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Instant Degree Audit</span>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics & Ticker Section */}
      <section id="metrics" className="py-12 bg-white border-y border-slate-200/90 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-3xl sm:text-4xl font-black text-teal-700 font-mono mb-1">
              1,250+
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-600 font-mono font-medium">
              Active Cataloged Courses
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-3xl sm:text-4xl font-black text-teal-700 font-mono mb-1">
              14,800+
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-600 font-mono font-medium">
              Registered Students
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-3xl sm:text-4xl font-black text-teal-700 font-mono mb-1">
              &lt; 50ms
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-600 font-mono font-medium">
              Prerequisite Validation
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-3xl sm:text-4xl font-black text-teal-700 font-mono mb-1">
              99.98%
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-600 font-mono font-medium">
              Approval Reliability
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-teal-700 uppercase font-bold">
            // COMPREHENSIVE ACADEMIC SUITE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mt-3">
            Engineered for Modern Universities
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Everything needed for intuitive course registration, degree requirement auditing, and faculty grade management in one unified platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BookOpen className="w-6 h-6" />}
            title="Smart Course Registration"
            description="Browse real-time seat availability, lecture section schedules, and prerequisite validation with automated waitlists."
            badge="Real-Time"
          />
          <FeatureCard
            icon={<Award className="w-6 h-6" />}
            title="Interactive Degree Audit"
            description="Track major program requirements, elective distribution, and target GPA meters with visual progress rings."
            badge="Automated"
          />
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Faculty Grade Management"
            description="Streamlined grade submission workflow, roster management, and grade change request approval queues."
            badge="Faculty Hub"
          />
          <FeatureCard
            icon={<Clock className="w-6 h-6" />}
            title="Conflict-Free Timetable Builder"
            description="Intelligent schedule matrix alerting students to overlapping lecture, discussion, and lab time slots."
            badge="Intelligent"
          />
          <FeatureCard
            icon={<Bell className="w-6 h-6" />}
            title="Broadcasting & Alerts"
            description="Instant university notifications for deadline updates, schedule changes, and administrative announcements."
            badge="Instant"
          />
          <FeatureCard
            icon={<ShieldCheck className="w-6 h-6" />}
            title="Enterprise Governance"
            description="Strict role-based authorization for Students, Instructors, and System Administrators with full audit logs."
            badge="Secure"
          />
        </div>
      </section>

      {/* Interactive Course Catalog Teaser */}
      <section id="catalog-preview" className="py-20 bg-white border-t border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-mono tracking-widest text-teal-700 uppercase font-bold">
                // EXPLORE CATALOG TEASER
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2">
                Featured University Courses
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Preview active offerings and live capacity meters across departments.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              {[
                { id: 'ALL', label: 'All Courses' },
                { id: 'CS', label: 'Computer Science' },
                { id: 'MATH', label: 'Mathematics' },
                { id: 'GRAD', label: 'Graduate Level' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                    selectedCategory === tab.id
                      ? 'bg-teal-600 text-white shadow-md font-bold'
                      : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.code}
                className="group p-6 rounded-2xl bg-slate-50/90 border border-slate-200 hover:border-teal-500/60 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-teal-700 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200">
                    {course.code}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {course.credits} Credits
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                  {course.title}
                </h4>

                <p className="text-xs text-slate-500 mt-1">{course.dept}</p>

                {/* Capacity Meter */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-mono text-slate-600 mb-1">
                    <span>Enrolled Seats</span>
                    <span className={course.enrolled >= course.capacity ? 'text-coral-600 font-bold' : 'text-slate-700'}>
                      {course.enrolled} / {course.capacity}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        course.enrolled >= course.capacity
                          ? 'bg-coral-500'
                          : 'bg-teal-600'
                      }`}
                      style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{course.level}</span>
                  <Link
                    to="/login"
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center space-x-1"
                  >
                    <span>Register</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Workflows Showcase (Tabs for Student, Faculty, Admin) */}
      <section id="workflows" className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-teal-700 uppercase font-bold">
            // TAILORED WORKFLOWS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mt-2">
            Built for Every Role
          </h2>
          <p className="mt-3 text-slate-600">
            Customized tools and dashboards designed specifically for Students, Instructors, and Administrators.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'student'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Portal</span>
            </button>
            <button
              onClick={() => setActiveTab('faculty')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'faculty'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Faculty Portal</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'admin'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Administrator Portal</span>
            </button>
          </div>
        </div>

        {/* Active Tab Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-teal-700 font-bold">
              {activeTab === 'student' && '// STUDENT EXPERIENCE'}
              {activeTab === 'faculty' && '// INSTRUCTOR EXPERIENCE'}
              {activeTab === 'admin' && '// SYSTEM GOVERNANCE'}
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-2">
              {activeTab === 'student' && 'Streamlined Course Registration & Degree Audit'}
              {activeTab === 'faculty' && 'Effortless Class Rosters & Grade Approval'}
              {activeTab === 'admin' && 'Centralized System Oversight & Reporting'}
            </h3>
            <p className="text-slate-600 mt-4 leading-relaxed">
              {activeTab === 'student' &&
                'Students can search open course sections, resolve prerequisite conflicts, track degree progression, and submit schedule add/drop requests.'}
              {activeTab === 'faculty' &&
                'Instructors access live class rosters, manage grade submissions with administrative sign-off, and process schedule override requests with single-click ease.'}
              {activeTab === 'admin' &&
                'University registrars can configure course catalogs, review system enrollment analytics, broadcast campus announcements, and manage user roles.'}
            </p>

            <ul className="mt-6 space-y-3">
              {(activeTab === 'student'
                ? [
                    'Interactive weekly timetable builder',
                    'Real-time prerequisite validation engine',
                    'Degree requirement progress indicators',
                    'Instant notifications on waitlist updates'
                  ]
                : activeTab === 'faculty'
                ? [
                    'Live roster search and student list exports',
                    'Secure final grade submission & history',
                    'Course schedule override request queue',
                    'Academic progress feedback monitoring'
                  ]
                : [
                    'Full university catalog & section manager',
                    'Grade approval queue and audit log history',
                    'User directory and role permissions',
                    'System-wide announcement broadcasting'
                  ]
              ).map((item, idx) => (
                <li key={idx} className="flex items-center space-x-3 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md transition-all hover:scale-105"
              >
                <span>Log in as {activeTab.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl group">
            <img
              src={
                activeTab === 'student'
                  ? 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800'
                  : activeTab === 'faculty'
                  ? 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800'
                  : 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800'
              }
              alt="Workflow Showcase"
              className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-lg">
              <div className="flex items-center justify-between text-xs font-mono text-slate-800">
                <span className="text-teal-700 font-bold">NEXUS.ENROLL SYSTEM LIVE</span>
                <span className="text-emerald-600 font-semibold">● ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="relative rounded-3xl p-10 sm:p-16 bg-gradient-to-r from-teal-700 via-teal-600 to-teal-800 text-white shadow-2xl overflow-hidden text-center">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Ready to Upgrade Your Academic Experience?
            </h2>
            <p className="mt-4 text-teal-100 text-base sm:text-lg font-light">
              Join thousands of university students and faculty members using Nexus-Enroll 2.0.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/signup"
                className="px-8 py-4 rounded-xl font-bold bg-white text-teal-900 hover:bg-slate-100 shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 rounded-xl font-semibold bg-teal-800/80 border border-teal-400/40 text-white hover:bg-teal-800 transition-all hover:scale-105"
              >
                Sign In to Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
              N
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm">Nexus-Enroll 2.0</span>
              <p className="text-slate-500">Academic Registration & Management Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <a href="#features" className="hover:text-teal-700 transition-colors">
              Features
            </a>
            <a href="#catalog-preview" className="hover:text-teal-700 transition-colors">
              Catalog
            </a>
            <a href="#workflows" className="hover:text-teal-700 transition-colors">
              Workflows
            </a>
            <Link to="/login" className="hover:text-teal-700 transition-colors">
              Portal Sign In
            </Link>
          </div>

          <div className="flex items-center space-x-2 text-slate-500 font-mono">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
