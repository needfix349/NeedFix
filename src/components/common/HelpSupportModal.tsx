import React from 'react';
import {
  X,
  Mail,
  HelpCircle,
  AlertTriangle,
  Phone,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { NeedFixAppIcon } from './NeedFixAppIcon';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'customer' | 'technician' | 'admin';
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  isOpen,
  onClose,
  userRole = 'customer',
}) => {
  if (!isOpen) return null;

  const emailHref = 'mailto:needfix349@gmail.com?subject=NeedFix%20Complaint%2FSupport';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in overflow-x-hidden max-w-full">
      <div className="bg-white rounded-3xl max-w-[calc(100vw-1.5rem)] sm:max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col max-h-[90vh] box-border">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NeedFixAppIcon size={34} rounded="rounded-xl" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">
                  NeedFix Support & Complaints
                </h3>
                <span className="text-[10px] bg-red-500/30 text-red-200 border border-red-400/40 px-2 py-0.5 rounded-full font-bold">
                  24/7 Desk
                </span>
              </div>
              <p className="text-xs text-slate-300">
                File a Complaint / Need Help?
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Quick Notice */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
            <ShieldCheck size={20} className="text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-900 text-xs">
                Direct Administrator Resolution for Customers & Technicians
              </p>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Whether you are a customer facing an issue with service quality or a technician needing assistance with account approval, our administration team resolves all requests directly via email.
              </p>
            </div>
          </div>

          {/* Primary One-Touch Direct Email Support Button */}
          <div className="p-4 bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 border border-red-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-red-950 font-bold text-xs uppercase tracking-wider">
              <Mail size={16} className="text-red-600" />
              <span>One-Touch Direct Email Support</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Click the button below to immediately open your native <strong>email client</strong> with our official support address pre-filled:
            </p>

            <a
              href={emailHref}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-red-600/30 transition-all text-center cursor-pointer"
            >
              <Mail size={16} />
              <span>Email Support: needfix349@gmail.com</span>
              <ExternalLink size={13} className="text-red-200 ml-1" />
            </a>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
              <span>Recipient:</span>
              <code className="font-mono font-bold text-red-700 bg-red-100/70 px-2 py-0.5 rounded text-[11px]">
                needfix349@gmail.com
              </code>
            </div>
          </div>

          {/* Common Topics */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Common Reasons to Contact Support
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Service quality dispute or technician behavior issue</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Technician Aadhaar verification or profile rejection query</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Pricing or visiting fee mismatch with rate list</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>General feedback or suggestions for NeedFix</span>
              </div>
            </div>
          </div>

          {/* Resolution Timeline Note */}
          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2">
            <HelpCircle size={14} className="text-slate-400 shrink-0" />
            <span>
              Expected Response Time: NeedFix administrators review and reply to all email inquiries within <strong>12 to 24 hours</strong>.
            </span>
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
