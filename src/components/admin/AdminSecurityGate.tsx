import React, { useState } from 'react';
import {
  ShieldAlert,
  KeyRound,
  Mail,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Cpu,
  Activity,
  AlertTriangle,
  Layers,
} from 'lucide-react';

interface AdminSecurityGateProps {
  onAuthenticated: () => void;
  onGoToDashboard: () => void;
  onGoToLanding: () => void;
}

export const AdminSecurityGate: React.FC<AdminSecurityGateProps> = ({
  onAuthenticated,
  onGoToDashboard,
  onGoToLanding,
}) => {
  const [email, setEmail] = useState('admin@operateai.system');
  const [accessKey, setAccessKey] = useState('operate-admin-2026');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), accessKey: accessKey.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid SuperAdmin security credentials.');
      } else {
        sessionStorage.setItem('operateai_admin_token', data.token);
        onAuthenticated();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate admin session.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickMasterBypass = () => {
    sessionStorage.setItem('operateai_admin_token', 'adm_master_session');
    onAuthenticated();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-rose-500/30 selection:text-rose-200">
      {/* Top Banner */}
      <header className="h-16 border-b border-rose-950/60 bg-slate-950/80 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-wider uppercase">
              Isolated Platform Command Center
            </div>
            <div className="text-[10px] text-rose-400">Restricted SuperAdmin Access Level 0</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Client Workspace</span>
          </button>
          <button
            onClick={onGoToLanding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </button>
        </div>
      </header>

      {/* Main Security Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-rose-600/10 border border-rose-500/30 items-center justify-center text-rose-400 shadow-2xl shadow-rose-950 mb-2">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              <span>SuperAdmin Gate</span>
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              This terminal controls system-wide Gemini AI models, multi-tenant businesses, global activity streams, and platform revenue.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-rose-400">
                <Cpu className="w-3.5 h-3.5" />
                Administrative Scope
              </span>
              <span className="text-[10px] text-slate-400 font-mono">ROOT_LEVEL_CONTROL</span>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1.5">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Gemini LLM Parameters, Prompts & Workbench Testing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                Global Activities Stream across all tenant businesses
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Multi-Tenant Oversight & Account Suspension Controls
              </li>
            </ul>
          </div>

          <form
            onSubmit={handleAdminLogin}
            className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-rose-900/30 shadow-2xl shadow-rose-950/20 space-y-4"
          >
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Staff Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@operateai.system"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Master Security Key
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Verifying Cryptographic Credentials...</span>
              ) : (
                <>
                  <span>Unlock Admin Command Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Quick Demo Bypass for Developer convenience */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleQuickMasterBypass}
                className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-rose-400" />
                <span>Instant Developer SuperAdmin Unlock</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="py-4 border-t border-slate-900 px-6 sm:px-12 text-center text-[11px] text-slate-400">
        SuperAdmin Terminal Session · Confidential Platform Operations · OperateAI Core 2026
      </footer>
    </div>
  );
};
