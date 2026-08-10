import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { AuthSwitch } from '../../components/ui/auth-switch';
import { GradientBackground } from '../../components/ui/jade-sky';

export const SignupPage: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 text-[#333333] overflow-hidden">
      <GradientBackground className="fixed inset-0 pointer-events-none z-0 opacity-90" />
      
      {/* Top Floating Landing Page Button */}
      <div className="fixed top-5 left-5 z-30">
        <Link
          to="/"
          className="group flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/90 backdrop-blur-xl border border-slate-200/90 text-slate-700 hover:text-teal-700 hover:border-teal-500/50 shadow-lg shadow-slate-900/5 font-semibold text-xs tracking-wider uppercase transition-all hover:-translate-x-1"
        >
          <ArrowLeft className="w-4 h-4 text-teal-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Landing Page</span>
        </Link>
      </div>

      {/* Main Auth Form Container */}
      <div className="relative z-10 w-full flex justify-center mt-12 sm:mt-0">
        <AuthSwitch initialMode="signup" />
      </div>
    </div>
  );
};

export default SignupPage;
