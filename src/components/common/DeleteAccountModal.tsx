import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, KeyRound, Eye, EyeOff, RefreshCw, Trash2 } from 'lucide-react';
import { UserProfile } from '../../types';
import { accountService } from '../../services/accountService';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onAccountDeleted: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAccountDeleted,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !currentUser) return null;

  const handleClose = () => {
    if (isLoading) return;
    setPin('');
    setErrorMessage(null);
    onClose();
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPin = pin.trim();
    if (!/^\d{4}$/.test(cleanPin)) {
      setErrorMessage('Please enter your 4-digit Secret PIN.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await accountService.deleteAccountWithPin(currentUser.id, cleanPin);
      if (res.success) {
        onAccountDeleted();
        handleClose();
      } else {
        setErrorMessage(res.message || 'Verification failed. Incorrect PIN.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error processing account deletion.');
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div
      id="delete-account-modal-backdrop"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={handleClose}
    >
      <div
        id="delete-account-modal-dialog"
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-red-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-red-100 bg-red-50/50 relative">
          <button
            type="button"
            id="delete-account-close-btn"
            onClick={handleClose}
            disabled={isLoading}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white hover:bg-red-100 flex items-center justify-center text-slate-500 hover:text-red-700 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-red-900 tracking-tight">
                Delete Account
              </h2>
              <p className="text-xs text-red-600/90 font-medium mt-0.5">
                Permanent Account Removal
              </p>
            </div>
          </div>
        </div>

        {/* Content Form */}
        <form onSubmit={handleDelete} className="p-5 sm:p-6 space-y-4">
          <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-xl text-xs text-red-800 leading-relaxed">
            <p className="font-bold text-red-900 mb-1">Warning: Irreversible Action</p>
            Are you sure you want to permanently delete your Needfix account? This action cannot be undone. All your profile records, preferences, and active sessions will be terminated immediately.
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-100 border border-rose-300 text-rose-800 rounded-xl text-xs font-semibold flex items-start gap-2 animate-in fade-in">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 text-rose-700" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 4-digit PIN verification */}
          <div className="space-y-1.5">
            <label htmlFor="delete-account-pin-input" className="block text-xs font-bold text-slate-800">
              Enter Your 4-Digit Secret PIN <span className="text-red-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500">
              Verification is required to prevent accidental or unauthorized account deletion.
            </p>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound size={16} />
              </div>
              <input
                id="delete-account-pin-input"
                type={showPin ? 'text' : 'password'}
                required
                maxLength={4}
                inputMode="numeric"
                pattern="[0-9]{4}"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                placeholder="4-digit PIN"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold tracking-widest text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                title={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              id="delete-account-cancel-btn"
              onClick={handleClose}
              disabled={isLoading}
              className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="delete-account-confirm-btn"
              disabled={isLoading || pin.length !== 4}
              className="py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={15} />
                  <span>Permanently Delete</span>
                </>
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
