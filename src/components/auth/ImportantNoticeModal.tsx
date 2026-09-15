import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ImportantNoticeModalProps {
  isOpen: boolean;
  onAgree: () => void;
  userName?: string;
}

export const ImportantNoticeModal: React.FC<ImportantNoticeModalProps> = ({
  isOpen,
  onAgree,
  userName,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAgreeClick = () => {
    setIsSubmitting(true);
    try {
      onAgree();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="important-notice-overlay"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-x-hidden max-w-full"
    >
      <div
        id="important-notice-card"
        className="bg-white w-full max-w-[calc(100vw-1.5rem)] sm:max-w-[420px] rounded-2xl shadow-xl border border-amber-200/90 overflow-hidden transform animate-in zoom-in-95 duration-200 flex flex-col box-border"
        role="dialog"
        aria-modal="true"
        aria-labelledby="important-notice-title"
      >
        {/* Compact Accent Header Strip */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 flex items-center gap-2.5 text-white">
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-sm shrink-0 shadow-xs">
            ⚠️
          </div>
          <div className="flex-1 min-w-0">
            <h2
              id="important-notice-title"
              className="text-xs sm:text-sm font-bold text-white tracking-tight truncate"
            >
              Important Notice / महत्वपूर्ण सूचना
            </h2>
            <p className="text-amber-100 text-[10px] font-normal truncate">
              {userName ? `Mandatory disclaimer for ${userName}` : 'Mandatory disclaimer for all customers & services'}
            </p>
          </div>
        </div>

        {/* Modal Body - Tighter padding and slightly smaller text */}
        <div className="p-3.5 sm:p-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {/* English Section */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 sm:p-3 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                English
              </span>
            </div>
            <p className="text-slate-700 text-xs sm:text-[12.5px] leading-relaxed font-normal">
              {userName && (
                <span className="font-bold text-slate-900 block mb-0.5">
                  Namaste {userName},
                </span>
              )}
              &ldquo;NeedFix is a platform designed solely to connect customers with local service providers. Please note that any work or service you engage in is entirely at your own risk. Kindly ensure proper supervision and take personal responsibility for the safety, quality, and management of the work being done.&rdquo;
            </p>
          </div>

          {/* Hindi Section */}
          <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-2.5 sm:p-3 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                हिंदी (Hindi)
              </span>
            </div>
            <p className="text-slate-800 text-xs sm:text-[12.5px] leading-relaxed font-normal">
              {userName && (
                <span className="font-bold text-slate-900 block mb-0.5">
                  नमस्ते {userName},
                </span>
              )}
              &ldquo;NeedFix केवल ग्राहकों (Customers) और काम करने वालों (Technicians) को आपस में जोड़ने का एक माध्यम है। आप ऐप के ज़रिए जो भी काम करवा रहे हैं, उसे पूरी तरह से अपनी देख-रेख और अपनी ज़िम्मेदारी पर करवाएं। किसी भी प्रकार के काम, सुरक्षा या क्वालिटी की ज़िम्मेदारी स्वयं आपकी होगी।&rdquo;
            </p>
          </div>

          {/* Verification info */}
          <div className="flex items-center gap-1.5 px-0.5 text-slate-500 text-[10px]">
            <ShieldAlert size={13} className="text-amber-600 shrink-0" />
            <span>
              By proceeding, you confirm personal supervision of all requested services.
            </span>
          </div>
        </div>

        {/* Modal Footer / Compact Action Button */}
        <div className="p-3 sm:p-3.5 bg-slate-50/80 border-t border-slate-100">
          <button
            type="button"
            id="agree-notice-btn"
            onClick={handleAgreeClick}
            disabled={isSubmitting}
            className="w-full py-2.5 sm:py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            <CheckCircle2 size={16} className="text-emerald-100" />
            <span>I Agree / समझ गया</span>
          </button>
        </div>
      </div>
    </div>
  );
};
