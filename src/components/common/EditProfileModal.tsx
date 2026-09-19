import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
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

  useEffect(() => {
    if (isOpen && currentUser) {
      setName(currentUser.name || '');
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

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
        }, 500);
      } else {
        setErrorMessage(res.message || 'Failed to update name.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error updating profile name.');
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div
      id="edit-profile-modal-backdrop"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="edit-profile-modal-dialog"
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 relative">
          <button
            type="button"
            id="edit-profile-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div>
            <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 tracking-tight">
              Edit Display Name
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              @{currentUser.username || 'user'}
            </p>
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

          {/* Clean Editable Name Field */}
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
                placeholder="e.g. Alex"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Your name will be visible to technicians when booking services.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              id="edit-profile-cancel-btn"
              onClick={onClose}
              disabled={isLoading}
              className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer disabled:opacity-50"
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

  if (typeof document !== 'undefined' && document.body) {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
};
