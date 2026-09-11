import React from 'react';
import {
  Mail,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  Phone,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { NeedFixAppIcon } from '../common/NeedFixAppIcon';
import { ALL_INDIAN_STATES } from '../../services/locationService';
import { SERVICE_CATEGORIES } from '../../data/categories';
import { PWAInstallButton } from '../common/PWAInstallButton';

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
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* TOP CALLOUT: File a Complaint / Need Help & Direct Action */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-red-500/20 text-red-300 border border-red-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <HelpCircle size={12} />
                <span>Support & Grievances</span>
              </span>
              <span className="text-slate-400 text-xs">• For Customers & Technicians</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-display">
              File a Complaint / Need Help? (सहायता एवं शिकायत दर्ज करें)
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Facing any issue with a service provider, visiting rates, or technician account verification? Contact NeedFix administrators directly via one-touch email for fast, prioritized resolution.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Direct Email Support Button */}
            <a
              href={emailHref}
              className="py-3 px-5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-95 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 text-center cursor-pointer"
              title="Click to launch your native Email / Gmail app directly"
            >
              <Mail size={16} />
              <span>Email Support (needfix349@gmail.com)</span>
              <ExternalLink size={13} className="text-red-200" />
            </a>

            <button
              type="button"
              onClick={onOpenHelpModal}
              className="py-3 px-4 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-2xl text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <HelpCircle size={15} />
              <span>Helpdesk Guidelines</span>
            </button>
          </div>
        </div>

        {/* 4-COLUMN MAIN FOOTER CONTENT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pt-2">
          {/* Col 1: Brand & Direct Connect Promise */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <NeedFixAppIcon size={32} rounded="rounded-xl" className="shadow-xs" />
              <span className="font-extrabold text-lg text-white font-display">
                Need<span className="text-blue-500">Fix</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-400/30">
                Direct Connect
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              India's direct on-demand doorstep service platform. Customers connect directly with verified technicians through instant Phone Calls and WhatsApp chats with zero middleman booking commissions.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
              <span>100% Aadhaar & National ID Verified</span>
            </div>
            <div className="pt-2">
              <PWAInstallButton variant="compact" />
            </div>
          </div>

          {/* Col 2: Featured Service Categories */}
          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>All 22 Service Categories</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              {SERVICE_CATEGORIES.slice(0, 7).map((cat) => (
                <li key={cat.id} className="hover:text-blue-400 transition-colors flex items-center gap-1">
                  <ChevronRight size={10} className="text-slate-600" />
                  <span>{cat.name}</span>
                </li>
              ))}
              <li className="text-blue-400 font-semibold pt-1 flex items-center gap-1">
                <ChevronRight size={10} />
                <span>+ 15 More Specialized Categories</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform Transparency & Governance */}
          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">
              Platform Transparency
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="text-emerald-400">✓</span>
                <span>Zero Middleman Booking Fees</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="text-emerald-400">✓</span>
                <span>Direct Technician Contact (Call & WhatsApp)</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="text-emerald-400">✓</span>
                <span>Strict 20 km Service Radius Cap</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="text-emerald-400">✓</span>
                <span>Fixed Rate Lists & Visiting Fee Transparency</span>
              </li>
              <li className="pt-1">
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="text-purple-400 hover:text-purple-300 font-bold hover:underline text-left cursor-pointer flex items-center gap-1"
                >
                  <span>🔐 Admin Approval Center & Audit</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenNoticeModal}
                  className="text-amber-400 hover:text-amber-300 font-medium hover:underline text-left cursor-pointer flex items-center gap-1"
                >
                  <AlertTriangle size={12} />
                  <span>Important Notice / महत्वपूर्ण सूचना</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: For Service Providers */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              For Service Providers
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Are you a technician, mechanic, tutor, or logistics driver? Join NeedFix to get direct customer calls and grow your earnings.
            </p>
            <button
              type="button"
              onClick={onOpenTechnicianRegistration}
              className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Briefcase size={14} />
              <span>Register as a Service Provider</span>
            </button>
            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">Official Support:</p>
              <a
                href={emailHref}
                className="text-red-400 hover:text-red-300 hover:underline font-mono text-[11px] block truncate"
              >
                needfix349@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Pan-India 28 States Directory */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>🇮🇳</span>
                <span>Active Across All 28 States of India (भारत के सभी 28 राज्य)</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                NeedFix verified technician network spans every state and major city hub across India.
              </p>
            </div>
            <span className="text-[10px] bg-blue-900/60 text-blue-200 border border-blue-700/50 px-2.5 py-0.5 rounded-full font-semibold w-fit">
              28 States & 8 Union Territories
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 text-[11px]">
            {ALL_INDIAN_STATES.map((st) => (
              <div
                key={st.id}
                className="p-1.5 bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-lg text-slate-300 transition-colors"
              >
                <div className="font-semibold text-slate-200 truncate">
                  <span className="text-slate-500 text-[10px] mr-1">{st.id}.</span>
                  {st.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {st.hindiName} • {st.capital}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 text-center text-slate-400 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-3">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} NeedFix Technologies India.</span>
            <span>•</span>
            <span>Direct Call & WhatsApp Connect</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={emailHref}
              className="text-red-400 hover:text-red-300 hover:underline flex items-center gap-1 font-semibold"
            >
              <Mail size={12} />
              <span>Email Support (needfix349@gmail.com)</span>
            </a>
            <button
              type="button"
              onClick={onOpenNoticeModal}
              className="hover:text-slate-200 transition-colors"
            >
              Notice & Terms
            </button>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
