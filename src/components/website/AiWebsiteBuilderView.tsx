import React, { useState, useEffect } from 'react';
import {
  Globe,
  Sparkles,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Eye,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { GeneratedWebsite } from '../../types.ts';

export const AiWebsiteBuilderView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [websites, setWebsites] = useState<GeneratedWebsite[]>([]);
  const [selectedSite, setSelectedSite] = useState<GeneratedWebsite | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Generator prompt state
  const [prompt, setPrompt] = useState('');
  const [targetAudience, setTargetAudience] = useState('');

  const fetchWebsites = async (retryCount = 0) => {
    if (!activeBusiness?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/websites/${activeBusiness.id}`);
      if (res.ok) {
        const data = await res.json();
        setWebsites(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0 && !selectedSite) {
          setSelectedSite(data[0]);
        }
      } else if (retryCount < 1) {
        setTimeout(() => fetchWebsites(retryCount + 1), 600);
      }
    } catch {
      // Graceful retry once on momentary network disconnect
      if (retryCount < 1) {
        setTimeout(() => fetchWebsites(retryCount + 1), 600);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, [activeBusiness?.id]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !activeBusiness?.id) return;

    setGenerating(true);
    try {
      const genRes = await fetch(`/api/websites/${activeBusiness.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, targetAudience }),
      });

      if (genRes.ok) {
        const pageData = await genRes.json();

        // Save to database
        const saveRes = await fetch(`/api/websites/${activeBusiness.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pageData),
        });

        if (saveRes.ok) {
          const newSite = await saveRes.json();
          setWebsites((prev) => [newSite, ...prev]);
          setSelectedSite(newSite);
          setPrompt('');
        }
      }
    } catch (e) {
      console.error('Failed to generate website:', e);
    } finally {
      setGenerating(false);
    }
  };

  const generateHtmlCode = (site: GeneratedWebsite) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${site.title} | ${activeBusiness?.name || 'OperateAI'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-950 text-slate-100 antialiased min-h-screen">
  <!-- Navigation -->
  <header class="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <span class="font-extrabold text-lg text-white">${activeBusiness?.name || 'Brand'}</span>
      <a href="#cta" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors">${site.primaryCta}</a>
    </div>
  </header>

  <!-- Hero -->
  <section class="py-24 px-6 text-center max-w-4xl mx-auto">
    <h1 class="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">${site.headline}</h1>
    <p class="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">${site.subheadline}</p>
    <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
      <a href="#cta" class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl transition-all">${site.primaryCta}</a>
      <a href="#features" class="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all">${site.secondaryCta}</a>
    </div>
  </section>

  <!-- Features -->
  <section id="features" class="py-16 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
    ${site.sections
      .map(
        (sec) => `
      <div class="p-8 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 class="text-xl font-bold text-white mb-3">${sec.heading}</h3>
        <p class="text-slate-400 text-sm leading-relaxed mb-6">${sec.body}</p>
        <ul class="space-y-2">
          ${sec.highlights.map((h) => `<li class="text-xs text-slate-300 flex items-center gap-2">✓ ${h}</li>`).join('')}
        </ul>
      </div>
    `
      )
      .join('')}
  </section>

  <!-- Live Chat Widget Injected -->
  <script src="${window.location.origin}/widget.js?businessId=${activeBusiness?.id}"></script>
</body>
</html>`;
  };

  const handleCopyCode = () => {
    if (!selectedSite) return;
    navigator.clipboard.writeText(generateHtmlCode(selectedSite));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <Globe className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Landing Page & Storefront Builder</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Instant Generation
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl">
            Generate high-converting standalone landing pages, product launch showcases, and VIP event invitations with 1-click HTML export and embedded AI chat.
          </p>
        </div>

        {selectedSite && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'HTML Copied!' : 'Copy Standalone HTML'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Generator Form & Site List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Generate Page with AI</h2>
            </div>

            <form onSubmit={handleGenerate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Product, Offer or Page Goal</label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Bespoke Wedding Tuxedos & Gala Couture showcase with $100 private fitting reservation..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., Grooms, Gala Attendees, Executives"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={generating || !prompt.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium text-xs shadow-lg shadow-cyan-600/25 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{generating ? 'Drafting Landing Page...' : 'Build Landing Page with AI'}</span>
              </button>
            </form>
          </div>

          {/* Saved Pages List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
              Published Pages ({websites.length})
            </div>

            {websites.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedSite(w)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                  selectedSite?.id === w.id
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold truncate">{w.title}</div>
                <div className="text-[10px] text-cyan-400 mt-1 truncate">/{w.slug}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Live Interactive Split-Screen Preview */}
        <div className="lg:col-span-8 space-y-4">
          {selectedSite ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* Browser Mockup Bar */}
              <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="ml-3 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
                    https://{activeBusiness?.slug || 'aura-atelier'}.operateai.app/{selectedSite.slug}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-lg text-xs ${
                      previewDevice === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title="Desktop Preview"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-lg text-xs ${
                      previewDevice === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title="Mobile Preview"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Page Content Simulator */}
              <div className={`p-6 sm:p-10 mx-auto transition-all ${previewDevice === 'mobile' ? 'max-w-sm border-x border-slate-800' : 'w-full'}`}>
                {/* Hero */}
                <div className="text-center py-10 space-y-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wide">
                    {activeBusiness?.name} Showcase
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {selectedSite.headline}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                    {selectedSite.subheadline}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all">
                      {selectedSite.primaryCta}
                    </button>
                    <button className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs border border-slate-700 transition-all">
                      {selectedSite.secondaryCta}
                    </button>
                  </div>
                </div>

                {/* Feature Sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {selectedSite.sections.map((sec, i) => (
                    <div key={i} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <h3 className="text-sm font-bold text-white">{sec.heading}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{sec.body}</p>
                      <ul className="space-y-1.5 pt-2 border-t border-slate-800/80">
                        {sec.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="text-[11px] text-slate-300 flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Pricing Tiers if available */}
                {selectedSite.pricingTiers && selectedSite.pricingTiers.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-slate-800/80">
                    <h3 className="text-center text-sm font-bold text-white mb-4">Investment Tiers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedSite.pricingTiers.map((tier, tIdx) => (
                        <div key={tIdx} className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-center space-y-2">
                          <div className="text-xs font-semibold text-slate-400">{tier.name}</div>
                          <div className="text-xl font-extrabold text-white">{tier.price}</div>
                          <ul className="text-[11px] text-slate-300 space-y-1 pt-2">
                            {tier.features.map((f, fIdx) => (
                              <li key={fIdx}>• {f}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center p-12 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              Select or generate a landing page to preview.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
