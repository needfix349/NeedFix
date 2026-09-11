import React, { useEffect, useState } from 'react';
import { MessageSquare, Copy, Check, X, Sparkles, Shield } from 'lucide-react';
import { otpService, OTPDeliveryEvent } from '../../services/otpService';

interface SMSNotificationToastProps {
  onAutoFill?: (otp: string) => void;
}

export const SMSNotificationToast: React.FC<SMSNotificationToastProps> = ({ onAutoFill }) => {
  const [notification, setNotification] = useState<OTPDeliveryEvent | null>(null);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = otpService.subscribe((event) => {
      setNotification(event);
      setVisible(true);
      setCopied(false);

      // Auto dismiss after 18 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 18000);

      return () => clearTimeout(timer);
    });

    return unsubscribe;
  }, []);

  if (!visible || !notification) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(notification.otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAutoFillClick = () => {
    if (onAutoFill) {
      onAutoFill(notification.otp);
    }
    // Also trigger custom event for any listening OTP inputs
    window.dispatchEvent(new CustomEvent('needfix_autofill_otp', { detail: notification.otp }));
    handleCopy();
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-[calc(100vw-2rem)] bg-slate-900/95 text-white rounded-2xl shadow-2xl border border-slate-700/80 p-4 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
            <MessageSquare size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-wide uppercase text-blue-400">SMS Notification</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-1.5 py-0.2 rounded-full flex items-center gap-0.5 font-medium">
                <Shield size={9} /> NeedFix Gateway
              </span>
            </div>
            <p className="text-[11px] text-slate-400">To: {notification.fullPhone} • {notification.timestamp}</p>
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          title="Dismiss"
        >
          <X size={15} />
        </button>
      </div>

      <div className="mt-3 bg-slate-800/70 rounded-xl p-3 border border-slate-700/50">
        <p className="text-xs text-slate-300 font-mono leading-relaxed">
          &lt;#&gt; Your NeedFix Verification Code is:
        </p>
        <div className="my-2 flex items-center justify-between bg-slate-950/80 border border-blue-500/40 rounded-xl px-3.5 py-2">
          <span className="text-2xl font-extrabold tracking-[0.25em] text-amber-400 font-mono">
            {notification.otp}
          </span>
          <span className="text-[11px] bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-md font-medium">
            Valid 5 min
          </span>
        </div>
        <p className="text-[10px] text-slate-400">
          Do not share this OTP with anyone for your account security.
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={handleAutoFillClick}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
        >
          <Sparkles size={13} className="text-amber-300" />
          <span>Auto-Fill OTP</span>
        </button>
        <button
          onClick={handleCopy}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-2 px-3 rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
