import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Campaign } from '../../types.ts';
import {
  Megaphone,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Smartphone,
  Mail,
  Users,
  DollarSign,
} from 'lucide-react';

export const CampaignsView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New campaign state
  const [newCampaign, setNewCampaign] = useState<{
    name: string;
    channel: 'whatsapp' | 'email';
    audienceSegment: 'all_customers' | 'new_leads' | 'past_buyers' | 'inactive_30d' | 'high_value_vip';
    messageTemplate: string;
  }>({
    name: '',
    channel: 'whatsapp',
    audienceSegment: 'all_customers',
    messageTemplate: 'Hello {customer_name}! We have just released our private Autumn tailoring collection. Reply to this message to explore swatches.',
  });

  const businessId = activeBusiness?.id || 'biz_aura_001';

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await api.getCampaigns(businessId);
      setCampaigns(data);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, [businessId]);

  const handleCreate = async () => {
    try {
      await api.createCampaign(businessId, newCampaign);
      setShowCreateModal(false);
      setNewCampaign({
        name: '',
        channel: 'whatsapp',
        audienceSegment: 'all_customers',
        messageTemplate: 'Hello {customer_name}! We have just released our private Autumn tailoring collection. Reply to this message to explore swatches.',
      });
      loadCampaigns();
    } catch (err) {
      console.error('Failed to create campaign:', err);
    }
  };

  const handleSendCampaign = async (id: string) => {
    try {
      setSendingId(id);
      const updated = await api.sendCampaign(businessId, id);
      setCampaigns((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setSendingId(null);
    } catch (err) {
      console.error('Failed to dispatch campaign:', err);
      setSendingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Broadcast Campaigns & Outbound Nudges</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Send targeted WhatsApp and Email broadcasts to re-engage VIP customers, announce catalog arrivals, and recover revenue.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Campaign</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((camp) => {
          const isSent = camp.status === 'sent';
          const isSending = sendingId === camp.id;
          return (
            <div
              key={camp.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                    {camp.channel === 'whatsapp' ? <Smartphone className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                    {camp.channel} Broadcast
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isSent
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {camp.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-1.5">{camp.name}</h3>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Audience: {camp.audienceSegment.replace('_', ' ')}</span>
                </div>

                {/* Message preview */}
                <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs font-mono leading-relaxed">
                  {camp.messageTemplate}
                </div>
              </div>

              {/* Performance Metrics if Sent */}
              {isSent ? (
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400">Recipients</span>
                    <div className="font-bold text-white font-mono">{camp.sentCount}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Clicked / Replied</span>
                    <div className="font-bold text-indigo-400 font-mono">{camp.clickCount}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Revenue Won</span>
                    <div className="font-bold text-emerald-400 font-mono">${camp.revenueGenerated.toLocaleString()}</div>
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Ready to dispatch</span>
                  <button
                    onClick={() => handleSendCampaign(camp.id)}
                    disabled={isSending}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm transition-all active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'Sending Broadcast...' : 'Launch Broadcast'}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal New Campaign */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">Create Broadcast Campaign</h3>

            <div>
              <label className="text-slate-300 block mb-1">Campaign Name</label>
              <input
                type="text"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                placeholder="e.g. VIP Fall Private Showcase"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">Delivery Channel</label>
                <select
                  value={newCampaign.channel}
                  onChange={(e) => setNewCampaign({ ...newCampaign, channel: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="whatsapp">WhatsApp Cloud API</option>
                  <option value="email">Email</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Audience Segment</label>
                <select
                  value={newCampaign.audienceSegment}
                  onChange={(e) => setNewCampaign({ ...newCampaign, audienceSegment: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="all_customers">All Customers & Contacts</option>
                  <option value="high_value_vip">High-Value VIPs ($2,000+)</option>
                  <option value="new_leads">New Unconverted Leads</option>
                  <option value="past_buyers">Past Buyers</option>
                  <option value="inactive_30d">Inactive for 30+ Days</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Message Template (supports {'{customer_name}'})</label>
              <textarea
                rows={4}
                value={newCampaign.messageTemplate}
                onChange={(e) => setNewCampaign({ ...newCampaign, messageTemplate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newCampaign.name.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold disabled:opacity-50"
              >
                Save Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
