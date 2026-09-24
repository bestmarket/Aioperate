import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { KnowledgeSource } from '../../types.ts';
import {
  BookOpen,
  Plus,
  Trash2,
  FileText,
  Globe,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Search,
  Send,
} from 'lucide-react';

export const KnowledgeBaseView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Testing Sandbox tool inside Knowledge
  const [testQuery, setTestQuery] = useState('');
  const [testResult, setTestResult] = useState<{ matchedDoc?: string; answer?: string } | null>(null);
  const [testing, setTesting] = useState(false);

  // New Doc Form
  const [newDoc, setNewDoc] = useState({
    title: '',
    type: 'faq' as const,
    content: '',
  });

  const businessId = activeBusiness?.id || 'biz_aura_001';

  const loadKnowledge = async () => {
    try {
      setLoading(true);
      const data = await api.getKnowledge(businessId);
      setKnowledgeList(data);
    } catch (err) {
      console.error('Failed to load knowledge:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKnowledge();
  }, [businessId]);

  const handleAddDoc = async () => {
    try {
      await api.createKnowledge(businessId, newDoc);
      setShowAddModal(false);
      setNewDoc({ title: '', type: 'faq', content: '' });
      loadKnowledge();
    } catch (err) {
      console.error('Failed to add knowledge document:', err);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await api.deleteKnowledge(businessId, docId);
      setKnowledgeList((prev) => prev.filter((k) => k.id !== docId));
    } catch (err) {
      console.error('Failed to delete doc:', err);
    }
  };

  const handleTestQuery = () => {
    if (!testQuery.trim()) return;
    setTesting(true);
    setTimeout(() => {
      const q = testQuery.toLowerCase();
      const matched = knowledgeList.find((k) =>
        q.split(/\s+/).some((w) => w.length > 3 && k.content.toLowerCase().includes(w))
      ) || knowledgeList[0];

      setTestResult({
        matchedDoc: matched?.title || 'General Knowledge Grounding',
        answer: matched
          ? `Grounded Match from [${matched.title}]: "${matched.content.slice(0, 180)}..."`
          : 'No specific document matched. The AI will rely on its general domain tone and request contact details.',
      });
      setTesting(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Knowledge Base & AI Grounding Brain</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Indexed business documents, FAQs, return policies, and service guidelines that ground your AI agent to prevent hallucinations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Knowledge Document</span>
        </button>
      </div>

      {/* Retrieval Grounding Tester */}
      <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Knowledge Retrieval & Grounding Inspector
            </h3>
          </div>
          <span className="text-[10px] text-indigo-300 font-mono">Vector Grounding Ready</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a sample customer question (e.g. What is your bespoke fitting return policy?)..."
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTestQuery()}
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleTestQuery}
            disabled={testing || !testQuery.trim()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Test Retrieval</span>
          </button>
        </div>

        {testResult && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs space-y-1 animate-in fade-in">
            <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Retrieved Source: {testResult.matchedDoc}
            </div>
            <p className="text-slate-300 leading-relaxed">{testResult.answer}</p>
          </div>
        )}
      </div>

      {/* Document Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {knowledgeList.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                  {doc.type}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Indexed ({doc.tokenCount} tokens)
                </span>
              </div>

              <h3 className="text-sm font-bold text-white">{doc.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-4 leading-relaxed mt-2">
                {doc.content}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Updated {new Date(doc.lastUpdated).toLocaleDateString()}</span>
              <button
                onClick={() => handleDelete(doc.id)}
                className="p-1 text-slate-400 hover:text-red-400 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Document */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">Add Knowledge Document</h3>

            <div>
              <label className="text-slate-300 block mb-1">Document Title</label>
              <input
                type="text"
                value={newDoc.title}
                onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                placeholder="e.g. Return Policy, Pricing Guidelines, VIP Concierge Procedures"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Source Category</label>
              <select
                value={newDoc.type}
                onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="faq">FAQ Collection</option>
                <option value="policy">Legal Policy / Terms</option>
                <option value="manual">Manual Document</option>
                <option value="website_crawl">Web Crawl Page</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Content / Text</label>
              <textarea
                rows={6}
                value={newDoc.content}
                onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                placeholder="Enter exact rules, policies, instructions, and information..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={handleAddDoc}
                disabled={!newDoc.title.trim() || !newDoc.content.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold disabled:opacity-50"
              >
                Index Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
