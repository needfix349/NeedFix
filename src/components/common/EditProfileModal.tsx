import React, { useState, useEffect } from 'react';
import { X, User, Shield, CheckCircle2, AlertCircle, RefreshCw, Copy, Check } from 'lucide-react';
import { UserProfile } from '../../types';
import { accountService } from '../../services/accountService';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUserUpdated?: (updatedUser: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
}) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasCopiedId, setHasCopiedId] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      setName(currentUser.name || '');
      setErrorMessage(null);
      setSuccessMessage(null);
      setHasCopiedId(false);
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleCopyAccountId = () => {
    const idToCopy = currentUser.id;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(idToCopy);
      setHasCopiedId(true);
      setTimeout(() => setHasCopiedId(false), 2500);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanName = name.trim();
    if (!cleanName || cleanName.length < 2) {
      setErrorMessage('Please enter a valid name (at least 2 characters).');
      return;
    }

    setIsLoading(true);
    try {
      const res = await accountService.updateUserName(currentUser.id, cleanName);
      if (res.success && res.user) {
        setSuccessMessage('Name updated successfully!');
        if (onUserUpdated) {
          onUserUpdated(res.user);
        }
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setErrorMessage(res.message || 'Failed to update name.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error updating profile name.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="edit-profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="edit-profile-modal-dialog"
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-5 sm:p-6 text-white relative">
          <button
            type="button"
            id="edit-profile-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shrink-0">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">Edit Profile Details</h2>
              <p className="text-xs text-blue-100">Update your display name while keeping your permanent ID intact</p>
            </div>
          </div>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Editable Full Name Field */}
          <div>
            <label htmlFor="edit-profile-name-input" className="block text-xs font-bold text-slate-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={16} />
              </div>
              <input
                id="edit-profile-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">This name will be displayed across your service bookings and profile.</p>
          </div>

          {/* Read-Only Permanent Username Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">Permanent Username</label>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Shield size={10} className="text-slate-500" />
                Read-Only
              </span>
            </div>
            <div className="px-3.5 py-2.5 bg-slate-100/90 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-700 select-all flex items-center justify-between">
              <span>@{currentUser.username || 'user'}</span>
              <span className="text-[10px] text-slate-400 font-sans font-normal">Permanent ID</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Your username is permanently linked to your account for secure sign-in.</p>
          </div>

          {/* Read-Only Permanent Account ID Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">Permanent Account ID</label>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Shield size={10} className="text-slate-500" />
                Read-Only
              </span>
            </div>
            <div className="px-3.5 py-2.5 bg-slate-100/90 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-600 select-all flex items-center justify-between gap-2 overflow-hidden">
              <span className="truncate">{currentUser.id}</span>
              <button
                type="button"
                id="copy-account-id-btn"
                onClick={handleCopyAccountId}
                className="shrink-0 p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                title="Copy Account ID"
              >
                {hasCopiedId ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              id="edit-profile-cancel-btn"
              onClick={onClose}
              disabled={isLoading}
              className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="edit-profile-save-btn"
              disabled={isLoading || !name.trim() || name.trim() === currentUser.name}
              className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
