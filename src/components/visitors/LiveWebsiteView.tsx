import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import {
  VisitorProfile,
  VisitorEvent,
  WebsiteAiConfig,
  Message,
} from '../../types.ts';
import {
  Activity,
  Globe,
  Users,
  Eye,
  MessageSquare,
  Bot,
  UserCheck,
  Send,
  ShieldCheck,
  Clock,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Sliders,
  Copy,
  Check,
  Lock,
  Compass,
  ShoppingBag,
  Zap,
  Phone,
  Mail,
  Smartphone,
  Monitor,
  ChevronRight,
  X,
  Plus,
  Play,
  RotateCcw,
  Code,
} from 'lucide-react';

interface LiveWebsiteViewProps {
  onOpenTestModal?: () => void;
}

export const LiveWebsiteView: React.FC<LiveWebsiteViewProps> = ({ onOpenTestModal }) => {
  const { activeBusiness } = useAuth();
  const businessId = activeBusiness?.id || 'biz_aura_001';
  const businessName = activeBusiness?.name || 'Aura Atelier';

  const [activeTab, setActiveTab] = useState<'control_machine' | 'website_ai' | 'installation'>('control_machine');
  const [visitors, setVisitors] = useState<VisitorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorProfile | null>(null);
  const [selectedVisitorEvents, setSelectedVisitorEvents] = useState<VisitorEvent[]>([]);
  const [visitorConversation, setVisitorConversation] = useState<Message[]>([]);
  const [directMessageText, setDirectMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSentNotice, setMessageSentNotice] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'human_takeover' | 'identified'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiConfig, setAiConfig] = useState<WebsiteAiConfig | null>(null);
  const [savingConfig, setSavingConfig] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [showSnippetModal, setShowSnippetModal] = useState(false);
  const [simulating, setSimulating] = useState(false);

  // Load visitors and Website AI config
  const loadData = async () => {
    try {
      const [vList, config] = await Promise.all([
        api.getVisitors(businessId),
        api.getWebsiteAiConfig(businessId),
      ]);
      setVisitors(vList || []);
      setAiConfig(config);

      // If a visitor is selected, refresh their details
      if (selectedVisitor) {
        const updated = vList.find((v) => v.id === selectedVisitor.id);
        if (updated) {
          setSelectedVisitor(updated);
          loadVisitorDetails(updated.id);
        }
      }
    } catch (err) {
      console.error('Failed to load live website data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll every 6 seconds for live visitor updates
    const interval = setInterval(loadData, 6000);
    return () => clearInterval(interval);
  }, [businessId]);

  // Load selected visitor events and conversation
  const loadVisitorDetails = async (visitorId: string) => {
    try {
      const events = await api.getVisitorEvents(businessId, visitorId);
      setSelectedVisitorEvents(events || []);

      // If visitor has conversation, load messages
      const convId = selectedVisitor?.conversationId || `conv_${visitorId}`;
      const convData = await api.getConversations(businessId);
      const match = convData.find((c) => c.id === convId || c.customerContact === visitorId);
      if (match) {
        const msgs = await api.getConversationMessages(businessId, match.id);
        setVisitorConversation(msgs || []);
      } else {
        setVisitorConversation([]);
      }
    } catch (err) {
      console.error('Error loading visitor details:', err);
    }
  };

  const handleSelectVisitor = (vis: VisitorProfile) => {
    setSelectedVisitor(vis);
    loadVisitorDetails(vis.id);
  };

  const handleSendDirectMessage = async () => {
    if (!selectedVisitor || !directMessageText.trim()) return;
    try {
      setSendingMessage(true);
      await api.sendMessageToVisitor(
        businessId,
        selectedVisitor.id,
        directMessageText,
        'Sarah Montgomery (Owner)'
      );
      setDirectMessageText('');
      setMessageSentNotice(true);
      setTimeout(() => setMessageSentNotice(false), 3000);
      loadVisitorDetails(selectedVisitor.id);
      loadData();
    } catch (err) {
      console.error('Failed to send direct message to visitor:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleToggleTakeover = async (takeover: boolean) => {
    if (!selectedVisitor) return;
    try {
      const res = await api.toggleHumanTakeover(
        businessId,
        selectedVisitor.id,
        takeover,
        'Sarah Montgomery (Owner)'
      );
      setSelectedVisitor(res.visitor);
      loadData();
    } catch (err) {
      console.error('Failed to toggle human takeover:', err);
    }
  };

  const handleTransferAgent = async (targetRole: string) => {
    if (!selectedVisitor) return;
    try {
      const res = await api.transferVisitor(businessId, selectedVisitor.id, { targetRole });
      setSelectedVisitor(res.visitor);
      loadData();
    } catch (err) {
      console.error('Failed to transfer visitor agent:', err);
    }
  };

  const handleToggleAgentRole = async (role: string) => {
    if (!aiConfig) return;
    const current = aiConfig.enabledAgentRoles || [];
    const next = current.includes(role) ? current.filter((r) => r !== role) : [...current, role];
    const updated = { ...aiConfig, enabledAgentRoles: next };
    setAiConfig(updated);
    try {
      setSavingConfig(true);
      await api.updateWebsiteAiConfig(businessId, { enabledAgentRoles: next });
    } catch (err) {
      console.error('Failed to update enabled agent roles:', err);
    } finally {
      setSavingConfig(false);
    }
  };

  const handleToggleWebsiteAction = async (action: string) => {
    if (!aiConfig) return;
    const current = aiConfig.allowedWebsiteActions || [];
    const next = current.includes(action) ? current.filter((a) => a !== action) : [...current, action];
    const updated = { ...aiConfig, allowedWebsiteActions: next };
    setAiConfig(updated);
    try {
      setSavingConfig(true);
      await api.updateWebsiteAiConfig(businessId, { allowedWebsiteActions: next });
    } catch (err) {
      console.error('Failed to update allowed website actions:', err);
    } finally {
      setSavingConfig(false);
    }
  };

  // Simulate a live visitor action
  const handleSimulateVisitor = async (type: 'pricing' | 'checkout' | 'returning') => {
    try {
      setSimulating(true);
      const testVisitorId = type === 'returning' ? 'vis_1043' : `vis_${Math.floor(1050 + Math.random() * 800)}`;
      const page = type === 'pricing' ? '/pricing' : type === 'checkout' ? '/checkout' : '/products/monaco-overcoat';
      
      await api.trackVisitorEvent(businessId, {
        visitorId: testVisitorId,
        type: type === 'pricing' ? 'page_view' : type === 'checkout' ? 'checkout_started' : 'product_view',
        page,
        metadata: {
          simulated: true,
          action: `Simulated visitor interaction on ${page}`,
          time: new Date().toLocaleTimeString(),
        },
        customerInfo: type === 'returning' ? { name: 'Alexander Wright', email: 'alex.wright@vanguard-cap.com' } : undefined,
      });

      await loadData();
    } catch (err) {
      console.error('Failed simulation:', err);
    } finally {
      setSimulating(false);
    }
  };

  const onlineVisitors = visitors.filter((v) => v.isOnline);
  const filteredVisitors = visitors.filter((v) => {
    if (statusFilter === 'online' && !v.isOnline) return false;
    if (statusFilter === 'human_takeover' && !v.humanTakeover) return false;
    if (statusFilter === 'identified' && !v.name && !v.email) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = v.name?.toLowerCase().includes(q);
      const matchId = v.id.toLowerCase().includes(q);
      const matchCountry = v.country.toLowerCase().includes(q);
      const matchPage = v.currentPage.toLowerCase().includes(q);
      const matchIntent = v.currentIntent?.toLowerCase().includes(q);
      return matchName || matchId || matchCountry || matchPage || matchIntent;
    }
    return true;
  });

  const embedScript = `<!-- OperateAI Autonomous Website AI Agent SDK -->
<script
  src="${window.location.origin}/widget.js"
  data-business-id="${businessId}"
  data-auto-track="true"
  data-allow-actions="true"
  async>
</script>`;

  const copySnippet = () => {
    navigator.clipboard.writeText(embedScript);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-white flex items-center gap-2">
                Live Website & Visitor Control Machine
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {onlineVisitors.length} Online Now
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-slate-400 mt-1 max-w-3xl">
              Real-time visitor intelligence, persistent cross-session memory, autonomous AI Business Team execution, and instant human takeover console for {businessName}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowSnippetModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="View and copy 1-line website installation code"
            >
              <Code className="w-3.5 h-3.5" />
              Get Website Snippet
            </button>

            <button
              onClick={() => handleSimulateVisitor('pricing')}
              disabled={simulating}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-stone-700 dark:text-slate-200 text-xs font-semibold border border-stone-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Simulate high-intent visitor viewing pricing"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Simulate Live Event
            </button>

            {onOpenTestModal && (
              <button
                onClick={onOpenTestModal}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Open Live Chat Widget
              </button>
            )}

            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-600 dark:text-slate-300 border border-stone-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Refresh Live Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-stone-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-stone-900 dark:text-white leading-none">
                {onlineVisitors.length}
              </div>
              <div className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">Active Online Now</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-stone-900 dark:text-white leading-none">
                {aiConfig?.enabledAgentRoles?.length || 5} Roles
              </div>
              <div className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">Website AI Team Active</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-stone-900 dark:text-white leading-none">
                {visitors.filter((v) => v.name || v.customerId).length}
              </div>
              <div className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">Known Identified VIPs</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-stone-900 dark:text-white leading-none">
                {aiConfig?.allowedWebsiteActions?.length || 8}
              </div>
              <div className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">Approved Browser Actions</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 border-b border-stone-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('control_machine')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'control_machine'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400 dark:border-rose-400'
                : 'border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Live Visitor Control Machine
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-100 dark:bg-slate-800">
              {visitors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('website_ai')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'website_ai'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400 dark:border-rose-400'
                : 'border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            Website AI Agent Configuration
          </button>

          <button
            onClick={() => setActiveTab('installation')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'installation'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400 dark:border-rose-400'
                : 'border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Website Installation & Security
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LIVE VISITOR CONTROL MACHINE & VISITOR LIVE PROFILE               */}
      {/* ========================================================================= */}
      {activeTab === 'control_machine' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left Column: Online Now Visitor List */}
          <div className={`space-y-4 ${selectedVisitor ? 'xl:col-span-5' : 'xl:col-span-12'}`}>
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search visitors by ID, country, page, or intent..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                      : 'bg-stone-100 text-stone-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  All ({visitors.length})
                </button>
                <button
                  onClick={() => setStatusFilter('online')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                    statusFilter === 'online'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 text-stone-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Online ({onlineVisitors.length})
                </button>
                <button
                  onClick={() => setStatusFilter('human_takeover')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    statusFilter === 'human_takeover'
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 text-stone-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  Staff Takeover
                </button>
                <button
                  onClick={() => setStatusFilter('identified')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    statusFilter === 'identified'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-stone-100 text-stone-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  Identified
                </button>
              </div>
            </div>

            {/* Online Now Visitor Cards List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500">
                  ONLINE NOW FEED ({filteredVisitors.length})
                </span>
                <span className="text-[11px] text-stone-400">Click a visitor to inspect live activity</span>
              </div>

              {filteredVisitors.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 text-stone-400 text-xs">
                  No visitors match the current filter. Click "Simulate Live Event" above to create live visitor traffic.
                </div>
              ) : (
                filteredVisitors.map((vis) => {
                  const isSelected = selectedVisitor?.id === vis.id;
                  return (
                    <div
                      key={vis.id}
                      onClick={() => handleSelectVisitor(vis)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                        isSelected
                          ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 shadow-md ring-1 ring-rose-500/20'
                          : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-slate-700 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {/* Live pulse badge */}
                          <div className="pt-0.5">
                            {vis.isOnline ? (
                              <span className="flex h-2.5 w-2.5 relative" title="Online right now">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                              </span>
                            ) : (
                              <span className="inline-block h-2 w-2 rounded-full bg-stone-300 dark:bg-slate-600" title="Offline"></span>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-stone-900 dark:text-white">
                                {vis.name ? vis.name : `Visitor ${vis.id.replace('vis_', '')}`}
                              </span>
                              {vis.name && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                  Identified VIP
                                </span>
                              )}
                              {vis.humanTakeover && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                  Staff Takeover
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-stone-500 dark:text-slate-400 mt-1">
                              <span>Country: <strong className="text-stone-700 dark:text-slate-300">{vis.country}{vis.city ? ` (${vis.city})` : ''}</strong></span>
                              <span>·</span>
                              <span>Page: <code className="px-1 py-0.2 rounded bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 font-mono text-[10px]">{vis.currentPage}</code></span>
                              <span>·</span>
                              <span>Time on site: <strong>{formatSeconds(vis.totalTimeSpentSeconds || 180)}</strong></span>
                            </div>

                            {/* Status and Intent */}
                            <div className="mt-2 text-xs text-stone-700 dark:text-slate-300 flex items-center gap-1.5">
                              <span className="text-[11px] font-medium text-stone-500 dark:text-slate-400">Status:</span>
                              <span className="font-medium text-rose-600 dark:text-rose-400">{vis.currentIntent || 'Viewing catalog'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Current Assigned Agent Role */}
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700 capitalize flex items-center gap-1">
                            <Bot className="w-3 h-3 text-rose-500" />
                            AI {vis.currentAgentRole || 'sales'} Agent
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {vis.sessionsCount > 1 ? `${vis.sessionsCount} visits (Returning)` : '1st visit'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: VISITOR LIVE PROFILE DRAWER / PANEL */}
          {selectedVisitor && (
            <div className="xl:col-span-7 space-y-5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm sticky top-20 animate-in fade-in zoom-in-95 duration-150">
              {/* Header with Close */}
              <div className="flex items-start justify-between pb-4 border-b border-stone-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-bold text-base shadow-xs">
                    {selectedVisitor.name ? selectedVisitor.name[0] : selectedVisitor.country[0] || 'V'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-stone-900 dark:text-white">
                        {selectedVisitor.name || `Visitor ${selectedVisitor.id.replace('vis_', '')}`}
                      </h2>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        selectedVisitor.isOnline
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-stone-100 dark:bg-slate-800 text-stone-500'
                      }`}>
                        {selectedVisitor.isOnline ? 'Online Now' : 'Offline'}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>ID: <code className="font-mono text-[11px] text-rose-600 dark:text-rose-400">{selectedVisitor.id}</code></span>
                      {selectedVisitor.customerId && (
                        <span>· CRM ID: <code className="font-mono text-[11px]">{selectedVisitor.customerId}</code></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedVisitor(null)}
                    className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SECTION: AI + HUMAN COEXISTENCE CONTROLS */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    AI + Human Coexistence Controls
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">
                    {selectedVisitor.humanTakeover
                      ? 'Staff has taken over this session. Autonomous AI responses are paused.'
                      : `Autonomous AI ${selectedVisitor.currentAgentRole || 'sales'} Agent is currently handling conversation.`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedVisitor.humanTakeover ? (
                    <button
                      onClick={() => handleToggleTakeover(false)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Return to AI
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleTakeover(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Take Over Session
                    </button>
                  )}

                  {/* Transfer to Agent Role */}
                  <select
                    value={selectedVisitor.currentAgentRole || 'sales'}
                    onChange={(e) => handleTransferAgent(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs font-medium text-stone-800 dark:text-slate-200 focus:outline-none"
                    title="Transfer to another AI Business Team Persona"
                  >
                    <option value="receptionist">Aria (Receptionist)</option>
                    <option value="sales">Julian (Sales Closer)</option>
                    <option value="support">Kael (Customer Support)</option>
                    <option value="booking">Sarah (Booking Coordinator)</option>
                    <option value="retention">Elena (Retention & VIP)</option>
                  </select>
                </div>
              </div>

              {/* Identity & Current Activity Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Identity Box */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    Visitor Identity
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Full Name:</span>
                      <span className="font-semibold text-stone-900 dark:text-white">
                        {selectedVisitor.name || 'Anonymous (Not submitted)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Email:</span>
                      <span className="text-stone-800 dark:text-slate-200 font-mono text-[11px]">
                        {selectedVisitor.email || 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Phone:</span>
                      <span className="text-stone-800 dark:text-slate-200 font-mono text-[11px]">
                        {selectedVisitor.phone || 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Country / City:</span>
                      <span className="font-medium text-stone-900 dark:text-white">
                        {selectedVisitor.country}{selectedVisitor.city ? `, ${selectedVisitor.city}` : ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Visits / Sessions:</span>
                      <span className="font-medium text-stone-900 dark:text-white">
                        {selectedVisitor.sessionsCount} session(s)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Device:</span>
                      <span className="text-stone-700 dark:text-slate-300">
                        {selectedVisitor.device?.browser || 'Browser'} on {selectedVisitor.device?.os || 'OS'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Current Activity Box */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    Current Live Activity
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Current Page:</span>
                      <code className="px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-mono text-[11px]">
                        {selectedVisitor.currentPage}
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Previous Page:</span>
                      <span className="text-stone-700 dark:text-slate-300 font-mono text-[11px]">
                        {selectedVisitor.previousPage || 'None (Direct Entry)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Time on Page:</span>
                      <span className="font-semibold text-stone-900 dark:text-white">
                        {formatSeconds(selectedVisitor.timeOnCurrentPageSeconds || 45)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Current Intent:</span>
                      <span className="font-medium text-rose-600 dark:text-rose-400 text-right max-w-[160px] truncate">
                        {selectedVisitor.currentIntent || 'Browsing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Current Agent:</span>
                      <span className="font-semibold text-stone-900 dark:text-white capitalize">
                        AI {selectedVisitor.currentAgentRole || 'sales'} Agent
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Referrer:</span>
                      <span className="text-stone-700 dark:text-slate-300 text-right max-w-[160px] truncate">
                        {selectedVisitor.referrer || 'Direct'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RETURNING VISITOR MEMORY & INTELLIGENCE */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-50 to-rose-50/30 dark:from-slate-800/40 dark:to-rose-950/20 border border-stone-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Visitor Memory & Context Retention
                  </div>
                  <span className="text-[10px] text-stone-400">Persists cross-session</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-stone-100 dark:border-slate-800">
                    <span className="text-[10px] text-stone-400 block font-medium">Interests & Tiers</span>
                    <span className="font-semibold text-stone-800 dark:text-slate-200">
                      {selectedVisitor.memory?.interests?.join(', ') || 'Luxury dinner jackets, bespoke fitting'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-stone-100 dark:border-slate-800">
                    <span className="text-[10px] text-stone-400 block font-medium">Budget & Timeline</span>
                    <span className="font-semibold text-stone-800 dark:text-slate-200">
                      {selectedVisitor.memory?.budget || '$1,500 - $3,500'} · {selectedVisitor.memory?.timeline || 'Immediate'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-stone-100 dark:border-slate-800">
                    <span className="text-[10px] text-stone-400 block font-medium">Last Interaction Summary</span>
                    <span className="text-stone-700 dark:text-slate-300 text-[11px] line-clamp-2">
                      {selectedVisitor.memory?.lastConversationSummary || 'Reviewed sizing for bespoke dinner jacket with Julian.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* LIVE CONVERSATION & DIRECT MANUAL MESSAGING */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    Live Conversation Stream
                  </div>
                  {messageSentNotice && (
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Delivered to visitor screen
                    </span>
                  )}
                </div>

                {/* Messages Feed */}
                <div className="max-h-56 overflow-y-auto space-y-2.5 p-3 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-100 dark:border-slate-850 text-xs">
                  {visitorConversation.length === 0 ? (
                    <div className="text-center py-6 text-stone-400 text-xs">
                      No active messages in this session yet. You can send a live proactive message below.
                    </div>
                  ) : (
                    visitorConversation.map((m) => {
                      const isCustomer = m.sender === 'customer';
                      const isStaff = (m as any).metadata?.isStaff;
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                        >
                          <div
                            className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                              isCustomer
                                ? 'bg-white dark:bg-slate-900 text-stone-900 dark:text-white border border-stone-200 dark:border-slate-800'
                                : isStaff
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-rose-600 text-white shadow-xs'
                            }`}
                          >
                            <div className="text-[10px] opacity-80 mb-1 flex items-center gap-1 font-semibold">
                              {isCustomer ? (
                                'Visitor'
                              ) : isStaff ? (
                                <>
                                  <UserCheck className="w-3 h-3" /> Staff (You)
                                </>
                              ) : (
                                <>
                                  <Bot className="w-3 h-3" /> AI {selectedVisitor.currentAgentRole || 'Sales'} Agent
                                </>
                              )}
                              <span>· {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="whitespace-pre-wrap">{m.content}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Direct Message Input (Section 9 Requirement) */}
                <div className="space-y-2 pt-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Send direct live message to ${selectedVisitor.name || 'visitor'}...`}
                      value={directMessageText}
                      onChange={(e) => setDirectMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendDirectMessage();
                      }}
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                    <button
                      onClick={handleSendDirectMessage}
                      disabled={sendingMessage || !directMessageText.trim()}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send
                    </button>
                  </div>

                  {/* Quick message shortcuts */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-400">
                    <span className="text-[10px] font-semibold">Shortcuts:</span>
                    <button
                      onClick={() => setDirectMessageText("Hi! I noticed you're looking at our bespoke packages. Would you like me to help you choose?")}
                      className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-600 dark:text-slate-300 text-[10px] cursor-pointer"
                    >
                      "Help with plans?"
                    </button>
                    <button
                      onClick={() => setDirectMessageText("Welcome back! Would you like me to verify sizing or reserve your selection for a private fitting?")}
                      className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-600 dark:text-slate-300 text-[10px] cursor-pointer"
                    >
                      "Welcome back follow-up"
                    </button>
                    <button
                      onClick={() => setDirectMessageText("I can prepare a 1-tap checkout link with express insured delivery to your city right now.")}
                      className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-600 dark:text-slate-300 text-[10px] cursor-pointer"
                    >
                      "Instant checkout link"
                    </button>
                  </div>
                </div>
              </div>

              {/* VISITOR JOURNEY TIMELINE */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Journey Timeline Audit Trail
                  </div>
                  <span className="text-[11px] text-stone-400">Chronological Event Stream</span>
                </div>

                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-stone-200 dark:before:bg-slate-800 pl-8">
                  {selectedVisitorEvents.length === 0 ? (
                    <div className="text-stone-400 text-xs py-2">No event records found for this visitor.</div>
                  ) : (
                    selectedVisitorEvents.map((evt) => (
                      <div key={evt.id} className="relative group">
                        <div className="absolute -left-8 mt-1.5 w-3 h-3 rounded-full bg-rose-600 ring-4 ring-white dark:ring-slate-900" />
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-semibold text-xs text-stone-900 dark:text-white capitalize">
                              {evt.type.replace(/_/g, ' ')}
                            </span>
                            <span className="text-stone-400 text-[11px] ml-2">
                              {evt.page}
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {evt.metadata && Object.keys(evt.metadata).length > 0 && (
                          <div className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5 font-mono">
                            {evt.metadata.productName && `Product: ${evt.metadata.productName} `}
                            {evt.metadata.amount && `Amount: $${evt.metadata.amount} `}
                            {evt.metadata.messageSnippet && `"${evt.metadata.messageSnippet}" `}
                            {evt.metadata.initialMessage && `"${evt.metadata.initialMessage}" `}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: WEBSITE AI AGENT CONFIGURATION                                    */}
      {/* ========================================================================= */}
      {activeTab === 'website_ai' && (
        <div className="space-y-6">
          {/* Enabled Roles Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                Website AI Business Team Allocation
              </h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                Select which existing AI Business Team personas operate directly on your website. The central AI orchestrator seamlessly routes visitor intent to the appropriate enabled persona.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {[
                {
                  role: 'receptionist',
                  name: 'Aria (AI Receptionist & Concierge)',
                  desc: 'Greets visitors, answers business hours, explains location, routes inquiries, and initiates human handoffs.',
                  badge: 'Front Desk',
                },
                {
                  role: 'sales',
                  name: 'Julian (AI Sales Closer)',
                  desc: 'Discovers buyer needs, explains pricing tiers, recommends products, answers objections, and issues payment links.',
                  badge: 'Revenue Engine',
                },
                {
                  role: 'support',
                  name: 'Kael (AI Customer Support)',
                  desc: 'Answers FAQs, verifies tracking and order status, explains policies, and de-escalates concerns.',
                  badge: 'Resolution',
                },
                {
                  role: 'booking',
                  name: 'Sarah (AI Booking Coordinator)',
                  desc: 'Checks calendar availability in real-time, displays open fitting slots, and confirms reservations.',
                  badge: 'Calendar',
                },
                {
                  role: 'retention',
                  name: 'Elena (AI Retention & VIP Specialist)',
                  desc: 'Recognizes returning visitors, follows up on past interactions, and recovers abandoned carts.',
                  badge: 'Loyalty & LTV',
                },
              ].map((item) => {
                const isEnabled = aiConfig?.enabledAgentRoles?.includes(item.role) ?? true;
                return (
                  <div
                    key={item.role}
                    className={`p-4 rounded-2xl border transition-all ${
                      isEnabled
                        ? 'bg-rose-50/30 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/60 shadow-xs'
                        : 'bg-stone-50 dark:bg-slate-800/40 border-stone-200 dark:border-slate-800 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                          {item.badge}
                        </span>
                        <h3 className="font-bold text-sm text-stone-900 dark:text-white mt-0.5">
                          {item.name}
                        </h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => handleToggleAgentRole(item.role)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                      </label>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Approved Browser Actions Registry (Section 14) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Approved Website Actions Registry
              </h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                The AI does not have unrestricted browser control. Toggle which pre-approved execution actions the AI is permitted to perform on behalf of visitors.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {[
                { action: 'scroll_to_section', label: 'Scroll to Website Section', desc: 'Smoothly guides visitor to pricing or testimonials' },
                { action: 'navigate_page', label: 'Navigate Page URL', desc: 'Directs visitor to catalog, checkout, or lookbook' },
                { action: 'highlight_element', label: 'Highlight UI Element', desc: 'Draws subtle visual focus to key elements' },
                { action: 'search_catalog', label: 'Execute Product Search', desc: 'Filters products matching visitor specifications' },
                { action: 'display_product', label: 'Display Product Card', desc: 'Renders luxury product tray directly in chat' },
                { action: 'open_booking_modal', label: 'Open VIP Booking Interface', desc: 'Opens interactive calendar time picker' },
                { action: 'start_checkout', label: 'Initiate Secure Checkout', desc: 'Prepares Lemon Squeezy or Stripe checkout' },
                { action: 'show_payment_option', label: 'Show Payment Options', desc: 'Displays installments, Apple Pay or crypto' },
                { action: 'request_human_assistance', label: 'Trigger Human Escalation', desc: 'Alerts business owner & pauses AI' },
              ].map((it) => {
                const isAllowed = aiConfig?.allowedWebsiteActions?.includes(it.action) ?? true;
                return (
                  <div
                    key={it.action}
                    onClick={() => handleToggleWebsiteAction(it.action)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isAllowed
                        ? 'bg-indigo-50/30 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60'
                        : 'bg-stone-50 dark:bg-slate-800/40 border-stone-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="pt-0.5">
                      {isAllowed ? (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-stone-300 dark:border-slate-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-white">{it.label}</div>
                      <div className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">{it.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: WEBSITE INSTALLATION & SECURITY                                   */}
      {/* ========================================================================= */}
      {activeTab === 'installation' && (
        <div className="space-y-6">
          {/* Snippet Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  One-Click Secure Installation Snippet
                </h2>
                <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                  Paste this single lightweight script before the closing <code>&lt;/body&gt;</code> tag on Shopify, WordPress, Webflow, Next.js, or custom HTML.
                </p>
              </div>

              <button
                onClick={copySnippet}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSnippet ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedSnippet ? 'Copied to Clipboard!' : 'Copy Installation Code'}
              </button>
            </div>

            <div className="relative">
              <pre className="p-4 rounded-2xl bg-stone-950 text-stone-100 text-xs font-mono overflow-x-auto border border-stone-800">
                {embedScript}
              </pre>
            </div>
          </div>

          {/* Security & Secret Protection Guarantee (Section 3 Requirement) */}
          <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Browser Zero-Knowledge & Secrets Security Architecture
            </h3>
            <p className="text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed">
              The website installation snippet transmits only your public <code>data-business-id</code> and encrypted visitor session identifiers. <strong>Under no circumstances are Gemini API keys, Stripe/Lemon Squeezy webhook secrets, database credentials, or private system prompts ever exposed in the customer's browser.</strong> All AI orchestration, knowledge grounding, and order processing executes strictly on your secure server backend.
            </p>
          </div>
        </div>
      )}

      {/* Snippet Modal popup */}
      {showSnippetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Website AI Agent Installation Snippet
                </h3>
                <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                  Add this snippet to your website to connect the Live Visitor Machine and Autonomous AI Concierge.
                </p>
              </div>
              <button
                onClick={() => setShowSnippetModal(false)}
                className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <pre className="p-4 rounded-2xl bg-stone-950 text-stone-100 text-xs font-mono overflow-x-auto border border-stone-800">
                {embedScript}
              </pre>
              <button
                onClick={copySnippet}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSnippet ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/80 text-xs">
                <span className="font-bold text-stone-900 dark:text-white block mb-0.5">Shopify / Liquid</span>
                <span className="text-[11px] text-stone-500 dark:text-slate-400">
                  Paste into <code>theme.liquid</code> immediately before the <code>&lt;/body&gt;</code> tag.
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/80 text-xs">
                <span className="font-bold text-stone-900 dark:text-white block mb-0.5">WordPress / WooCommerce</span>
                <span className="text-[11px] text-stone-500 dark:text-slate-400">
                  Insert via Header/Footer Scripts plugin or in <code>footer.php</code>.
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/80 text-xs">
                <span className="font-bold text-stone-900 dark:text-white block mb-0.5">Webflow / Next.js / HTML</span>
                <span className="text-[11px] text-stone-500 dark:text-slate-400">
                  Add to Custom Code Body or as a <code>&lt;Script&gt;</code> tag in Next.js layout.
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowSnippetModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-800 dark:text-slate-200 text-xs font-semibold cursor-pointer"
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
