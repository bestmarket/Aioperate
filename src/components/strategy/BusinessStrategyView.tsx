import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  TrendingUp,
  Target,
  Shield,
  Layers,
  CheckCircle2,
  Download,
  Share2,
  Calendar,
  ArrowRight,
  RefreshCw,
  Plus,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { BusinessPlan } from '../../types.ts';

export const BusinessStrategyView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<BusinessPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Generator form
  const [strategyType, setStrategyType] = useState<string>('90_day_growth');
  const [ownerGoals, setOwnerGoals] = useState<string>('');
  const [timeline, setTimeline] = useState<string>('90 Days');
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});

  const fetchPlans = async () => {
    if (!activeBusiness?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/strategy/${activeBusiness.id}`);
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
        if (data.length > 0 && !selectedPlan) {
          setSelectedPlan(data[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load strategy plans:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [activeBusiness?.id]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness?.id) return;

    setGenerating(true);
    try {
      const genRes = await fetch(`/api/strategy/${activeBusiness.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: strategyType,
          goals: ownerGoals,
          timeline,
        }),
      });

      if (genRes.ok) {
        const planData = await genRes.json();

        // Save generated plan to database
        const saveRes = await fetch(`/api/strategy/${activeBusiness.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: planData.title,
            type: strategyType,
            executiveSummary: planData.executiveSummary,
            sections: planData.sections,
          }),
        });

        if (saveRes.ok) {
          const newSaved = await saveRes.json();
          setPlans((prev) => [newSaved, ...prev]);
          setSelectedPlan(newSaved);
          setOwnerGoals('');
        }
      }
    } catch (e) {
      console.error('Failed to generate strategy:', e);
    } finally {
      setGenerating(false);
    }
  };

  const toggleAction = (key: string) => {
    setCheckedActions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExportText = () => {
    if (!selectedPlan) return;
    let text = `# ${selectedPlan.title}\n\n`;
    text += `## Executive Summary\n${selectedPlan.executiveSummary}\n\n`;
    selectedPlan.sections.forEach((sec, i) => {
      text += `### ${sec.title}\n${sec.content}\n\nKey Actions:\n`;
      sec.keyActions?.forEach((act) => {
        text += `- [ ] ${act}\n`;
      });
      text += '\n';
    });

    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedPlan.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Business Strategist</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              90-Day Execution Roadmaps
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl">
            Leverage enterprise growth consulting frameworks to formulate 90-day expansion blueprints, SWOT analyses, and pricing models tailored to {activeBusiness?.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedPlan && (
            <button
              onClick={handleExportText}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Markdown</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Generator Form & Blueprint Selector (Left) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Generate Strategic Blueprint</h2>
            </div>

            <form onSubmit={handleGenerate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Strategy Type</label>
                <select
                  value={strategyType}
                  onChange={(e) => setStrategyType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="90_day_growth">90-Day Growth & Revenue Plan</option>
                  <option value="swot_analysis">SWOT & Risk Assessment</option>
                  <option value="competitor_intel">Competitor Counter-Strategy</option>
                  <option value="pricing_matrix">Pricing & Margin Optimization</option>
                  <option value="launch_plan">New Product Launch Architecture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Execution Horizon</label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="30 Days">30 Days (Sprint)</option>
                  <option value="90 Days">90 Days (Quarterly Blueprint)</option>
                  <option value="6 Months">6 Months (Scale-Up)</option>
                  <option value="12 Months">12 Months (Annual Vision)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Growth Goals</label>
                <textarea
                  rows={3}
                  value={ownerGoals}
                  onChange={(e) => setOwnerGoals(e.target.value)}
                  placeholder="e.g., Increase average customer order from $1,200 to $2,500, automate follow-ups, and enter the corporate executive market..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs shadow-lg shadow-emerald-600/25 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{generating ? 'Synthesizing Strategic Blueprint...' : 'Generate Blueprint with AI'}</span>
              </button>
            </form>
          </div>

          {/* Saved Blueprints List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
              Saved Blueprints ({plans.length})
            </div>

            {plans.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlan(p)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                  selectedPlan?.id === p.id
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold truncate">{p.title}</div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
                  <span className="capitalize">{p.type.replace(/_/g, ' ')}</span>
                  <span>•</span>
                  <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Blueprint Viewer & Action Tracker (Right) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedPlan ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  {selectedPlan.type.replace(/_/g, ' ')}
                </span>
                <h2 className="text-xl font-bold text-white mt-2">{selectedPlan.title}</h2>
                <p className="text-xs text-slate-400 mt-1">Generated for {activeBusiness?.name}</p>
              </div>

              {/* Executive Summary */}
              <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>Executive Summary</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">{selectedPlan.executiveSummary}</p>
              </div>

              {/* Strategic Pillars / Sections */}
              <div className="space-y-4">
                {selectedPlan.sections.map((section, sIdx) => (
                  <div key={sIdx} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                        {sIdx + 1}
                      </span>
                      <span>{section.title}</span>
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{section.content}</p>

                    {section.keyActions && section.keyActions.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-2">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Key Milestones & Action Items:
                        </div>
                        <div className="space-y-1.5">
                          {section.keyActions.map((action, aIdx) => {
                            const actionKey = `${sIdx}_${aIdx}`;
                            const isChecked = checkedActions[actionKey];
                            return (
                              <div
                                key={aIdx}
                                onClick={() => toggleAction(actionKey)}
                                className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                                  isChecked
                                    ? 'bg-slate-900/40 border-slate-800/50 text-slate-500 line-through'
                                    : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                                }`}
                              >
                                <button
                                  type="button"
                                  className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${
                                    isChecked
                                      ? 'bg-emerald-600 border-emerald-500 text-white'
                                      : 'border-slate-600 bg-slate-800'
                                  }`}
                                >
                                  {isChecked && <CheckCircle2 className="w-3 h-3" />}
                                </button>
                                <span className="flex-1">{action}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-12 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              Select or generate a business blueprint to view the strategic roadmap.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
