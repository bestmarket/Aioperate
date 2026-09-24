import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight, RefreshCw, CheckCircle2, Bot } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface DailyBriefData {
  summary: string;
  recommendations: string[];
  metrics: {
    conversations: number;
    leads: number;
    orders: number;
    revenue: number;
  };
}

interface AiDailyBriefProps {
  onNavigate: (tab: string) => void;
  onOpenTest: () => void;
}

export const AiDailyBrief: React.FC<AiDailyBriefProps> = ({ onNavigate, onOpenTest }) => {
  const { activeBusiness } = useAuth();
  const [brief, setBrief] = useState<DailyBriefData | null>(null);
  const [loading, setLoading] = useState(false);
  const [completedItems, setCompletedItems] = useState<Record<number, boolean>>({});

  const fetchBrief = async () => {
    if (!activeBusiness?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/daily-brief/${activeBusiness.id}`);
      if (res.ok) {
        const data = await res.json();
        setBrief(data);
      }
    } catch (e) {
      console.error('Failed to load daily brief:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrief();
  }, [activeBusiness?.id]);

  const toggleComplete = (idx: number) => {
    setCompletedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 bg-gradient-to-br from-rose-50/90 via-white to-pink-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-rose-200/80 dark:border-indigo-500/30 p-6 shadow-sm shadow-rose-200/30 dark:shadow-xl dark:shadow-indigo-950/20">
      {/* Decorative ambient aura */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-rose-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-12 w-48 h-48 bg-pink-400/10 dark:bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100 dark:border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 dark:from-indigo-600 dark:to-violet-500 flex items-center justify-center text-white shadow-md shadow-rose-500/25 dark:shadow-indigo-500/25">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">AI Morning Brief & Executive Directive</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700 border border-rose-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30">
                  Live Sync
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                Prepared exclusively for {activeBusiness?.name || 'your business'} by your AI Chief of Staff
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchBrief}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/60 transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
              title="Refresh AI briefing"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-rose-500 dark:text-indigo-400' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Re-analyze'}</span>
            </button>
            <button
              onClick={onOpenTest}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-md shadow-rose-600/25 dark:shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test AI Agent</span>
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mt-4 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal bg-white/95 dark:bg-slate-900/90 rounded-xl p-4 border border-rose-200/70 dark:border-indigo-500/30 shadow-xs">
          <p>{brief?.summary || 'Analyzing real-time customer intent, conversation logs, and catalog sales to formulate today’s strategic priorities...'}</p>
        </div>

        {/* Recommended Actions for Today */}
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5 flex items-center justify-between">
            <span>Priority Tactical Actions ({brief?.recommendations.length || 3})</span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Click circle to mark completed</span>
          </div>

          <div className="space-y-2">
            {(brief?.recommendations || [
              'Review and confirm pending private appointments scheduled by the AI concierge.',
              'Approve automated WhatsApp re-engagement campaign for inactive VIP customers.',
              'Check inventory stock levels for high-margin catalog highlights.',
            ]).map((action, idx) => {
              const isDone = completedItems[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleComplete(idx)}
                  className={`group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isDone
                      ? 'bg-rose-50/40 dark:bg-slate-900/40 border-rose-200/60 dark:border-slate-800/60 text-slate-500 line-through'
                      : 'bg-white dark:bg-slate-900/90 border-rose-200/70 dark:border-slate-800 hover:border-rose-300 dark:hover:border-indigo-500/40 text-slate-800 dark:text-slate-200 shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors flex-shrink-0 ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600 group-hover:border-rose-500 dark:group-hover:border-indigo-400 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <div className="flex-1 text-xs sm:text-sm font-medium leading-normal">
                    <span>{action}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
