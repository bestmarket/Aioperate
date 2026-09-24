import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Settings,
  Save,
  Shield,
  Key,
  Database,
  Building,
  CheckCircle2,
  Lock,
  Download,
  Trash2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { activeBusiness, switchBusiness, businesses } = useAuth();
  const [name, setName] = useState(activeBusiness?.name || 'Aura Atelier');
  const [industry, setIndustry] = useState(activeBusiness?.industry || 'Bespoke Luxury Menswear');
  const [website, setWebsite] = useState(activeBusiness?.website || 'https://auraatelier.com');
  const [location, setLocation] = useState(activeBusiness?.location || 'San Francisco, CA');
  const [currency, setCurrency] = useState(activeBusiness?.currency || 'USD');
  const [timezone, setTimezone] = useState(activeBusiness?.timezone || 'America/Los_Angeles');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Business Profile & Tenant Isolation Settings</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure tenant parameters, localization, operating hours, and API security keys.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{saved ? 'Saved!' : 'Save Business Settings'}</span>
        </button>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-400" />
            Core Business Information
          </h3>

          <div>
            <label className="text-slate-300 block mb-1">Company / Brand Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1">Industry Vertical</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1">Website URL</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1">Store Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Operating Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="America/Los_Angeles">Pacific (PT)</option>
                <option value="America/New_York">Eastern (ET)</option>
                <option value="Europe/London">London (GMT)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & Multi-tenant data isolation */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Security & Tenant Isolation
          </h3>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Tenant Partition Key</span>
            <div className="font-mono text-indigo-400 font-bold">{activeBusiness?.id}</div>
            <p className="text-[10px] text-slate-400 mt-1">
              Guaranteed cryptographic database separation. No cross-tenant data leakage.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-slate-300 block mb-1">Tenant Secret API Key</label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  readOnly
                  value="sk_live_opai_994829381029384729"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono"
                />
                <button className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200">
                  Roll Key
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Full Business Data Export</div>
                <div className="text-[11px] text-slate-400">Download all leads, orders, and transcripts in JSON format</div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium">
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
