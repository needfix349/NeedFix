import React from 'react';
import {
  Mail,
  HelpCircle,
  Shield,
  Briefcase,
  AlertTriangle,
} from 'lucide-react';
import { NeedFixAppIcon } from '../common/NeedFixAppIcon';

interface FooterProps {
  onOpenHelpModal: () => void;
  onOpenNoticeModal: () => void;
  onOpenAdmin: () => void;
  onOpenTechnicianRegistration: () => void;
  onOpenTechnicianPortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenHelpModal,
  onOpenNoticeModal,
  onOpenAdmin,
  onOpenTechnicianRegistration,
  onOpenTechnicianPortal,
}) => {
  const emailHref = 'mailto:needfix349@gmail.com?subject=NeedFix%20Complaint%2FSupport';

  return (
    <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs mt-auto w-full max-w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-5 w-full">
        {/* COMPACT STANDARD SUPPORT BAR: File a Complaint / Need Help */}
        <div className="py-3.5 px-4 sm:px-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-center gap-4 text-xs">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-slate-800 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
              <HelpCircle size={18} />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">
                File a Complaint / Need Help?
              </div>
              <p className="text-[11px] text-slate-600">
                Direct Official Email:{' '}
                <a
                  href={emailHref}
                  className="text-red-600 hover:text-red-700 font-mono font-semibold underline"
                >
                  needfix349@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 shrink-0">
            <a
              href={emailHref}
              className="py-2 px-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Send email complaint to needfix349@gmail.com"
            >
              <Mail size={13} />
              <span>Email Support</span>
            </a>
            <button
              type="button"
              onClick={onOpenHelpModal}
              className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-300 cursor-pointer"
            >
              Guidelines
            </button>
          </div>
        </div>

        {/* COMPACT BOTTOM BAR */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <NeedFixAppIcon size={20} rounded="rounded-md" />
            <span className="font-bold text-white font-display text-xs">
              Need<span className="text-blue-500">Fix</span>
            </span>
            <span>© {new Date().getFullYear()}</span>
            <span>•</span>
            <span className="text-slate-400">Direct Call & Doorstep Services</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
            <button
              type="button"
              onClick={onOpenTechnicianPortal || onOpenTechnicianRegistration}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Briefcase size={12} />
              <span>Partner / Technician Portal</span>
            </button>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <button
              type="button"
              onClick={onOpenNoticeModal}
              className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
            >
              <AlertTriangle size={11} className="text-amber-400" />
              <span>Important Notice</span>
            </button>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
              title="NeedFix Administrator Login"
            >
              <Shield size={11} />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
