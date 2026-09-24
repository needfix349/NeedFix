import React, { useState, useEffect } from 'react';
import {
  X,
  Wrench,
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Layers,
  MapPin,
  Clock,
} from 'lucide-react';
import { UserProfile, TechnicianProfile } from '../../types';
import { storageService } from '../../services/storage';
import { accountService } from '../../services/accountService';

interface TechnicianPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile, technician: TechnicianProfile) => void;
  onOpenRegistration: () => void;
}

export const TechnicianPortalModal: React.FC<TechnicianPortalModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenRegistration,
}) => {
  const [techMobile, setTechMobile] = useState('');
  const [techPin, setTechPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setTechMobile('');
      setTechPin('');
      setShowPin(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTechnicianLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanMobile = techMobile.replace(/\D/g, '').slice(-10);
    const cleanPin = techPin.trim();

    if (!cleanMobile || cleanMobile.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit registered mobile number.');
      return;
    }
    if (!cleanPin || cleanPin.length !== 4) {
      setErrorMessage('Please enter your 4-digit secret PIN.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await accountService.loginTechnician({
        mobileNumber: cleanMobile,
        pin: cleanPin,
      });

      if (res.success && res.user && res.technician) {
        setSuccessMessage('Partner verified! Opening Dashboard...');
        setTimeout(() => {
          onLoginSuccess(res.user!, res.technician!);
          onClose();
        }, 500);
      } else {
        if (res.isBlocked) {
          storageService.clearSession(true);
          setErrorMessage('Your partner account has been restricted by Admin.');
          window.dispatchEvent(new Event('needfix_security_block'));
          setTimeout(() => {
            onClose();
          }, 600);
        } else {
          setErrorMessage(
            res.message || 'Incorrect mobile number or 4-digit PIN. Please try again or register below.'
          );
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Verification error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRegistration = () => {
    onClose();
    onOpenRegistration();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 transition-all">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Wrench className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                Partner Network
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white mt-1">
                Technician Portal
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Dedicated workspace for verified service providers & workshop owners
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Status Alerts */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-start gap-2.5 text-rose-800 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-2.5 text-emerald-800 text-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          {/* Section 1: Sign in with Mobile & 4-Digit Secret PIN */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Partner Sign In
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Mobile & 4-Digit PIN
              </span>
            </div>

            <form onSubmit={handleTechnicianLogin} className="space-y-3">
              {/* Mobile Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Registered Mobile Number</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-400 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={techMobile}
                    onChange={(e) => setTechMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile"
                    className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium tracking-wide"
                    required
                  />
                </div>
              </div>

              {/* 4-Digit Secret PIN Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>4-Digit Secret PIN</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={4}
                    value={techPin}
                    onChange={(e) => setTechPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="••••"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold tracking-widest"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPin ? 'Hide PIN' : 'Show PIN'}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-slate-900 hover:bg-black active:scale-98 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  'Verifying Credentials...'
                ) : (
                  <>
                    <span>Sign In to Partner Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              OR
            </span>
          </div>

          {/* Section 2: New Technician Registration Card */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-slate-50 border border-blue-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  New to NeedFix Partner Network?
                </h3>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  Register as an Electrician, Plumber, AC Tech, RO Specialist, Mechanic, or Store Owner.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-white/80 border border-slate-200/60 rounded-xl p-2">
                <Layers className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-800 block">List Skills</span>
                <span className="text-[9px] text-slate-500 block">All trades</span>
              </div>
              <div className="bg-white/80 border border-slate-200/60 rounded-xl p-2">
                <MapPin className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-800 block">GPS Radius</span>
                <span className="text-[9px] text-slate-500 block">Local area</span>
              </div>
              <div className="bg-white/80 border border-slate-200/60 rounded-xl p-2">
                <Clock className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-800 block">Direct Calls</span>
                <span className="text-[9px] text-slate-500 block">Zero fee</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartRegistration}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Register as Service Provider</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>NeedFix Verified Partner System</span>
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
