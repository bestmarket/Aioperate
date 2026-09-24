import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Conversation, Message, Customer } from '../../types.ts';
import {
  Inbox,
  Search,
  MessageSquare,
  Smartphone,
  Mail,
  Bot,
  UserCheck,
  Send,
  Sparkles,
  Tag,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  User,
} from 'lucide-react';

export const UnifiedInboxView: React.FC = () => {
  const { activeBusiness, user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState('');
  const [search, setSearch] = useState('');
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [internalNote, setInternalNote] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const businessId = activeBusiness?.id || 'biz_aura_001';

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await api.getConversations(businessId);
      setConversations(data);
      if (data.length > 0 && !selectedConv) {
        setSelectedConv(data[0]);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [businessId]);

  useEffect(() => {
    async function loadMessages() {
      if (!selectedConv) return;
      try {
        const msgs = await api.getConversationMessages(businessId, selectedConv.id);
        setMessages(msgs);
      } catch (err) {
        console.error('Failed to load messages for conversation:', err);
      }
    }
    loadMessages();
  }, [selectedConv, businessId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendReply = async () => {
    if (!selectedConv || !replyText.trim() || sending) return;
    try {
      setSending(true);
      const res = await api.replyConversation(businessId, selectedConv.id, replyText, user?.name);
      setMessages((prev) => [...prev, res.message]);
      setReplyText('');
      // Mark as human escalated/handled
      setSelectedConv((prev) => prev ? { ...prev, status: 'human_escalated', lastMessage: replyText } : null);
      loadConversations();
    } catch (err) {
      console.error('Failed to reply:', err);
    } finally {
      setSending(false);
    }
  };

  const handleToggleAiStatus = async (newStatus: 'ai_handling' | 'human_escalated' | 'closed') => {
    if (!selectedConv) return;
    try {
      const updated = await api.updateConversationStatus(businessId, selectedConv.id, newStatus);
      setSelectedConv(updated);
      setConversations((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const channelIcons: Record<string, any> = {
    website_chat: MessageSquare,
    whatsapp: Smartphone,
    email: Mail,
    voice: PhoneCall,
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase());
    const matchesChannel = filterChannel === 'all' || c.channel === filterChannel;
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesChannel && matchesStatus;
  });

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      {/* Inbox Header Filters */}
      <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations, names..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none"
          >
            <option value="all">All Channels</option>
            <option value="website_chat">Website Chat</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="voice">Voice Transcripts</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="ai_handling">AI Handling</option>
            <option value="human_escalated">Human Escalated</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* 3-Column Layout: Conv List | Message Thread | Customer Detail Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Conversations List */}
        <div className="w-80 border-r border-slate-800 overflow-y-auto divide-y divide-slate-800/60 bg-slate-950/30 shrink-0">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No conversations found.
            </div>
          ) : (
            filteredConversations.map((c) => {
              const Icon = channelIcons[c.channel] || MessageSquare;
              const isSelected = selectedConv?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedConv(c)}
                  className={`w-full p-3.5 text-left transition-colors flex items-start gap-3 ${
                    isSelected ? 'bg-indigo-600/15 border-l-2 border-indigo-500' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-slate-300">
                    <Icon className="w-4 h-4 text-indigo-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-white truncate">{c.customerName}</div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.lastMessage}</p>

                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                          c.status === 'ai_handling'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : c.status === 'human_escalated'
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {c.status === 'ai_handling' ? 'AI Active' : c.status === 'human_escalated' ? 'Human Required' : 'Closed'}
                      </span>
                      {c.unread && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Center Column: Active Conversation Stream */}
        {selectedConv ? (
          <div className="flex-1 flex flex-col bg-slate-900/60 overflow-hidden">
            {/* Conversation Control Header */}
            <div className="p-3.5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{selectedConv.customerName}</span>
                    <span className="text-[10px] font-normal text-slate-400 font-mono">
                      {selectedConv.customerContact}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize flex items-center gap-1.5">
                    <span>Channel: {selectedConv.channel.replace('_', ' ')}</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-medium">
                      Status: {selectedConv.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Takeover & Return controls */}
              <div className="flex items-center gap-2">
                {selectedConv.status === 'ai_handling' ? (
                  <button
                    onClick={() => handleToggleAiStatus('human_escalated')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Take Over from AI</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleAiStatus('ai_handling')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Return to AI Brain</span>
                  </button>
                )}

                <button
                  onClick={() =>
                    handleToggleAiStatus(selectedConv.status === 'closed' ? 'ai_handling' : 'closed')
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                >
                  {selectedConv.status === 'closed' ? 'Reopen' : 'Close Ticket'}
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {messages.map((m) => {
                const isCustomer = m.sender === 'customer';
                const isHumanStaff = m.sender === 'human_staff';
                return (
                  <div
                    key={m.id}
                    className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 space-y-1 ${
                        isCustomer
                          ? 'bg-slate-800 text-slate-200'
                          : isHumanStaff
                          ? 'bg-purple-600 text-white rounded-br-sm'
                          : 'bg-indigo-600 text-white rounded-br-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 text-[10px] opacity-75">
                        <span className="font-semibold uppercase tracking-wider">
                          {isCustomer
                            ? selectedConv.customerName
                            : isHumanStaff
                            ? 'Human Staff'
                            : 'AI Employee'}
                        </span>
                        <span>
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-xs whitespace-pre-line leading-relaxed">{m.content}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Canned Responses */}
            <div className="px-4 py-1.5 border-t border-slate-800 bg-slate-950/40 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400">
              <span className="font-semibold text-slate-400 shrink-0">Canned:</span>
              {[
                'Hello! How can I assist your order today?',
                'I have scheduled your fitting with our master tailor.',
                'Your payment link has been verified and invoice sent.',
              ].map((canned, i) => (
                <button
                  key={i}
                  onClick={() => setReplyText(canned)}
                  className="whitespace-nowrap px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                >
                  {canned}
                </button>
              ))}
            </div>

            {/* Staff Reply Box */}
            <div className="p-3 border-t border-slate-800 bg-slate-950">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendReply();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Type human staff reply (will pause AI agent)..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || sending}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
            Select a conversation to view thread.
          </div>
        )}

        {/* Right Column: Customer Details & CRM Sidebar */}
        {selectedConv && (
          <div className="w-72 border-l border-slate-800 p-4 bg-slate-950/40 overflow-y-auto space-y-4 hidden xl:block text-xs">
            <div>
              <div className="text-xs font-bold text-white">Customer Profile</div>
              <div className="text-[11px] text-slate-400">Unified omnichannel view</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div>
                <span className="text-[10px] text-slate-400 block">Name</span>
                <span className="text-xs font-semibold text-white">{selectedConv.customerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Contact</span>
                <span className="text-xs text-slate-300 font-mono">{selectedConv.customerContact}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Sentiment Score</span>
                <span className="text-xs text-emerald-400 font-semibold capitalize">
                  {selectedConv.sentiment} · Positive
                </span>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-white mb-2">Conversation Tags</div>
              <div className="flex flex-wrap gap-1">
                {selectedConv.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <div className="text-xs font-bold text-white mb-1.5">Internal Staff Notes</div>
              <textarea
                rows={3}
                placeholder="Add private note for team members..."
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (internalNote.trim()) {
                    setInternalNote('');
                  }
                }}
                className="mt-1.5 w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Save Internal Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
