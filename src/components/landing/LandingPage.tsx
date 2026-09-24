import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Zap,
  ShoppingBag,
  CalendarCheck,
  CreditCard,
  MessageSquare,
  Smartphone,
  BarChart3,
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
  Building2,
  Play,
  Layers,
  ChevronRight,
  PhoneCall,
  DollarSign,
  TrendingUp,
  Clock,
  HelpCircle,
  FileText,
  Star,
  Globe,
  Sliders,
  X,
} from 'lucide-react';
import { WebsiteCmsContent, BillingPlan } from '../../types.ts';
import { ThemeToggle } from '../layout/ThemeToggle.tsx';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenDemo: () => void;
  onEnterDashboard: () => void;
  onGoToLogin?: () => void;
  onGoToAdmin?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onOpenDemo,
  onEnterDashboard,
  onGoToLogin,
  onGoToAdmin,
}) => {
  const [cms, setCms] = useState<WebsiteCmsContent | null>(null);
  const [billingPlans, setBillingPlans] = useState<BillingPlan[]>([]);
  const [annualBilling, setAnnualBilling] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'chat' | 'whatsapp' | 'voice' | 'sales' | 'inbox'>('chat');
  const [activeLegalModal, setActiveLegalModal] = useState<string | null>(null);

  // ROI Calculator state
  const [monthlyInquiries, setMonthlyInquiries] = useState(1200);
  const [avgTicketValue, setAvgTicketValue] = useState(250);

  useEffect(() => {
    const fetchCmsData = async () => {
      try {
        const [cmsRes, plansRes] = await Promise.all([
          fetch('/api/public/cms'),
          fetch('/api/admin/plans'),
        ]);
        if (cmsRes.ok) setCms(await cmsRes.json());
        if (plansRes.ok) setBillingPlans(await plansRes.json());
      } catch (e) {
        console.error('Failed to load public CMS or plans:', e);
      }
    };
    fetchCmsData();
  }, []);

  // ROI Calculations
  const calculatedDeflectionRate = 0.88;
  const calculatedConversionBoost = 0.14;
  const estimatedHoursSaved = Math.round((monthlyInquiries * calculatedDeflectionRate * 7.5) / 60);
  const estimatedAddedRevenue = Math.round(monthlyInquiries * calculatedConversionBoost * avgTicketValue);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col selection:bg-rose-500/25 selection:text-rose-900 dark:selection:bg-indigo-500/30 dark:selection:text-indigo-200 transition-colors duration-200">
      {/* Announcement Ribbon */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 text-white text-[11px] font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>{cms?.announcementText || '✨ OperateAI 2.0 Live: 8-Persona Digital Workforce, WhatsApp Cloud & Voice Concierge'}</span>
        <button
          onClick={onOpenDemo}
          className="ml-2 underline font-bold hover:text-rose-100 transition-colors"
        >
          Try Live Demo →
        </button>
      </div>

      {/* Navigation Bar */}
      <header className="h-20 border-b border-rose-100/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40 px-6 sm:px-12 flex items-center justify-between transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-600 dark:bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-rose-600/25 dark:shadow-indigo-600/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">OperateAI</span>
            <span className="text-[10px] text-rose-500 dark:text-indigo-400 block -mt-1 font-semibold">AI Business OS</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <a href="#preview" className="hover:text-rose-600 dark:hover:text-white transition-colors">Product Live Tour</a>
          <a href="#team" className="hover:text-rose-600 dark:hover:text-white transition-colors">8 AI Personas</a>
          <a href="#roi" className="hover:text-rose-600 dark:hover:text-white transition-colors">ROI Calculator</a>
          <a href="#features" className="hover:text-rose-600 dark:hover:text-white transition-colors">Architecture</a>
          <a href="#pricing" className="hover:text-rose-600 dark:hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-rose-600 dark:hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sweet Light / Dark Mode Toggle */}
          <ThemeToggle />

          {onGoToLogin && (
            <button
              onClick={onGoToLogin}
              className="px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-rose-50 dark:hover:bg-slate-850 transition-colors"
            >
              Sign In
            </button>
          )}

          <button
            onClick={onEnterDashboard}
            className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 dark:text-indigo-300 bg-rose-50 hover:bg-rose-100/80 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 border border-rose-200/80 dark:border-indigo-500/30 transition-colors shadow-xs"
          >
            Business App
          </button>

          {onGoToAdmin && (
            <button
              onClick={onGoToAdmin}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-rose-200/70 dark:border-slate-800 transition-colors shadow-xs"
              title="SaaS Platform SuperAdmin"
            >
              <Shield className="w-3.5 h-3.5 text-rose-500 dark:text-indigo-400" />
              <span>SuperAdmin</span>
            </button>
          )}

          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-rose-600/25 dark:shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <span>{cms?.primaryCtaText || 'Deploy Your AI OS'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 sm:px-12 pt-20 pb-24 max-w-6xl mx-auto text-center overflow-hidden">
        {/* Sweet Ambient Backdrop Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-rose-400/10 dark:bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-8 shadow-xs shadow-rose-100">
          <Sparkles className="w-3.5 h-3.5 text-rose-500 dark:text-indigo-400" />
          <span>Multi-Tenant AI Business Operating System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.14]">
          {cms?.heroHeadline || 'Your Autonomous AI Employee for 24/7 Revenue Growth'}
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          {cms?.heroSubheadline ||
            'Capture inbound leads, qualify buyer intent, issue verified checkout links, schedule VIP calendar appointments, and follow up automatically across Website Chat, WhatsApp Cloud, and Voice.'}
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-rose-600/25 dark:shadow-indigo-600/25 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{cms?.primaryCtaText || 'Start 14-Day Free Trial'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenDemo}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-rose-50/70 border border-rose-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700/80 text-slate-800 dark:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Play className="w-4 h-4 text-rose-600 dark:text-indigo-400 fill-rose-600/20 dark:fill-indigo-400/20" />
            <span>{cms?.secondaryCtaText || 'Experience Live Simulation'}</span>
          </button>
        </div>

        {/* Live Metrics Trust Banner */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-rose-100 dark:border-slate-800/80 pt-8 text-left">
          <div className="p-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">91.4%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Automated Resolution</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-rose-600 dark:text-indigo-400">3.8x</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Lead Conversion Lift</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">24/7</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Omnichannel Presence</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">100%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Isolated Multi-Tenant</div>
          </div>
        </div>
      </section>

      {/* SECTION: LIVE INTERACTIVE PRODUCT PREVIEW TABS */}
      <section id="preview" className="py-20 border-t border-rose-100 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/30 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-indigo-400 mb-2">
              Interactive Product Showcase
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              One Unified AI Brain Across Every Channel
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Select a channel to preview how the autonomous agent operates seamlessly for your customers.
            </p>
          </div>

          {/* Channel Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: 'chat', label: 'Website Chat Concierge', icon: MessageSquare },
              { id: 'whatsapp', label: 'Official WhatsApp Cloud', icon: Smartphone },
              { id: 'voice', label: 'AI Voice Receptionist', icon: PhoneCall },
              { id: 'sales', label: 'Autonomous Quoting', icon: DollarSign },
              { id: 'inbox', label: 'Unified Staff Inbox', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activePreviewTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePreviewTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25 dark:bg-indigo-600 dark:shadow-indigo-600/30'
                      : 'bg-white border border-rose-200/80 text-slate-700 hover:bg-rose-50/60 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-850 shadow-xs'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Preview Canvas */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xl shadow-rose-200/30 dark:shadow-2xl">
            {activePreviewTab === 'chat' && (
              <div className="space-y-4 max-w-xl mx-auto bg-rose-50/30 dark:bg-slate-950 p-6 rounded-2xl border border-rose-100 dark:border-slate-850 shadow-xs">
                <div className="flex items-center gap-3 border-b border-rose-100 dark:border-slate-800 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 dark:bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                    OA
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Aura Concierge (AI Agent)</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Active 24/7 on website
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl text-slate-700 dark:text-slate-300 max-w-[85%] border border-rose-100 dark:border-transparent shadow-xs">
                    Hello! Welcome to Aura Atelier. Are you searching for a made-to-measure evening tuxedo or an everyday bespoke jacket?
                  </div>
                  <div className="bg-rose-600 dark:bg-indigo-600 text-white p-3.5 rounded-2xl ml-auto max-w-[80%] shadow-sm">
                    I need a tuxedo for a black-tie gala next month. What fabrics do you offer?
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl text-slate-700 dark:text-slate-300 max-w-[90%] space-y-2 border border-rose-100 dark:border-transparent shadow-xs">
                    <p>
                      We craft tuxedos using pure Vitale Barberis Canonico Super 150s wool and Italian silk-faced peak lapels ($1,850).
                    </p>
                    <div className="p-2.5 rounded-xl bg-rose-50/50 dark:bg-slate-950 border border-rose-200/80 dark:border-indigo-500/30 flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white">Silk Peak Dinner Suit</span>
                      <button
                        onClick={onOpenDemo}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 dark:bg-indigo-600 text-white font-bold text-[10px] shadow-xs"
                      >
                        Reserve Fitting ($100)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'whatsapp' && (
              <div className="space-y-4 max-w-xl mx-auto bg-rose-50/30 dark:bg-slate-950 p-6 rounded-2xl border border-emerald-500/20 shadow-xs">
                <div className="flex items-center gap-3 border-b border-rose-100 dark:border-slate-800 pb-3">
                  <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Official Meta WhatsApp Cloud API</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Direct two-way customer messaging</div>
                  </div>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl text-slate-700 dark:text-slate-300 max-w-[85%] border border-rose-100 dark:border-transparent shadow-xs">
                    [WhatsApp] Hello Jonathan! Your bespoke measurement session is scheduled for tomorrow at 2:00 PM with Master Tailor Marcus.
                  </div>
                  <div className="bg-emerald-600 text-white p-3.5 rounded-2xl ml-auto max-w-[80%] shadow-sm">
                    Can I reschedule to 4:30 PM?
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl text-slate-700 dark:text-slate-300 max-w-[90%] border border-rose-100 dark:border-transparent shadow-xs">
                    Checking calendar... Marcus is open at 4:30 PM. I’ve rescheduled your fitting and updated your calendar invite!
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'voice' && (
              <div className="space-y-4 max-w-xl mx-auto bg-rose-50/30 dark:bg-slate-950 p-6 rounded-2xl border border-purple-500/20 text-center py-8 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-purple-600/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <PhoneCall className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Voice Receptionist SIP Phone Handler</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Answers incoming phone calls with ultra-low latency, answers pricing questions, takes caller details, and books appointments straight to your CRM.
                </p>
                <div className="pt-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
                    Telephony Ready • Twilio & SIP Compatible
                  </span>
                </div>
              </div>
            )}

            {activePreviewTab === 'sales' && (
              <div className="space-y-4 max-w-xl mx-auto bg-rose-50/30 dark:bg-slate-950 p-6 rounded-2xl border border-amber-500/20 shadow-xs">
                <div className="flex items-center justify-between border-b border-rose-100 dark:border-slate-800 pb-3">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                    <span>Autonomous Sales & Checkout Flow</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">100% Server Verified</span>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 space-y-2 text-xs shadow-xs">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Client Intent Score:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">96/100 (High Buying Intent)</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Generated Quote:</span>
                    <span className="font-bold text-slate-900 dark:text-white">$1,850.00 USD</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Payment Gateway:</span>
                    <span className="font-mono text-[11px] text-rose-600 dark:text-indigo-400">Stripe Checkout / Webhook Verified</span>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'inbox' && (
              <div className="space-y-3 max-w-xl mx-auto bg-rose-50/30 dark:bg-slate-950 p-6 rounded-2xl border border-rose-100 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between border-b border-rose-100 dark:border-slate-800 pb-2 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">Unified Multi-Channel Staff Inbox</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px]">Real-time synchronization</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 flex items-center justify-between text-xs shadow-xs">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Alexander Sterling</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Handled by AI • Converted to VIP Order</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    $1,850 Paid
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION: 8 AI PERSONAS SHOWCASE */}
      <section id="team" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-indigo-400 mb-2">
            The Digital Workforce
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Meet Your 8 Specialized AI Team Members
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            One subscription unlocks an entire digital department, all synchronized around your catalog and brand rules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              role: 'Front Desk Concierge',
              name: 'Aria',
              desc: 'Greets inbound visitors 24/7, answers questions, and adapts tone.',
              badge: '24/7 Greeting',
            },
            {
              role: 'Autonomous Sales Rep',
              name: 'Julian',
              desc: 'Qualifies intent, recommends matching items, and issues checkout links.',
              badge: 'Closes Sales',
            },
            {
              role: 'Resolution Specialist',
              name: 'Kael',
              desc: 'Resolves order issues, tracks courier packages, handles policies.',
              badge: '91% Deflection',
            },
            {
              role: 'Campaign Marketer',
              name: 'Lyra',
              desc: 'Generates high-converting social posts, Meta ads, and email blasts.',
              badge: '10+ Formats',
            },
            {
              role: 'Booking Coordinator',
              name: 'Soren',
              desc: 'Syncs calendar slots, checks staff schedules, and sends SMS alerts.',
              badge: 'Zero Double-Booking',
            },
            {
              role: 'Operations Supervisor',
              name: 'Vance',
              desc: 'Monitors inventory alerts and creates 4x6 courier shipping labels.',
              badge: 'Fulfillment Ready',
            },
            {
              role: 'Chief Strategist',
              name: 'Athena',
              desc: 'Formulates 90-day growth roadmaps, SWOT models, and pricing tactics.',
              badge: 'Growth Blueprints',
            },
            {
              role: 'Telemetry Auditor',
              name: 'Orion',
              desc: 'Measures exact revenue influenced by AI and deflections.',
              badge: 'ROI Analytics',
            },
          ].map((persona, i) => (
            <div key={i} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 space-y-2 flex flex-col justify-between shadow-xs shadow-rose-100/60 dark:shadow-none hover:border-rose-300 dark:hover:border-slate-700 transition-all">
              <div>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200/60 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
                  {persona.badge}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">{persona.name}</h3>
                <div className="text-xs text-rose-600 dark:text-indigo-300 font-semibold">{persona.role}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{persona.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: INTERACTIVE ROI CALCULATOR */}
      <section id="roi" className="py-20 border-t border-rose-100 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/30 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              ROI & Revenue Projection
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">Calculate Your Projected Impact</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              See how much time and incremental revenue OperateAI can deliver for your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xl shadow-rose-200/30 dark:shadow-2xl">
            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <span>Monthly Inbound Inquiries</span>
                  <span className="text-rose-600 dark:text-indigo-400 font-bold">{monthlyInquiries.toLocaleString()} chats/calls</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="10000"
                  step="100"
                  value={monthlyInquiries}
                  onChange={(e) => setMonthlyInquiries(Number(e.target.value))}
                  className="w-full accent-rose-600 dark:accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <span>Average Customer Order / Booking Value</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">${avgTicketValue} USD</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="2500"
                  step="25"
                  value={avgTicketValue}
                  onChange={(e) => setAvgTicketValue(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-slate-950 border border-rose-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Estimated Deflected Inquiries:</span>
                  <span className="text-slate-900 dark:text-white font-semibold">{Math.round(monthlyInquiries * calculatedDeflectionRate)} chats</span>
                </div>
                <div className="flex justify-between">
                  <span>Extra Qualified Conversions:</span>
                  <span className="text-slate-900 dark:text-white font-semibold">{Math.round(monthlyInquiries * calculatedConversionBoost)} orders</span>
                </div>
              </div>
            </div>

            {/* Results Output */}
            <div className="flex flex-col justify-center gap-4 p-6 rounded-2xl bg-rose-50/60 dark:bg-slate-950 border border-rose-200/80 dark:border-indigo-500/30 text-center shadow-xs">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Projected Extra Monthly Revenue
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  +${estimatedAddedRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">From 24/7 autonomous closing & instant replies</div>
              </div>

              <div className="pt-4 border-t border-rose-200/60 dark:border-slate-850">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Staff Hours Saved Monthly
                </div>
                <div className="text-2xl font-extrabold text-rose-600 dark:text-indigo-400 mt-1">
                  ~{estimatedHoursSaved} Hours / mo
                </div>
              </div>

              <button
                onClick={onGetStarted}
                className="mt-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 dark:shadow-indigo-600/30 transition-all cursor-pointer"
              >
                Hire Your AI Operating System
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: ARCHITECTURE FEATURES */}
      <section id="features" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-indigo-400 mb-2">
            Enterprise Grade
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">Full SaaS Feature Architecture</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Bot, title: 'AI Agent Builder', desc: 'Custom tone, persona, multi-language translation, and guardrails.' },
            { icon: Smartphone, title: 'Official WhatsApp Cloud API', desc: 'Two-way verified messaging, automated alerts, and broadcasts.' },
            { icon: MessageSquare, title: 'Website Chat Widget', desc: '1-line embed script with live catalog and appointments.' },
            { icon: Users, title: '360° Lightweight CRM', desc: 'Unified customer profiles tracking leads, orders, and sentiment.' },
            { icon: Zap, title: 'WHEN / IF / THEN Automations', desc: 'Visual workflow engine to recover carts and nurture leads.' },
            { icon: CreditCard, title: 'Server-Verified Payments', desc: 'Stripe, PayPal, and Paystack webhooks preventing client tampering.' },
            { icon: CalendarCheck, title: 'VIP Bookings & Calendar', desc: 'Time slots, deposit collection, and staff assignments.' },
            { icon: ShoppingBag, title: 'Catalog & 4x6 Shipping', desc: 'SKU management, order fulfillment, and barcode labels.' },
            { icon: BarChart3, title: 'AI Impact Analytics', desc: 'Track exact revenue attributed to AI and deflections.' },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-rose-100 dark:border-slate-800 hover:border-rose-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 dark:bg-indigo-600/15 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION: PRICING PLANS */}
      <section id="pricing" className="py-20 border-t border-rose-100 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/20 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-indigo-400 mb-2">
              SaaS Pricing Tiers
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">Predictable Plans for Every Stage</h2>

            {/* Monthly / Annual Toggle */}
            <div className="mt-6 flex items-center justify-center gap-3 text-xs">
              <span className={!annualBilling ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'}>Monthly</span>
              <button
                onClick={() => setAnnualBilling(!annualBilling)}
                className={`w-12 h-6 rounded-full transition-colors p-1 ${annualBilling ? 'bg-rose-600 dark:bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    annualBilling ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={annualBilling ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'}>
                Annual <span className="text-emerald-600 dark:text-emerald-400 font-bold">(Save 20%)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(billingPlans.length > 0
              ? billingPlans.slice(0, 3)
              : [
                  {
                    id: 'starter',
                    name: 'Starter',
                    priceMonthly: 49,
                    features: ['1 AI Business Agent', '1,000 AI Conversations/mo', 'Website Chat Widget', 'Lightweight CRM', 'Email Support'],
                  },
                  {
                    id: 'growth',
                    name: 'Growth',
                    priceMonthly: 149,
                    features: ['WhatsApp Cloud API', '5,000 AI Conversations/mo', 'Product Catalog & Orders', 'WHEN/IF/THEN Automations', 'Appointment Bookings', 'Priority Support'],
                  },
                  {
                    id: 'business',
                    name: 'Business',
                    priceMonthly: 399,
                    features: ['Unlimited AI Conversations', 'Multi-tenant Sub-accounts', 'Voice Receptionist SIP Ready', 'Custom Knowledge Vectors', 'Dedicated Account Manager'],
                  },
                ]
            ).map((plan: any, i: number) => {
              const price = annualBilling ? Math.round(plan.priceMonthly * 0.8) : plan.priceMonthly;
              const isPopular = plan.id === 'growth';

              return (
                <div
                  key={i}
                  className={`p-7 rounded-3xl border flex flex-col justify-between relative transition-all ${
                    isPopular
                      ? 'bg-white border-rose-400 shadow-xl shadow-rose-200/50 dark:bg-slate-900 dark:border-indigo-500 dark:shadow-indigo-600/10'
                      : 'bg-white/80 border-rose-100 shadow-xs dark:bg-slate-900/40 dark:border-slate-800'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-rose-600 dark:bg-indigo-600 text-white font-semibold text-[10px] uppercase tracking-wider shadow-sm">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="text-base font-bold text-slate-900 dark:text-white">{plan.name}</div>
                    <div className="mt-5 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">${price}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">/month</span>
                    </div>

                    <div className="mt-6 space-y-2.5">
                      {plan.features.map((feat: string, fi: number) => (
                        <div key={fi} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={onGetStarted}
                    className={`mt-8 w-full py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                      isPopular
                        ? 'bg-rose-600 hover:bg-rose-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-md shadow-rose-600/25 dark:shadow-indigo-600/30'
                        : 'bg-rose-50 hover:bg-rose-100/80 text-rose-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white'
                    }`}
                  >
                    Start 14-Day Free Trial
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION: FAQ */}
      <section id="faq" className="py-20 px-6 sm:px-12 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {(cms?.faqs || [
            {
              question: 'How does OperateAI differ from a typical chatbot?',
              answer: 'A chatbot only outputs text answers. OperateAI is a full Business Operating System connected to your catalog, orders, bookings calendar, and CRM. It can directly execute actions such as creating an order, booking a time slot, capturing a qualified lead, or escalating to human staff with full context.',
            },
            {
              question: 'Is my business data shared with other companies?',
              answer: 'Never. OperateAI uses a multi-tenant isolated architecture. Each business has dedicated knowledge documents, customer tables, and settings. No cross-tenant data leaks can occur.',
            },
            {
              question: 'Can I connect my official WhatsApp Business number?',
              answer: 'Yes! We integrate with the official Meta WhatsApp Business Cloud API. Your agent handles incoming messages and triggers automated follow-up templates using the exact same business brain as your website widget.',
            },
            {
              question: 'What happens when a customer needs human assistance?',
              answer: 'You can configure customizable escalation rules (e.g. order value over $5,000, angry customer sentiment, or explicit request). When triggered, the AI notifies your team instantly and transfers the conversation to your Unified Staff Inbox.',
            },
          ]).map((faq: { question: string; answer: string }, i: number) => (
            <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xs">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">{faq.question}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-6 sm:px-12 border-t border-rose-100 dark:border-slate-800 bg-gradient-to-b from-rose-50/60 to-white dark:from-slate-900 dark:to-slate-950 text-center">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Ready to hire your 24/7 AI employee?</h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto">
          Set up your business in under 3 minutes and start closing leads around the clock.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-rose-600/30 dark:shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
          >
            Create Your AI Agent Now
          </button>
        </div>
      </section>

      {/* Footer & Compliance Modals */}
      <footer className="py-8 border-t border-rose-100 dark:border-slate-900 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-transparent">
        <div>© 2026 OperateAI Inc. All rights reserved. Enterprise AI Business Operating System.</div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <button onClick={() => setActiveLegalModal('privacy')} className="hover:text-slate-900 dark:hover:text-white">
            Privacy Policy
          </button>
          <span>·</span>
          <button onClick={() => setActiveLegalModal('terms')} className="hover:text-slate-900 dark:hover:text-white">
            Terms of Service
          </button>
          <span>·</span>
          <button onClick={() => setActiveLegalModal('security')} className="hover:text-slate-900 dark:hover:text-white">
            Security & Data Isolation
          </button>
          <span>·</span>
          <button onClick={() => setActiveLegalModal('refund')} className="hover:text-slate-900 dark:hover:text-white">
            Refund Policy
          </button>
        </div>
      </footer>

      {/* Legal & Compliance Modal */}
      {activeLegalModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-rose-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                OperateAI {activeLegalModal} Statement
              </h3>
              <button
                onClick={() => setActiveLegalModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-rose-50 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 max-h-96 overflow-y-auto pr-2 leading-relaxed">
              <p>
                <strong>1. Multi-Tenant Architecture & Data Segregation:</strong> All business records, customer CRM profiles, order records, and custom knowledge documents are partitioned by unique tenant identifier (businessId). We employ strict row-level isolation and zero cross-tenant query policies.
              </p>
              <p>
                <strong>2. Artificial Intelligence Processing & Telemetry:</strong> Inbound messages are processed via enterprise LLM inference engines solely for the purpose of conversational resolution and business function execution. No customer conversation data is utilized to train external public foundation models.
              </p>
              <p>
                <strong>3. Commercial Transactions & Payment Security:</strong> Payment requests generated by the AI agent utilize server-verified checkout links (Stripe / Paystack). OperateAI never stores raw credit card details on application servers.
              </p>
              <p>
                <strong>4. Service Level & Cancellation:</strong> SaaS subscriptions may be upgraded or cancelled at any time through the customer billing portal. Refunds are evaluated pursuant to our standard 14-day customer satisfaction commitment.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm cursor-pointer"
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
