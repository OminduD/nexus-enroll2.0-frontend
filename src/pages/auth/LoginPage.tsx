import React from 'react';
import { AuthSwitch } from '../../components/ui/auth-switch';
import { GradientBackground } from '../../components/ui/jade-sky';

export const LoginPage: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 text-[#333333] overflow-hidden">
      <GradientBackground className="fixed inset-0 pointer-events-none z-0 opacity-90" />
      <div className="relative z-10 w-full flex justify-center">
        <AuthSwitch initialMode="signin" />
      </div>
    </div>
  );
};
