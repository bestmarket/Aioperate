import React, { useState, useEffect } from 'react';
import {
  Star,
  Sparkles,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertTriangle,
  Heart,
  TrendingUp,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { ReputationItem } from '../../types.ts';

export const ReputationView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [reviews, setReviews] = useState<ReputationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replyingId, setReplyingId] = useState<string | null>(null);

  // New feedback modal
  const [addingFeedback, setAddingFeedback] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [channel, setChannel] = useState<'website' | 'whatsapp' | 'email' | 'google'>('website');

  const fetchReviews = async () => {
    if (!activeBusiness?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/reputation/${activeBusiness.id}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error('Failed to load reviews:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [activeBusiness?.id]);

  const handleSendReply = async (id: string) => {
    const text = replyText[id];
    if (!activeBusiness?.id) return;
    setReplyingId(id);
    try {
      const res = await fetch(`/api/reputation/${activeBusiness.id}/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: text }),
      });
      if (res.ok) {
        const updated = await res.json();
        setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
      }
    } catch (e) {
      console.error('Failed to dispatch reply:', e);
    } finally {
      setReplyingId(null);
    }
  };

  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness?.id || !customerName.trim() || !feedback.trim()) return;

    try {
      const res = await fetch(`/api/reputation/${activeBusiness.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          channel,
          rating,
          feedback,
        }),
      });

      if (res.ok) {
        const newItem = await res.json();
        setReviews((prev) => [newItem, ...prev]);
        setAddingFeedback(false);
        setCustomerName('');
        setFeedback('');
      }
    } catch (e) {
      console.error('Failed to add feedback:', e);
    }
  };

  const averageRating =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '5.0';
  const positiveCount = reviews.filter((r) => r.sentiment === 'positive').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
              <Star className="w-5 h-5 fill-rose-400" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Reputation & Retention</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Customer Sentiment & Reviews
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl">
            Monitor client satisfaction, proactively resolve negative experiences, and generate AI-crafted personalized review replies across all channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddingFeedback(!addingFeedback)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{addingFeedback ? 'Cancel' : 'Log Feedback'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Average CSAT Rating</div>
            <div className="text-2xl font-extrabold text-white mt-1 flex items-center gap-1.5">
              <span>{averageRating}</span>
              <span className="text-amber-400 text-sm">★</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Positive Brand Sentiment</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">
              {reviews.length > 0 ? Math.round((positiveCount / reviews.length) * 100) : 100}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Heart className="w-5 h-5 fill-emerald-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">AI Deflection & Resolution</div>
            <div className="text-2xl font-extrabold text-indigo-400 mt-1">94.2%</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Manual Feedback Form */}
      {addingFeedback && (
        <form onSubmit={handleAddFeedback} className="p-5 rounded-2xl bg-slate-900 border border-rose-500/30 space-y-4">
          <h2 className="text-sm font-bold text-white">Record Customer Review / Feedback</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g., Jonathan Vance"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Channel</label>
              <select
                value={channel}
                onChange={(e: any) => setChannel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="website">Website Chat</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="google">Google Review</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Rating (1 to 5 Stars)</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value={5}>5 Stars - Outstanding</option>
                <option value={4}>4 Stars - Great</option>
                <option value={3}>3 Stars - Neutral</option>
                <option value={2}>2 Stars - Poor</option>
                <option value={1}>1 Star - Critical Issue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Comments</label>
            <textarea
              rows={2}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Detailed customer comment or complaint..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAddingFeedback(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow"
            >
              Save Feedback
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white text-xs">
                  {rev.customerName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{rev.customerName}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize border ${
                        rev.sentiment === 'positive'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : rev.sentiment === 'neutral'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {rev.sentiment}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span className="capitalize">{rev.channel}</span>
                    <span>•</span>
                    <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-850">
              "{rev.feedback}"
            </p>

            {/* AI Suggested Response Box */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-rose-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Suggested Concierge Reply</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  Status: {rev.status === 'ai_responded' ? 'Dispatched' : 'Pending Response'}
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyText[rev.id] ?? (rev.aiSuggestedReply || '')}
                  onChange={(e) => setReplyText({ ...replyText, [rev.id]: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
                <button
                  onClick={() => handleSendReply(rev.id)}
                  disabled={replyingId === rev.id}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{rev.status === 'ai_responded' ? 'Update' : 'Send Reply'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
