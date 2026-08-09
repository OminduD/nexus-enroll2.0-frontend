import React, { useState } from 'react';
import { Search, BookOpen, User, ArrowRight } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useNavigate } from 'react-router-dom';
import { MOCK_COURSES } from '../../services/mockData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filteredCourses = query.trim()
    ? MOCK_COURSES.filter(
        (c) =>
          c.courseCode.toLowerCase().includes(query.toLowerCase()) ||
          c.title.toLowerCase().includes(query.toLowerCase())
      )
    : MOCK_COURSES.slice(0, 3);

  const handleSelect = (courseCode: string) => {
    onClose();
    navigate(`/student/courses?search=${courseCode}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Global Nexus Search" maxWidth="lg">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-teal-600" />
          <input
            type="text"
            placeholder="Search courses, codes, programs, or instructors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#333333] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none placeholder:text-slate-400 font-medium"
            autoFocus
          />
        </div>

        <div className="space-y-2 mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
            {query ? 'Search Results' : 'Suggested Courses'}
          </p>

          {filteredCourses.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">No matching courses found.</p>
          ) : (
            filteredCourses.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelect(c.courseCode)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-teal-50/50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#333333] group-hover:text-teal-700">
                      {c.courseCode}: {c.title}
                    </h5>
                    <p className="text-xs text-slate-500">
                      {c.departmentName} • {c.credits} Credits
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

