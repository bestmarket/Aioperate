import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { WidgetSettings } from '../../types.ts';
import {
  MessageSquare,
  Copy,
  Check,
  Save,
  Palette,
  Bot,
  ExternalLink,
  Code,
  Layout,
  Smartphone,
  Monitor,
  Send,
} from 'lucide-react';

interface WebsiteChatViewProps {
  onOpenTestModal: () => void;
}

export const WebsiteChatView: React.FC<WebsiteChatViewProps> = ({ onOpenTestModal }) => {
  const { activeBusiness } = useAuth();
  const [config, setConfig] = useState<WidgetSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [requireEmailBeforeChat, setRequireEmailBeforeChat] = useState(false);

  const businessId = activeBusiness?.id || 'biz_aura_001';

  useEffect(() => {
    async function fetchConfig() {
      try {
        setLoading(true);
        const data = await api.getWidgetConfig(businessId);
        setConfig(data);
      } catch (err) {
        console.error('Failed to load widget config:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, [businessId]);

  const handleSave = async () => {
    if (!config) return;
    try {
      setSaving(true);
      await api.updateWidgetConfig(businessId, config);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update widget config:', err);
    } finally {
      setSaving(false);
    }
  };

  const embedSnippet = `<!-- OperateAI Business Concierge Widget -->
<script
  src="${window.location.origin}/widget.js"
  data-business-id="${businessId}"
  async>
</script>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading || !config) {
    return <div className="p-8 text-xs text-slate-400">Loading Website Chat configuration...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            Website Concierge Widget Customizer
          </h1>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
            Embed an autonomous AI client advisor directly on your e-commerce storefront or corporate website.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenTestModal}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-stone-800 dark:text-white text-xs font-semibold border border-stone-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            Launch Fullscreen Test
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-rose-600 dark:hover:bg-rose-500 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : savedSuccess ? 'Saved!' : 'Save Widget'}</span>
          </button>
        </div>
      </div>

      {/* Embed Code Section */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <h3 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              1-Line Embed Code (Paste before &lt;/body&gt;)
            </h3>
          </div>
          <button
            onClick={copyEmbed}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs text-stone-800 dark:text-slate-200 font-medium transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Snippet'}</span>
          </button>
        </div>
        <pre className="p-3.5 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-stone-800 dark:text-rose-200 font-mono text-xs overflow-x-auto">
          {embedSnippet}
        </pre>
      </div>

      {/* 2-Column: Customizer Form & Live Visual Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Customizer Controls */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 space-y-4 text-xs shadow-xs">
          <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            Concierge Styling & Appearance
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-stone-700 dark:text-slate-300 font-semibold block mb-1">Primary Brand Accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.brandColor}
                  onChange={(e) => setConfig({ ...config, brandColor: e.target.value })}
                  className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={config.brandColor}
                  onChange={(e) => setConfig({ ...config, brandColor: e.target.value })}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-stone-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-700 dark:text-slate-300 font-semibold block mb-1">Screen Position</label>
              <select
                value={config.position}
                onChange={(e) => setConfig({ ...config, position: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-stone-900 dark:text-white"
              >
                <option value="bottom-right">Bottom Right (Recommended)</option>
                <option value="bottom-left">Bottom Left</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-stone-700 dark:text-slate-300 font-semibold block mb-1">Heritage Greeting Message</label>
            <textarea
              rows={3}
              value={config.welcomeMessage}
              onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-stone-700 dark:text-slate-300 font-semibold block mb-1">Quick Action Prompts</label>
            <div className="space-y-2">
              {config.quickPrompts.map((p, i) => (
                <input
                  key={i}
                  type="text"
                  value={p}
                  onChange={(e) => {
                    const next = [...config.quickPrompts];
                    next[i] = e.target.value;
                    setConfig({ ...config, quickPrompts: next });
                  }}
                  className="w-full px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-stone-900 dark:text-white"
                />
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 dark:border-slate-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="rounded border-slate-700 text-rose-600 focus:ring-0"
              />
              <span className="text-stone-700 dark:text-slate-300 font-medium">Acoustic chimes on incoming advisory messages</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requireEmailBeforeChat}
                onChange={(e) => setRequireEmailBeforeChat(e.target.checked)}
                className="rounded border-slate-700 text-rose-600 focus:ring-0"
              />
              <span className="text-stone-700 dark:text-slate-300 font-medium">Require VIP client email before consultation starts</span>
            </label>
          </div>
        </div>

        {/* Right: Live Interactive Mockup Frame */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center">
          <div className="text-xs font-bold text-stone-700 dark:text-slate-300 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <Monitor className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>High-Fidelity Concierge Preview & Frame</span>
          </div>

          {/* Framed Device Sandbox Container */}
          <div className="w-full max-w-sm rounded-[32px] p-2.5 bg-gradient-to-b from-stone-200 via-stone-300 to-stone-400 dark:from-stone-700 dark:via-stone-800 dark:to-stone-900 shadow-2xl shadow-stone-900/20 border border-stone-300/80 dark:border-stone-700">
            {/* Top Chrome / Bezel Bar */}
            <div className="flex items-center justify-between px-3 py-1.5 text-[10px] text-stone-600 dark:text-stone-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
              </div>
              <span className="font-mono text-[9px] text-stone-500 dark:text-stone-400 tracking-wider">concierge-sandbox.app</span>
              <div className="w-4 h-1 rounded-full bg-stone-400/40 dark:bg-stone-600" />
            </div>

            {/* Inner App Canvas */}
            <div className="w-full rounded-[22px] bg-[#FAF9F5] dark:bg-[#0c1017] border border-stone-300/60 dark:border-slate-800 shadow-inner overflow-hidden flex flex-col h-[510px]">
              {/* Header */}
              <div
                className="p-3.5 text-white flex items-center justify-between shadow-xs transition-colors"
                style={{ backgroundColor: config.brandColor || '#1c1917' }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xs shadow-xs">
                      {config.businessName[0] || 'A'}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-1.5 ring-stone-900" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold leading-none">{config.businessName} Concierge</div>
                    <div className="text-[10px] text-white/80 mt-0.5 font-medium">Online · Bespoke Client Advisory</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-80">
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">VIP</span>
                </div>
              </div>

              {/* Simulated Chat Content */}
              <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs bg-[#FAF9F5] dark:bg-[#0c1017]">
                {/* Intro message */}
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-rose-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    {config.businessName[0] || 'A'}
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl rounded-tl-xs border border-stone-200/90 dark:border-slate-800 text-stone-800 dark:text-slate-100 text-[11px] leading-relaxed max-w-[85%] shadow-xs">
                    {config.welcomeMessage}
                  </div>
                </div>

                {/* Sample Product Recommendation Card */}
                <div className="ml-9 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 text-[11px] space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                      Recommended Piece
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-slate-400">In Stock (14)</span>
                  </div>
                  <div className="font-bold text-stone-900 dark:text-white">Milano Silk-Blend Dinner Jacket</div>
                  <p className="text-[10px] text-stone-500 dark:text-slate-400 leading-snug">
                    Peak silk lapels, pure Vitale Barberis wool. Includes complimentary bespoke fitting.
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-slate-800">
                    <div className="text-stone-900 dark:text-white font-extrabold text-xs">$1,250.00 USD</div>
                    <button
                      style={{ backgroundColor: config.brandColor || '#1c1917' }}
                      className="px-3 py-1 rounded-lg text-white font-bold text-[10px] shadow-xs cursor-pointer"
                    >
                      Instant Checkout
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Prompts */}
              <div className="p-2 border-t border-stone-200/80 dark:border-slate-800 bg-stone-100/70 dark:bg-slate-950 flex gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
                {config.quickPrompts.slice(0, 3).map((p, i) => (
                  <span
                    key={i}
                    className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-stone-700 dark:text-slate-300 border border-stone-200 dark:border-slate-800 font-medium shadow-xs"
                  >
                    {p}
                  </span>
                ))}
              </div>

              {/* Input Bar */}
              <div className="p-3 border-t border-stone-200 dark:border-slate-800 bg-white dark:bg-[#111622] flex items-center gap-2">
                <input
                  disabled
                  placeholder="Inquire with private concierge..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 text-stone-800 dark:text-white text-xs opacity-75"
                />
                <button
                  style={{ backgroundColor: config.brandColor || '#1c1917' }}
                  className="p-2 rounded-xl text-white font-bold text-xs shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
