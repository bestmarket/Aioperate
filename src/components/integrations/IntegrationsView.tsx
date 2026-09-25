import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { IntegrationStatus } from '../../types.ts';
import {
  Boxes,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  Smartphone,
  Calendar,
  CreditCard,
  Truck,
  Mail,
  Coins,
  PhoneCall,
  RefreshCw,
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const businessId = activeBusiness?.id || 'biz_aura_001';

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const data = await api.getIntegrations(businessId);
      setIntegrations(data);
    } catch (err) {
      console.error('Failed to load integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, [businessId]);

  const toggleStatus = async (id: string) => {
    try {
      setTogglingId(id);
      const res = await api.toggleIntegration(businessId, id);
      setIntegrations((prev) =>
        prev.map((i) => (i.id === id ? { ...i, connected: res.item.connected } : i))
      );
    } catch (err) {
      console.error('Failed to toggle integration:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const getCategoryIcon = (category: string, name: string) => {
    if (name.toLowerCase().includes('crypto')) return Coins;
    if (name.toLowerCase().includes('lemon')) return CreditCard;
    if (name.toLowerCase().includes('voice') || category === 'voice') return PhoneCall;
    if (name.toLowerCase().includes('whatsapp') || category === 'channel') return Smartphone;
    if (category === 'payment') return CreditCard;
    if (category === 'ecommerce') return Globe;
    if (category === 'crm') return Boxes;
    return Zap;
  };

  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Boxes className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Integrations & Connected Ecosystem</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-xs font-semibold">
              Live Gateway Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Seamlessly synchronize your payment gateways, Meta WhatsApp Business Cloud, AI telephony, and e-commerce catalogs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadIntegrations}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors"
            title="Refresh integrations"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <ShieldCheck className="w-4 h-4" /> {connectedCount} Active Connections
          </span>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => {
          const Icon = getCategoryIcon(item.category, item.name);
          const isConnected = item.connected;
          const isToggling = togglingId === item.id;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all shadow-sm ${
                isConnected
                  ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/60 hover:border-indigo-300 dark:hover:border-indigo-700'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isConnected
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isConnected
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isConnected ? 'Connected' : 'Available'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3.5">{item.name}</h3>
                <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider block mt-0.5">
                  {item.category}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {isConnected ? 'Webhook / API verified' : 'Standby / Click to enable'}
                </span>
                <button
                  onClick={() => toggleStatus(item.id)}
                  disabled={isToggling}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer disabled:opacity-50 ${
                    isConnected
                      ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
                  }`}
                >
                  {isToggling ? 'Updating...' : isConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
