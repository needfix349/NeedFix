import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[NeedFix ErrorBoundary Caught Error]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetAndReload = () => {
    try {
      // Clear temporary cache keys that might be corrupted or oversized
      const keysToClear = [
        'needfix_v9_current_user',
        'needfix_v10_current_user',
        'needfix_cached_client_ip',
        'needfix_auth_token',
        'needfix_session',
      ];
      keysToClear.forEach((k) => {
        try {
          localStorage.removeItem(k);
        } catch {}
      });

      // Also unregister any service worker to clear bad cache
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const reg of registrations) {
            reg.unregister();
          }
        }).catch(() => {});
      }
    } catch {}

    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans selection:bg-blue-600">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              NeedFix App Restored
            </h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              We encountered a temporary display issue. Tap below to reload the app smoothly.
            </p>

            {this.state.error?.message && (
              <div className="mt-4 p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-left overflow-hidden">
                <p className="text-xs font-mono text-red-400 truncate">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleResetAndReload}
                className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-200 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all text-xs cursor-pointer border border-slate-600"
              >
                <Trash2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Clear Cache & Open Fresh</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-6">
              NeedFix Service Network &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
