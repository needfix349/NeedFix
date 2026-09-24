import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Phone,
  Lock,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { storageService } from '../../services/storage';
import { accountService } from '../../services/accountService';

interface UnifiedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: UserProfile, isNewUser: boolean) => void;
  onSuccess?: (user: UserProfile, isNewUser: boolean) => void;
  promptMessage?: string | null;
  initialRole?: 'customer' | 'technician';
  onOpenTechnicianRegistration?: () => void;
}

type CustomerMode = 'login' | 'register';

export const UnifiedAuthModal: React.FC<UnifiedAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSuccess,
  promptMessage,
}) => {
  const [customerMode, setCustomerMode] = useState<CustomerMode>('login');

  // Customer Login Fields
  const [custLoginMobile, setCustLoginMobile] = useState('');
  const [custLoginPin, setCustLoginPin] = useState('');
  const [showLoginPin, setShowLoginPin] = useState(false);

  // Customer Register Fields
  const [custRegName, setCustRegName] = useState('');
  const [custRegMobile, setCustRegMobile] = useState('');
  const [custRegPin, setCustRegPin] = useState('');
  const [showRegPin, setShowRegPin] = useState(false);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setShowLoginPin(false);
      setShowRegPin(false);
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

  // 1. Customer Sign In (Mobile + 4-Digit PIN)
  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanMobile = custLoginMobile.trim().replace(/\D/g, '');
    const cleanPin = custLoginPin.trim();

    if (!cleanMobile || cleanMobile.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!cleanPin || cleanPin.length !== 4) {
      setErrorMessage('Please enter your 4-digit secret PIN.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await accountService.loginCustomer({
        mobileNumber: cleanMobile,
        pin: cleanPin,
      });

      if (res.success && res.user) {
        setSuccessMessage('Sign in successful! Redirecting...');
        setTimeout(() => {
          notifySuccess(res.user!, false);
          onClose();
        }, 500);
      } else {
        if (res.isBlocked) {
          storageService.clearSession(true);
          setErrorMessage('Your account or device has been blocked by Admin. Access denied.');
          window.dispatchEvent(new Event('needfix_security_block'));
          setTimeout(() => {
            onClose();
          }, 600);
        } else {
          setErrorMessage(res.message || 'Sign in failed. Please check your credentials.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Sign in error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Customer Registration (Name + Mobile + 4-Digit PIN)
  const handleCustomerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanName = custRegName.trim();
    const cleanMobile = custRegMobile.trim().replace(/\D/g, '');
    const cleanPin = custRegPin.trim();

    if (!cleanName) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!cleanMobile || cleanMobile.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!cleanPin || !/^\d{4}$/.test(cleanPin)) {
      setErrorMessage('Please set a 4-digit numeric secret PIN (0000-9999).');
      return;
    }

    setIsLoading(true);
    try {
      const res = await accountService.registerCustomer({
        name: cleanName,
        mobileNumber: cleanMobile,
        pin: cleanPin,
      });

      if (res.success && res.user) {
        setSuccessMessage('Account created successfully! Welcome to NeedFix.');
        setTimeout(() => {
          notifySuccess(res.user!, true);
          onClose();
        }, 600);
      } else {
        if (res.isBlocked) {
          storageService.clearSession(true);
          setErrorMessage('Account creation restricted for this device.');
          window.dispatchEvent(new Event('needfix_security_block'));
          setTimeout(() => {
            onClose();
          }, 600);
        } else {
          setErrorMessage(res.message || 'Registration failed.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 transition-all">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Customer Access</h2>
              <p className="text-xs text-blue-100 font-medium">Fast, Zero-Cost & Secure Customer Sign In</p>
            </div>
          </div>

          {promptMessage && (
            <div className="mt-3 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white/95 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-300" />
              <span>{promptMessage}</span>
            </div>
          )}
        </div>

        {/* Sub-Toggle: Sign In vs Sign Up */}
        <div className="p-6 pb-2">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
            <button
              type="button"
              onClick={() => {
                setCustomerMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                customerMode === 'login'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setCustomerMode('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                customerMode === 'register'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Customer? Sign Up
            </button>
          </div>

          {/* Status Alerts */}
          {errorMessage && (
            <div className="mb-4 bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-start gap-2.5 text-rose-800 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-2.5 text-emerald-800 text-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          {/* Customer Sign In Form */}
          {customerMode === 'login' && (
            <form onSubmit={handleCustomerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Registered Mobile Number</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={custLoginMobile}
                    onChange={(e) => setCustLoginMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit mobile"
                    className="w-full pl-12 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>4-Digit Secret PIN</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">0000 - 9999</span>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPin ? 'text' : 'password'}
                    maxLength={4}
                    inputMode="numeric"
                    value={custLoginPin}
                    onChange={(e) => setCustLoginPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 4-digit PIN"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono tracking-widest text-center"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPin(!showLoginPin)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showLoginPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  'Verifying...'
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Customer Sign Up Form */}
          {customerMode === 'register' && (
            <form onSubmit={handleCustomerRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Your Full Name</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={custRegName}
                    onChange={(e) => setCustRegName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Mobile Number (Unique)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={custRegMobile}
                    onChange={(e) => setCustRegMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit mobile"
                    className="w-full pl-12 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Create 4-Digit Secret PIN</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">0000 - 9999</span>
                </div>
                <div className="relative">
                  <input
                    type={showRegPin ? 'text' : 'password'}
                    maxLength={4}
                    inputMode="numeric"
                    value={custRegPin}
                    onChange={(e) => setCustRegPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 5678"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono tracking-widest text-center"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPin(!showRegPin)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showRegPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  'Creating Account...'
                ) : (
                  <>
                    <span>Create Customer Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>NeedFix Customer Portal</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-medium hover:text-slate-800 text-xs cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
