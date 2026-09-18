import React, { useState } from 'react';
import { User, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { UserProfile, UserLocation } from '../../types';
import { DEFAULT_USER_LOCATION } from '../../services/locationService';
import { storageService } from '../../services/storage';

interface OnboardingModalProps {
  user: UserProfile;
  onComplete: (completedUser: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ user, onComplete }) => {
  const [fullName, setFullName] = useState(user.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsSaving(true);

    const updatedUser: UserProfile = {
      ...user,
      name: fullName.trim(),
      location: user.location || DEFAULT_USER_LOCATION,
      role: 'customer', // Default registered as customer
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        fullName
      )}&backgroundColor=0284c7,4f46e5,0d9488`,
    };

    storageService.updateUser(updatedUser);
    storageService.setCurrentUser(updatedUser);
    setIsSaving(false);
    onComplete(updatedUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-x-hidden max-w-full">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md overflow-hidden flex flex-col box-border">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">
              Profile Setup
            </span>
            <span className="text-xs text-blue-100 flex items-center gap-1 font-medium">
              <Sparkles size={12} className="text-amber-300" /> Welcome to NeedFix
            </span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">Enter Your Name</h2>
          <p className="text-xs text-blue-100/90 mt-1">
            Enter your name to connect with verified service technicians instantly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center rounded-2xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-3 focus-within:ring-blue-100 transition-all bg-slate-50/50 px-3.5 py-2.5">
              <User size={18} className="text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="e.g. Alex"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-slate-900 font-medium placeholder:text-slate-400"
                required
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Instant access without password or email barriers.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving || !fullName.trim()}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSaving ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <>
                  <span>Save Profile & Start Exploring</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
