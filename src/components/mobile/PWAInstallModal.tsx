import React from 'react';
import { X, Smartphone, Download, CheckCircle2, Share2, PlusSquare, ArrowRight } from 'lucide-react';
import { NeedFixAppIcon } from '../common/NeedFixAppIcon';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="mb-3">
            <NeedFixAppIcon size={56} rounded="rounded-2xl" className="shadow-lg shadow-blue-950/40 border border-white/20" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
            NeedFix Mobile Application
          </span>
          <h2 className="text-xl font-bold font-display text-white mt-1.5">
            Install NeedFix on Your Phone
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            Fast, zero storage, instant access to 20 verified trade categories.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-slate-800">
          {/* Android Steps */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">Android (Chrome / Browser)</h3>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 pl-8 list-disc">
              <li>Tap the <strong>three dots (⋮)</strong> at the top right of Chrome.</li>
              <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
              <li>NeedFix will appear on your phone like a native app!</li>
            </ul>
          </div>

          {/* iOS Steps */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">iPhone / iOS (Safari)</h3>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 pl-8 list-disc">
              <li>Tap the <strong>Share</strong> button <Share2 size={12} className="inline mx-0.5 text-blue-600" /> at the bottom.</li>
              <li>Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare size={12} className="inline mx-0.5 text-blue-600" />.</li>
              <li>Tap <strong>Add</strong> at top right to complete.</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50/70 p-3 rounded-2xl border border-blue-100">
            <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
            <span>Works 100% offline with instant push notification support for leads & bookings.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs transition-colors shadow-md shadow-blue-600/20"
          >
            Got It, Continue to App
          </button>
        </div>
      </div>
    </div>
  );
};
