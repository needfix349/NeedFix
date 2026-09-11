import React, { useEffect, useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <aside aria-label="Offline status" className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900/95 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-xs animate-bounce-subtle">
      <WifiOff size={15} className="text-amber-400 shrink-0" />
      <span>Offline Mode — Cached data and verified technicians ready</span>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="ml-1 p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
        title="Check internet connection"
      >
        <RefreshCw size={12} />
      </button>
    </aside>
  );
};
