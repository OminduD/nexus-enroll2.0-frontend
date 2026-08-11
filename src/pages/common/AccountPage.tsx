import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_AVATARS, getUserAvatar, DummyAvatar } from '../../lib/avatars';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import {
  User as UserIcon,
  Check,
  ShieldCheck,
  Mail,
  Smartphone,
  BookOpen,
  Sparkles,
  Lock,
  KeyRound,
  Save,
  Palette,
  Upload,
  Link as LinkIcon,
  Camera,
  Layers,
  Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AccountPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [bio, setBio] = useState('Enthusiastic CS student focused on web development & distributed systems.');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Casual' | 'Professional' | 'Executive' | '3D Vector'>('All');
  const [isSaving, setIsSaving] = useState(false);

  const activeAvatarUrl = getUserAvatar(user);

  const filteredAvatars = categoryFilter === 'All'
    ? DUMMY_AVATARS
    : DUMMY_AVATARS.filter(a => a.category === categoryFilter);

  const handleSelectAvatar = (avatar: DummyAvatar) => {
    updateUser({ avatarUrl: avatar.url });
    showToast(`Selected avatar: ${avatar.name}`, 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size exceeds 5MB limit. Please choose a smaller photo.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateUser({ avatarUrl: dataUrl });
        showToast('Custom photo uploaded successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    updateUser({ avatarUrl: customUrlInput.trim() });
    showToast('Custom avatar URL applied!', 'success');
    setCustomUrlInput('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateUser({ firstName, lastName, email });
      setIsSaving(false);
      showToast('Account profile details saved successfully!', 'success');
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 text-[#333333] dark:text-slate-100 max-w-5xl mx-auto"
    >
      {/* Account Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-950 via-teal-900 to-slate-950 p-6 sm:p-8 text-white shadow-2xl border border-teal-500/30">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-coral-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Active Avatar Preview with Camera Trigger */}
          <div className="relative shrink-0 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img
              src={activeAvatarUrl}
              alt="Account Avatar"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white/20 shadow-2xl group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1">
              <Camera className="w-5 h-5" />
              <span>Change</span>
            </div>
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-teal-500 text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Account Details Overview */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Badge variant={user?.role === 'ADMIN' ? 'danger' : user?.role === 'FACULTY' ? 'warning' : 'primary'}>
                {user?.role} ACCOUNT
              </Badge>
              <span className="text-xs font-mono font-medium text-teal-200/90 bg-white/10 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/15">
                ID: NEX-{user?.id || 1}842
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/90 flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-3.5 h-3.5 text-coral-400" /> {user?.email} • @{user?.username}
            </p>
            <p className="text-xs text-teal-200/80 pt-1">
              Member of Nexus Academic System • Status: <span className="font-bold text-emerald-300">Active Verified</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Realistic Avatar Portfolio & Account Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Realistic Avatar Picker & Upload */}
        <div className="space-y-6">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold flex items-center gap-2">
                  <Palette className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Avatar Selection
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Choose realistic portrait or upload custom photo</p>
              </div>
            </div>

            {/* Custom Photo Upload Trigger */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 rounded-xl bg-teal-50/80 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/70 border border-dashed border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-200 flex items-center justify-center gap-2.5 text-xs font-bold transition-all shadow-2xs group"
            >
              <Upload className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
              <span>Upload Custom Photo</span>
            </button>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
              {(['All', 'Casual', 'Professional', 'Executive', '3D Vector'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    categoryFilter === cat
                      ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Avatars Grid */}
            <div className="grid grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
              {filteredAvatars.map((av) => {
                const isSelected = activeAvatarUrl === av.url;
                return (
                  <button
                    key={av.id}
                    onClick={() => handleSelectAvatar(av)}
                    className={`relative p-2 rounded-xl border text-left transition-all duration-200 group ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/50 shadow-md ring-2 ring-teal-500/40'
                        : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-1.5">
                      <img
                        src={av.url}
                        alt={av.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 p-1 bg-teal-600 text-white rounded-full shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] font-extrabold truncate">{av.name}</p>
                    <span className="text-[9px] font-mono text-slate-400 block truncate">{av.description || av.category}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom URL Input Form */}
            <form onSubmit={handleApplyCustomUrl} className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Or Paste Image URL</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>

          {/* Live UI Mockup Preview Widget */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Layers className="w-4 h-4 text-coral-500" /> UI Mockup Live Preview
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-3 p-2 bg-white dark:bg-slate-900 rounded-lg shadow-2xs border border-slate-200/60 dark:border-slate-700">
                <img src={activeAvatarUrl} alt="Header Avatar Preview" className="w-8 h-8 rounded-xl object-cover ring-2 ring-teal-500/40" />
                <div>
                  <p className="text-xs font-bold">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">Header & Sidebar View</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Personal Information & Security Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-extrabold flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Account Profile Details
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Update your primary personal profile settings</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                      required
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Major / Department</label>
                <div className="relative">
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Account Security Settings */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-coral-500" /> Security & Password Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Password updates and multi-factor security</p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold">Password Status</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Last changed 30 days ago • Strong status</p>
                </div>
                <button
                  onClick={() => showToast('Password reset link sent to your email!', 'info')}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors shrink-0"
                >
                  Reset Password
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-teal-600" /> Two-Factor Verification
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Protects your account with an extra verification code</p>
                </div>
                <Badge variant="success">ENABLED</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
