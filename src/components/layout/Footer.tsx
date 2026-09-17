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
}

export const Footer: React.FC<FooterProps> = ({
  onOpenHelpModal,
  onOpenNoticeModal,
  onOpenAdmin,
  onOpenTechnicianRegistration,
}) => {
  const emailHref = 'mailto:needfix349@gmail.com?subject=NeedFix%20Complaint%2FSupport';

  return (
    <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs mt-auto w-full max-w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-5 w-full">
        {/* COMPACT STANDARD SUPPORT BAR: File a Complaint / Need Help */}
        <div className="py-3 px-4 sm:px-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-3 text-slate-200">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
              <HelpCircle size={16} />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">
                File a Complaint / Need Help? (सहायता एवं शिकायत दर्ज करें)
              </div>
              <p className="text-[11px] text-slate-400">
                Direct Official Email:{' '}
                <a
                  href={emailHref}
                  className="text-red-300 hover:text-red-200 font-mono font-semibold underline"
                >
                  needfix349@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
            <a
              href={emailHref}
              className="py-2 px-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Send email complaint to needfix349@gmail.com"
            >
              <Mail size={13} />
              <span>Email Support</span>
            </a>
            <button
              type="button"
              onClick={onOpenHelpModal}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-xl text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
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
              onClick={onOpenTechnicianRegistration}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Briefcase size={12} />
              <span>Technician Join</span>
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
