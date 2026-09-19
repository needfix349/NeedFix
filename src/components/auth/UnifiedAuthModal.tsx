import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Lock,
  ArrowRight,
  Shield,
  HelpCircle,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Phone,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { storageService } from '../../services/storage';
import { accountService, STANDARD_SECURITY_QUESTIONS } from '../../services/accountService';

interface UnifiedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: UserProfile, isNewUser: boolean) => void;
  onSuccess?: (user: UserProfile, isNewUser: boolean) => void;
  promptMessage?: string | null;
  initialRole?: 'customer' | 'technician';
}

type AuthTab = 'login' | 'register' | 'recovery_pin' | 'recovery_admin';

export const UnifiedAuthModal: React.FC<UnifiedAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSuccess,
  promptMessage,
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  
  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSecurityPin, setRegSecurityPin] = useState('');
  const [showRegPin, setShowRegPin] = useState(false);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Password Recovery via 4-Digit PIN fields
  const [recUsername, setRecUsername] = useState('');
  const [recPin, setRecPin] = useState('');
  const [showRecPin, setShowRecPin] = useState(false);
  const [recNewPassword, setRecNewPassword] = useState('');
  const [recConfirmPassword, setRecConfirmPassword] = useState('');
  const [showRecPassword, setShowRecPassword] = useState(false);
  const [adminPhone, setAdminPhone] = useState('');

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setShowPassword(false);
      setShowRegPin(false);
      setShowRecPin(false);
      setShowRecPassword(false);
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const notifySuccess = (user: UserProfile, isNewUser: boolean) => {
    if (typeof onLoginSuccess === 'function') {
      onLoginSuccess(user, isNewUser);
    } else if (typeof onSuccess === 'function') {
      onSuccess(user, isNewUser);
    }
  };

  // Handle Login: strictly username + password
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginUsername.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await accountService.loginWithCredentials(loginUsername, loginPassword);
      if (res.success && res.user) {
        notifySuccess(res.user, false);
        onClose();
      } else {
        if (res.isBlocked) {
          storageService.clearSession();
          setErrorMessage("Your account/device has been blocked by Admin. Access denied until unblocked.");
        } else {
          setErrorMessage(res.message || 'Login failed. Please check your credentials.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Registration with required 4-digit numeric PIN
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regUsername.trim() || !regPassword.trim() || !regName.trim()) {
      setErrorMessage('Username, password, and full name are required.');
      return;
    }

    const cleanPin = regSecurityPin.trim();
    if (!cleanPin || !/^\d{4}$/.test(cleanPin)) {
      setErrorMessage('Please set a required 4-digit numeric Security PIN (0000-9999).');
      return;
    }

    setIsLoading(true);
    try {
      const res = await accountService.registerUser({
        username: regUsername,
        password: regPassword,
        securityPin: cleanPin,
        name: regName,
        phone: regPhone,
      });

      if (res.success && res.user) {
        notifySuccess(res.user, true);
        onClose();
      } else {
        if (res.isBlocked) {
          storageService.clearSession();
          setErrorMessage("Your account/device has been blocked by Admin. Access denied until unblocked.");
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

  // Handle 4-Digit PIN Instant Password Recovery (No OTP / No Email / No Admin Required)
  const handleRecoveryPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanUser = recUsername.trim();
    const cleanPin = recPin.trim();

    if (!cleanUser) {
      setErrorMessage('Please enter your account username.');
      return;
    }

    if (!cleanPin || !/^\d{4}$/.test(cleanPin)) {
      setErrorMessage('Please enter your 4-digit numeric Security PIN.');
      return;
    }

    if (!recNewPassword.trim() || recNewPassword.length < 4) {
      setErrorMessage('New password must be at least 4 characters long.');
      return;
    }

    if (recNewPassword !== recConfirmPassword) {
      setErrorMessage('New password and confirm password do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await accountService.recoverPasswordViaPin({
        username: cleanUser,
        pin: cleanPin,
        newPassword: recNewPassword,
      });

      if (res.success && res.user) {
        setSuccessMessage('Password reset successfully! Redirecting to sign in...');
        setTimeout(() => {
          setActiveTab('login');
          setLoginUsername(cleanUser);
          setLoginPassword('');
          setRecPin('');
          setRecNewPassword('');
          setRecConfirmPassword('');
        }, 1500);
      } else {
        if (res.isBlocked) {
          storageService.clearSession();
          setErrorMessage("Your account/device has been blocked by Admin. Access denied until unblocked.");
        } else {
          setErrorMessage(res.message || 'Recovery failed. Verify your PIN or contact Admin.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error recovering password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Admin Verification Request
  const handleAdminResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!recUsername.trim() || !adminPhone.trim()) {
      setErrorMessage('Please enter both your account username and registered phone.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await accountService.submitAdminResetRequest(recUsername, adminPhone);
      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message || 'Failed to submit reset request.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error submitting request to Admin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-x-hidden max-w-full">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md overflow-hidden flex flex-col relative max-h-[92vh] overflow-y-auto box-border">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white font-black text-lg tracking-tight">
              NF
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                {activeTab === 'login' && 'Sign In to NeedFix'}
                {activeTab === 'register' && 'Create NeedFix Account'}
                {activeTab === 'recovery_pin' && 'Reset Password (4-Digit PIN)'}
                {activeTab === 'recovery_admin' && 'Contact Admin for Reset'}
              </h2>
              <p className="text-[11px] sm:text-xs text-blue-100">
                1 Permanent Account ID • Strict Username & Password
              </p>
            </div>
          </div>

          {promptMessage && activeTab === 'login' && (
            <div className="mt-2 p-2.5 bg-amber-400/20 border border-amber-300/40 rounded-xl text-xs text-amber-100 flex items-start gap-2">
              <AlertCircle size={14} className="text-amber-300 shrink-0 mt-0.5" />
              <p className="leading-tight">{promptMessage}</p>
            </div>
          )}
        </div>

        {/* Tab Navigation (Login / Register) */}
        {(activeTab === 'login' || activeTab === 'register') && (
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 text-center transition-colors ${
                activeTab === 'login'
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 text-center transition-colors ${
                activeTab === 'register'
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Registration
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-start gap-2">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value.toLowerCase().trim())}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="e.g. alex_user123"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('recovery_pin')}
                    className="text-[11px] text-blue-600 hover:underline font-bold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !loginUsername.trim() || !loginPassword.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <><span>Sign In</span><ArrowRight size={16} /></>}
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                New to NeedFix?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Create an account
                </button>
              </div>
            </form>
          )}

          {/* TAB: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Choose Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="e.g. alex_user123"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimum 4 characters"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number (Optional - for Admin recovery & bookings)
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Required 4-Digit Security PIN for Instant Recovery */}
              <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                    <Shield size={15} className="text-emerald-600 shrink-0" />
                    <span>4-Digit Secret PIN <span className="text-red-500">*</span></span>
                  </div>
                  <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-bold px-1.5 py-0.5 rounded-md">
                    Instant Recovery
                  </span>
                </div>

                <p className="text-[11px] text-emerald-800 leading-snug">
                  Choose a secret 4-digit numeric PIN (e.g. 5824). If you ever forget your password, you can reset it instantly with just your username and this PIN — no OTP or email required.
                </p>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-700">
                    <KeyRound size={15} />
                  </div>
                  <input
                    type={showRegPin ? 'text' : 'password'}
                    required
                    maxLength={4}
                    inputMode="numeric"
                    pattern="[0-9]{4}"
                    value={regSecurityPin}
                    onChange={(e) => setRegSecurityPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                    placeholder="Enter 4-digit PIN (e.g. 5824)"
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-emerald-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 tracking-widest focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPin(!showRegPin)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    {showRegPin ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <span>Create Account</span>}
              </button>

              <div className="text-center text-xs text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* TAB: 4-DIGIT PIN INSTANT PASSWORD RECOVERY */}
          {activeTab === 'recovery_pin' && (
            <form onSubmit={handleRecoveryPinSubmit} className="space-y-3.5">
              <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-950">
                  <KeyRound size={15} className="text-blue-600 shrink-0" />
                  <span>Instant Password Recovery (4-Digit PIN)</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-snug">
                  No OTP, SMS, or Email needed. Enter your account username and your 4-digit secret PIN to reset your password immediately.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    required
                    value={recUsername}
                    onChange={(e) => setRecUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="e.g. alex_user123"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  4-Digit Secret PIN <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Shield size={15} />
                  </div>
                  <input
                    type={showRecPin ? 'text' : 'password'}
                    required
                    maxLength={4}
                    inputMode="numeric"
                    pattern="[0-9]{4}"
                    value={recPin}
                    onChange={(e) => setRecPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                    placeholder="Enter 4-digit PIN"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 tracking-widest focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRecPin(!showRecPin)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showRecPin ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showRecPassword ? 'text' : 'password'}
                    required
                    value={recNewPassword}
                    onChange={(e) => setRecNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 4 characters)"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRecPassword(!showRecPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showRecPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showRecPassword ? 'text' : 'password'}
                    required
                    value={recConfirmPassword}
                    onChange={(e) => setRecConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !recUsername.trim() || recPin.length !== 4 || !recNewPassword.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <span>Reset Password Instantly</span>}
              </button>

              <div className="pt-2 flex flex-col gap-2 text-center text-xs text-slate-600">
                <button
                  type="button"
                  onClick={() => setActiveTab('recovery_admin')}
                  className="text-amber-700 font-bold hover:underline flex items-center justify-center gap-1 cursor-pointer"
                >
                  <HelpCircle size={13} />
                  <span>Forgot PIN? Contact Admin Desk</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* TAB: ADMIN VERIFICATION RECOVERY */}
          {activeTab === 'recovery_admin' && (
            <form onSubmit={handleAdminResetSubmit} className="space-y-3.5">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <p className="font-bold mb-0.5">Admin Desk Manual Password Verification</p>
                <p className="text-[11px] text-amber-800">
                  Provide your username and registered phone number. The NeedFix Admin team will verify your identity and generate a temporary access key.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={recUsername}
                    onChange={(e) => setRecUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="e.g. alex_user123"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    required
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm shadow-md shadow-amber-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <span>Submit to Admin Desk</span>}
              </button>

              <div className="pt-2 text-center text-xs text-slate-600">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
