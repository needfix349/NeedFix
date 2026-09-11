import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { storageService } from '../../services/storage';
import { supabaseService } from '../../services/supabaseService';
import { ShieldCheck, User, Wrench, RotateCcw, LogIn, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

interface BypassTestingBarProps {
  currentUser: UserProfile | null;
  onSwitchUser: (user: UserProfile) => void;
  onOpenLoginModal?: () => void;
  onTriggerSampleOTP?: () => void;
  onResetDatabase?: () => void;
}

export const BypassTestingBar: React.FC<BypassTestingBarProps> = ({
  currentUser,
  onSwitchUser,
  onOpenLoginModal,
  onTriggerSampleOTP,
  onResetDatabase,
}) => {
  const handleSelectRole = (role: 'customer' | 'technician' | 'admin') => {
    const user = storageService.loginAsDemoRole(role);
    onSwitchUser(user);
  };

  const handleReset = () => {
    if (confirm('Reset all demo data to initial verified state?')) {
      if (onResetDatabase) {
        onResetDatabase();
      } else {
        storageService.resetToDefaults();
        window.location.reload();
      }
    }
  };

  const isCustomerActive = currentUser?.role === 'customer' && currentUser?.id !== 'google_preview';
  const isTechnicianActive = currentUser?.role === 'technician';
  const isAdminActive = currentUser?.role === 'admin';
  const isGoogleUserActive = Boolean(currentUser?.email?.includes('gmail') || currentUser?.id?.startsWith('google_'));

  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  const handleGoogleQuickLogin = async () => {
    setIsGoogleSigningIn(true);
    try {
      const result = await supabaseService.signInWithGoogle({
        customEmail: 'needfix349@gmail.com',
        customName: 'NeedFix Google Account',
        rolePreference: 'customer',
      });
      if (result.success && result.user) {
        onSwitchUser(result.user);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  return (
    <aside aria-label="Testing and Role Bypass Bar" className="bg-slate-950 text-slate-200 border-b border-slate-800 px-3 py-1.5 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left Badge */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20 text-[11px]">
            <Sparkles size={12} className="text-amber-400" /> Bypass Testing Roles
          </span>
          <span className="text-slate-400 hidden sm:inline text-[11px]">One-click role switcher:</span>
        </div>

        {/* 3 Explicit Testing Roles */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* 1. Customer Profile */}
          <button
            type="button"
            onClick={() => handleSelectRole('customer')}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              isCustomerActive
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60'
            }`}
            title="Switch to Customer Profile (9876543210) - Browse & Book Services"
          >
            <User size={12} className={isCustomerActive ? 'text-white' : 'text-blue-400'} />
            <span className="font-semibold">Customer Profile</span>
            {isCustomerActive && <CheckCircle2 size={11} className="text-blue-200" />}
          </button>

          {/* 2. Verified Technician Profile */}
          <button
            type="button"
            onClick={() => handleSelectRole('technician')}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              isTechnicianActive
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60'
            }`}
            title="Switch to Verified Technician Profile (Amit Kumar - Electrician) - Opens Dashboard, Job Requests & Pricing Manager"
          >
            <Wrench size={12} className={isTechnicianActive ? 'text-white' : 'text-emerald-400'} />
            <span className="font-semibold">Verified Technician Profile</span>
            {isTechnicianActive && <CheckCircle2 size={11} className="text-emerald-200" />}
          </button>

          {/* 3. Admin Profile */}
          <button
            type="button"
            onClick={() => handleSelectRole('admin')}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              isAdminActive
                ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60'
            }`}
            title="Switch to NeedFix Admin Profile (8092805945) - Aadhaar Approvals & Audit"
          >
            <ShieldCheck size={12} className={isAdminActive ? 'text-white' : 'text-purple-400'} />
            <span className="font-semibold">Admin Profile</span>
            {isAdminActive && <CheckCircle2 size={11} className="text-purple-200" />}
          </button>

          {/* 4. Google Sign-In Test (Web SDK v9/v10) */}
          <button
            type="button"
            onClick={handleGoogleQuickLogin}
            disabled={isGoogleSigningIn}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              isGoogleUserActive
                ? 'bg-amber-500 text-slate-950 shadow-sm ring-1 ring-amber-300 font-bold'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60'
            }`}
            title="Authenticate with Google Account (Supabase Auth Google OAuth)"
          >
            {isGoogleSigningIn ? (
              <RefreshCw size={11} className="animate-spin text-amber-300" />
            ) : (
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span className="font-semibold">Google User</span>
            {isGoogleUserActive && <CheckCircle2 size={11} className="text-slate-950" />}
          </button>

          {/* OTP Login Modal Trigger */}
          {onOpenLoginModal && (
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="px-2.5 py-1 rounded-lg font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 border border-slate-700/60 transition-colors ml-1"
              title="Open full OTP Login Dialog"
            >
              <LogIn size={12} className="text-slate-400" />
              <span className="hidden md:inline">OTP Login Modal</span>
            </button>
          )}

          {/* Reset Database */}
          <button
            type="button"
            onClick={handleReset}
            className="px-2 py-1 rounded-lg bg-slate-800/70 hover:bg-red-950/60 hover:text-red-300 text-slate-400 flex items-center gap-1 transition-colors border border-slate-800"
            title="Reset to default mock database"
          >
            <RotateCcw size={11} />
            <span className="hidden lg:inline">Reset Data</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
