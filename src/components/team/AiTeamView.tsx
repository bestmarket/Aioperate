import React, { useState, useEffect } from 'react';
import {
  Users,
  Bot,
  Sparkles,
  CheckCircle2,
  Sliders,
  Play,
  ArrowRight,
  ShieldCheck,
  Zap,
  MessageSquare,
  DollarSign,
  Headphones,
  Megaphone,
  Calendar,
  Layers,
  Compass,
  LineChart,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { AiTeamMember } from '../../types.ts';

const DEFAULT_AI_TEAM: AiTeamMember[] = [
  {
    id: 'team_receptionist',
    role: 'receptionist',
    name: 'Aria',
    title: 'AI Front Desk Concierge',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    status: 'active',
    description: 'Greets inbound visitors, answers general inquiries, shares business hours, and routes visitors.',
    capabilities: ['Instant 24/7 greeting', 'FAQ resolution', 'Tone adaptation', 'Multi-language translation'],
    systemGuidance: 'Warm, welcoming, polite, and efficient. Represent the brand with utmost elegance.',
    activeWorkflowsCount: 4,
  },
  {
    id: 'team_sales',
    role: 'sales',
    name: 'Julian',
    title: 'Autonomous Sales & Quoting Agent',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    status: 'active',
    description: 'Discovers buyer needs, qualifies budget, recommends matching products, and issues checkout links.',
    capabilities: ['Budget qualification', 'Catalog recommendations', 'Instant payment links', 'Objection handling'],
    systemGuidance: 'Consultative, persuasive without being pushy, focused on client value and perfect fit.',
    activeWorkflowsCount: 7,
  },
  {
    id: 'team_support',
    role: 'support',
    name: 'Kael',
    title: 'Customer Resolution Specialist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    status: 'active',
    description: 'Resolves customer questions, checks shipping status, provides care instructions, handles escalations.',
    capabilities: ['Order tracking', 'Return & policy queries', 'Empathetic de-escalation', 'Human staff handover'],
    systemGuidance: 'Empathetic, clear, and reassuring. Offer instant resolutions and escalate gracefully if needed.',
    activeWorkflowsCount: 5,
  },
  {
    id: 'team_marketing',
    role: 'marketing',
    name: 'Lyra',
    title: 'AI Content & Campaign Marketer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    status: 'active',
    description: 'Generates high-converting social media posts, ad copy, WhatsApp broadcasts, and seasonal emails.',
    capabilities: ['Social copy generator', 'Ad headline testing', 'Broadcast scheduling', 'Hashtag & SEO optimizer'],
    systemGuidance: 'Creative, punchy, on-brand, and focused on driving clicks, inquiries, and conversions.',
    activeWorkflowsCount: 3,
  },
  {
    id: 'team_booking',
    role: 'booking',
    name: 'Soren',
    title: 'VIP Booking & Calendar Coordinator',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    status: 'active',
    description: 'Checks staff availability, suggests open slots, collects reservation deposits, and sends reminders.',
    capabilities: ['Calendar synchronization', 'Deposit collection', 'Automated SMS/Email reminders', 'Rescheduling'],
    systemGuidance: 'Organized, precise, respectful of client time, ensuring seamless calendar bookings.',
    activeWorkflowsCount: 4,
  },
  {
    id: 'team_operations',
    role: 'operations',
    name: 'Vance',
    title: 'Operations & Fulfillment Supervisor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    status: 'active',
    description: 'Monitors inventory levels, generates 4x6 courier shipping labels, and alerts staff on bottlenecks.',
    capabilities: ['Stock threshold alerts', 'Shipping label creation', 'Courier barcode tracking', 'Supplier updates'],
    systemGuidance: 'Rigorous, detail-oriented, and focused on 100% operational fulfillment accuracy.',
    activeWorkflowsCount: 6,
  },
  {
    id: 'team_strategist',
    role: 'strategist',
    name: 'Athena',
    title: 'Chief Growth & Revenue Strategist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    status: 'active',
    description: 'Formulates 90-day growth blueprints, competitor analyses, SWOT assessments, and margin strategies.',
    capabilities: ['90-day plan generation', 'SWOT & competitor analysis', 'AOV & LTV maximization', 'Pricing models'],
    systemGuidance: 'High-level strategic mindset, data-driven, focused on sustainable enterprise growth.',
    activeWorkflowsCount: 2,
  },
  {
    id: 'team_analytics',
    role: 'analytics',
    name: 'Orion',
    title: 'AI Telemetry & ROI Auditor',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    status: 'active',
    description: 'Tracks deflection rates, revenue generated by AI, conversation conversion rates, and ROI metrics.',
    capabilities: ['ROI attribution', 'Deflection audit', 'Abandonment detection', 'Executive reporting'],
    systemGuidance: 'Analytical, objective, concise, translating raw business events into clear growth insights.',
    activeWorkflowsCount: 3,
  },
];

interface AiTeamViewProps {
  onOpenTestSandbox?: () => void;
}

export const AiTeamView: React.FC<AiTeamViewProps> = ({ onOpenTestSandbox }) => {
  const { activeBusiness } = useAuth();
  const [team, setTeam] = useState<AiTeamMember[]>(DEFAULT_AI_TEAM);
  const [selectedMember, setSelectedMember] = useState<AiTeamMember>(DEFAULT_AI_TEAM[0]);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [testingPersona, setTestingPersona] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const businessId = activeBusiness?.id || 'biz_aura_001';

  const loadTeam = async () => {
    try {
      const data = await api.getAiTeam(businessId);
      if (Array.isArray(data) && data.length > 0) {
        setTeam(data);
        const match = data.find((m) => m.id === selectedMember.id) || data[0];
        setSelectedMember(match);
      }
    } catch (e) {
      console.error('Failed to load AI team:', e);
    }
  };

  useEffect(() => {
    loadTeam();
  }, [businessId]);

  const toggleStatus = async (id: string) => {
    const target = team.find((m) => m.id === id);
    if (!target) return;
    const nextStatus = target.status === 'active' ? 'standby' : 'active';
    setTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m))
    );
    try {
      await api.updateAiTeamMember(businessId, id, { status: nextStatus });
    } catch (err) {
      console.error('Failed to update status on server:', err);
    }
  };

  const handleSaveMember = async () => {
    setTeam((prev) => prev.map((m) => (m.id === selectedMember.id ? selectedMember : m)));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    try {
      await api.updateAiTeamMember(businessId, selectedMember.id, selectedMember);
    } catch (err) {
      console.error('Failed to persist AI team member:', err);
    }
  };

  const runPersonaSimulation = async () => {
    if (!testInput.trim()) return;
    setTestingPersona(true);
    setTestOutput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: activeBusiness?.id,
          message: `[Simulating as ${selectedMember.name} - ${selectedMember.title}]: ${testInput}`,
          customer: { name: 'VIP Simulator Client', email: 'test@simulator.luxury' },
        }),
      });
      const data = await res.json();
      setTestOutput(data.reply || 'Simulation completed.');
    } catch (e) {
      setTestOutput(
        `[${selectedMember.name}]: Thank you for reaching out. Based on our ${activeBusiness?.name} catalog and private service offerings, I am prepared to assist you with distinction.`
      );
    } finally {
      setTestingPersona(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'receptionist':
        return MessageSquare;
      case 'sales':
        return DollarSign;
      case 'support':
        return Headphones;
      case 'marketing':
        return Megaphone;
      case 'booking':
        return Calendar;
      case 'operations':
        return Layers;
      case 'strategist':
        return Compass;
      case 'analytics':
        return LineChart;
      default:
        return Bot;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Business Team</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              8 Specialized Personas
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl">
            Each persona operates on the same unified business knowledge, catalog, and CRM data while maintaining
            domain-specific intelligence for specialized business workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTestSandbox}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Live Chat Sandbox</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Persona List (Left) + Detail Config & Simulation (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 8 Personas Cards */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Active Digital Workforce ({team.filter((m) => m.status === 'active').length} of {team.length} Active)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {team.map((member) => {
              const isSelected = selectedMember.id === member.id;
              const RoleIcon = getRoleIcon(member.role);
              return (
                <div
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className={`relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-700 shadow"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm">{member.name}</span>
                            <span className="p-1 rounded bg-slate-800 text-indigo-400">
                              <RoleIcon className="w-3 h-3" />
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 leading-tight">{member.title}</div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(member.id);
                        }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-colors ${
                          member.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {member.status === 'active' ? 'Active' : 'Standby'}
                      </button>
                    </div>

                    <p className="mt-3 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {member.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>{member.activeWorkflowsCount} Workflows</span>
                    </span>
                    <span className="text-indigo-400 font-medium group-hover:underline flex items-center gap-0.5">
                      Configure <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Persona Deep-Dive Configuration & Live Simulation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  className="w-12 h-12 rounded-xl object-cover border border-indigo-500/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{selectedMember.name}</h2>
                    <span className="text-xs text-indigo-400 font-medium">({selectedMember.title})</span>
                  </div>
                  <p className="text-xs text-slate-400">Persona Role: {selectedMember.role.toUpperCase()}</p>
                </div>
              </div>

              <button
                onClick={handleSaveMember}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/20 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saveSuccess ? 'Saved!' : 'Save Rules'}</span>
              </button>
            </div>

            {/* Persona Guidance / Directives */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Persona Directives & Guardrails
              </label>
              <textarea
                rows={3}
                value={selectedMember.systemGuidance}
                onChange={(e) =>
                  setSelectedMember({ ...selectedMember, systemGuidance: e.target.value })
                }
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed font-mono"
                placeholder="Specific guidance for how this AI persona conducts business interactions..."
              />
            </div>

            {/* Core Capabilities */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Core Capabilities & Tool Bindings
              </label>
              <div className="flex flex-wrap gap-1.5">
                {selectedMember.capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-[11px] text-slate-300 font-medium"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{cap}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Simulation Sandbox */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Test {selectedMember.name} in Sandbox</span>
                </span>
                <span className="text-[10px] text-slate-400">Context: {activeBusiness?.name}</span>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && runPersonaSimulation()}
                    placeholder={`Ask ${selectedMember.name} something as a customer...`}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={runPersonaSimulation}
                    disabled={testingPersona || !testInput.trim()}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-medium transition-colors"
                  >
                    {testingPersona ? 'Testing...' : 'Send'}
                  </button>
                </div>

                {testOutput && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs text-slate-200 leading-relaxed animate-in fade-in duration-200">
                    <div className="font-semibold text-indigo-400 mb-1 flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5" />
                      <span>{selectedMember.name} Response:</span>
                    </div>
                    <p className="whitespace-pre-line">{testOutput}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
