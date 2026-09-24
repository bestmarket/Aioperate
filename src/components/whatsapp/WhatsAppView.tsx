import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { WhatsAppConfig } from '../../types.ts';
import {
  Smartphone,
  CheckCircle2,
  Save,
  Radio,
  Send,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Copy,
  ExternalLink,
} from 'lucide-react';

export const WhatsAppView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [config, setConfig] = useState<WhatsAppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testNumber, setTestNumber] = useState('+1 (555) 789-0123');
  const [testSent, setTestSent] = useState(false);
  const [sendOrderNotifications, setSendOrderNotifications] = useState(true);

  const businessId = activeBusiness?.id || 'biz_aura_001';

  useEffect(() => {
    async function fetchConfig() {
      try {
        setLoading(true);
        const data = await api.getWhatsAppConfig(businessId);
        setConfig(data);
      } catch (err) {
        console.error('Failed to load WhatsApp config:', err);
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
      await api.updateWhatsAppConfig(businessId, config);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update WhatsApp config:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestTemplate = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);
  };

  if (loading || !config) {
    return <div className="p-8 text-xs text-slate-400">Loading WhatsApp Cloud settings...</div>;
  }

  const webhookUrl = `${window.location.origin}/api/webhooks/whatsapp`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">Official WhatsApp Business Cloud API</h1>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                  config.connected
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/15 text-amber-400'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                {config.connected ? 'Cloud Connected' : 'Setup Required'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Connect your Meta WhatsApp Cloud API credentials to allow the AI employee to converse, send order receipts, and execute automated follow-up campaigns.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Verifying...' : savedSuccess ? 'Verified & Saved!' : 'Save & Verify Webhook'}</span>
        </button>
      </div>

      {/* Meta Webhook Endpoint */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Meta Developer Webhook Configuration
        </h3>
        <p className="text-xs text-slate-400">
          In your Meta Developer App &gt; WhatsApp &gt; Configuration, enter this callback URL and verify token.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Callback URL</label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={webhookUrl}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-indigo-300 font-mono text-xs"
              />
              <button
                onClick={() => navigator.clipboard.writeText(webhookUrl)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Verify Token</label>
            <input
              readOnly
              value="operate_ai_secret_token"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* API Credentials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">Meta Cloud API Credentials</h3>

          <div>
            <label className="text-slate-300 block mb-1">WhatsApp Business Phone Number ID</label>
            <input
              type="text"
              value={config.phoneNumberId || ''}
              onChange={(e) => setConfig({ ...config, phoneNumberId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1">WhatsApp Business Account ID (WABA ID)</label>
            <input
              type="text"
              value={config.wabaId || ''}
              onChange={(e) => setConfig({ ...config, wabaId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1">System User Access Token (Permanent Token)</label>
            <input
              type="password"
              value={config.accessTokenMasked || ''}
              onChange={(e) => setConfig({ ...config, accessTokenMasked: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoReplyEnabled}
                onChange={(e) => setConfig({ ...config, autoReplyEnabled: e.target.checked })}
                className="rounded border-slate-700 text-emerald-600 focus:ring-0"
              />
              <span className="text-slate-200">Enable 24/7 AI employee replies to inbound chats</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sendOrderNotifications}
                onChange={(e) => setSendOrderNotifications(e.target.checked)}
                className="rounded border-slate-700 text-emerald-600 focus:ring-0"
              />
              <span className="text-slate-200">Send WhatsApp receipt and tracking on order creation</span>
            </label>
          </div>
        </div>

        {/* Test Sandbox & Template Dispatch */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400" />
            Send Test WhatsApp Cloud Notification
          </h3>
          <p className="text-slate-400">
            Verify your webhook and message dispatch with a live preview template.
          </p>

          <div>
            <label className="text-slate-300 block mb-1">Recipient Mobile Number (E.164)</label>
            <input
              type="text"
              value={testNumber}
              onChange={(e) => setTestNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-200 space-y-1">
            <div className="font-semibold text-xs">Template: order_confirmation_v1</div>
            <div className="text-[11px] leading-relaxed">
              &quot;Hello! Your bespoke order from {activeBusiness?.name} has been processed with white-glove care. Click below to view live tracking.&quot;
            </div>
          </div>

          <button
            onClick={handleSendTestTemplate}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send Test Message to {testNumber}</span>
          </button>

          {testSent && (
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 font-medium text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Simulated WhatsApp message sent successfully via Meta Cloud API!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
