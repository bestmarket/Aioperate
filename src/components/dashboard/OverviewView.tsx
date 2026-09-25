import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { AnalyticsData, Lead, Order, Booking } from '../../types.ts';
import { AiDailyBrief } from './AiDailyBrief.tsx';
import {
  DollarSign,
  Users,
  Flame,
  ShoppingBag,
  CalendarCheck,
  TrendingUp,
  Sparkles,
  Bot,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

interface OverviewViewProps {
  onNavigate: (nav: string) => void;
  onOpenTest: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate, onOpenTest }) => {
  const { activeBusiness } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const businessId = activeBusiness?.id || 'biz_aura_001';

  const loadData = async () => {
    try {
      setLoading(true);
      const [analyticsData, leadsData, ordersData, bookingsData] = await Promise.all([
        api.getAnalytics(businessId),
        api.getLeads(businessId),
        api.getOrders(businessId),
        api.getBookings(businessId),
      ]);
      setAnalytics(analyticsData);
      setRecentLeads(leadsData.slice(0, 5));
      setRecentOrders(ordersData.slice(0, 5));
      setRecentBookings(bookingsData.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard overview data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [businessId]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick AI Test CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 bg-gradient-to-r from-rose-50/90 via-pink-50/50 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-rose-200/80 dark:border-slate-800 shadow-sm shadow-rose-200/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              AI Workforce Online
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
            {activeBusiness?.name || 'Aura Atelier'} Control Center
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 mt-1 max-w-xl leading-relaxed">
            Autonomous multi-channel operations: capturing leads, answering questions, generating quotes, and closing sales 24/7.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-white transition-colors shadow-xs"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onOpenTest}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-rose-600/25 dark:shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Launch Sandbox Test</span>
          </button>
        </div>
      </div>

      {/* AI Daily Brief & Strategic Directive */}
      <AiDailyBrief onNavigate={onNavigate} onOpenTest={onOpenTest} />

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Revenue',
            value: `$${(analytics?.revenue || 24800).toLocaleString()}`,
            change: '+24.5%',
            sub: 'orders + bookings',
            icon: DollarSign,
            color: 'text-emerald-500 dark:text-emerald-400',
          },
          {
            label: 'Qualified Leads',
            value: analytics?.qualifiedLeads || 48,
            change: '+18.2%',
            sub: 'high buying intent',
            icon: Flame,
            color: 'text-amber-500 dark:text-amber-400',
          },
          {
            label: 'AI Deflection Rate',
            value: `${analytics?.aiDeflectionRate || 91.2}%`,
            change: '+4.1%',
            sub: 'resolved without human',
            icon: Bot,
            color: 'text-rose-600 dark:text-indigo-400',
          },
          {
            label: 'Booked Sessions',
            value: analytics?.bookings || 31,
            change: '+12.0%',
            sub: 'appointments confirmed',
            icon: CalendarCheck,
            color: 'text-sky-500 dark:text-sky-400',
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xs shadow-rose-100/50 dark:shadow-none relative">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-2">
                <span className="text-xs font-semibold">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{kpi.value}</div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  {kpi.change}
                </span>
                <span className="text-slate-600 dark:text-slate-400 font-medium">{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Website Visitor Machine Banner */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <div className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <span>Live Website Machine Active</span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                3 Visitors Online Now
              </span>
            </div>
            <div className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">
              Autonomous AI Sales Closer & Receptionist routing active. Alexander Wright viewing Monaco Overcoat.
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('live_website')}
          className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>Open Live Control Machine</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* AI Impact Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-indigo-950/20 bg-gradient-to-br from-rose-50/60 to-pink-50/40 dark:from-indigo-950/30 dark:to-slate-900 border border-rose-200/70 dark:border-indigo-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">AI Employee Business Impact</h2>
          </div>
          <span className="text-xs text-rose-700 dark:text-indigo-300 font-bold">Last 30 Days Telemetry</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-rose-100 dark:border-indigo-500/20 shadow-xs">
            <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Sales Influenced by AI</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              ${(analytics?.aiInfluenceRevenue || 19340).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">78% of total revenue</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-rose-100 dark:border-indigo-500/20 shadow-xs">
            <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Questions Answered</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {(analytics?.conversations || 184) * 4}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">0 human minutes spent</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-rose-100 dark:border-indigo-500/20 shadow-xs">
            <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold">After-Hours Revenue</div>
            <div className="text-xl font-bold text-rose-600 dark:text-indigo-400 mt-1">
              ${Math.round((analytics?.revenue || 24800) * 0.42).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">Captured 8PM - 8AM</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-rose-100 dark:border-indigo-500/20 shadow-xs">
            <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Avg Response Latency</div>
            <div className="text-xl font-bold text-sky-600 dark:text-sky-400 mt-1">
              {analytics?.avgResponseTimeSeconds || 1.8}s
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">Real-time Gemini Stream</div>
          </div>
        </div>
      </div>

      {/* Charts & Omnichannel Engagement Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Trend Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Revenue Velocity (7 Days)</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Daily processed volume across channels</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 dark:bg-indigo-500"></span>
              <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Gross Sales</span>
            </div>
          </div>

          <div className="h-48 flex items-end gap-2 pt-6 pb-2 px-2">
            {([
              { date: 'Mon', revenue: 3400, orders: 4 },
              { date: 'Tue', revenue: 5800, orders: 7 },
              { date: 'Wed', revenue: 7200, orders: 9 },
              { date: 'Thu', revenue: 4900, orders: 6 },
              { date: 'Fri', revenue: 9400, orders: 12 },
              { date: 'Sat', revenue: 11200, orders: 15 },
              { date: 'Sun', revenue: 6800, orders: 8 },
            ]).map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  ${day.revenue}
                </div>
                <div className="w-full max-w-[28px] bg-rose-100/70 dark:bg-slate-800 rounded-t-xl relative overflow-hidden flex flex-col justify-end" style={{ height: '80%' }}>
                  <div
                    className="w-full bg-rose-600 hover:bg-rose-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-t-xl transition-all"
                    style={{ height: `${(day.revenue / 12000) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-700 dark:text-slate-300 font-bold">{day.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Omnichannel Distribution */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Omnichannel Engagement</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-4">Volume by incoming customer channel</p>

            <div className="space-y-3">
              {[
                { name: 'Website Chat Widget', count: 128, share: 50, color: 'bg-rose-500 dark:bg-indigo-500' },
                { name: 'WhatsApp Cloud API', count: 84, share: 33, color: 'bg-emerald-500' },
                { name: 'Email Concierge', count: 32, share: 12, color: 'bg-amber-500' },
                { name: 'Voice Telephony (SIP)', count: 14, share: 5, color: 'bg-sky-500' },
              ].map((ch, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{ch.name}</span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px] font-bold">{ch.count} msgs</span>
                  </div>
                  <div className="w-full bg-rose-50 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`${ch.color} h-2 rounded-full`} style={{ width: `${ch.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-rose-100 dark:border-slate-800/80 mt-4">
            <button
              onClick={() => onNavigate('inbox')}
              className="w-full py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10 flex items-center justify-center gap-1 transition-colors"
            >
              <span>Open Unified Inbox</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Tables: Leads & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Leads Table */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              Latest Captured Leads
            </h3>
            <button
              onClick={() => onNavigate('leads')}
              className="text-xs text-rose-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              View All →
            </button>
          </div>

          <div className="space-y-2">
            {recentLeads.length === 0 ? (
              <div className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center font-medium">No leads captured yet.</div>
            ) : (
              recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 rounded-xl bg-rose-50/40 dark:bg-slate-950/60 border border-rose-100 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{lead.name}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate max-w-xs">{lead.interest}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold block">${lead.value}</span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium capitalize">{lead.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Latest Orders & Payments Table */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              Recent Orders & Fulfillment
            </h3>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs text-rose-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              View All →
            </button>
          </div>

          <div className="space-y-2">
            {recentOrders.length === 0 ? (
              <div className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center font-medium">No orders recorded yet.</div>
            ) : (
              recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3 rounded-xl bg-rose-50/40 dark:bg-slate-950/60 border border-rose-100 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white font-mono">{ord.id}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">{ord.customerName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 dark:text-white">${ord.total.toFixed(2)}</div>
                    <span
                      className={`text-[10px] font-semibold ${
                        ord.paymentStatus === 'paid' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {ord.paymentStatus}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
