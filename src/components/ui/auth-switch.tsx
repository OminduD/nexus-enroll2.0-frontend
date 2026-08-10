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
  Info,
  Eye,
  EyeOff,
  Check,
  X,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { useToast } from '../../components/ui/Toast';
import { Role } from '../../types/auth';
import { cn } from '../../lib/utils';
import { ButtonWithIcon } from './button-with-icon';
import { Skeleton } from './Skeleton';

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
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up Form State (For Student registration only)
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  // Password Strength Evaluation Criteria
  const passwordCriteria = {
    minLength: signupPassword.length >= 8,
    hasUpper: /[A-Z]/.test(signupPassword),
    hasLower: /[a-z]/.test(signupPassword),
    hasNumber: /[0-9]/.test(signupPassword),
    hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(signupPassword),
  };

  const passedCount = Object.values(passwordCriteria).filter(Boolean).length;
  const isStrongPassword = passedCount === 5;

  const getStrengthLabel = () => {
    if (passedCount <= 1) return { label: 'Very Weak', color: 'bg-rose-500', text: 'text-rose-600' };
    if (passedCount === 2) return { label: 'Weak', color: 'bg-coral-500', text: 'text-coral-600' };
    if (passedCount === 3) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-600' };
    if (passedCount === 4) return { label: 'Good', color: 'bg-teal-500', text: 'text-teal-600' };
    return { label: 'Strong Password', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

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
    setLoginPassword('');
    setSignupPassword('');
    setSignupConfirmPassword('');
    if (onModeChange) onModeChange(nextState ? 'signup' : 'signin');
  };

  const handleQuickFill = (presetUsername: string) => {
    setLoginIdentifier(presetUsername);
    setLoginPassword('Password123');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Automatic role detection from authentication service response
      const response = await authService.login(loginIdentifier.trim(), loginPassword);
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
      const apiError =
        err.response?.data?.errors && err.response.data.errors.length > 0
          ? err.response.data.errors.join(', ')
          : err.response?.data?.message || 'Invalid username or password. Please try again.';
      setError(apiError);
      showToast(apiError || 'Authentication failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if password fulfills all strong security requirements
    if (!isStrongPassword) {
      const strengthError = 'Password does not satisfy all security requirements (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special symbol).';
      setError(strengthError);
      showToast('Weak password. Please satisfy all requirements.', 'error');
      return;
    }

    // Check if passwords match
    if (signupPassword !== signupConfirmPassword) {
      const matchError = 'Passwords do not match. Please make sure both passwords are identical.';
      setError(matchError);
      showToast('Passwords do not match.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Public signup is strictly for Student accounts
      const response = await authService.register({
        username: (signupUsername || signupEmail.split('@')[0]).trim(),
        email: signupEmail.trim(),
        password: signupPassword,
        firstName: signupFirstName.trim(),
        lastName: signupLastName.trim(),
        role: 'STUDENT',
      });

      // Check if registration returned a valid token directly
      if (response && response.token) {
        showToast('Student account created successfully!', 'success');
        login(response.token, {
          id: response.userId,
          username: response.username || signupUsername,
          email: response.email || signupEmail,
          firstName: response.firstName || signupFirstName,
          lastName: response.lastName || signupLastName,
          role: response.role || 'STUDENT',
        });
        navigate('/student/dashboard');
      } else {
        // Fallback: attempt automatic login with the registered credentials
        try {
          const loginRes = await authService.login(signupUsername || signupEmail, signupPassword);
          showToast('Student account created successfully!', 'success');
          login(loginRes.token, {
            id: loginRes.userId,
            username: loginRes.username || signupUsername,
            email: loginRes.email || signupEmail,
            firstName: loginRes.firstName || signupFirstName,
            lastName: loginRes.lastName || signupLastName,
            role: loginRes.role || 'STUDENT',
          });
          navigate('/student/dashboard');
        } catch {
          // If auto-login fails, switch UI to Sign In mode with credentials filled in so user can sign in manually
          showToast('Account created! Please sign in with your password.', 'info');
          setLoginIdentifier(signupUsername || signupEmail);
          setLoginPassword(signupPassword);
          setIsSignUp(false);
        }
      }
    } catch (err: any) {
      const apiError =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.errors && err.response.data.errors.length > 0
          ? err.response.data.errors.join(', ')
          : err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(apiError);
      showToast(apiError || 'Account creation failed.', 'error');
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
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 min-h-[660px] md:min-h-[700px] overflow-hidden">

        {/* ==================== SIGN UP FORM PANEL (STUDENT ONLY) ==================== */}
        <div
          className={cn(
            'absolute top-0 left-0 h-full w-full md:w-1/2 p-5 sm:p-7 overflow-y-auto max-h-full flex flex-col justify-between transition-all duration-700 ease-in-out',
            isSignUp
              ? 'translate-x-0 md:translate-x-full opacity-100 z-20'
              : 'opacity-0 z-0 pointer-events-none md:translate-x-0'
          )}
        >
          <div className="space-y-3">
            <div className="text-center space-y-0.5">
              <div className="flex justify-center mb-1">
                <img src="/nexuslogo.webp" alt="Nexus Logo" className="w-10 h-10 object-contain drop-shadow-md" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#333333]">Student Registration</h2>
              <p className="text-[11px] text-slate-500">Create your student academic account</p>
            </div>

            {/* Public Registration Scope Information Banner */}
            <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-[11px] flex items-start gap-2">
              <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <span className="leading-tight">
                Public registration is for <strong>Student Accounts</strong> only. Faculty & Admin accounts are provisioned by system admins.
              </span>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-coral-50 border border-coral-200 text-coral-700 text-xs font-semibold text-center space-y-1">
                <div>{error}</div>
                {(error.toLowerCase().includes('email already') ||
                  error.toLowerCase().includes('username already') ||
                  error.toLowerCase().includes('already use')) && (
                  <button
                    type="button"
                    onClick={() => {
                      setLoginIdentifier(signupUsername || signupEmail);
                      if (onModeChange) onModeChange('signin');
                      setIsSignUp(false);
                    }}
                    className="inline-block mt-1 text-[11px] font-extrabold text-[#006666] underline hover:text-[#004444] cursor-pointer"
                  >
                    Account already exists? Click here to Sign In →
                  </button>
                )}
              </div>
            )}

            {isSubmitting ? (
              <div className="space-y-3.5 py-2 animate-pulse">
                <div className="p-3 rounded-2xl bg-teal-50/80 border border-teal-200/80 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-teal-200/80" />
                  <Skeleton className="h-3 w-1/2 bg-teal-200/60" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-9 w-full rounded-xl" />
                  <Skeleton className="h-9 w-full rounded-xl" />
                </div>
                <Skeleton className="h-9 w-full rounded-xl" />
                <Skeleton className="h-9 w-full rounded-xl" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-9 w-full rounded-xl" />
                  <Skeleton className="h-9 w-full rounded-xl" />
                </div>
                <Skeleton className="h-10 w-full rounded-xl bg-teal-800/20" />
                <div className="p-3 rounded-xl bg-[#006666] text-white text-center text-xs font-extrabold flex items-center justify-center gap-2 shadow-md">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Student Account & Generating Profile...
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1 text-[11px]">First Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John"
                      value={signupFirstName}
                      onChange={(e) => setSignupFirstName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#006666] focus:ring-4 focus:ring-[#006666]/15 outline-none text-xs text-[#333333]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1 text-[11px]">Last Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Doe"
                      value={signupLastName}
                      onChange={(e) => setSignupLastName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#006666] focus:ring-4 focus:ring-[#006666]/15 outline-none text-xs text-[#333333]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1 text-[11px]">Student Username</label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-2 w-4 h-4 text-[#006666]" />
                    <input
                      type="text"
                      required
                      placeholder="student1"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#006666] focus:ring-4 focus:ring-[#006666]/15 outline-none text-xs text-[#333333]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1 text-[11px]">Student Email</label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2 w-4 h-4 text-[#006666]" />
                    <input
                      type="email"
                      required
                      placeholder="john.doe@nexus.edu"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#006666] focus:ring-4 focus:ring-[#006666]/15 outline-none text-xs text-[#333333]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1 text-[11px]">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-2.5 top-2 w-4 h-4 text-[#006666]" />
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#006666] focus:ring-4 focus:ring-[#006666]/15 outline-none text-xs text-[#333333]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-2 top-2 text-slate-400 hover:text-[#006666] transition-colors"
                        title={showSignupPassword ? 'Hide password' : 'Show password'}
                      >
                        {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1 text-[11px]">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-2.5 top-2 w-4 h-4 text-[#006666]" />
                      <input
                        type={showSignupConfirmPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        className={cn(
                          'w-full pl-8 pr-8 py-1.5 rounded-xl bg-slate-50 border focus:ring-4 outline-none text-xs text-[#333333] transition-all',
                          signupConfirmPassword && signupPassword !== signupConfirmPassword
                            ? 'border-coral-500 focus:border-coral-500 focus:ring-coral-500/15'
                            : 'border-slate-200 focus:border-[#006666] focus:ring-[#006666]/15'
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                        className="absolute right-2 top-2 text-slate-400 hover:text-[#006666] transition-colors"
                        title={showSignupConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showSignupConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {signupConfirmPassword && signupPassword !== signupConfirmPassword && (
                  <p className="text-[10px] font-semibold text-coral-600 flex items-center gap-1 mt-0.5">
                    <span>⚠️ Passwords do not match</span>
                  </p>
                )}

                {/* Password Strength Meter & Requirements Checklist */}
                {signupPassword && (
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1 text-[10px]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-500">Security Strength:</span>
                      <span className={cn('font-extrabold text-[11px]', getStrengthLabel().text)}>
                        {getStrengthLabel().label}
                      </span>
                    </div>

                    {/* Dynamic Progress Indicator Bar */}
                    <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full transition-all duration-300', getStrengthLabel().color)}
                        style={{ width: `${(passedCount / 5) * 100}%` }}
                      />
                    </div>

                    {/* Requirements Checklist */}
                    <div className="grid grid-cols-2 gap-x-1.5 gap-y-0.5 pt-0.5 text-[9px]">
                      <div className={cn('flex items-center gap-1 font-medium', passwordCriteria.minLength ? 'text-emerald-700 font-bold' : 'text-slate-400')}>
                        {passwordCriteria.minLength ? <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" /> : <X className="w-2.5 h-2.5 text-slate-300 shrink-0" />}
                        <span>8+ Chars</span>
                      </div>

                      <div className={cn('flex items-center gap-1 font-medium', passwordCriteria.hasUpper ? 'text-emerald-700 font-bold' : 'text-slate-400')}>
                        {passwordCriteria.hasUpper ? <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" /> : <X className="w-2.5 h-2.5 text-slate-300 shrink-0" />}
                        <span>Uppercase (A-Z)</span>
                      </div>

                      <div className={cn('flex items-center gap-1 font-medium', passwordCriteria.hasLower ? 'text-emerald-700 font-bold' : 'text-slate-400')}>
                        {passwordCriteria.hasLower ? <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" /> : <X className="w-2.5 h-2.5 text-slate-300 shrink-0" />}
                        <span>Lowercase (a-z)</span>
                      </div>

                      <div className={cn('flex items-center gap-1 font-medium', passwordCriteria.hasNumber ? 'text-emerald-700 font-bold' : 'text-slate-400')}>
                        {passwordCriteria.hasNumber ? <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" /> : <X className="w-2.5 h-2.5 text-slate-300 shrink-0" />}
                        <span>Number (0-9)</span>
                      </div>

                      <div className={cn('flex items-center gap-1 font-medium col-span-2', passwordCriteria.hasSymbol ? 'text-emerald-700 font-bold' : 'text-slate-400')}>
                        {passwordCriteria.hasSymbol ? <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" /> : <X className="w-2.5 h-2.5 text-slate-300 shrink-0" />}
                        <span>Special Symbol (!@#$...)</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#006666] hover:bg-[#005555] text-white font-extrabold text-xs shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" /> Create Student Account
                </button>
              </form>
            )}
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
              <div className="flex justify-center mb-2">
                <img src="/nexuslogo.webp" alt="Nexus Logo" className="w-12 h-12 object-contain drop-shadow-md" />
              </div>
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
                    placeholder="student1, faculty1, or admin"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#006666] focus:ring-4 focus:ring-[#006666]/15 outline-none text-xs text-[#333333]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-600">Password</label>
                  <span className="text-[10px] text-slate-500 font-mono font-semibold bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    Default: <strong className="text-teal-700">Password123</strong>
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#006666]" />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Password123"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#006666] focus:ring-4 focus:ring-[#006666]/15 outline-none text-xs text-[#333333]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-[#006666] transition-colors"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
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
            <div className="flex items-center justify-between text-xs font-bold text-[#006666]">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FF7F50]" /> Quick Test Logins:
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-medium">
                (Auto-fills <strong className="text-teal-700 font-bold">Password123</strong>)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('student1')}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-400 text-left transition-all flex items-center gap-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                  alt="Student Avatar"
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-teal-500/40"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold leading-none text-[#333333]">Student</p>
                  <span className="text-[9px] text-slate-500 font-mono">student1</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('faculty1')}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-400 text-left transition-all flex items-center gap-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
                  alt="Faculty Avatar"
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-amber-500/40"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold leading-none text-[#333333]">Faculty</p>
                  <span className="text-[9px] text-slate-500 font-mono">faculty1</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-400 text-left transition-all flex items-center gap-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
                  alt="Admin Avatar"
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-rose-500/40"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold leading-none text-[#333333]">Admin</p>
                  <span className="text-[9px] text-slate-500 font-mono">admin</span>
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
                  <img src="/nexuslogo.webp" alt="Nexus Logo" className="w-5 h-5 object-contain" /> NexusEnroll Portal
                </div>
              </div>

              <div className="space-y-4 my-auto flex flex-col items-center">
                <img src="/nexuslogo.webp" alt="Nexus Logo" className="w-20 h-20 object-contain drop-shadow-xl mb-2" />
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
                  <img src="/nexuslogo.webp" alt="Nexus Logo" className="w-5 h-5 object-contain" /> NexusEnroll Portal
                </div>
              </div>

              <div className="space-y-4 my-auto flex flex-col items-center">
                <img src="/nexuslogo.webp" alt="Nexus Logo" className="w-20 h-20 object-contain drop-shadow-xl mb-2" />
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
