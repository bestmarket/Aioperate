import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Message, Product } from '../../types.ts';
import {
  Send,
  X,
  Sparkles,
  ShoppingBag,
  CalendarCheck,
  CreditCard,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Mic,
  MicOff,
  MessageSquare,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Tag,
  CheckCheck,
} from 'lucide-react';

export interface LiveChatWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  onDataChanged?: () => void;
}

// Self-contained Web Audio synthesizer for classic luxury feedback
function playChime(type: 'send' | 'receive') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'send') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880.0, ctx.currentTime + 0.07); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);
      osc.start();
      osc.stop(ctx.currentTime + 0.24);
    }
  } catch {
    // Ignore audio permission or autoplay restrictions
  }
}

export const LiveChatWidgetModal: React.FC<LiveChatWidgetModalProps> = ({
  isOpen,
  onClose,
  onOpen,
  onDataChanged,
}) => {
  const { activeBusiness } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [paymentSuccessOrder, setPaymentSuccessOrder] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [catalogDrawerOpen, setCatalogDrawerOpen] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [teaserDismissed, setTeaserDismissed] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const businessId = activeBusiness?.id || 'biz_aura_001';
  const businessName = activeBusiness?.name || 'Aura Atelier';

  // Load catalog for quick product tray
  useEffect(() => {
    async function loadCatalog() {
      try {
        const prods = await api.getProducts(businessId);
        if (prods && prods.length > 0) {
          setCatalogProducts(prods);
        } else {
          // Fallback curated luxury products
          setCatalogProducts([
            {
              id: 'prod_001',
              businessId,
              name: 'Milano Silk-Blend Dinner Jacket',
              description: 'Midnight navy evening jacket with peak silk satin lapels and Mother-of-Pearl buttons.',
              price: 1450,
              salePrice: 1250,
              sku: 'AURA-JKT-001',
              inventory: 14,
              category: 'Suits & Blazers',
              variants: [],
              images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80'],
              status: 'active',
            },
            {
              id: 'prod_002',
              businessId,
              name: 'Pure Mongolian Cashmere Overcoat',
              description: 'Double-breasted camel overcoat tailored with horn buttons and cupro lining.',
              price: 2100,
              salePrice: 1850,
              sku: 'AURA-COAT-002',
              inventory: 8,
              category: 'Outerwear',
              variants: [],
              images: [],
              status: 'active',
            },
            {
              id: 'prod_003',
              businessId,
              name: 'Hand-Welted Oxford Evening Shoes',
              description: 'Full-grain calfskin leather with Goodyear-welted oak bark leather soles.',
              price: 720,
              salePrice: 650,
              sku: 'AURA-SHOE-003',
              inventory: 20,
              category: 'Footwear',
              variants: [],
              images: [],
              status: 'active',
            },
          ]);
        }
      } catch {
        // Fallback default
      }
    }
    loadCatalog();
  }, [businessId]);

  // Teaser bubble timeout
  useEffect(() => {
    if (!isOpen && !teaserDismissed) {
      const timer = setTimeout(() => setShowTeaser(true), 1600);
      return () => clearTimeout(timer);
    } else {
      setShowTeaser(false);
    }
  }, [isOpen, teaserDismissed]);

  // Initialize conversation
  const initChat = () => {
    const newConvId = `conv_${Date.now()}`;
    setConversationId(newConvId);
    setPaymentSuccessOrder(null);
    setMessages([
      {
        id: 'msg_welcome',
        conversationId: newConvId,
        businessId,
        sender: 'agent',
        content: `Good day. Welcome to ${businessName} Client Advisory.

I am your dedicated Autonomous Executive Concierge. I have direct access to our master catalog, bespoke tailoring ateliers, VIP private fitting calendar, and automated billing desk.

How may I assist your style, sizing, custom commission, or appointment today?`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initChat();
    }
  }, [isOpen, businessId]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen, catalogDrawerOpen]);

  // Copy transcript to clipboard
  const handleCopyTranscript = () => {
    const text = messages
      .map(
        (m) =>
          `[${new Date(m.timestamp).toLocaleTimeString()}] ${
            m.sender === 'agent' ? `${businessName} Concierge` : 'Client'
          }: ${m.content}`
      )
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2200);
  };

  // Voice dictation handling
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Simulate realistic voice input if browser lacks speech API
      setIsListening(true);
      setTimeout(() => {
        setInput('I would like to explore your custom evening jackets for an upcoming gala.');
        setIsListening(false);
      }, 1400);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setInput(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    setInput('');
    setCatalogDrawerOpen(false);

    if (soundEnabled) playChime('send');

    const userMsg: Message = {
      id: `msg_u_${Date.now()}`,
      conversationId: conversationId || `conv_${Date.now()}`,
      businessId,
      sender: 'customer',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await api.sendChatMessage({
        businessId,
        conversationId: conversationId || `conv_${Date.now()}`,
        message: text,
        customerMeta: {
          name: 'Distinguished Client',
          contact: 'client.advisory@luxurymail.com',
          channel: 'website_chat',
        },
      });

      if (soundEnabled) playChime('receive');
      setMessages((prev) => [...prev, res.agentMessage]);
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          conversationId,
          businessId,
          sender: 'agent',
          content: `Our advisory communication link experienced a brief latency interruption: ${
            err?.message || 'Unable to connect to the central atelier server'
          }. Our senior concierge on-duty has been notified.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Simulate Payment Confirmation via Server Webhook
  const handleSimulatePayment = async (orderId: string) => {
    try {
      setLoading(true);
      await api.simulatePaymentSuccess(businessId, orderId);
      setPaymentSuccessOrder(orderId);
      if (soundEnabled) playChime('receive');
      if (onDataChanged) onDataChanged();

      setMessages((prev) => [
        ...prev,
        {
          id: `msg_pay_${Date.now()}`,
          conversationId,
          businessId,
          sender: 'agent',
          content: `Transaction verified via Stripe for Order #${orderId}. Your official bespoke dossier has been finalized, our master cutting atelier has been scheduled, and your dispatch confirmation has been registered in the CRM.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error('Payment simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Explore bespoke dinner jackets',
    'Reserve private VIP fitting session',
    'Tailored tuxedo for a black-tie gala ($3,500)',
    'Order Milano Wool Blazer ($1,250)',
    'Request fabric swatch consultation',
    'Speak with senior human stylist',
  ];

  // Helper to render rich markdown-like formatting in messages
  const renderMessageContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }

          // Bullet points
          if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
            const itemText = line.trim().replace(/^[-•]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-rose-500 dark:text-rose-400 mt-1 text-[10px] shrink-0">✦</span>
                <span className="flex-1">{formatInlineEmphasis(itemText)}</span>
              </div>
            );
          }

          return <p key={idx}>{formatInlineEmphasis(line)}</p>;
        })}
      </div>
    );
  };

  const formatInlineEmphasis = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={i} className="font-semibold text-stone-900 dark:text-stone-100 underline decoration-rose-300/40 dark:decoration-rose-500/40 underline-offset-2">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };

  // If closed, return null so nothing blocks the dashboard
  if (!isOpen) {
    return null;
  }

  // Active Chat Box Container - Fully Mobile-Friendly with clear visible frame and crisp typography
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-center items-center p-2.5 sm:p-4 md:p-6 transition-all duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Outer Device & Shadow Bezel Frame (visible on both mobile and desktop) */}
      <div
        className={`w-full max-w-[96vw] sm:max-w-[440px] ${
          isExpanded ? 'sm:max-w-3xl sm:h-[88vh]' : 'h-[92vh] sm:h-[660px]'
        } bg-[#FAF9F5] dark:bg-[#0c1017] rounded-3xl border-2 border-stone-300 dark:border-stone-700 shadow-2xl ring-4 ring-black/10 dark:ring-white/5 flex flex-col overflow-hidden transition-all duration-200`}
      >
        {/* Mobile Pull / Grip Accent */}
        <div className="w-full flex justify-center pt-2 pb-1 bg-white dark:bg-[#111622] shrink-0 border-b border-stone-100 dark:border-stone-800/60">
          <div className="w-12 h-1 rounded-full bg-stone-300 dark:bg-stone-600" />
        </div>

        {/* Classic Luxury Header - cleanly visible on small mobile screens */}
        <div className="px-3 py-2.5 sm:px-4 sm:py-3 border-b border-stone-200/90 dark:border-slate-800 bg-white dark:bg-[#111622] flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2 min-w-0 flex-1 mr-1">
            {/* Monogram Crest */}
            <div className="relative shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-900 dark:bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-stone-700 dark:border-rose-400">
                <span>{businessName[0] || 'A'}</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-[#111622]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 tracking-tight truncate max-w-[130px] xs:max-w-[180px] sm:max-w-[220px]">
                  {businessName}
                </h2>
                <span className="text-[9px] font-medium uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-200/80 dark:border-rose-800/40 shrink-0">
                  Concierge
                </span>
              </div>
              <div className="text-[10px] text-stone-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate font-normal">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium shrink-0">Online</span>
                <span>·</span>
                <span className="truncate">Client Advisory</span>
              </div>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 text-stone-500 dark:text-slate-400 shrink-0">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute chimes' : 'Unmute chimes'}
              className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-500 dark:text-slate-300 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-stone-400" />}
            </button>

            {/* Copy Transcript */}
            <button
              onClick={handleCopyTranscript}
              title="Copy transcript"
              className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-500 dark:text-slate-300 transition-colors"
            >
              {copiedTranscript ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Reset Conversation */}
            <button
              onClick={initChat}
              title="Restart consultation"
              className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-500 dark:text-slate-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Expand / Minimize Window Mode (Desktop only) */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Dock window' : 'Expand window'}
              className="hidden sm:inline-flex p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-500 dark:text-slate-300 transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Close Button - Always prominent and clearly accessible */}
            <button
              onClick={onClose}
              title="Close chat"
              aria-label="Close concierge advisory"
              className="p-1.5 sm:p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-200 hover:text-stone-900 dark:hover:text-white transition-colors ml-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Advisory Capabilities Ribbon */}
        <div className="px-3.5 py-1.5 bg-gradient-to-r from-stone-100 via-rose-50/50 to-stone-100 dark:from-slate-900 dark:via-rose-950/20 dark:to-slate-900 border-b border-stone-200/80 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-stone-600 dark:text-slate-300 font-normal">
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="truncate">Live Tailoring Catalog, VIP Booking & Instant Checkout</span>
          </div>
          <span className="text-[9px] text-rose-700 dark:text-rose-300 font-semibold shrink-0 ml-2">
            24/7 Live
          </span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-[#FAF9F5] dark:bg-[#0c1017]">
          {/* Heritage Intro Greeting Card */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800/80 shadow-xs space-y-2.5">
            <div className="flex items-center gap-1.5 text-stone-500 dark:text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Advisory Briefing</span>
            </div>

            <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed font-normal">
              Welcome to <strong>{businessName}</strong>. You may inquire freely regarding bespoke commissions, sizing specs, fabric swatches, showroom visits, or initiate immediate garment orders.
            </p>

            <div className="pt-2 border-t border-stone-100 dark:border-slate-800 grid grid-cols-3 gap-1.5 text-[10px] text-stone-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <span className="text-rose-600 dark:text-rose-400 font-semibold">✓</span>
                <span className="truncate">Bespoke</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-rose-600 dark:text-rose-400 font-semibold">✓</span>
                <span className="truncate">VIP Booking</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-rose-600 dark:text-rose-400 font-semibold">✓</span>
                <span className="truncate">Stripe Pay</span>
              </div>
            </div>
          </div>

          {/* Conversation Messages */}
          {messages.map((m) => {
            const isAgent = m.sender === 'agent';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isAgent ? 'justify-start' : 'justify-end'} group`}
              >
                {/* Agent Avatar */}
                {isAgent && (
                  <div className="w-8 h-8 rounded-xl bg-stone-900 dark:bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs shadow-xs">
                    {businessName[0] || 'A'}
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[82%] rounded-2xl px-3.5 py-3 space-y-2.5 font-normal text-xs sm:text-[13px] ${
                    isAgent
                      ? 'bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 text-stone-700 dark:text-slate-200 shadow-xs'
                      : 'bg-stone-900 dark:bg-rose-600 text-white rounded-br-xs shadow-xs'
                  }`}
                >
                  {/* Message Prose */}
                  {renderMessageContent(m.content)}

                  {/* Executed Tools Action Cards */}
                  {m.toolCalls && m.toolCalls.length > 0 && (
                    <div className="pt-2 border-t border-stone-100 dark:border-slate-800 space-y-2.5">
                      {m.toolCalls.map((tc, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-200/80 dark:border-slate-800 text-xs space-y-2"
                        >
                          {/* Order Action Card */}
                          {tc.tool === 'createOrder' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                                  <ShoppingBag className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                  <span>Official Order Summary</span>
                                </span>
                                <span className="font-mono text-[11px] font-bold text-stone-600 dark:text-slate-400">
                                  {tc.result?.orderId || 'ORD-AURA'}
                                </span>
                              </div>

                              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-stone-200/70 dark:border-slate-800 flex items-center justify-between text-xs">
                                <div>
                                  <div className="font-semibold text-stone-900 dark:text-white">
                                    {tc.args.items?.[0]?.name || 'Bespoke Atelier Commission'}
                                  </div>
                                  <div className="text-[11px] text-stone-500 dark:text-slate-400">
                                    Direct Atelier Fulfillment · Complimentary Fitting
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-extrabold text-stone-900 dark:text-white">
                                    ${Number(tc.result?.total || tc.args.total || 1250).toFixed(2)}
                                  </div>
                                </div>
                              </div>

                              {paymentSuccessOrder === (tc.result?.orderId || 'ORD-AURA') ? (
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold text-xs">
                                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  <span>Verified via Stripe · Receipt sent to client</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleSimulatePayment(tc.result?.orderId || 'ORD-AURA')}
                                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm hover:shadow transition-all cursor-pointer"
                                >
                                  <CreditCard className="w-3.5 h-3.5" />
                                  <span>Simulate 1-Click Secure Stripe Checkout</span>
                                </button>
                              )}
                            </div>
                          )}

                          {/* VIP Booking Action Card */}
                          {tc.tool === 'createBooking' && (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between font-bold text-stone-900 dark:text-white">
                                <span className="flex items-center gap-1.5">
                                  <CalendarCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                  <span>Private Salon Fitting Confirmed</span>
                                </span>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                                  Reserved
                                </span>
                              </div>
                              <div className="text-stone-700 dark:text-slate-300 font-medium">
                                {tc.args.service || 'Private Bespoke Styling & Fitting Session'}
                              </div>
                              <div className="text-[11px] text-stone-500 dark:text-slate-400 flex items-center gap-2">
                                <Clock className="w-3 h-3 text-stone-400" />
                                <span>
                                  Date: {tc.args.date || 'Tomorrow'} at {tc.args.time || '15:00'}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Qualified Lead Card */}
                          {tc.tool === 'createLead' && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between font-bold text-stone-900 dark:text-white">
                                <span className="flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                  <span>Client Dossier Registered</span>
                                </span>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                  Priority VIP
                                </span>
                              </div>
                              <div className="text-stone-700 dark:text-slate-300">
                                Client: <strong className="text-stone-900 dark:text-white">{tc.args.name}</strong>
                              </div>
                              <div className="text-[11px] text-stone-500 dark:text-slate-400">
                                Interest: {tc.args.interest}
                              </div>
                              {tc.args.estimatedValue && (
                                <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  Estimated Project Value: ${tc.args.estimatedValue.toLocaleString()}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Escalate to Human Card */}
                          {tc.tool === 'escalateToHuman' && (
                            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold">
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              <span>Direct line opened with On-Duty Senior Master Tailor</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Micro Metadata */}
                  <div
                    className={`flex items-center justify-between text-[10px] pt-1 ${
                      isAgent ? 'text-stone-400 dark:text-slate-500' : 'text-stone-300 dark:text-rose-200'
                    }`}
                  >
                    <span>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1">
                      {isAgent ? (
                        <span>Verified Advisory Response</span>
                      ) : (
                        <>
                          <span>Delivered</span>
                          <CheckCheck className="w-3 h-3 text-rose-300" />
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-stone-900 dark:bg-rose-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                {businessName[0] || 'A'}
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 text-stone-600 dark:text-slate-300 text-xs flex items-center gap-2 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-bounce [animation-delay:0.3s]" />
                <span className="ml-1 text-[11px] font-medium text-stone-500 dark:text-slate-400">
                  Formulating bespoke advisory response...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 border-t border-stone-200/70 dark:border-slate-800/80 bg-stone-100/70 dark:bg-slate-950/70 overflow-x-auto flex items-center gap-1.5 sm:gap-2 no-scrollbar shrink-0 touch-pan-x">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 whitespace-nowrap shrink-0">
            Suggested:
          </span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-200 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-slate-800 text-[11px] sm:text-xs font-medium transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Quick Catalog Tray Drawer */}
        {catalogDrawerOpen && (
          <div className="p-3.5 sm:p-4 border-t border-stone-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 animate-in slide-in-from-bottom-3 duration-150 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 dark:text-white">
                <ShoppingBag className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>Featured Catalog Pieces (1-Click Inquire)</span>
              </div>
              <button
                onClick={() => setCatalogDrawerOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-h-40 sm:max-h-48 overflow-y-auto">
              {catalogProducts.slice(0, 3).map((prod) => (
                <div
                  key={prod.id}
                  onClick={() =>
                    handleSend(
                      `I am interested in acquiring the ${prod.name} (${prod.salePrice ? `$${prod.salePrice}` : `$${prod.price}`}). What sizing and fabric specs are available?`
                    )
                  }
                  className="p-2.5 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-500/50 transition-all cursor-pointer text-left space-y-1 group"
                >
                  <div className="font-semibold text-stone-900 dark:text-white text-xs truncate group-hover:text-rose-600 dark:group-hover:text-rose-400">
                    {prod.name}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-slate-400 line-clamp-1">
                    {prod.category}
                  </div>
                  <div className="text-xs font-bold text-stone-900 dark:text-white">
                    ${prod.salePrice || prod.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Composer Field */}
        <div className="p-2.5 sm:p-4 border-t border-stone-200/90 dark:border-slate-800 bg-white dark:bg-[#111622] shrink-0 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-1.5 sm:gap-2"
          >
            {/* Catalog Tray Button */}
            <button
              type="button"
              onClick={() => setCatalogDrawerOpen(!catalogDrawerOpen)}
              title="Browse catalog items to inquire"
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 min-h-[42px] min-w-[42px] flex items-center justify-center ${
                catalogDrawerOpen
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300'
                  : 'bg-stone-50 dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>

            {/* Voice Dictation Button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              title={isListening ? 'Listening... click to stop' : 'Dictate inquiry via microphone'}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 min-h-[42px] min-w-[42px] flex items-center justify-center ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                  : 'bg-stone-50 dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            {/* Text Input - text-base (16px) on mobile prevents iOS safari auto-zoom */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening to speech...'
                  : 'Inquire about tailoring, appointments...'
              }
              className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-slate-500 text-base sm:text-sm focus:border-stone-400 dark:focus:border-rose-500 focus:outline-none transition-colors min-h-[42px]"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-stone-900 dark:bg-rose-600 hover:bg-stone-800 dark:hover:bg-rose-500 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 min-h-[42px] min-w-[42px] flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Micro Footer Notice */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-stone-400 dark:text-slate-500 mt-1.5 px-0.5">
            <span className="truncate">OperateAI Client Intelligence</span>
            <span className="truncate ml-2">Synced with Atelier CRM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
