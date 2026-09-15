import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ArrowRight,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { UserProfile, UserLocation } from '../../types';
import { storageService } from '../../services/storage';
import { getCurrentGPSLocation, DEFAULT_USER_LOCATION } from '../../services/locationService';

interface UnifiedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: UserProfile, isNewUser: boolean) => void;
  onSuccess?: (user: UserProfile, isNewUser: boolean) => void;
  promptMessage?: string | null;
  initialRole?: 'customer' | 'technician';
}

export const UnifiedAuthModal: React.FC<UnifiedAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSuccess,
  promptMessage,
}) => {
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const storedCustomerName = localStorage.getItem('needfix_customer_custom_name');
      const existingUser = storageService.getCurrentUser();
      if (storedCustomerName) {
        setFullName(storedCustomerName);
      } else if (
        existingUser?.name &&
        existingUser.name !== 'NeedFix Customer' &&
        existingUser.name !== 'Nadeem' &&
        !existingUser.name.includes('Super Admin')
      ) {
        setFullName(existingUser.name);
      } else {
        setFullName('');
      }
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const notifySuccess = (user: UserProfile, isNewUser: boolean) => {
    if (typeof onLoginSuccess === 'function') {
      onLoginSuccess(user, isNewUser);
    } else if (typeof onSuccess === 'function') {
      onSuccess(user, isNewUser);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = fullName.trim();

    if (!cleanName) {
      setErrorMessage('Please enter your full name to proceed.');
      return;
    }

    if (cleanName.length < 2) {
      setErrorMessage('Please enter a valid name (at least 2 characters).');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      localStorage.setItem('needfix_customer_custom_name', cleanName);
      const existingUser = storageService.getCurrentUser();
      const isNew = !existingUser || existingUser.name !== cleanName;

      const userLoc: UserLocation = existingUser?.location || DEFAULT_USER_LOCATION;

      const updatedUser: UserProfile = {
        id: existingUser?.id || `user_cust_${Date.now()}`,
        name: cleanName,
        mobile: existingUser?.mobile || '',
        countryCode: existingUser?.countryCode || '+91',
        email: existingUser?.email || '',
        role: existingUser?.role || 'customer',
        createdAt: existingUser?.createdAt || new Date().toISOString(),
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
        location: userLoc,
        isTechnicianRegistered: existingUser?.isTechnicianRegistered || false,
      };

      storageService.setCurrentUser(updatedUser);

      // Auto-detect GPS silently in the background if not already set
      if (!existingUser?.location) {
        getCurrentGPSLocation()
          .then((loc) => {
            if (loc) {
              const userWithLoc = { ...updatedUser, location: loc };
              storageService.setCurrentUser(userWithLoc);
              window.dispatchEvent(
                new CustomEvent('needfix_gps_updated', { detail: loc })
              );
            }
          })
          .catch((err) => {
            console.warn('Background GPS auto-detect:', err);
          });
      }

      notifySuccess(updatedUser, isNew);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-x-hidden max-w-full">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md overflow-hidden flex flex-col relative max-h-[95vh] overflow-y-auto box-border">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-inner font-black text-xl tracking-tight">
              NF
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">
                Welcome to NeedFix
              </h2>
              <p className="text-xs text-blue-100">
                Verified On-Demand Technicians Near You
              </p>
            </div>
          </div>

          {promptMessage ? (
            <div className="mt-3 p-3 bg-amber-400/20 border border-amber-300/40 rounded-2xl text-xs text-amber-100 flex items-start gap-2.5 backdrop-blur-xs">
              <Sparkles size={15} className="text-amber-300 shrink-0 mt-0.5" />
              <p className="leading-snug font-medium text-white">{promptMessage}</p>
            </div>
          ) : (
            <p className="text-xs text-blue-100/90 leading-relaxed mt-1">
              Enter your name to connect with verified service technicians instantly.
            </p>
          )}
        </div>

        {/* Form Body: ONLY FULL NAME */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="user-full-name-input"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Your Full Name <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  id="user-full-name-input"
                  type="text"
                  required
                  autoFocus
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="e.g., Rahul Sharma or Priya Patel"
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                No passwords or complicated forms needed. Enter your name to start instantly.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !fullName.trim()}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isLoading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <>
                  <span>Enter NeedFix</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
