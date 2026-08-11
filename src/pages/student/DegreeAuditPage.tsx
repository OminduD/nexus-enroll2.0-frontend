/**
 * Renders degree progress/requirements tracking for the student. Calls
 * studentService.getProfile (GET /api/students) then getDegreeProgress
 * (GET /api/students/{id}/progress) for completed vs. remaining requirements.
 */
import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Award, BookOpen } from 'lucide-react';
import { studentService } from '../../services/studentService';
import { DegreeProgress } from '../../types/student';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { CardSkeleton } from '../../components/ui/Skeleton';

export const DegreeAuditPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<DegreeProgress | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true);
      try {
        const p = await studentService.getProfile(user?.id || 1);
        const actualStudentId = p?.id || user?.id || 1;
        const data = await studentService.getDegreeProgress(actualStudentId, 1);
        setProgress(data);
      } catch (e) {
        console.warn('Degree audit fallback:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadProgress();
  }, [user]);

  if (isLoading || !progress) {
    return (
      <div className="space-y-6">
        <CardSkeleton className="h-44" />
        <CardSkeleton className="h-64" />
      </div>
    );
  }

  const percentage = Math.round((progress.creditsCompleted / progress.totalRequiredCredits) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
          Degree Audit & Academic Progress
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Track degree requirements, fulfilled core/elective credits, and remaining coursework
        </p>
      </div>

      {/* Program Summary Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 text-[#333333]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="primary">MAJOR DEGREE AUDIT</Badge>
            <h2 className="text-xl sm:text-2xl font-bold text-[#333333]">
              {progress.programName}
            </h2>
            <p className="text-xs text-slate-500">
              Academic Standing: <span className="font-bold text-teal-700">{progress.academicStanding}</span> • GPA: <span className="font-bold text-[#333333]">{progress.gpa}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-3xl font-extrabold text-teal-700">
              {percentage}%
            </span>
            <p className="text-xs text-slate-500 font-semibold">Degree Complete</p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Progress ({progress.creditsCompleted} / {progress.totalRequiredCredits} Credits)</span>
            <span>{progress.totalRequiredCredits - progress.creditsCompleted} Credits Remaining</span>
          </div>
          <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full rounded-full bg-teal-700 transition-all duration-1000 shadow-sm"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Core Requirements */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#333333] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-700" /> Core Requirements
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {progress.coreCreditsCompleted} / {progress.coreCreditsRequired} Credits
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            <div
              className="h-full rounded-full bg-teal-700"
              style={{ width: `${(progress.coreCreditsCompleted / progress.coreCreditsRequired) * 100}%` }}
            />
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fulfilled Courses</p>
            <div className="flex flex-wrap gap-2">
              {progress.fulfilledCourses.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" /> {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Electives & Remaining */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-[#333333]">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#333333] flex items-center gap-2">
              <Award className="w-5 h-5 text-coral-500" /> Electives & Remaining
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {progress.electiveCreditsCompleted} / {progress.electiveCreditsRequired} Credits
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            <div
              className="h-full rounded-full bg-coral-500"
              style={{ width: `${(progress.electiveCreditsCompleted / progress.electiveCreditsRequired) * 100}%` }}
            />
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Remaining Required Courses</p>
            <div className="flex flex-wrap gap-2">
              {progress.remainingCourses.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium"
                >
                  <Circle className="w-3.5 h-3.5 text-slate-400" /> {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

