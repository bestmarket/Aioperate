import React, { useState, useEffect } from 'react';
import {
  Shield,
  Building2,
  Receipt,
  FileEdit,
  LifeBuoy,
  Activity,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  DollarSign,
  Users,
  Search,
  Check,
  Save,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Plus,
  Send,
  Zap,
  Cpu,
  Sparkles,
  Sliders,
  Play,
  Bot,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  HelpCircle,
  ArrowRight,
  Key,
  Trash2,
  ShieldCheck,
  Database,
  RefreshCcw,
  Info,
  CreditCard,
  Coins,
  ExternalLink,
} from 'lucide-react';
import {
  BillingPlan,
  WebsiteCmsContent,
  SupportTicket,
  SystemLog,
  FeatureFlags,
  LlmGlobalConfig,
  SystemActivity,
  AdminPaymentGateways,
} from '../../types.ts';
import { ThemeToggle } from '../layout/ThemeToggle.tsx';

interface AdminPortalViewProps {
  onNavigateToDashboard?: () => void;
  onNavigateToLanding?: () => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  onNavigateToDashboard,
  onNavigateToLanding,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'activities' | 'gemini' | 'businesses' | 'payments' | 'plans' | 'cms' | 'support' | 'logs' | 'flags'
  >('payments');

  const [overview, setOverview] = useState<any>(null);
  const [activities, setActivities] = useState<SystemActivity[]>([]);
  const [llmConfig, setLlmConfig] = useState<LlmGlobalConfig | null>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [cms, setCms] = useState<WebsiteCmsContent | null>(null);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [flags, setFlags] = useState<FeatureFlags | null>(null);
  const [paymentGateways, setPaymentGateways] = useState<AdminPaymentGateways | null>(null);
  const [savingGateways, setSavingGateways] = useState(false);
  const [saveGatewaysSuccess, setSaveGatewaysSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [savingLlm, setSavingLlm] = useState(false);
  const [saveLlmSuccess, setSaveLlmSuccess] = useState(false);
  const [saveCmsSuccess, setSaveCmsSuccess] = useState(false);
  const [ticketReplyText, setTicketReplyText] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activityFilter, setActivityFilter] = useState<string>('all');

  // Gemini Test Workbench state
  const [workbenchPrompt, setWorkbenchPrompt] = useState(
    'A high-net-worth client is requesting a custom midnight navy tuxedo for a charity gala in 10 days. Recommend an initial quote, check fabric availability, and suggest an expedited fitting session.'
  );
  const [workbenchModel, setWorkbenchModel] = useState('gemini-3.8-flash');
  const [workbenchPersona, setWorkbenchPersona] = useState('salesCloser');
  const [workbenchTemp, setWorkbenchTemp] = useState(0.3);
  const [workbenchTesting, setWorkbenchTesting] = useState(false);
  const [workbenchResult, setWorkbenchResult] = useState<{
    output: string;
    modelUsed: string;
    latencyMs: number;
    promptTokens: number;
    responseTokens: number;
    costEstimated: number;
    keyUsedMasked?: string;
  } | null>(null);

  // Gemini Multi-Key & Reset State
  const [resettingGemini, setResettingGemini] = useState(false);
  const [resetResult, setResetResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
    testedModel?: string;
    activeKeys?: number;
    primaryKeyMasked?: string;
  } | null>(null);

  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const [newKeyInput, setNewKeyInput] = useState('');
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [addingKey, setAddingKey] = useState(false);
  const [keyActionFeedback, setKeyActionFeedback] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [ovRes, actRes, llmRes, bizRes, plRes, cmsRes, supRes, logRes, flagRes, gwRes] =
        await Promise.all([
          fetch('/api/admin/overview'),
          fetch('/api/admin/activities'),
          fetch('/api/admin/llm-config'),
          fetch('/api/admin/businesses'),
          fetch('/api/admin/plans'),
          fetch('/api/admin/cms'),
          fetch('/api/admin/support'),
          fetch('/api/admin/logs'),
          fetch('/api/admin/feature-flags'),
          fetch('/api/admin/payment-gateways'),
        ]);

      if (ovRes.ok) setOverview(await ovRes.json());
      if (actRes.ok) setActivities(await actRes.json());
      if (llmRes.ok) setLlmConfig(await llmRes.json());
      if (bizRes.ok) setBusinesses(await bizRes.json());
      if (plRes.ok) setPlans(await plRes.json());
      if (cmsRes.ok) setCms(await cmsRes.json());
      if (supRes.ok) setSupportTickets(await supRes.json());
      if (logRes.ok) setLogs(await logRes.json());
      if (flagRes.ok) setFlags(await flagRes.json());
      if (gwRes.ok) setPaymentGateways(await gwRes.json());
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePaymentGateways = async () => {
    if (!paymentGateways) return;
    setSavingGateways(true);
    try {
      const res = await fetch('/api/admin/payment-gateways', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentGateways),
      });
      if (res.ok) {
        const updated = await res.json();
        setPaymentGateways(updated);
        setSaveGatewaysSuccess(true);
        setTimeout(() => setSaveGatewaysSuccess(false), 2500);
        const actRes = await fetch('/api/admin/activities');
        if (actRes.ok) setActivities(await actRes.json());
      }
    } catch (e) {
      console.error('Failed to save payment gateways:', e);
    } finally {
      setSavingGateways(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleSaveLlmConfig = async () => {
    if (!llmConfig) return;
    setSavingLlm(true);
    try {
      const res = await fetch('/api/admin/llm-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(llmConfig),
      });
      if (res.ok) {
        const updated = await res.json();
        setLlmConfig(updated);
        setSaveLlmSuccess(true);
        setTimeout(() => setSaveLlmSuccess(false), 2500);
        // Refresh activities to see the config update logged
        const actRes = await fetch('/api/admin/activities');
        if (actRes.ok) setActivities(await actRes.json());
      }
    } catch (e) {
      console.error('Failed to save LLM config:', e);
    } finally {
      setSavingLlm(false);
    }
  };

  const handleRunWorkbenchTest = async () => {
    if (!workbenchPrompt.trim()) return;
    setWorkbenchTesting(true);
    setWorkbenchResult(null);

    const systemInstruction =
      llmConfig?.personaPrompts?.[workbenchPersona as keyof typeof llmConfig.personaPrompts] ||
      'You are OperateAI Central Intelligence Engine. Provide concise, powerful, professional business analysis and writing.';

    try {
      const res = await fetch('/api/admin/llm-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: workbenchPrompt,
          model: workbenchModel,
          systemInstruction,
          temperature: workbenchTemp,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setWorkbenchResult(data);
        // Refresh LLM config telemetry and activities
        const [llmRes, actRes] = await Promise.all([
          fetch('/api/admin/llm-config'),
          fetch('/api/admin/activities'),
        ]);
        if (llmRes.ok) setLlmConfig(await llmRes.json());
        if (actRes.ok) setActivities(await actRes.json());
      }
    } catch (e) {
      console.error('Workbench test failed:', e);
    } finally {
      setWorkbenchTesting(false);
    }
  };

  const handleResetGemini = async () => {
    setResettingGemini(true);
    setResetResult(null);
    try {
      const res = await fetch('/api/admin/gemini/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setResetResult(data);
        // Refresh LLM config and activities
        const [llmRes, actRes] = await Promise.all([
          fetch('/api/admin/llm-config'),
          fetch('/api/admin/activities'),
        ]);
        if (llmRes.ok) setLlmConfig(await llmRes.json());
        if (actRes.ok) setActivities(await actRes.json());
      } else {
        const err = await res.json();
        setResetResult({
          success: false,
          message: err.message || 'Failed to reset Gemini engine.',
        });
      }
    } catch {
      setResetResult({
        success: false,
        message: 'Could not contact server to reset Gemini.',
      });
    } finally {
      setResettingGemini(false);
      setTimeout(() => setResetResult(null), 6000);
    }
  };

  const handleAddApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyInput.trim()) return;
    setAddingKey(true);
    setKeyActionFeedback(null);
    try {
      const res = await fetch('/api/admin/llm-config/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: newKeyInput.trim(),
          label: newKeyLabel.trim() || undefined,
        }),
      });
      if (res.ok) {
        setNewKeyInput('');
        setNewKeyLabel('');
        setShowAddKeyModal(false);
        setKeyActionFeedback('New Gemini API key added to failover pool!');
        setTimeout(() => setKeyActionFeedback(null), 3000);
        const [llmRes, actRes] = await Promise.all([
          fetch('/api/admin/llm-config'),
          fetch('/api/admin/activities'),
        ]);
        if (llmRes.ok) setLlmConfig(await llmRes.json());
        if (actRes.ok) setActivities(await actRes.json());
      } else {
        const err = await res.json();
        setKeyActionFeedback(`Error: ${err.error || 'Failed to add key'}`);
      }
    } catch {
      setKeyActionFeedback('Error connecting to server.');
    } finally {
      setAddingKey(false);
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to remove this API key from the failover pool?')) return;
    try {
      const res = await fetch(`/api/admin/llm-config/api-keys/${keyId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setKeyActionFeedback('API Key removed from system pool.');
        setTimeout(() => setKeyActionFeedback(null), 3000);
        const [llmRes, actRes] = await Promise.all([
          fetch('/api/admin/llm-config'),
          fetch('/api/admin/activities'),
        ]);
        if (llmRes.ok) setLlmConfig(await llmRes.json());
        if (actRes.ok) setActivities(await actRes.json());
      }
    } catch {
      setKeyActionFeedback('Failed to remove API key.');
    }
  };

  const handleToggleApiKey = async (keyId: string) => {
    try {
      const res = await fetch(`/api/admin/llm-config/api-keys/${keyId}/toggle`, {
        method: 'POST',
      });
      if (res.ok) {
        const llmRes = await fetch('/api/admin/llm-config');
        if (llmRes.ok) setLlmConfig(await llmRes.json());
      }
    } catch {
      // ignore
    }
  };

  const handleSelectModelFamily = (family: 'flash' | 'pro' | 'custom') => {
    if (!llmConfig) return;
    if (family === 'flash') {
      setLlmConfig({
        ...llmConfig,
        activeModelFamily: 'flash',
        defaultChatModel: 'gemini-3.8-flash',
        writingStrategyModel: 'gemini-3.8-flash',
      });
    } else if (family === 'pro') {
      setLlmConfig({
        ...llmConfig,
        activeModelFamily: 'pro',
        defaultChatModel: 'gemini-3.8-flash',
        writingStrategyModel: 'gemini-3.1-pro-preview',
      });
    } else {
      setLlmConfig({
        ...llmConfig,
        activeModelFamily: 'custom',
      });
    }
  };

  const handleInsertVariable = (variable: string) => {
    if (!llmConfig) return;
    const current = llmConfig.globalSystemPromptTemplate || '';
    setLlmConfig({
      ...llmConfig,
      globalSystemPromptTemplate: `${current} {{${variable}}} `,
    });
  };

  const handleResetGlobalPrompt = () => {
    if (!llmConfig) return;
    const defaultTemplate =
      'You are an autonomous AI employee for "{{business_name}}" operating in the {{industry}} industry.\n\nCore Operational Directives:\n1. Maintain absolute professionalism, helpfulness, and precision representing {{business_name}}.\n2. Adhere strictly to verified business knowledge, official product catalogs, and scheduled services. Never fabricate pricing, inventory, or delivery terms.\n3. Proactively qualify client intent, capture lead contact information, and streamline bookings and orders.\n4. Escalate gracefully when human assistance is explicitly requested.';
    setLlmConfig({
      ...llmConfig,
      globalSystemPromptTemplate: defaultTemplate,
    });
  };

  const handleSaveCms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cms) return;
    try {
      const res = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cms),
      });
      if (res.ok) {
        setSaveCmsSuccess(true);
        setTimeout(() => setSaveCmsSuccess(false), 2500);
      }
    } catch (e) {
      console.error('Failed to save CMS:', e);
    }
  };

  const handleToggleBusinessStatus = async (bizId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      const res = await fetch(`/api/admin/businesses/${bizId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setBusinesses((prev) =>
          prev.map((b) => (b.id === bizId ? { ...b, status: nextStatus } : b))
        );
      }
    } catch (e) {
      console.error('Failed to toggle business status:', e);
    }
  };

  const handleTicketReply = async (ticketId: string) => {
    const reply = ticketReplyText[ticketId];
    if (!reply?.trim()) return;

    try {
      const res = await fetch(`/api/admin/support/${ticketId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reply }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSupportTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
        setTicketReplyText((prev) => ({ ...prev, [ticketId]: '' }));
      }
    } catch (e) {
      console.error('Failed to reply to ticket:', e);
    }
  };

  const handleTicketStatus = async (ticketId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/support/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSupportTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
      }
    } catch (e) {
      console.error('Failed to change ticket status:', e);
    }
  };

  const filteredBusinesses = businesses.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.contactEmail && b.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredActivities = activities.filter((act) => {
    if (activityFilter === 'all') return true;
    return act.type === activityFilter;
  });

  return (
    <div className="space-y-6">
      {/* SuperAdmin Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-rose-100 dark:border-indigo-500/30 p-6 rounded-3xl shadow-sm dark:shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/80 dark:bg-indigo-600/20 dark:text-indigo-400 dark:border-indigo-500/40 flex items-center justify-center font-bold shadow-xs">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Platform Command Center</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30">
                SuperAdmin Isolated Root
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              System-level control over Gemini AI intelligence, persona instructions, real-time tenant activities, and SaaS infrastructure.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {onNavigateToDashboard && (
            <button
              onClick={onNavigateToDashboard}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Client Workspace</span>
            </button>
          )}

          {onNavigateToLanding && (
            <button
              onClick={onNavigateToLanding}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-medium border border-rose-200/70 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
            >
              <span>Public Site</span>
            </button>
          )}

          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-medium border border-rose-200/70 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-rose-100 dark:border-slate-800 pb-2">
        {[
          { id: 'payments', label: 'Payment Gateways', icon: CreditCard, badge: 'Lemon Squeezy + Crypto' },
          { id: 'gemini', label: 'Gemini AI Intelligence', icon: Cpu, badge: 'Live API' },
          { id: 'activities', label: `System Activities (${activities.length})`, icon: Activity },
          { id: 'businesses', label: `Tenants (${businesses.length})`, icon: Building2 },
          { id: 'overview', label: 'Platform Metrics', icon: TrendingUp },
          { id: 'plans', label: 'SaaS Plans', icon: Receipt },
          { id: 'cms', label: 'Website CMS', icon: FileEdit },
          { id: 'support', label: `Support Desk (${supportTickets.length})`, icon: LifeBuoy },
          { id: 'logs', label: 'System Health', icon: Activity },
          { id: 'flags', label: 'Feature Flags', icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25 dark:bg-indigo-600 dark:shadow-indigo-600/25'
                  : 'bg-white border border-rose-200/70 text-slate-600 hover:text-slate-900 hover:bg-rose-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-850 shadow-xs'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/20 text-rose-500 dark:text-rose-300 font-mono">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB: GEMINI AI INTELLIGENCE & LLM CONTROL */}
      {activeAdminTab === 'gemini' && llmConfig && (
        <div className="space-y-6">
          {/* Header & Save Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-indigo-500/20 p-5 rounded-2xl">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                Gemini API Engine & Multi-Agent Intelligence Center
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Centralized control for Gemini model versions (Flash vs. Pro), multiple API keys with automated failover, and global agent system prompt templates.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleResetGemini}
                disabled={resettingGemini}
                title="Clear temporary 503/429 cooldowns, reset key pools, and test active model connection"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resettingGemini ? 'animate-spin' : ''}`} />
                <span>{resettingGemini ? 'Resetting Gemini...' : 'Reset Gemini'}</span>
              </button>

              {saveLlmSuccess && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  Configurations Applied!
                </span>
              )}

              <button
                onClick={handleSaveLlmConfig}
                disabled={savingLlm}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingLlm ? 'Applying...' : 'Save AI Configurations'}</span>
              </button>
            </div>
          </div>

          {/* Status Feedback Banners */}
          {resetResult && (
            <div
              className={`p-4 rounded-xl border flex items-center justify-between gap-3 animate-fade-in ${
                resetResult.success
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-3 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <div>
                  <span className="font-semibold">{resetResult.message}</span>
                  {resetResult.testedModel && (
                    <span className="ml-2 text-[11px] opacity-80 font-mono">
                      (Verified: {resetResult.testedModel} in {resetResult.latencyMs}ms | Active Keys: {resetResult.activeKeys})
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setResetResult(null)}
                className="text-xs opacity-60 hover:opacity-100"
              >
                Dismiss
              </button>
            </div>
          )}

          {keyActionFeedback && (
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-indigo-200 text-xs flex items-center gap-2 animate-fade-in">
              <Info className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{keyActionFeedback}</span>
            </div>
          )}

          {/* Telemetry Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3.5">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400">Total Invocations</div>
              <div className="text-xl font-bold text-white mt-1">
                {llmConfig.tokenUsageTelemetry.totalCalls.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400 mt-1">Autonomous calls</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400">Prompt Tokens</div>
              <div className="text-xl font-bold text-white mt-1">
                {(llmConfig.tokenUsageTelemetry.totalPromptTokens / 1000).toFixed(1)}k
              </div>
              <div className="text-[10px] text-indigo-400 mt-1">Context ingested</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400">Response Tokens</div>
              <div className="text-xl font-bold text-white mt-1">
                {(llmConfig.tokenUsageTelemetry.totalResponseTokens / 1000).toFixed(1)}k
              </div>
              <div className="text-[10px] text-purple-400 mt-1">Content synthesized</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400">Avg Latency</div>
              <div className="text-xl font-bold text-white mt-1">
                {llmConfig.tokenUsageTelemetry.averageLatencyMs}ms
              </div>
              <div className="text-[10px] text-emerald-400 mt-1">High throughput</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400">Est. API Cost</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">
                ${llmConfig.tokenUsageTelemetry.estimatedCostUsd.toFixed(3)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Live token rate</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400">Active API Keys</div>
              <div className="text-xl font-bold text-indigo-400 mt-1">
                {(llmConfig.apiKeys || []).filter((k) => k.isActive).length}
                <span className="text-xs text-slate-500 font-normal"> / {(llmConfig.apiKeys || []).length || 1}</span>
              </div>
              <div className="text-[10px] text-emerald-400 mt-1">Failover pool ready</div>
            </div>
          </div>

          {/* SECTION 1: GEMINI MODEL VERSION QUICK TOGGLE */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Gemini Model Family Toggle
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select the active Gemini engine version. Switch between ultra-fast Flash for real-time customer conversation or deep reasoning Pro for executive strategy.
                </p>
              </div>
              <div className="inline-flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => handleSelectModelFamily('flash')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    (llmConfig.activeModelFamily || 'flash') === 'flash'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ Gemini Flash
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectModelFamily('pro')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    llmConfig.activeModelFamily === 'pro'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🧠 Gemini Pro
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectModelFamily('custom')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    llmConfig.activeModelFamily === 'custom'
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚙️ Custom
                </button>
              </div>
            </div>

            {/* Model Family Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Flash */}
              <div
                onClick={() => handleSelectModelFamily('flash')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  (llmConfig.activeModelFamily || 'flash') === 'flash'
                    ? 'bg-indigo-950/30 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    ⚡ Gemini Flash Engine
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Sub-second latency, highest throughput, and resilient failover. Perfect for 24/7 web chat, WhatsApp intake, and rapid quoting.
                </p>
                <div className="mt-3 text-[10px] font-mono text-indigo-300 bg-slate-900/80 px-2 py-1 rounded border border-slate-800 inline-block">
                  gemini-3.8-flash
                </div>
              </div>

              {/* Card 2: Pro */}
              <div
                onClick={() => handleSelectModelFamily('pro')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  llmConfig.activeModelFamily === 'pro'
                    ? 'bg-purple-950/30 border-purple-500 shadow-md shadow-purple-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    🧠 Gemini Pro Engine
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-400 font-semibold">
                    Deep Reasoning
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Advanced multi-step reasoning, executive strategic plans, long-form marketing copy, and nuanced client consultation analysis.
                </p>
                <div className="mt-3 text-[10px] font-mono text-purple-300 bg-slate-900/80 px-2 py-1 rounded border border-slate-800 inline-block">
                  gemini-3.1-pro-preview
                </div>
              </div>

              {/* Card 3: Hybrid / Custom */}
              <div
                onClick={() => handleSelectModelFamily('custom')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  llmConfig.activeModelFamily === 'custom'
                    ? 'bg-slate-800/50 border-slate-500 shadow-md shadow-slate-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    ⚙️ Hybrid Dual-Tier
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-700 text-slate-300 font-semibold">
                    Custom Tuning
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Use Flash for high-speed front-desk inquiries while routing marketing assets and business plans to Pro models.
                </p>
                <div className="mt-3 text-[10px] font-mono text-slate-300 bg-slate-900/80 px-2 py-1 rounded border border-slate-800 inline-block">
                  Flash + Pro Split
                </div>
              </div>
            </div>

            {/* Granular Model Selectors & Parameters */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Default Customer Chat & Receptionist Model
                </label>
                <select
                  value={llmConfig.defaultChatModel}
                  onChange={(e) =>
                    setLlmConfig({
                      ...llmConfig,
                      defaultChatModel: e.target.value,
                      activeModelFamily: 'custom',
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="gemini-3.8-flash">gemini-3.8-flash (Standard Flash - Low latency)</option>
                  <option value="gemini-flash-latest">gemini-flash-latest (Auto-updated Flash)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Cost-optimized lite)</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Full Pro reasoning)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Writing Studio & Business Strategy Model
                </label>
                <select
                  value={llmConfig.writingStrategyModel}
                  onChange={(e) =>
                    setLlmConfig({
                      ...llmConfig,
                      writingStrategyModel: e.target.value,
                      activeModelFamily: 'custom',
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="gemini-3.8-flash">gemini-3.8-flash (High speed copy)</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep strategic reasoning)</option>
                  <option value="gemini-flash-latest">gemini-flash-latest (Latest stable)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-semibold">
                  <span>Temperature</span>
                  <span className="text-indigo-400 font-mono">{llmConfig.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={llmConfig.temperature}
                  onChange={(e) =>
                    setLlmConfig({ ...llmConfig, temperature: parseFloat(e.target.value) })
                  }
                  className="w-full accent-indigo-600"
                />
                <span className="text-[10px] text-slate-400">0.0 (Factual) to 1.0 (Creative)</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Max Output Tokens
                </label>
                <input
                  type="number"
                  min="256"
                  max="8192"
                  step="256"
                  value={llmConfig.maxOutputTokens}
                  onChange={(e) =>
                    setLlmConfig({ ...llmConfig, maxOutputTokens: parseInt(e.target.value) || 2048 })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Safety Guardrails
                </label>
                <select
                  value={llmConfig.safetyThreshold}
                  onChange={(e) =>
                    setLlmConfig({
                      ...llmConfig,
                      safetyThreshold: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="strict">Strict (Zero hallucinated pricing)</option>
                  <option value="standard">Standard (Commercial friendly)</option>
                  <option value="relaxed">Relaxed (High autonomy)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: MULTIPLE GEMINI API KEYS & FAILOVER POOL */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Multiple Gemini API Keys & Failover Pool
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Store and manage multiple Gemini API keys. When one key experiences high demand spikes (503) or rate limits (429), the engine automatically fails over to the next healthy key in the pool.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddKeyModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all active:scale-95 shadow-sm shadow-indigo-600/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Gemini API Key</span>
              </button>
            </div>

            {/* Add Key Form / Modal Inline */}
            {showAddKeyModal && (
              <form
                onSubmit={handleAddApiKey}
                className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-3 animate-fade-in"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    Configure Additional Gemini API Key
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddKeyModal(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Gemini API Key (Secret)
                    </label>
                    <input
                      type="password"
                      value={newKeyInput}
                      onChange={(e) => setNewKeyInput(e.target.value)}
                      placeholder="AIzaSy..."
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Key Label / Purpose
                    </label>
                    <input
                      type="text"
                      value={newKeyLabel}
                      onChange={(e) => setNewKeyLabel(e.target.value)}
                      placeholder="e.g. High-Volume Production Key or Backup"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddKeyModal(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs hover:bg-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingKey || !newKeyInput.trim()}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50"
                  >
                    {addingKey ? 'Adding to Pool...' : 'Add Key to Failover Pool'}
                  </button>
                </div>
              </form>
            )}

            {/* Configured Keys Pool List */}
            <div className="space-y-2.5">
              {(!llmConfig.apiKeys || llmConfig.apiKeys.length === 0) ? (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
                  <Key className="w-5 h-5 mx-auto text-slate-600 mb-1.5" />
                  No secondary keys added. System is using primary environment credentials. Add additional keys to enable automatic load-balancing and failover.
                </div>
              ) : (
                llmConfig.apiKeys.map((keyEntry) => (
                  <div
                    key={keyEntry.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          !keyEntry.isActive
                            ? 'bg-slate-600'
                            : keyEntry.status === 'cooldown'
                            ? 'bg-amber-400 animate-pulse'
                            : 'bg-emerald-400'
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{keyEntry.label}</span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {keyEntry.maskedKey || '••••••••'}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase ${
                              !keyEntry.isActive
                                ? 'bg-slate-800 text-slate-400'
                                : keyEntry.status === 'cooldown'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {!keyEntry.isActive ? 'Disabled' : keyEntry.status === 'cooldown' ? 'Cooldown (503)' : 'Healthy'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3 font-mono">
                          <span>Calls: {keyEntry.callCount || 0}</span>
                          {keyEntry.errorCount ? (
                            <span className="text-amber-400">Errors: {keyEntry.errorCount}</span>
                          ) : null}
                          {keyEntry.lastUsed && (
                            <span>Last used: {new Date(keyEntry.lastUsed).toLocaleTimeString()}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleToggleApiKey(keyEntry.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          keyEntry.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {keyEntry.isActive ? 'Active' : 'Disabled'}
                      </button>

                      {keyEntry.id !== 'key_primary_env' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteApiKey(keyEntry.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove key"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Key Pool Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div
                onClick={() =>
                  setLlmConfig({
                    ...llmConfig,
                    multiKeyRotation: !llmConfig.multiKeyRotation,
                  })
                }
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700"
              >
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Automated Round-Robin Rotation
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Distribute incoming requests evenly across healthy API keys
                  </span>
                </div>
                {llmConfig.multiKeyRotation ? (
                  <ToggleRight className="w-6 h-6 text-indigo-400" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-slate-600" />
                )}
              </div>

              <div
                onClick={() =>
                  setLlmConfig({
                    ...llmConfig,
                    autoRetryOn503: !llmConfig.autoRetryOn503,
                  })
                }
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700"
              >
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Zero-Downtime 503 Spike Failover
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Auto-retry alternative models & keys when Google reports high demand
                  </span>
                </div>
                {llmConfig.autoRetryOn503 ? (
                  <ToggleRight className="w-6 h-6 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-slate-600" />
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: GLOBAL SYSTEM PROMPT TEMPLATES & GUARDRAILS */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Global System Prompt Template & Universal Guardrails
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  This master directive is dynamically injected before every autonomous AI agent. Use dynamic variables to adapt to each tenant business.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetGlobalPrompt}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Reset to Standard Template
              </button>
            </div>

            {/* Variable Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400">Insert Dynamic Variable:</span>
              {[
                { tag: 'business_name', label: '{{business_name}}' },
                { tag: 'industry', label: '{{industry}}' },
                { tag: 'currency', label: '{{currency}}' },
                { tag: 'tone', label: '{{tone}}' },
              ].map((v) => (
                <button
                  key={v.tag}
                  type="button"
                  onClick={() => handleInsertVariable(v.tag)}
                  className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-700 text-[11px] font-mono text-indigo-300 hover:border-indigo-500 hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  {v.label}
                </button>
              ))}
            </div>

            <div>
              <textarea
                rows={5}
                value={llmConfig.globalSystemPromptTemplate || ''}
                onChange={(e) =>
                  setLlmConfig({
                    ...llmConfig,
                    globalSystemPromptTemplate: e.target.value,
                  })
                }
                placeholder="Enter global system prompt template with {{business_name}}..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              />
            </div>
          </div>

          {/* SECTION 4: AI CAPABILITIES SWITCHES */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Autonomous System Capabilities
            </h3>

            <div className="space-y-3">
              {[
                {
                  key: 'autonomousQuoting',
                  label: 'Autonomous Quoting Engine',
                  desc: 'Issue instant quotes & Stripe checkout links during chat',
                },
                {
                  key: 'leadScoringEngine',
                  label: 'Predictive Lead Scoring',
                  desc: 'Score inbound inquiries 1-100 based on intent & budget',
                },
                {
                  key: 'sentimentAnalysis',
                  label: 'Sentiment & Urgent Escalation',
                  desc: 'Detect frustrated visitors and auto-notify human team',
                },
                {
                  key: 'autoTranslate',
                  label: 'Universal Language Translation',
                  desc: 'Seamlessly converse in Spanish, French, Arabic, Mandarin',
                },
                {
                  key: 'creativeStudioPolish',
                  label: 'Creative Studio LLM Polish',
                  desc: 'Enhance marketing assets and 90-day growth plans',
                },
              ].map((item) => {
                const active =
                  llmConfig.features[item.key as keyof typeof llmConfig.features];
                return (
                  <div
                    key={item.key}
                    onClick={() =>
                      setLlmConfig({
                        ...llmConfig,
                        features: {
                          ...llmConfig.features,
                          [item.key]: !active,
                        },
                      })
                    }
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors"
                  >
                    <div className="pr-3">
                      <div className="text-xs font-semibold text-slate-200">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </div>
                    <button type="button" className="text-indigo-400 shrink-0 cursor-pointer">
                      {active ? (
                        <ToggleRight className="w-6 h-6 text-indigo-500" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-600" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Gemini API Test Workbench */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-400" />
                  Gemini API Interactive Workbench & Test Runner
                </h3>
                <p className="text-xs text-slate-400">
                  Directly invoke Google Gemini API with custom prompts to test latency, reasoning, and response quality before deploying changes.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Model:</span>
                <select
                  value={workbenchModel}
                  onChange={(e) => setWorkbenchModel(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-indigo-400 font-semibold focus:outline-none"
                >
                  <option value="gemini-3.8-flash">gemini-3.8-flash</option>
                  <option value="gemini-flash-latest">gemini-flash-latest</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview</option>
                </select>

                <span className="text-slate-400 ml-2">Persona:</span>
                <select
                  value={workbenchPersona}
                  onChange={(e) => setWorkbenchPersona(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none capitalize"
                >
                  {Object.keys(llmConfig.personaPrompts).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Test Prompt / Customer Inquiry Simulation
              </label>
              <textarea
                rows={3}
                value={workbenchPrompt}
                onChange={(e) => setWorkbenchPrompt(e.target.value)}
                placeholder="Enter customer message or strategic prompt to test..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Runs against server-side Google GenAI client with official @google/genai SDK</span>
              </div>

              <button
                type="button"
                onClick={handleRunWorkbenchTest}
                disabled={workbenchTesting || !workbenchPrompt.trim()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all active:scale-95"
              >
                <Play className={`w-3.5 h-3.5 ${workbenchTesting ? 'animate-spin' : ''}`} />
                <span>{workbenchTesting ? 'Executing Inference...' : 'Run Test via Gemini API'}</span>
              </button>
            </div>

            {/* Workbench Output */}
            {workbenchResult && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3 animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="font-semibold text-white">Execution Successful</span>
                    <span className="text-slate-400">({workbenchResult.modelUsed})</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-slate-300 font-mono">
                    <span>Latency: <strong className="text-indigo-400">{workbenchResult.latencyMs}ms</strong></span>
                    <span>Tokens: <strong className="text-purple-400">{workbenchResult.promptTokens} in / {workbenchResult.responseTokens} out</strong></span>
                    <span>Cost: <strong className="text-emerald-400">${workbenchResult.costEstimated.toFixed(5)}</strong></span>
                  </div>
                </div>

                <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800 font-sans">
                  {workbenchResult.output}
                </div>
              </div>
            )}
          </div>

          {/* Persona System Prompts Editor */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <Bot className="w-4 h-4" />
                Baseline Persona Directives & Tone Control (7 Agents)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                These core system prompts define the personality, tone, domain knowledge, and conversational boundaries for every autonomous AI employee across all tenant businesses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(llmConfig.personaPrompts).map(([role, prompt]) => (
                <div
                  key={role}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white capitalize">
                      {role.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <span className="text-[10px] text-indigo-400 font-mono">
                      Active Directive
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) =>
                      setLlmConfig({
                        ...llmConfig,
                        personaPrompts: {
                          ...llmConfig.personaPrompts,
                          [role]: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: SYSTEM ACTIVITIES STREAM */}
      {activeAdminTab === 'activities' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Global Real-Time System Activities
              </h2>
              <p className="text-xs text-slate-400">
                Audited stream of tenant registrations, AI conversations, lead scoring, and transactions across the platform.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">All Activities ({activities.length})</option>
                <option value="visitor_registered">Registrations</option>
                <option value="chat_message">AI Chat Interactions</option>
                <option value="lead_captured">Leads Captured</option>
                <option value="order_created">Orders & Payments</option>
                <option value="booking_made">Bookings</option>
                <option value="gemini_called">Gemini LLM Invocations</option>
              </select>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredActivities.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 rounded-2xl bg-slate-900 border border-slate-800">
                No system activities found for the selected filter.
              </div>
            ) : (
              filteredActivities.map((act) => {
                let badgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
                if (act.type === 'visitor_registered')
                  badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                if (act.type === 'order_created')
                  badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                if (act.type === 'gemini_called')
                  badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';

                return (
                  <div
                    key={act.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${badgeColor}`}
                        >
                          {act.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-bold text-white">{act.businessName}</span>
                        <span className="text-slate-500 text-xs">·</span>
                        <span className="text-xs text-indigo-400 font-medium">{act.actor}</span>
                      </div>
                      <p className="text-xs text-slate-300">{act.description}</p>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 shrink-0">
                      {act.metadata && (
                        <div className="flex items-center gap-2 font-mono text-[10px] bg-slate-950 px-2 py-1 rounded border border-slate-800">
                          {act.metadata.latencyMs && (
                            <span>{act.metadata.latencyMs}ms</span>
                          )}
                          {act.metadata.tokens && (
                            <span className="text-purple-400">{act.metadata.tokens} tokens</span>
                          )}
                        </div>
                      )}
                      <span className="text-[11px] text-slate-400">
                        {new Date(act.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB: TENANTS / BUSINESSES */}
      {activeAdminTab === 'businesses' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search businesses by name, industry, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="text-xs text-slate-400">
              Total Tenants: <strong className="text-white">{businesses.length}</strong>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
              <thead className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/40">
                <tr>
                  <th className="py-3 px-4">Business Workspace</th>
                  <th className="py-3 px-4">Industry</th>
                  <th className="py-3 px-4">Owner Email</th>
                  <th className="py-3 px-4 text-center">Subscription</th>
                  <th className="py-3 px-4 text-center">Leads</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4 text-right">System Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBusinesses.map((biz) => (
                  <tr key={biz.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                          style={{ backgroundColor: biz.brandColor || '#4f46e5' }}
                        >
                          {biz.name[0]}
                        </div>
                        <div>
                          <div>{biz.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{biz.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 capitalize">{biz.industry}</td>
                    <td className="py-3.5 px-4 text-slate-400">{biz.contactEmail}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                        {biz.plan || 'Growth'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-300">{biz.leadsCount ?? 4}</td>
                    <td className="py-3.5 px-4 text-center text-slate-300">{biz.ordersCount ?? 3}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleBusinessStatus(biz.id, biz.status || 'active')}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                          biz.status === 'paused'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                      >
                        {biz.status === 'paused' ? 'Paused (Click to Resume)' : 'Active (Click to Pause)'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: OVERVIEW */}
      {activeAdminTab === 'overview' && overview && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Monthly Recurring Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">${overview.mrr.toLocaleString()}</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span>+18.4% from last month</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Active Business Tenants</span>
                <Building2 className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-white">{overview.totalBusinesses}</div>
              <div className="text-[11px] text-indigo-400">
                +{overview.newBusinessesThisMonth} new this month
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>AI Invocations (24h)</span>
                <Cpu className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {overview.aiRequests24h.toLocaleString()}
              </div>
              <div className="text-[10px] text-purple-400 font-mono">Gemini Flash Active</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>System Health</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400">{overview.systemHealth}</div>
              <div className="text-[11px] text-slate-400">Churn Rate: {overview.churnRate}%</div>
            </div>
          </div>

          {/* Revenue Graph Preview */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Platform MRR Growth Trend (Last 6 Months)
            </h3>
            <div className="h-44 flex items-end gap-6 pt-4 px-2">
              {overview.revenueHistory?.map((item: any, i: number) => {
                const max = Math.max(...overview.revenueHistory.map((h: any) => h.mrr));
                const heightPct = Math.round((item.mrr / max) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[10px] font-mono text-indigo-300">
                      ${(item.mrr / 1000).toFixed(1)}k
                    </span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-indigo-700 to-indigo-500 hover:from-indigo-600 hover:to-indigo-400 transition-all cursor-pointer"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[11px] text-slate-400 font-medium">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: SAAS PLANS */}
      {activeAdminTab === 'plans' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Subscription pricing tiers are dynamically displayed on the public landing page and in the customer billing portal.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    {plan.id}
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-1">{plan.name}</h3>
                  <div className="text-2xl font-extrabold text-white mt-2">
                    ${plan.priceMonthly}
                    <span className="text-xs font-normal text-slate-400">/mo</span>
                  </div>

                  <ul className="mt-4 space-y-2 text-xs text-slate-300">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  Monthly Limit: {plan.limits.aiMessages.toLocaleString()} AI Messages
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: CMS */}
      {activeAdminTab === 'cms' && cms && (
        <form onSubmit={handleSaveCms} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Public Landing Page CMS Copy</h2>
              <p className="text-xs text-slate-400">
                Update marketing headlines, call-to-actions, and value propositions rendered on the live public visitor landing page.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {saveCmsSuccess && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Published to Public Site!
                </span>
              )}
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Publish Updates</span>
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Hero Section
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hero Headline
              </label>
              <input
                type="text"
                value={cms.heroHeadline}
                onChange={(e) => setCms({ ...cms, heroHeadline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hero Subheadline
              </label>
              <textarea
                rows={3}
                value={cms.heroSubheadline}
                onChange={(e) => setCms({ ...cms, heroSubheadline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Primary Button CTA Text
                </label>
                <input
                  type="text"
                  value={cms.primaryCtaText}
                  onChange={(e) => setCms({ ...cms, primaryCtaText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Secondary Button CTA Text
                </label>
                <input
                  type="text"
                  value={cms.secondaryCtaText}
                  onChange={(e) => setCms({ ...cms, secondaryCtaText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB: SUPPORT */}
      {activeAdminTab === 'support' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Tenant inquiries and escalation tickets submitted by registered business owners.
          </div>

          <div className="space-y-4">
            {supportTickets.map((t) => (
              <div key={t.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{t.subject}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-indigo-400 border border-slate-700">
                        {t.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Submitted by <strong className="text-slate-300">{t.businessName}</strong> ({t.userEmail})
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={t.status}
                      onChange={(e) => handleTicketStatus(t.id, e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                  {t.description}
                </p>

                {t.replies && t.replies.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">
                      Conversation Thread
                    </div>
                    {t.replies.map((r, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl text-xs space-y-1 ${
                          r.isStaff
                            ? 'bg-indigo-950/40 border border-indigo-500/30 text-indigo-100 ml-4'
                            : 'bg-slate-950 border border-slate-800 text-slate-300 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-semibold text-white">{r.sender}</span>
                          <span>{new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p>{r.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Type official SuperAdmin staff reply..."
                    value={ticketReplyText[t.id] || ''}
                    onChange={(e) =>
                      setTicketReplyText({ ...ticketReplyText, [t.id]: e.target.value })
                    }
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => handleTicketReply(t.id)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SYSTEM LOGS */}
      {activeAdminTab === 'logs' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Real-time server logs from webhook handshakes, Gemini AI tools, Stripe webhooks, and background automations.
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800/80">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex items-start gap-3 hover:bg-slate-800/30 transition-colors">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 mt-0.5 ${
                    log.level === 'error'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : log.level === 'warn'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {log.level}
                </span>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white capitalize font-mono">
                      [{log.category}]
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: PAYMENT GATEWAYS (LEMON SQUEEZY & CRYPTO) */}
      {activeAdminTab === 'payments' && paymentGateways && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-rose-500/10 border border-amber-500/20 dark:border-amber-500/30">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span>Primary Payment Settlement Gateways</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Lemon Squeezy & Crypto Active
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Connect and govern merchant processing. Transactions can be routed through Lemon Squeezy (Merchant of Record with international VAT, cards, Apple Pay) or directly settled on-chain via Cryptocurrency Gateways.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {saveGatewaysSuccess && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-fade-in">
                  <Check className="w-4 h-4" /> Saved & Activated
                </span>
              )}
              <button
                type="button"
                disabled={savingGateways}
                onClick={handleSavePaymentGateways}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {savingGateways ? 'Applying Changes...' : 'Save & Publish Gateways'}
              </button>
            </div>
          </div>

          {/* Active Default Router Selector */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span>Active Default Provider For Autonomous Checkout</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'lemonsqueezy',
                  label: 'Lemon Squeezy',
                  sub: 'Merchant of Record, Global Cards, Tax compliant',
                  color: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
                  icon: CreditCard,
                  connected: paymentGateways.lemonSqueezy?.enabled,
                },
                {
                  id: 'crypto',
                  label: 'Cryptocurrency Gateway',
                  sub: 'USDT, USDC, BTC, ETH, SOL zero chargeback',
                  color: 'border-purple-500/50 bg-purple-500/10 text-purple-400',
                  icon: Coins,
                  connected: paymentGateways.crypto?.enabled,
                },
                {
                  id: 'stripe',
                  label: 'Stripe (Optional)',
                  sub: 'Standard CC Processing (Currently Inactive)',
                  color: 'border-slate-700 bg-slate-800/40 text-slate-400',
                  icon: CreditCard,
                  connected: paymentGateways.stripe?.enabled,
                },
              ].map((p) => {
                const isSelected = paymentGateways.activeDefaultProvider === p.id;
                const IconComp = p.icon;
                return (
                  <div
                    key={p.id}
                    onClick={() =>
                      setPaymentGateways({
                        ...paymentGateways,
                        activeDefaultProvider: p.id as any,
                      })
                    }
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? `${p.color} ring-2 ring-amber-500/40`
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <IconComp className="w-4 h-4" />
                        <span>{p.label}</span>
                      </div>
                      {p.connected ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                          Connected
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                          Offline
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{p.sub}</p>
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                      <span>{isSelected ? '● Default Gateway' : 'Click to select as default'}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lemon Squeezy Detailed Config */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-500/30">
                  🍋
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Lemon Squeezy Configuration
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-300 border border-emerald-700/50">
                      Live Connected
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Merchant of record handling customer checkout, fraud detection, and multi-currency payouts.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setPaymentGateways({
                      ...paymentGateways,
                      lemonSqueezy: {
                        ...paymentGateways.lemonSqueezy,
                        enabled: !paymentGateways.lemonSqueezy.enabled,
                      },
                    })
                  }
                  className="flex items-center gap-2 text-xs font-semibold text-slate-300"
                >
                  <span>Gateway Enabled</span>
                  {paymentGateways.lemonSqueezy.enabled ? (
                    <ToggleRight className="w-7 h-7 text-amber-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Store Identifier / Slug
                </label>
                <input
                  type="text"
                  value={paymentGateways.lemonSqueezy.storeId || ''}
                  onChange={(e) =>
                    setPaymentGateways({
                      ...paymentGateways,
                      lemonSqueezy: {
                        ...paymentGateways.lemonSqueezy,
                        storeId: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. lmsq_store_84920"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  API Key (Secret)
                </label>
                <input
                  type="text"
                  value={paymentGateways.lemonSqueezy.apiKeyMasked || paymentGateways.lemonSqueezy.apiKey || ''}
                  onChange={(e) =>
                    setPaymentGateways({
                      ...paymentGateways,
                      lemonSqueezy: {
                        ...paymentGateways.lemonSqueezy,
                        apiKey: e.target.value,
                        apiKeyMasked: e.target.value,
                      },
                    })
                  }
                  placeholder="lsq_live_..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Webhook Signing Secret
                </label>
                <input
                  type="text"
                  value={paymentGateways.lemonSqueezy.webhookSecretMasked || paymentGateways.lemonSqueezy.webhookSecret || ''}
                  onChange={(e) =>
                    setPaymentGateways({
                      ...paymentGateways,
                      lemonSqueezy: {
                        ...paymentGateways.lemonSqueezy,
                        webhookSecret: e.target.value,
                        webhookSecretMasked: e.target.value,
                      },
                    })
                  }
                  placeholder="whsec_..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Webhook URL:</span>
                <code className="text-amber-300 font-mono">https://api.yourdomain.com/api/webhooks/lemonsqueezy</code>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentGateways.lemonSqueezy.testMode}
                    onChange={(e) =>
                      setPaymentGateways({
                        ...paymentGateways,
                        lemonSqueezy: {
                          ...paymentGateways.lemonSqueezy,
                          testMode: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>Test Mode (Sandbox)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Crypto Payment Gateway Detailed Config */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg border border-purple-500/30">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Cryptocurrency Settlement Gateway
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 border border-purple-700/50">
                      Multi-Chain Ready
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Accept Bitcoin, Ethereum, Solana, and USDT/USDC stablecoins with immediate wallet routing and 0% chargebacks.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setPaymentGateways({
                      ...paymentGateways,
                      crypto: {
                        ...paymentGateways.crypto,
                        enabled: !paymentGateways.crypto.enabled,
                      },
                    })
                  }
                  className="flex items-center gap-2 text-xs font-semibold text-slate-300"
                >
                  <span>Gateway Enabled</span>
                  {paymentGateways.crypto.enabled ? (
                    <ToggleRight className="w-7 h-7 text-purple-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Crypto Provider Engine
                </label>
                <select
                  value={paymentGateways.crypto.provider}
                  onChange={(e) =>
                    setPaymentGateways({
                      ...paymentGateways,
                      crypto: {
                        ...paymentGateways.crypto,
                        provider: e.target.value as any,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="nowpayments">NOWPayments (Custody / Non-Custodial)</option>
                  <option value="coinbase_commerce">Coinbase Commerce</option>
                  <option value="btcpayserver">BTCPay Server (Self-Hosted)</option>
                  <option value="web3_direct">Web3 Direct Wallet Connect</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Provider API / Project Key
                </label>
                <input
                  type="text"
                  value={paymentGateways.crypto.apiKeyMasked || paymentGateways.crypto.apiKey || ''}
                  onChange={(e) =>
                    setPaymentGateways({
                      ...paymentGateways,
                      crypto: {
                        ...paymentGateways.crypto,
                        apiKey: e.target.value,
                        apiKeyMasked: e.target.value,
                      },
                    })
                  }
                  placeholder="np_live_... / cc_..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  IPN / Webhook Secret Key
                </label>
                <input
                  type="text"
                  value={paymentGateways.crypto.webhookSecretMasked || paymentGateways.crypto.webhookSecret || ''}
                  onChange={(e) =>
                    setPaymentGateways({
                      ...paymentGateways,
                      crypto: {
                        ...paymentGateways.crypto,
                        webhookSecret: e.target.value,
                        webhookSecretMasked: e.target.value,
                      },
                    })
                  }
                  placeholder="ipn_secret_..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Accepted Currencies & Tokens
              </label>
              <div className="flex flex-wrap gap-2">
                {(['USDT', 'USDC', 'BTC', 'ETH', 'SOL'] as const).map((token) => {
                  const isAccepted = paymentGateways.crypto.acceptedCurrencies?.includes(token);
                  return (
                    <button
                      key={token}
                      type="button"
                      onClick={() => {
                        const current = paymentGateways.crypto.acceptedCurrencies || [];
                        const next = isAccepted
                          ? current.filter((c) => c !== token)
                          : [...current, token];
                        setPaymentGateways({
                          ...paymentGateways,
                          crypto: {
                            ...paymentGateways.crypto,
                            acceptedCurrencies: next,
                          },
                        });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
                        isAccepted
                          ? 'bg-purple-900/40 text-purple-300 border-purple-500/50 shadow-sm'
                          : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span>{token}</span>
                      {isAccepted ? <Check className="w-3.5 h-3.5 text-purple-400" /> : <span className="text-[10px]">+</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Cold Storage / Settlement Wallet
                </label>
                <input
                  type="text"
                  value={paymentGateways.crypto.walletAddress || ''}
                  onChange={(e) =>
                    setPaymentGateways({
                      ...paymentGateways,
                      crypto: {
                        ...paymentGateways.crypto,
                        walletAddress: e.target.value,
                      },
                    })
                  }
                  placeholder="0x... / bc1q..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Supported Settlement Networks
                </label>
                <input
                  type="text"
                  value={paymentGateways.crypto.network || ''}
                  onChange={(e) =>
                    setPaymentGateways({
                      ...paymentGateways,
                      crypto: {
                        ...paymentGateways.crypto,
                        network: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. Ethereum, Solana, Bitcoin, Polygon"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Crypto IPN Callback:</span>
                <code className="text-purple-300 font-mono">https://api.yourdomain.com/api/webhooks/crypto</code>
              </div>
              <div>
                <span className="text-emerald-400 font-semibold">Instant confirmation with 0 chargeback exposure</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeAdminTab === 'flags' && flags && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Globally enable or toggle modules for all business tenants on the platform.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(flags).map(([key, enabled]) => (
              <div
                key={key}
                onClick={async () => {
                  const updated = { ...flags, [key]: !enabled };
                  setFlags(updated);
                  await fetch('/api/admin/feature-flags', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated),
                  });
                }}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-750 transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-white capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {enabled ? 'Active for all tenants' : 'Temporarily disabled'}
                  </div>
                </div>

                <button type="button" className="text-indigo-400">
                  {enabled ? (
                    <ToggleRight className="w-7 h-7 text-indigo-500" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-600" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
