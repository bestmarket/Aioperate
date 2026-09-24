import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
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
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [integrations, setIntegrations] = useState([
    { id: 'meta_whatsapp', name: 'WhatsApp Cloud API', cat: 'Messaging', status: 'Connected', icon: Smartphone },
    { id: 'stripe', name: 'Stripe Payments', cat: 'Finance', status: 'Connected', icon: CreditCard },
    { id: 'google_cal', name: 'Google Calendar API', cat: 'Calendar', status: 'Connected', icon: Calendar },
    { id: 'shopify', name: 'Shopify Storefront', cat: 'E-commerce', status: 'Available', icon: Globe },
    { id: 'hubspot', name: 'HubSpot CRM Sync', cat: 'CRM', status: 'Available', icon: Boxes },
    { id: 'resend', name: 'Resend Transactional Email', cat: 'Email/SMS', status: 'Connected', icon: Mail },
    { id: 'shipstation', name: 'ShipStation & Shippo', cat: 'Logistics', status: 'Connected', icon: Truck },
  ]);

  const toggleStatus = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: i.status === 'Connected' ? 'Available' : 'Connected' } : i
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Integrations & Connected Ecosystem</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Connect external e-commerce, CRM, calendars, and messaging platforms with bank-grade encryption.
          </p>
        </div>

        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> 5 Active Connections
        </span>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => {
          const Icon = item.icon;
          const isConnected = item.status === 'Connected';
          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isConnected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-3">{item.name}</h3>
                <span className="text-[10px] uppercase font-semibold text-slate-400">{item.cat}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  {isConnected ? 'OAuth Sync Active' : 'Requires API Key'}
                </span>
                <button
                  onClick={() => toggleStatus(item.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    isConnected
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
