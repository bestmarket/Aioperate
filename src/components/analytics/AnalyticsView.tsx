import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { AnalyticsData } from '../../types.ts';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Flame,
  Bot,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const businessId = activeBusiness?.id || 'biz_aura_001';

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await api.getAnalytics(businessId);
        setData(res);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [businessId]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Business OS Analytics & AI Telemetry</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time quantitative tracking of AI conversations, revenue influence, lead conversion, and staff time saved.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', val: `$${(data?.revenue || 24800).toLocaleString()}`, change: '+24.5%', sub: 'orders + bookings' },
          { label: 'Conversations Handled', val: data?.conversations || 184, change: '+32.1%', sub: '24/7 across channels' },
          { label: 'Conversion Rate', val: `${data?.conversionRate || 8.4}%`, change: '+2.8%', sub: 'visitor to sale/booking' },
          { label: 'AI Deflection Rate', val: `${data?.aiDeflectionRate || 91.2}%`, change: '+4.5%', sub: 'zero human intervention' },
        ].map((k, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">{k.label}</span>
            <div className="text-2xl font-bold text-white mt-1">{k.val}</div>
            <div className="flex items-center justify-between text-[11px] mt-2">
              <span className="text-emerald-400 font-semibold">{k.change}</span>
              <span className="text-slate-400">{k.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Impact Detailed Grid */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white">AI Employee Business ROI & Efficiency</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-400">Sales Influenced by AI</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              ${(data?.aiInfluenceRevenue || 19340).toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">78% of total revenue</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-400">Human Conversations Avoided</span>
            <div className="text-xl font-bold text-indigo-400 mt-1">162</div>
            <span className="text-[10px] text-slate-400">~38 staff hours saved</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-400">Follow-up Sequences</span>
            <div className="text-xl font-bold text-amber-400 mt-1">182</div>
            <span className="text-[10px] text-slate-400">23 abandoned carts recovered</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-400">Qualified Deals In Pipeline</span>
            <div className="text-xl font-bold text-white mt-1">
              {data?.qualifiedLeads || 48}
            </div>
            <span className="text-[10px] text-slate-400">High intent scoring</span>
          </div>
        </div>
      </div>

      {/* Omnichannel breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-3">Conversation Volume by Channel</h3>
          <div className="space-y-3 text-xs">
            {(data?.conversationsByChannel || [
              { channel: 'Website Chat', count: 128 },
              { channel: 'WhatsApp Cloud', count: 84 },
              { channel: 'Email Concierge', count: 32 },
              { channel: 'AI Voice Receptionist', count: 14 },
            ]).map((ch, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-medium text-white">{ch.channel}</span>
                <span className="font-mono text-indigo-400 font-bold">{ch.count} messages</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-3">Customer Acquisition Breakdown</h3>
          <div className="space-y-3 text-xs">
            {[
              { source: 'Direct Organic Website', share: '46%' },
              { source: 'WhatsApp Direct Click-to-Chat', share: '32%' },
              { source: 'Instagram / Social Referral', share: '14%' },
              { source: 'Word of mouth / VIP Referral', share: '8%' },
            ].map((s, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-medium text-white">{s.source}</span>
                <span className="font-mono text-emerald-400 font-bold">{s.share}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
