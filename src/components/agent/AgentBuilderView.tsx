import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { AgentSettings } from '../../types.ts';
import {
  Bot,
  Sparkles,
  Save,
  CheckCircle2,
  ShieldAlert,
  Play,
  Sliders,
  Settings2,
  Code2,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react';

interface AgentBuilderViewProps {
  onOpenTestSandbox: () => void;
}

export const AgentBuilderView: React.FC<AgentBuilderViewProps> = ({ onOpenTestSandbox }) => {
  const { activeBusiness } = useAuth();
  const [agent, setAgent] = useState<AgentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'persona' | 'actions' | 'escalation' | 'prompt'>('persona');

  const businessId = activeBusiness?.id || 'biz_aura_001';

  useEffect(() => {
    async function fetchAgent() {
      try {
        setLoading(true);
        const data = await api.getAgent(businessId);
        setAgent(data);
      } catch (err) {
        console.error('Failed to load agent settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAgent();
  }, [businessId]);

  const handleSave = async () => {
    if (!agent) return;
    try {
      setSaving(true);
      await api.updateAgent(businessId, agent);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update agent settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const allAvailableActions = [
    { id: 'answer_questions', label: 'Answer Customer Questions & Policies' },
    { id: 'search_products', label: 'Search Live Catalog & Stock Levels' },
    { id: 'recommend_services', label: 'Proactively Recommend Services & Upsells' },
    { id: 'capture_customer_info', label: 'Capture Contact Details & CRM Lead Scoring' },
    { id: 'create_orders', label: 'Generate Official Sales Orders' },
    { id: 'send_payment_link', label: 'Create Instant Checkout / Payment Links' },
    { id: 'book_appointments', label: 'Schedule Appointments & Calendar Slots' },
    { id: 'escalate_to_human', label: 'Escalate High-Value or Sensitive Chats' },
  ];

  const escalationOptions = [
    { id: 'customer_requests_human', label: 'Customer explicitly requests a human representative or manager' },
    { id: 'sentiment_unhappy', label: 'Negative customer sentiment, anger, or explicit dissatisfaction' },
    { id: 'payment_issue', label: 'Payment processing error, disputed transaction, or chargeback' },
    { id: 'high_value_deal', label: 'Deal or order value exceeding $1,000 (white-glove closing)' },
    { id: 'technical_support', label: 'Complex bespoke specifications outside knowledge base' },
  ];

  if (loading || !agent) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">
        Loading AI Agent configuration...
      </div>
    );
  }

  // Generate compiled system prompt preview for transparency
  const compiledPromptPreview = `You are ${agent.name}, an autonomous AI employee for "${activeBusiness?.name || 'the business'}" (${activeBusiness?.industry}).
Tone: ${agent.tone}.
Personality: ${agent.personality}.
Response Length: ${agent.responseLength}.
Language: ${agent.language}.

OBJECTIVES:
${agent.objectives.map((o) => `- ${o}`).join('\n')}

ALLOWED TOOLS & ACTIONS:
${agent.allowedActions.map((a) => `- ${a}`).join('\n')}

ESCALATION PROTOCOLS:
${agent.escalationRules.map((r) => `- Active rule: ${r}`).join('\n')}
`;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">AI Agent Builder</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                Trained & Live
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure your AI employee persona, commercial objectives, execution privileges, and escalation guardrails.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenTestSandbox}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Play className="w-3.5 h-3.5 text-indigo-400" />
            <span>Test Sandbox</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : savedSuccess ? 'Saved!' : 'Save Agent'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'persona', label: 'Persona & Tone', icon: Bot },
          { id: 'actions', label: 'Allowed Tools & Actions', icon: Sliders },
          { id: 'escalation', label: 'Escalation & Safety', icon: ShieldAlert },
          { id: 'prompt', label: 'Compiled System Prompt', icon: Code2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Persona & Tone */}
      {activeTab === 'persona' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: General Identity */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Agent Identity</h3>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Agent Name</label>
              <input
                type="text"
                value={agent.name}
                onChange={(e) => setAgent({ ...agent, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={agent.avatar}
                onChange={(e) => setAgent({ ...agent, avatar: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Tone of Voice</label>
                <select
                  value={agent.tone}
                  onChange={(e) => setAgent({ ...agent, tone: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="premium">Premium Concierge</option>
                  <option value="casual">Casual & Direct</option>
                  <option value="concise">Concise & Minimal</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Response Length</label>
                <select
                  value={agent.responseLength}
                  onChange={(e) => setAgent({ ...agent, responseLength: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                >
                  <option value="short">Short & Punchy</option>
                  <option value="balanced">Balanced</option>
                  <option value="thorough">Thorough & Comprehensive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Detailed Persona Instructions</label>
              <textarea
                rows={4}
                value={agent.personality}
                onChange={(e) => setAgent({ ...agent, personality: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Right: Business Objectives */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Commercial Objectives</h3>
              <button
                onClick={() =>
                  setAgent({
                    ...agent,
                    objectives: [...agent.objectives, 'Qualify budget and timeline before offering calendar slots.'],
                  })
                }
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Goal</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              The AI aligns every conversation towards fulfilling these specific high-value business goals.
            </p>

            <div className="space-y-2">
              {agent.objectives.map((obj, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => {
                      const next = [...agent.objectives];
                      next[i] = e.target.value;
                      setAgent({ ...agent, objectives: next });
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      const next = agent.objectives.filter((_, idx) => idx !== i);
                      setAgent({ ...agent, objectives: next });
                    }}
                    className="p-2 text-slate-400 hover:text-red-400 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800">
              <label className="text-xs text-slate-300 block mb-1">Fallback Behavior</label>
              <input
                type="text"
                value={agent.fallbackBehavior}
                onChange={(e) => setAgent({ ...agent, fallbackBehavior: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Allowed Actions */}
      {activeTab === 'actions' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Execution Privileges (Tools)</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select which autonomous business actions this agent is authorized to invoke during customer chats.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {allAvailableActions.map((action) => {
              const isChecked = agent.allowedActions.includes(action.id);
              return (
                <label
                  key={action.id}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    isChecked
                      ? 'border-indigo-500/50 bg-indigo-600/10 text-white'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...agent.allowedActions, action.id]
                        : agent.allowedActions.filter((a) => a !== action.id);
                      setAgent({ ...agent, allowedActions: next });
                    }}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-xs font-medium">{action.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Escalation & Safety */}
      {activeTab === 'escalation' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white">Escalation & Human Handoff Rules</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Define exact boundaries when the AI must safely hand off control to human team members in the Unified Inbox.
            </p>
          </div>

          <div className="space-y-3">
            {escalationOptions.map((rule) => {
              const isChecked = agent.escalationRules.includes(rule.id);
              return (
                <label
                  key={rule.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:bg-slate-950 cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...agent.escalationRules, rule.id]
                        : agent.escalationRules.filter((r) => r !== rule.id);
                      setAgent({ ...agent, escalationRules: next });
                    }}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-slate-200 font-medium">{rule.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Compiled Prompt */}
      {activeTab === 'prompt' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Compiled System Prompt Preview</h3>
            <span className="text-xs text-indigo-400 font-mono">Live Grounding Injected</span>
          </div>
          <p className="text-xs text-slate-400">
            This is the exact prompt structure sent to the Gemini AI reasoning model for your tenant.
          </p>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
            {compiledPromptPreview}
          </pre>
        </div>
      )}
    </div>
  );
};
