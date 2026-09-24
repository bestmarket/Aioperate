import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Customer } from '../../types.ts';
import {
  Users,
  Search,
  Filter,
  Briefcase,
  DollarSign,
  ShoppingBag,
  CalendarCheck,
  Tag,
  Clock,
  Sparkles,
  Plus,
} from 'lucide-react';

export const CrmView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState<string>('all');
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);

  const businessId = activeBusiness?.id || 'biz_aura_001';

  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true);
        const data = await api.getCustomers(businessId);
        setCustomers(data);
        if (data.length > 0) setSelectedCust(data[0]);
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, [businessId]);

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase());

    if (segment === 'high_value') return matchesSearch && c.totalSpent > 2000;
    if (segment === 'repeat') return matchesSearch && c.ordersCount > 1;
    if (segment === 'leads_only') return matchesSearch && c.status === 'lead';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">360° Customer Database & CRM</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Unified omnichannel timeline across website chats, WhatsApp exchanges, orders, and appointments.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {['all', 'high_value', 'repeat', 'leads_only'].map((seg) => (
            <button
              key={seg}
              onClick={() => setSegment(seg)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-colors ${
                segment === seg
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {seg.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Split: Customer List & Customer Detail Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Directory */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-800 bg-slate-950/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-[580px] overflow-y-auto">
            {filtered.map((c) => {
              const isSelected = selectedCust?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCust(c)}
                  className={`w-full p-4 text-left transition-colors flex items-center justify-between text-xs ${
                    isSelected ? 'bg-indigo-600/15 border-l-2 border-indigo-500' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">{c.name}</div>
                    <div className="text-[11px] text-slate-400">{c.email || c.phone}</div>
                    <div className="mt-1 flex items-center gap-1">
                      {c.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-indigo-300 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-emerald-400 font-bold block">${c.totalSpent.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400">{c.ordersCount} orders</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Customer Timeline */}
        {selectedCust ? (
          <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-xs">
            {/* Customer Profile Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white">{selectedCust.name}</h2>
                <div className="text-slate-400 text-xs mt-0.5 flex items-center gap-3">
                  <span>{selectedCust.email}</span>
                  <span>·</span>
                  <span>{selectedCust.phone}</span>
                  {selectedCust.company && (
                    <>
                      <span>·</span>
                      <span className="text-indigo-400">{selectedCust.company}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right">
                  <div className="text-[10px] text-slate-400">Lifetime Spent</div>
                  <div className="text-base font-bold text-emerald-400 font-mono">
                    ${selectedCust.totalSpent.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right">
                  <div className="text-[10px] text-slate-400">Total Bookings</div>
                  <div className="text-base font-bold text-indigo-400 font-mono">
                    {selectedCust.bookingsCount}
                  </div>
                </div>
              </div>
            </div>

            {/* Interaction Timeline Stream */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                Unified Interaction Timeline
              </h3>

              <div className="relative pl-6 border-l border-slate-800 space-y-4 text-xs">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[30px] top-1"></div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="flex items-center justify-between font-semibold text-white">
                      <span>Order Completed & Fulfilled (#ORD-91823)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Yesterday at 4:15 PM</span>
                    </div>
                    <div className="text-slate-400 mt-1">
                      Purchased: Milano Silk-Blend Dinner Jacket ($1,250.00). Stripe verified.
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 absolute -left-[30px] top-1"></div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="flex items-center justify-between font-semibold text-white">
                      <span>Private VIP Consultation Booked</span>
                      <span className="text-[10px] text-slate-400 font-normal">3 days ago</span>
                    </div>
                    <div className="text-slate-400 mt-1">
                      Attended 60-min bespoke fitting session with Marcus Vance.
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500 absolute -left-[30px] top-1"></div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="flex items-center justify-between font-semibold text-white">
                      <span>AI Conversation & Lead Capture</span>
                      <span className="text-[10px] text-slate-400 font-normal">5 days ago</span>
                    </div>
                    <div className="text-slate-400 mt-1">
                      Visitor inquired about evening fabrics. AI scored high buying intent and captured contact details.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center text-xs text-slate-400">
            Select a customer to inspect profile.
          </div>
        )}
      </div>
    </div>
  );
};
