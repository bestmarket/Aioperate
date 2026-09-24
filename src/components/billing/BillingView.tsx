import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  CreditCard,
  CheckCircle2,
  Zap,
  TrendingUp,
  ShieldCheck,
  Download,
  Sparkles,
} from 'lucide-react';

export const BillingView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<'starter' | 'growth' | 'pro'>('growth');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 49,
      desc: 'Ideal for local businesses getting started with autonomous AI concierges.',
      features: [
        '1 AI Business Agent',
        '1,000 Monthly Conversations',
        'Website Chat Widget',
        'Built-in CRM & Lead Capture',
        'Standard Email Support',
      ],
    },
    {
      id: 'growth',
      name: 'Growth',
      price: 149,
      popular: true,
      desc: 'Complete AI Business Operating System for high-converting SMBs.',
      features: [
        'Everything in Starter',
        '5,000 Monthly Conversations',
        'Official WhatsApp Cloud API',
        'Autonomous Orders & Payments',
        'Calendar Bookings & Automations',
        'Thermal Shipping Label Generator',
      ],
    },
    {
      id: 'pro',
      name: 'Pro Enterprise',
      price: 299,
      desc: 'For multi-location brands and high-volume commercial enterprises.',
      features: [
        'Unlimited AI Business Agents',
        '25,000 Monthly Conversations',
        'AI Voice Phone Receptionist (SIP)',
        'Custom Vector Knowledge Base',
        'Multi-tenant Sub-accounts',
        '24/7 Dedicated Concierge SLA',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Subscription & Usage Metering</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent usage tracking and scalable subscription tiers for {activeBusiness?.name}.
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
          Active Plan: {currentPlan.toUpperCase()} ($149/mo)
        </span>
      </div>

      {/* Usage Metering */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
        <h3 className="text-sm font-bold text-white">Current Billing Cycle Consumption</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Conversations</span>
              <span className="font-mono text-white">1,840 / 5,000</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '36.8%' }} />
            </div>
            <span className="text-[10px] text-slate-400">36.8% used · Resets Oct 1</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>WhatsApp Cloud API Messages</span>
              <span className="font-mono text-white">840 / 2,500</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '33.6%' }} />
            </div>
            <span className="text-[10px] text-slate-400">33.6% used · Meta direct tier</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Knowledge Storage</span>
              <span className="font-mono text-white">4.2 MB / 100 MB</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '4.2%' }} />
            </div>
            <span className="text-[10px] text-slate-400">Vector embeddings cached</span>
          </div>
        </div>
      </div>

      {/* Pricing Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isCurrent = currentPlan === p.id;
          return (
            <div
              key={p.id}
              className={`p-6 rounded-2xl flex flex-col justify-between space-y-6 relative transition-all ${
                p.popular
                  ? 'bg-slate-900 border-2 border-indigo-500 shadow-xl shadow-indigo-600/10'
                  : 'bg-slate-900 border border-slate-800'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-base font-bold text-white">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{p.desc}</p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">${p.price}</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>

                <div className="mt-5 space-y-2.5 text-xs text-slate-300">
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setCurrentPlan(p.id as any)}
                className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  isCurrent
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                }`}
              >
                {isCurrent ? 'Current Plan' : `Switch to ${p.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
