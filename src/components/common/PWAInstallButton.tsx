import React, { useState } from 'react';
import { Download, Share2, X, Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'button' | 'badge' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already running in standalone PWA mode, hide the install prompt
  if (isInstalled && !justInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setJustInstalled(true);
      setTimeout(() => setJustInstalled(false), 4000);
    }
  };

  if (justInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold animate-fade-in">
        <Check size={14} className="text-emerald-600" />
        <span>NeedFix Installed!</span>
      </span>
    );
  }

  // Chromium / Android / Desktop flow with beforeinstallprompt
  if (isInstallable) {
    if (variant === 'button') {
      return (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition cursor-pointer active:scale-95 ${className}`}
          title="Install NeedFix App for fast offline access"
        >
          <Download size={15} className="animate-bounce" />
          <span>Install NeedFix App</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={handleInstallClick}
        className={`flex items-center gap-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-700 transition cursor-pointer active:scale-95 ${className}`}
        title="Install NeedFix App on your home screen"
      >
        <Download size={13} className="text-blue-600" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300/80 px-3 py-1.5 text-xs font-bold text-slate-700 transition cursor-pointer ${className}`}
          title="Install on iPhone / iPad"
        >
          <Smartphone size={13} className="text-slate-600" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                    NF
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Install NeedFix on iPhone</h3>
                    <p className="text-[11px] text-slate-500">Fast doorstep services directly on your home screen</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>
                    Tap the <strong>Share</strong> icon <Share2 size={13} className="inline text-blue-600 mx-0.5" /> in the Safari toolbar at bottom of your screen.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>
                    Scroll down the sheet and tap <strong>Add to Home Screen</strong>.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>
                    Tap <strong>Add</strong> in the top-right corner to launch NeedFix anytime with zero lag.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                Got It, Thanks
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
