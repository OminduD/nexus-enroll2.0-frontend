import React from 'react';
import { Link } from 'react-router-dom';
import { AuthSwitch } from '../../components/ui/auth-switch';
import { GradientBackground } from '../../components/ui/jade-sky';
import { BackButton } from '../../components/ui/back-button';

export const LoginPage: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 text-[#333333] overflow-hidden">
      <GradientBackground className="fixed inset-0 pointer-events-none z-0 opacity-90" />
      
      {/* Top Floating Landing Page Button */}
      <div className="fixed top-5 left-5 z-30">
        <Link to="/">
          <BackButton label="Back to Landing Page" />
        </Link>
      </div>

      {/* Main Auth Form Container */}
      <div className="relative z-10 w-full flex justify-center mt-12 sm:mt-0">
        <AuthSwitch initialMode="signin" />
      </div>
    </div>
  );
};

export default LoginPage;
