import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Automation } from '../../types.ts';
import {
  Zap,
  Play,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  Bell,
  Tag,
  AlertCircle,
} from 'lucide-react';

export const AutomationEngineView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggeringId, setTriggeringId] = useState<string | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  const businessId = activeBusiness?.id || 'biz_aura_001';

  const loadAutomations = async () => {
    try {
      setLoading(true);
      const data = await api.getAutomations(businessId);
      setAutomations(data);
    } catch (err) {
      console.error('Failed to load automations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAutomations();
  }, [businessId]);

  const handleToggleStatus = async (auto: Automation) => {
    try {
      const nextStatus = auto.status === 'active' ? 'paused' : 'active';
      const updated = await api.updateAutomation(businessId, auto.id, { status: nextStatus });
      setAutomations((prev) => prev.map((a) => (a.id === auto.id ? updated : a)));
    } catch (err) {
      console.error('Failed to update automation:', err);
    }
  };

  const handleManualTrigger = async (autoId: string) => {
    try {
      setTriggeringId(autoId);
      const res = await api.triggerAutomation(businessId, autoId);
      setAutomations((prev) =>
        prev.map((a) => (a.id === autoId ? { ...a, runsCount: res.runsCount, lastRunAt: res.executedAt } : a))
      );
      setTimeout(() => setTriggeringId(null), 2500);
    } catch (err) {
      console.error('Failed to manually trigger automation:', err);
      setTriggeringId(null);
    }
  };

  const recipes = [
    {
      name: 'Abandoned Cart 2h WhatsApp Nudge',
      trigger: 'order_abandoned' as const,
      desc: 'Send warm conversational follow-up if visitor left cart without purchasing.',
      waitHours: 2,
    },
    {
      name: '24h Pre-Appointment VIP Reminder',
      trigger: 'booking_created' as const,
      desc: 'Send confirmation details and directions 24 hours prior to appointment.',
      waitHours: 24,
    },
    {
      name: 'Post-Delivery Luxury Review & Cross-Sell',
      trigger: 'order_paid' as const,
      desc: 'Request feedback and suggest matching accessories 48 hours after delivery.',
      waitHours: 48,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h1 className="text-lg font-bold text-white">Automations & Follow-up Engine</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Event-driven WHEN / IF / THEN workflows that follow up with leads, recover abandoned carts, and nurture VIP clients.
          </p>
        </div>

        <button
          onClick={() => setShowRecipeModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Add Pre-Built Recipe</span>
        </button>
      </div>

      {/* Visual Workflow Cards */}
      <div className="space-y-4">
        {automations.map((auto) => {
          const isTriggering = triggeringId === auto.id;
          return (
            <div
              key={auto.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{auto.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        auto.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {auto.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{auto.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleManualTrigger(auto.id)}
                    disabled={isTriggering}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isTriggering ? 'Running...' : 'Test Trigger'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleStatus(auto)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                  >
                    {auto.status === 'active' ? 'Pause' : 'Activate'}
                  </button>
                </div>
              </div>

              {/* Visual Logic Stepper: WHEN -> IF -> THEN */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Trigger */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider">
                    WHEN Trigger
                  </span>
                  <div className="font-semibold text-white capitalize">{auto.trigger.replace('_', ' ')}</div>
                  {auto.waitHours ? (
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-amber-400" /> Wait {auto.waitHours} hour(s) delay
                    </div>
                  ) : null}
                </div>

                {/* Condition */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                    IF Condition
                  </span>
                  <div className="font-semibold text-white">
                    {auto.conditions.length > 0
                      ? auto.conditions.map((c) => `${c.field} ${c.operator} ${c.value}`).join(' & ')
                      : 'Always run (no condition)'}
                  </div>
                </div>

                {/* Action */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">
                    THEN Action
                  </span>
                  <div className="space-y-1">
                    {auto.actions.map((act, idx) => (
                      <div key={idx} className="font-medium text-slate-200">
                        {act.type.replace('_', ' ')}: &quot;{act.params?.template || act.params?.tag || 'Default Action'}&quot;
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Telemetry info */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Executed: <strong className="text-white font-mono">{auto.runsCount}</strong> times</span>
                <span>Last run: {auto.lastRunAt ? new Date(auto.lastRunAt).toLocaleTimeString() : 'Never'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pre-built Recipe Modal */}
      {showRecipeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Install Pre-Built Automation Recipe
            </h3>
            <p className="text-slate-400">
              One-click install proven conversion workflows used by leading high-growth brands.
            </p>

            <div className="space-y-2.5">
              {recipes.map((rcp, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white">{rcp.name}</div>
                    <div className="text-[11px] text-slate-400">{rcp.desc}</div>
                  </div>
                  <button
                    onClick={async () => {
                      await api.createAutomation(businessId, {
                        name: rcp.name,
                        description: rcp.desc,
                        trigger: rcp.trigger,
                        waitHours: rcp.waitHours,
                        actions: [{ type: 'send_whatsapp', params: { template: 'quick_nudge' } }],
                      });
                      setShowRecipeModal(false);
                      loadAutomations();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                  >
                    Install
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowRecipeModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
