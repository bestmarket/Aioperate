import React, { useState, useEffect } from 'react';
import {
  Palette,
  Sparkles,
  Save,
  Check,
  Eye,
  Sliders,
  Type,
  Image as ImageIcon,
  Copy,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { BrandKit } from '../../types.ts';

export const CreativeStudioView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [brandKit, setBrandKit] = useState<BrandKit>({
    businessId: activeBusiness?.id || 'biz_aura_001',
    logoUrl: '',
    primaryColor: '#4f46e5',
    secondaryColor: '#10b981',
    fontHeading: 'Plus Jakarta Sans',
    fontBody: 'Plus Jakarta Sans',
    brandVoice: 'Sophisticated, discerning, warm, highly knowledgeable in luxury couture.',
    tagline: 'Artisanal Elegance for Discerning Modern Wardrobes',
    missionStatement: 'To create timeless sartorial masterpieces that embody distinction.',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Creative Mockup Generator State
  const [mockupTitle, setMockupTitle] = useState('Autumn Private Showroom Appointments');
  const [mockupSubtitle, setMockupSubtitle] = useState('Bespoke Tailoring & Made-To-Measure Fittings');
  const [mockupBadge, setMockupBadge] = useState('VIP Exclusive');
  const [mockupCta, setMockupCta] = useState('Book Consultation');

  useEffect(() => {
    if (!activeBusiness?.id) return;
    const fetchBrandKit = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/brand-kit/${activeBusiness.id}`);
        if (res.ok) {
          const data = await res.json();
          setBrandKit(data);
        }
      } catch (e) {
        console.error('Failed to load brand kit:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchBrandKit();
  }, [activeBusiness?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness?.id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/brand-kit/${activeBusiness.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandKit),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (e) {
      console.error('Failed to save brand kit:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-pink-600/20 text-pink-400 border border-pink-500/30">
              <Palette className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Creative Studio & Brand Kit</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              Visual Identity & Mockups
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl">
            Maintain consistent brand colors, voice, and typography across all AI generated copy, website widgets, and promotional social creatives.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-medium text-xs shadow-lg shadow-pink-600/25 transition-all"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? 'Brand Kit Saved!' : saving ? 'Saving...' : 'Save Brand Kit'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Brand Kit Settings */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-pink-400" />
              <span>Core Brand Kit Configuration</span>
            </h2>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Brand Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandKit.primaryColor}
                    onChange={(e) => setBrandKit({ ...brandKit, primaryColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={brandKit.primaryColor}
                    onChange={(e) => setBrandKit({ ...brandKit, primaryColor: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandKit.secondaryColor}
                    onChange={(e) => setBrandKit({ ...brandKit, secondaryColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={brandKit.secondaryColor}
                    onChange={(e) => setBrandKit({ ...brandKit, secondaryColor: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Official Brand Tagline</label>
              <input
                type="text"
                value={brandKit.tagline}
                onChange={(e) => setBrandKit({ ...brandKit, tagline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Brand Voice / Tone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tone of Voice Directive</label>
              <textarea
                rows={3}
                value={brandKit.brandVoice}
                onChange={(e) => setBrandKit({ ...brandKit, brandVoice: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-pink-500 leading-relaxed font-sans"
              />
            </div>

            {/* Mission Statement */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mission Statement</label>
              <textarea
                rows={3}
                value={brandKit.missionStatement}
                onChange={(e) => setBrandKit({ ...brandKit, missionStatement: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-pink-500 leading-relaxed font-sans"
              />
            </div>
          </form>
        </div>

        {/* Right Column: Promotional Creative Card Mockup */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-pink-400" />
                <span>Live Creative Card Preview</span>
              </h2>
              <span className="text-[11px] text-slate-400">1:1 Social Asset Format</span>
            </div>

            {/* Customizer controls */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-400 mb-1">Headline</label>
                <input
                  type="text"
                  value={mockupTitle}
                  onChange={(e) => setMockupTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-400 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={mockupBadge}
                  onChange={(e) => setMockupBadge(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Visual Card Canvas */}
            <div
              className="relative aspect-[4/3] rounded-2xl overflow-hidden p-6 flex flex-col justify-between border shadow-2xl transition-all"
              style={{
                background: `linear-gradient(135deg, #090d16 0%, #151a28 60%, ${brandKit.primaryColor}22 100%)`,
                borderColor: `${brandKit.primaryColor}40`,
              }}
            >
              {/* Top ambient glow */}
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40"
                style={{ backgroundColor: brandKit.primaryColor }}
              />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow"
                    style={{ backgroundColor: brandKit.primaryColor }}
                  >
                    {activeBusiness?.name?.[0] || 'O'}
                  </div>
                  <span className="font-bold text-white text-xs tracking-wider uppercase">
                    {activeBusiness?.name || 'Aura Atelier'}
                  </span>
                </div>

                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white tracking-wide uppercase shadow"
                  style={{ backgroundColor: brandKit.secondaryColor }}
                >
                  {mockupBadge}
                </span>
              </div>

              <div className="relative z-10 space-y-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight drop-shadow-md">
                  {mockupTitle}
                </h3>
                <p className="text-xs text-slate-300 font-medium max-w-sm drop-shadow">
                  {mockupSubtitle}
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10">
                <div className="text-[11px] text-slate-400 italic">
                  "{brandKit.tagline}"
                </div>

                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: brandKit.primaryColor }}
                >
                  {mockupCta}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
