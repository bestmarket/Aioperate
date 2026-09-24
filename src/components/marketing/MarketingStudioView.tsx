import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Share2,
  Calendar,
  Layers,
  Send,
  Plus,
  RefreshCw,
  Clock,
  Instagram,
  Facebook,
  Linkedin,
  Mail,
  Smartphone,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { MarketingAsset } from '../../types.ts';

export const MarketingStudioView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [assets, setAssets] = useState<MarketingAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [selectedType, setSelectedType] = useState<string>('social_post');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('Instagram');
  const [topicPrompt, setTopicPrompt] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

  const fetchAssets = async () => {
    if (!activeBusiness?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/marketing/${activeBusiness.id}`);
      if (res.ok) {
        const data = await res.json();
        setAssets(data);
      }
    } catch (e) {
      console.error('Failed to load marketing assets:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [activeBusiness?.id]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicPrompt.trim() || !activeBusiness?.id) return;

    setGenerating(true);
    try {
      const genRes = await fetch(`/api/marketing/${activeBusiness.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          platform: selectedPlatform,
          topic: topicPrompt,
          targetAudience,
        }),
      });

      if (genRes.ok) {
        const genData = await genRes.json();

        // Save generated asset to business library
        const saveRes = await fetch(`/api/marketing/${activeBusiness.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: genData.title,
            type: selectedType,
            platform: selectedPlatform,
            content: genData.content,
            targetAudience,
            status: 'draft',
          }),
        });

        if (saveRes.ok) {
          const newSaved = await saveRes.json();
          setAssets((prev) => [newSaved, ...prev]);
          setTopicPrompt('');
        }
      }
    } catch (e) {
      console.error('Generation failed:', e);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!activeBusiness?.id) return;
    try {
      await fetch(`/api/marketing/${activeBusiness.id}/${id}`, { method: 'DELETE' });
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error('Failed to delete asset:', e);
    }
  };

  const filteredAssets = assets.filter((a) => (filterPlatform === 'all' ? true : a.platform === filterPlatform));

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return Instagram;
      case 'Facebook':
        return Facebook;
      case 'LinkedIn':
        return Linkedin;
      case 'WhatsApp':
        return Smartphone;
      case 'Email':
        return Mail;
      default:
        return Globe;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Megaphone className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Marketing Studio</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Multi-Channel Copy & Campaigns
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl">
            Generate high-converting social media posts, Facebook & Instagram ads, WhatsApp broadcasts, email newsletters, and blog articles instantly tailored to {activeBusiness?.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAssets}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700/60 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Library</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Creator Panel (Left) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold text-white">Generate Marketing Copy</h2>
            </div>

            <form onSubmit={handleGenerate} className="mt-4 space-y-4">
              {/* Channel / Platform Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Platform</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Instagram', 'Facebook', 'LinkedIn', 'WhatsApp', 'Email', 'Blog / Web'].map((plat) => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setSelectedPlatform(plat)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        selectedPlatform === plat
                          ? 'bg-purple-600/20 text-purple-300 border-purple-500 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                      }`}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format / Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Asset Format</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="social_post">Social Media Post</option>
                  <option value="facebook_ad">High-Converting Ad Copy (Meta / FB)</option>
                  <option value="instagram_caption">Instagram Caption with Hashtags</option>
                  <option value="tiktok_script">TikTok / Reels Video Hook & Script</option>
                  <option value="whatsapp_broadcast">VIP WhatsApp Broadcast</option>
                  <option value="email_blast">Email Newsletter / Promo Blast</option>
                  <option value="blog_post">SEO Blog Article / Guide</option>
                  <option value="product_description">Catalog Product Description</option>
                </select>
              </div>

              {/* Topic / Angle */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Topic, Angle or Product</label>
                <textarea
                  rows={3}
                  value={topicPrompt}
                  onChange={(e) => setTopicPrompt(e.target.value)}
                  placeholder="e.g., Autumn Bespoke Dinner Jacket launch with complimentary white-glove styling, limited to 15 slots..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 leading-relaxed"
                  required
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Audience (Optional)</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., Executives, Gala attendees, Wedding parties"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={generating || !topicPrompt.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium text-xs shadow-lg shadow-purple-600/25 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{generating ? 'Crafting Marketing Copy...' : 'Generate with AI'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Content Library (Right) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Content Library ({filteredAssets.length} Assets)
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Filter:</span>
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">All Platforms</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Email</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAssets.length === 0 ? (
              <div className="text-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No marketing assets generated yet. Enter a topic on the left to create your first high-converting copy!
              </div>
            ) : (
              filteredAssets.map((asset) => {
                const Icon = getPlatformIcon(asset.platform);
                const isCopied = copiedId === asset.id;
                return (
                  <div
                    key={asset.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-slate-800 text-purple-400 border border-slate-700">
                          <Icon className="w-4 h-4" />
                        </span>
                        <div>
                          <h3 className="font-bold text-white text-sm">{asset.title}</h3>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span className="font-medium text-purple-400">{asset.platform}</span>
                            <span>•</span>
                            <span>{asset.type.replace(/_/g, ' ')}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(asset.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopy(asset.id, asset.content)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                          title="Copy to clipboard"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                        </button>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-line">
                      {asset.content}
                    </div>

                    {asset.targetAudience && (
                      <div className="text-[11px] text-slate-400">
                        <span className="font-medium text-slate-300">Audience:</span> {asset.targetAudience}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
