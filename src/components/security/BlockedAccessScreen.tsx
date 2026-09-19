import React, { useEffect } from 'react';
import { ShieldAlert, Ban, AlertTriangle, Mail, Lock, RefreshCw } from 'lucide-react';
import { DeviceSecurityStatus } from '../../types';

interface BlockedAccessScreenProps {
  status: DeviceSecurityStatus;
  onRefreshCheck?: () => void;
}

export const BlockedAccessScreen: React.FC<BlockedAccessScreenProps> = ({
  status,
  onRefreshCheck,
}) => {
  // Lock body scroll completely while blocked
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPointerEvents = document.body.style.pointerEvents;
    document.body.style.overflow = 'hidden';

    // Intercept any click or touch attempts
    const preventAll = (e: Event) => {
      e.stopPropagation();
    };

    window.addEventListener('contextmenu', preventAll, true);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.pointerEvents = originalPointerEvents;
      window.removeEventListener('contextmenu', preventAll, true);
    };
  }, []);

  const appealSubject = encodeURIComponent(
    `Security Restriction Appeal - Device ID: ${status.deviceId} / IP: ${status.ip}`
  );
  const appealBody = encodeURIComponent(
    `Dear NeedFix Security Team & Admin,\n\nMy access to the NeedFix platform has been suspended with the following details:\n\n- Device ID: ${status.deviceId}\n- IP Address: ${status.ip}\n- Reference ID: ${status.uniqueId || 'N/A'}\n- Ban Reason: ${status.reason || 'Restricted by Admin'}\n- Blocked At: ${status.blockedAt || 'Recent'}\n\nPlease review my appeal to restore access.\n\nThank you.`
  );

  return (
    <div
      id="needfix-security-freeze-overlay"
      className="fixed inset-0 z-[99999] bg-slate-950/98 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto text-white select-none"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-black rounded-3xl border border-red-500/40 max-w-xl w-full p-6 sm:p-8 shadow-[0_0_80px_rgba(239,68,68,0.25)] space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Urgent Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)]" />

        {/* Header Badge */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center text-red-400 shadow-inner">
            <ShieldAlert size={34} className="animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider">
              <Ban size={13} />
              <span>System Access Blocked & Frozen</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Access Restricted
            </h1>
            <p className="text-xs sm:text-sm text-red-300 font-semibold max-w-md mx-auto leading-relaxed">
              Your account/device has been blocked by Admin. Access denied until unblocked.
            </p>
          </div>
        </div>

        {/* Security Parameters Dossier */}
        <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-slate-400">Security Rule Status:</span>
            <span className="text-red-400 font-bold flex items-center gap-1">
              <Lock size={12} /> COMPLETE LOCKDOWN
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-slate-400">Your Real IP Address:</span>
            <span className="text-amber-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {status.ip}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-slate-400">Device Fingerprint ID:</span>
            <span className="text-amber-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {status.deviceId}
            </span>
          </div>

          {status.uniqueId && (
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Account / Unique ID:</span>
              <span className="text-purple-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {status.uniqueId}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-1 pt-1">
            <span className="text-slate-400">Reason for Restriction:</span>
            <div className="bg-red-950/40 border border-red-900/50 text-red-200 rounded-xl p-2.5 text-xs">
              {status.reason || 'Suspicious activity or violation of NeedFix Terms of Service.'}
            </div>
          </div>
        </div>

        {/* Appeal and Resolution Actions */}
        <div className="space-y-2.5 pt-1">
          <a
            href={`mailto:needfix349@gmail.com?subject=${appealSubject}&body=${appealBody}`}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Mail size={16} />
            <span>Appeal Restriction to NeedFix Admin</span>
          </a>

          {onRefreshCheck && (
            <button
              type="button"
              onClick={onRefreshCheck}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Check if Unblocked / Re-verify Access</span>
            </button>
          )}

          <p className="text-[11px] text-center text-slate-500 pt-1">
            NeedFix Helpdesk: <span className="text-slate-400 font-mono">needfix349@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};
