import React, { useEffect, useState } from 'react';
import { Mail, Eye, Search } from 'lucide-react';
import { facultyService } from '../../services/facultyService';
import { courseService } from '../../services/courseService';
import { ClassRosterStudent } from '../../types/faculty';
import { CourseSection } from '../../types/course';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const ClassRosterPage: React.FC = () => {
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<CourseSection | null>(null);
  const [roster, setRoster] = useState<ClassRosterStudent[]>([]);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadSections = async () => {
      const secList = await courseService.getSections();
      setSections(secList);
      if (secList.length > 0) {
        setSelectedSection(secList[0]);
      }
    };
    loadSections();
  }, []);

  const handleOpenRoster = async (sec: CourseSection) => {
    setSelectedSection(sec);
    const r = await facultyService.getRoster(sec.id);
    setRoster(r);
    setIsRosterModalOpen(true);
  };

  const filteredRoster = roster.filter(
    (s) =>
      (s.studentName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (s.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (s.studentIdNumber?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
          Assigned Courses & Class Rosters
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Inspect enrolled student rosters, photos, student numbers, and contact details for your teaching sections
        </p>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map((sec) => (
          <div
            key={sec.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 hover:border-teal-500/50 transition-all flex flex-col justify-between text-[#333333]"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-teal-700 text-sm">
                  {sec.courseCode} ({sec.sectionNumber})
                </span>
                <Badge variant="primary">{sec.semester} {sec.year}</Badge>
              </div>
              <h3 className="font-bold text-base text-[#333333] leading-tight">
                {sec.courseTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {sec.scheduleDays} • {sec.scheduleTime} ({sec.location})
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">
                Students: <span className="text-[#333333] font-bold">{sec.enrolledCount} / {sec.capacity}</span>
              </span>
              <button
                onClick={() => handleOpenRoster(sec)}
                className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> View Roster
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Class Roster Modal */}
      <Modal
        isOpen={isRosterModalOpen}
        onClose={() => setIsRosterModalOpen(false)}
        title={`Class Roster: ${selectedSection?.courseCode} (${selectedSection?.sectionNumber})`}
        maxWidth="xl"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-teal-600" />
            <input
              type="text"
              placeholder="Search student by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none"
            />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {filteredRoster.map((s) => (
              <div
                key={s.enrollmentId}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={s.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.studentName)}&background=006666&color=fff&rounded=true`}
                    alt={s.studentName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0"
                  />
                  <div>
                    <h5 className="font-bold text-[#333333]">{s.studentName}</h5>
                    <p className="text-[11px] font-mono text-slate-500">ID: {s.studentIdNumber} • Major: {s.major}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${s.email}`}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-teal-700 hover:text-white text-slate-600 transition-colors"
                    title={`Email ${s.email}`}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <Badge variant="success">{s.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

