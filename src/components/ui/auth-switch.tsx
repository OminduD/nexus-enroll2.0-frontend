import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  Sparkles,
  Shield,
  GraduationCap,
  School,
  ArrowRight,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { useToast } from '../../components/ui/Toast';
import { Role } from '../../types/auth';
import { cn } from '../../lib/utils';

export interface AuthSwitchProps {
  initialMode?: 'signin' | 'signup';
  className?: string;
  onModeChange?: (mode: 'signin' | 'signup') => void;
}

export const AuthSwitch: React.FC<AuthSwitchProps> = ({
  initialMode = 'signin',
  className,
  onModeChange,
}) => {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');

  // Sign In Form State
  const [loginIdentifier, setLoginIdentifier] = useState('john_doe');
  const [loginPassword, setLoginPassword] = useState('Password123!');

  // Sign Up Form State (For Student registration only)
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupPassword, setSignupPassword] = useState('Password123!');

  // Common State
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleToggle = () => {
    const nextState = !isSignUp;
    setIsSignUp(nextState);
    setError('');
    if (onModeChange) onModeChange(nextState ? 'signup' : 'signin');
  };

  const handleQuickFill = (presetUsername: string) => {
    setLoginIdentifier(presetUsername);
    setLoginPassword('Password123!');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Automatic role detection from authentication service response
      const response = await authService.login(loginIdentifier, loginPassword);
      login(response.token, {
        id: response.userId,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role,
      });

      showToast(`Welcome back, ${response.firstName}! Logged in as ${response.role}.`, 'success');

      // Direct redirection to the appropriate portal dashboard
      const dest =
        response.role === 'ADMIN'
          ? '/admin/dashboard'
          : response.role === 'FACULTY'
          ? '/faculty/dashboard'
          : '/student/dashboard';

      navigate(dest);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid username or password. Please try again.');
      showToast('Authentication failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Public signup is strictly for Student accounts
      await authService.register({
        username: signupUsername || signupEmail.split('@')[0],
        email: signupEmail,
        password: signupPassword,
        firstName: signupFirstName,
        lastName: signupLastName,
        role: 'STUDENT',
      });

      showToast('Student account created successfully!', 'success');

      const response = await authService.login(signupUsername || signupEmail, signupPassword);
      login(response.token, {
        id: response.userId,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role,
      });

      navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      showToast('Account creation failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('w-full max-w-4xl mx-auto text-[#333333]', className)}>
      {/* Mobile Top Controls Toggle */}
      <div className="md:hidden mb-4 bg-slate-200 p-1 rounded-2xl flex items-center justify-between border border-slate-300">
        <button
          type="button"
          onClick={() => {
            if (isSignUp) handleToggle();
          }}
          className={cn(
            'flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5',
            !isSignUp ? 'bg-[#006666] text-white shadow-md' : 'text-slate-600'
          )}
        >
          <LogIn className="w-4 h-4" /> Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isSignUp) handleToggle();
          }}
          className={cn(
            'flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5',
            isSignUp ? 'bg-[#006666] text-white shadow-md' : 'text-slate-600'
          )}
        >
          <UserPlus className="w-4 h-4" /> Create Student Account
        </button>
      </div>

      {/* Main Split Sliding Auth Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 min-h-[620px] overflow-hidden">

        {/* ==================== SIGN UP FORM PANEL (STUDENT ONLY) ==================== */}
        <div
          className={cn(
            'absolute top-0 left-0 h-full w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-between transition-all duration-700 ease-in-out',
            isSignUp
              ? 'translate-x-0 md:translate-x-full opacity-100 z-20'
              : 'opacity-0 z-0 pointer-events-none md:translate-x-0'
          )}
        >
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-[#333333]">Student Registration</h2>
              <p className="text-xs text-slate-500">Create your student academic account</p>
            </div>

            {/* Public Registration Scope Information Banner */}
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <span className="leading-tight">
                Public registration is for <strong>Student Accounts</strong> only. Faculty and Administrator accounts are provisioned in the Admin Portal.
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-coral-50 border border-coral-200 text-coral-700 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John"
                    value={signupFirstName}
                    onChange={(e) => setSignupFirstName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#006666] focus:ring-4 focus:ring-[#006666]/15 outline-none text-xs text-[#333333]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Doe"
                    value={signupLastName}
                    onChange={(e) => setSignupLastName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#006666] focus:ring-4 focus:ring-[#006666]/15 outline-none text-xs text-[#333333]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Student Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-[#006666]" />
                  <input
                    type="text"
                    required
                    placeholder="john_doe"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#006666] focus:ring-4 focus:ring-[#006666]/15 outline-none text-xs text-[#333333]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Student Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#006666]" />
                  <input
                    type="email"
                    required
                    placeholder="john.doe@nexus.edu"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#006666] focus:ring-4 focus:ring-[#006666]/15 outline-none text-xs text-[#333333]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#006666]" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#006666] focus:ring-4 focus:ring-[#006666]/15 outline-none text-xs text-[#333333]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-[#006666] hover:bg-[#005555] text-white font-extrabold text-xs shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" /> Create Student Account
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ==================== SIGN IN FORM PANEL (DIRECT REDIRECTION) ==================== */}
        <div
          className={cn(
            'absolute top-0 left-0 h-full w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-between transition-all duration-700 ease-in-out z-10',
            isSignUp
              ? 'translate-x-full opacity-0 pointer-events-none'
              : 'translate-x-0 opacity-100 z-10'
          )}
        >
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-[#333333]">Sign In</h2>
              <p className="text-xs text-slate-500">Enter your credentials to enter your portal</p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-coral-50 border border-coral-200 text-coral-700 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Username or Email</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#006666]" />
                  <input
                    type="text"
                    required
                    placeholder="john_doe, prof_smith, or admin_user"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#006666] focus:ring-4 focus:ring-[#006666]/15 outline-none text-xs text-[#333333]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-600">Password</label>
                  <button
                    type="button"
                    onClick={() => showToast('Demo Password: Password123!', 'info')}
                    className="text-[11px] text-[#006666] font-bold hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#006666]" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#006666] focus:ring-4 focus:ring-[#006666]/15 outline-none text-xs text-[#333333]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#006666] hover:bg-[#005555] text-white font-extrabold text-xs shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 mt-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" /> Sign In to Portal
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Demo Account Quick-Fill Selector */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-1 text-xs font-bold text-[#006666]">
              <Sparkles className="w-3.5 h-3.5 text-[#FF7F50]" /> Quick Test Logins:
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('john_doe')}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-400 text-left transition-all flex items-center gap-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                  alt="Student Avatar"
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-teal-500/40"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold leading-none text-[#333333]">Student</p>
                  <span className="text-[9px] text-slate-500 font-mono">john_doe</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('prof_smith')}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-400 text-left transition-all flex items-center gap-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
                  alt="Faculty Avatar"
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-amber-500/40"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold leading-none text-[#333333]">Faculty</p>
                  <span className="text-[9px] text-slate-500 font-mono">prof_smith</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('admin_user')}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-400 text-left transition-all flex items-center gap-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
                  alt="Admin Avatar"
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-rose-500/40"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold leading-none text-[#333333]">Admin</p>
                  <span className="text-[9px] text-slate-500 font-mono">admin_user</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ==================== SLIDING OVERLAY CONTAINER ==================== */}
        <div
          className={cn(
            'hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-30',
            isSignUp ? '-translate-x-full' : 'translate-x-0'
          )}
        >
          <div
            className={cn(
              'bg-gradient-to-br from-[#006666] via-teal-800 to-teal-900 text-white relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out',
              isSignUp ? 'translate-x-1/2' : 'translate-x-0'
            )}
          >
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&q=80"
              alt="Campus"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-25"
            />
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#FF7F50]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

            {/* Left Overlay Content Panel (Shown when in Sign Up mode) */}
            <div
              className={cn(
                'w-1/2 h-full absolute top-0 left-0 flex flex-col justify-between items-center text-center p-10 transform transition-transform duration-700 ease-in-out',
                isSignUp ? 'translate-x-0' : '-translate-x-[20%]'
              )}
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-teal-200">
                  <School className="w-4 h-4 text-[#FF7F50]" /> NexusEnroll Portal
                </div>
              </div>

              <div className="space-y-4 my-auto">
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  Welcome Back!
                </h2>
                <p className="text-xs sm:text-sm text-teal-100 max-w-xs leading-relaxed mx-auto">
                  Sign in with your username & password to enter your portal.
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggle}
                className="px-8 py-3 rounded-2xl bg-transparent border-2 border-white text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-[#006666] transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                Sign In
              </button>
            </div>

            {/* Right Overlay Content Panel (Shown when in Sign In mode) */}
            <div
              className={cn(
                'w-1/2 h-full absolute top-0 right-0 flex flex-col justify-between items-center text-center p-10 transform transition-transform duration-700 ease-in-out',
                isSignUp ? 'translate-x-[20%]' : 'translate-x-0'
              )}
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-teal-200">
                  <School className="w-4 h-4 text-[#FF7F50]" /> NexusEnroll Portal
                </div>
              </div>

              <div className="space-y-4 my-auto">
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  Student Registration
                </h2>
                <p className="text-xs sm:text-sm text-teal-100 max-w-xs leading-relaxed mx-auto">
                  New student? Register your account to access course enrollment and degree tracking.
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggle}
                className="px-8 py-3 rounded-2xl bg-transparent border-2 border-white text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-[#006666] transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                Student Sign Up
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthSwitch;
