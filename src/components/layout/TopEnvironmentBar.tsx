import React from 'react';
import { Globe, Lock, LayoutDashboard, Shield, Bot } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.tsx';

export type AppEnvironment = 'landing' | 'login' | 'dashboard' | 'admin';

interface TopEnvironmentBarProps {
  currentEnv: AppEnvironment;
  onChangeEnv: (env: AppEnvironment) => void;
  onOpenLiveTest: () => void;
}

export const TopEnvironmentBar: React.FC<TopEnvironmentBarProps> = ({
  currentEnv,
  onChangeEnv,
  onOpenLiveTest,
}) => {
  return (
    <div className="bg-white/95 dark:bg-slate-900 border-b border-rose-100/80 dark:border-indigo-500/20 text-xs px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 z-50 sticky top-0 shadow-xs backdrop-blur-md transition-colors duration-200">
      {/* Left indicator */}
      <div className="flex items-center gap-2.5">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 dark:bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 dark:bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          OperateAI Preview Navigator:
        </span>
        <span className="hidden md:inline text-[11px] font-medium text-slate-600 dark:text-slate-300">
          Instant view switcher
        </span>
      </div>

      {/* Center 4-Pill View Selector */}
      <div className="flex items-center gap-1 bg-rose-50/80 dark:bg-slate-950 p-1 rounded-xl border border-rose-200/80 dark:border-slate-800 shadow-xs transition-colors">
        <button
          onClick={() => onChangeEnv('landing')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold text-[11px] transition-all ${
            currentEnv === 'landing'
              ? 'bg-rose-600 text-white shadow-sm shadow-rose-200 dark:shadow-none dark:bg-indigo-600'
              : 'text-slate-700 hover:text-slate-950 hover:bg-white/90 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-850'
          }`}
          title="View Public Marketing Landing Page"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>1. Landing Page</span>
        </button>

        <button
          onClick={() => onChangeEnv('login')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold text-[11px] transition-all ${
            currentEnv === 'login'
              ? 'bg-rose-600 text-white shadow-sm shadow-rose-200 dark:shadow-none dark:bg-indigo-600'
              : 'text-slate-700 hover:text-slate-950 hover:bg-white/90 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-850'
          }`}
          title="Visitor Register & Business Sign In"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>2. Visitor Register / Login</span>
        </button>

        <button
          onClick={() => onChangeEnv('dashboard')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold text-[11px] transition-all ${
            currentEnv === 'dashboard'
              ? 'bg-rose-600 text-white shadow-sm shadow-rose-200 dark:shadow-none dark:bg-indigo-600'
              : 'text-slate-700 hover:text-slate-950 hover:bg-white/90 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-850'
          }`}
          title="Open Business Operating Hub (Aura Atelier CRM, Catalog, Orders, AI Team)"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>3. Business Workspace</span>
        </button>

        <button
          onClick={() => onChangeEnv('admin')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium text-[11px] transition-all ${
            currentEnv === 'admin'
              ? 'bg-rose-700 text-white shadow-sm font-semibold dark:bg-rose-600'
              : 'text-rose-600 hover:text-rose-700 hover:bg-rose-100/60 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-950/40 border border-rose-200/60 dark:border-rose-500/20'
          }`}
          title="Open Isolated SuperAdmin Command Center (Gemini LLM Controls, Global Activities, Multi-Tenant Oversight)"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>4. Admin Command</span>
        </button>
      </div>

      {/* Right Controls: Theme Toggle & Live AI Sandbox */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <button
          onClick={onOpenLiveTest}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100/80 text-rose-700 border border-rose-200/80 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 text-[11px] font-semibold transition-all shadow-xs"
        >
          <Bot className="w-3.5 h-3.5 text-rose-500 dark:text-emerald-400" />
          <span className="hidden sm:inline">Test 24/7 AI Employee</span>
        </button>
      </div>
    </div>
  );
};
