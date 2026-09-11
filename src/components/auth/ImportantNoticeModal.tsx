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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="important-notice-card"
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-amber-200/80 overflow-hidden transform animate-in zoom-in-95 duration-200 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="important-notice-title"
      >
        {/* Top Accent Header Strip */}
        <div className="bg-amber-500 px-6 py-4 flex items-center gap-3 text-white">
          <div className="w-10 h-10 rounded-2xl bg-amber-600/60 flex items-center justify-center text-xl shrink-0 shadow-inner">
            ⚠️
          </div>
          <div className="flex-1">
            <h2
              id="important-notice-title"
              className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2"
            >
              <span>Important Notice / महत्वपूर्ण सूचना</span>
            </h2>
            <p className="text-amber-100 text-xs font-medium">
              Mandatory disclaimer for all customers & service requests
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* English Section */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 relative">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                English
              </span>
            </div>
            <p className="text-slate-800 text-sm sm:text-[15px] leading-relaxed font-medium">
              &ldquo;NeedFix is a platform designed solely to connect customers with local service providers. Please note that any work or service you engage in is entirely at your own risk. Kindly ensure proper supervision and take personal responsibility for the safety, quality, and management of the work being done.&rdquo;
            </p>
          </div>

          {/* Hindi Section */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 relative">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                हिंदी (Hindi)
              </span>
            </div>
            <p className="text-slate-900 text-sm sm:text-[15px] leading-relaxed font-medium">
              &ldquo;NeedFix केवल ग्राहकों (Customers) और काम करने वालों (Technicians) को आपस में जोड़ने का एक माध्यम है। आप ऐप के ज़रिए जो भी काम करवा रहे हैं, उसे पूरी तरह से अपनी देख-रेख और अपनी ज़िम्मेदारी पर करवाएं। किसी भी प्रकार के काम, सुरक्षा या क्वालिटी की ज़िम्मेदारी स्वयं आपकी होगी।&rdquo;
            </p>
          </div>

          {/* Verification Badge info */}
          <div className="flex items-start gap-3 px-1 py-1 text-slate-500 text-xs">
            <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <span>
              By clicking the button below, you confirm that you have read, understood, and agreed to this notice.
            </span>
          </div>
        </div>

        {/* Modal Footer / Action Button */}
        <div className="px-6 pb-6 pt-2 bg-slate-50/50 border-t border-slate-100">
          <button
            type="button"
            id="agree-notice-btn"
            onClick={handleAgreeClick}
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base sm:text-lg rounded-2xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-[0.99] disabled:opacity-50"
          >
            <CheckCircle2 size={22} className="text-emerald-100" />
            <span>I Agree / समझ गया</span>
          </button>
        </div>
      </div>
    </div>
  );
};
