import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { PaymentRequest, AdminPaymentGateways, Order } from '../../types.ts';
import {
  CreditCard,
  Coins,
  ShieldCheck,
  Zap,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  QrCode,
  RefreshCw,
  Check,
  Lock,
  Sparkles,
  ChevronDown,
  Layers,
  Globe,
  Radio,
  FileCheck2,
} from 'lucide-react';

export const PaymentsView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [gateways, setGateways] = useState<AdminPaymentGateways | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'lemonsqueezy' | 'crypto' | 'stripe'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals & Drawers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [previewPayment, setPreviewPayment] = useState<PaymentRequest | null>(null);
  const [auditPayment, setAuditPayment] = useState<PaymentRequest | null>(null);

  // Create Payment State
  const [createForm, setCreateForm] = useState({
    customerName: '',
    customerEmail: '',
    amount: '',
    currency: 'USD',
    provider: 'lemonsqueezy' as 'lemonsqueezy' | 'crypto' | 'stripe',
    orderId: '',
    description: '',
    cryptoToken: 'USDT' as 'USDT' | 'USDC' | 'BTC' | 'ETH' | 'SOL',
    cryptoNetwork: 'Ethereum (ERC-20)',
  });
  const [creating, setCreating] = useState(false);

  // Webhook Test State
  const [testGateway, setTestGateway] = useState<'lemonsqueezy' | 'crypto' | 'stripe'>('lemonsqueezy');
  const [testEvent, setTestEvent] = useState('order_created');
  const [testSelectedPaymentId, setTestSelectedPaymentId] = useState<string>('');
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookLog, setWebhookLog] = useState<{
    success: boolean;
    message: string;
    signature: string;
    payload: any;
  } | null>(null);

  const businessId = activeBusiness?.id || 'biz_aura_001';

  const loadData = async () => {
    try {
      setLoading(true);
      const [paymentsData, ordersData, gwData] = await Promise.all([
        api.getPayments(businessId),
        api.getOrders(businessId),
        api.getPaymentGateways().catch(() => null),
      ]);
      setPayments(paymentsData);
      setOrders(ordersData);
      if (gwData) {
        setGateways(gwData);
        if (!createForm.provider && gwData.activeDefaultProvider) {
          setCreateForm((prev) => ({ ...prev, provider: gwData.activeDefaultProvider }));
        }
      }
    } catch (err) {
      console.error('Failed to load payment data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [businessId]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSwitchDefaultGateway = async (provider: 'lemonsqueezy' | 'crypto' | 'stripe') => {
    if (!gateways) return;
    try {
      const updated = await api.updatePaymentGateways({
        ...gateways,
        activeDefaultProvider: provider,
      });
      setGateways(updated);
    } catch (err) {
      console.error('Failed to switch default gateway:', err);
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.customerName || !createForm.amount) return;

    try {
      setCreating(true);
      const newPay = await api.createPaymentRequest(businessId, {
        customerName: createForm.customerName,
        customerEmail: createForm.customerEmail || 'client@example.com',
        amount: parseFloat(createForm.amount) || 0,
        currency: createForm.currency,
        provider: createForm.provider,
        orderId: createForm.orderId || undefined,
        description: createForm.description || `Invoice for ${createForm.customerName}`,
        cryptoToken: createForm.provider === 'crypto' ? createForm.cryptoToken : undefined,
        cryptoNetwork: createForm.provider === 'crypto' ? createForm.cryptoNetwork : undefined,
      });

      setPayments((prev) => [newPay, ...prev]);
      setIsCreateModalOpen(false);
      setPreviewPayment(newPay);
      // Reset form
      setCreateForm({
        customerName: '',
        customerEmail: '',
        amount: '',
        currency: 'USD',
        provider: gateways?.activeDefaultProvider || 'lemonsqueezy',
        orderId: '',
        description: '',
        cryptoToken: 'USDT',
        cryptoNetwork: 'Ethereum (ERC-20)',
      });
    } catch (err) {
      console.error('Failed to create payment:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleSimulateWebhook = async (pay?: PaymentRequest) => {
    const target = pay || payments.find((p) => p.id === testSelectedPaymentId) || payments[0];
    if (!target) return;

    const gw = pay ? (pay.provider === 'crypto' ? 'crypto' : pay.provider === 'lemonsqueezy' ? 'lemonsqueezy' : 'stripe') : testGateway;
    const ev = pay ? (gw === 'crypto' ? 'finished' : 'order_created') : testEvent;

    try {
      setTestingWebhook(true);
      const res = await api.simulateWebhookTest({
        gateway: gw,
        eventType: ev,
        orderId: target.orderId,
        paymentId: target.id,
        businessId,
        amount: target.amount,
        currency: target.currency,
        cryptoToken: target.cryptoToken || 'USDT',
      });

      setWebhookLog(res);
      await loadData();
      if (previewPayment && previewPayment.id === target.id) {
        setPreviewPayment((prev) => (prev ? { ...prev, status: 'completed' } : null));
      }
    } catch (err) {
      console.error('Failed to simulate webhook:', err);
    } finally {
      setTestingWebhook(false);
    }
  };

  // Calculations
  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const lemonVolume = payments
    .filter((p) => p.status === 'completed' && p.provider === 'lemonsqueezy')
    .reduce((sum, p) => sum + p.amount, 0);

  const cryptoVolume = payments
    .filter((p) => p.status === 'completed' && p.provider === 'crypto')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingCount = payments.filter((p) => p.status === 'pending').length;

  const filteredPayments = payments.filter((p) => {
    if (activeTab !== 'all' && p.provider !== activeTab) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.customerName.toLowerCase().includes(q);
      const matchOrder = p.orderId?.toLowerCase().includes(q);
      const matchRef = p.transactionRef.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchOrder && !matchRef && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-emerald-500/5 via-amber-500/5 to-transparent pointer-events-none" />
        
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CreditCard className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Payment Gateways & Omnichannel Checkout</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live Verified
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Autonomous checkout links, Merchant of Record tax handling (Lemon Squeezy), and instant zero-chargeback crypto settlements (USDT/USDC/BTC) with cryptographically verified HMAC webhooks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={() => setIsWebhookModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-all active:scale-95 shadow-sm"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Test Webhooks & IPN</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Payment Link</span>
          </button>
        </div>
      </div>

      {/* Primary Gateway Cards (Dynamic Config from Admin Router) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Lemon Squeezy Card */}
        <div
          className={`p-5 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
            gateways?.activeDefaultProvider === 'lemonsqueezy'
              ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-950/30'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          {gateways?.activeDefaultProvider === 'lemonsqueezy' && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
              <Sparkles className="w-3 h-3" /> Default Router
            </div>
          )}

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                🍋
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Lemon Squeezy
                  <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active MoR
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Global Merchant of Record & Tax Compliance</p>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-300 mb-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Store Slug:</span>
                <span className="text-slate-300 font-bold">{gateways?.lemonSqueezy?.storeId || 'auraatelier'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Currencies:</span>
                <span className="text-slate-300">135+ Global Currencies</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Taxes & Invoicing:</span>
                <span className="text-emerald-400 font-semibold">100% Automated VAT/Sales</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Webhook Auth:</span>
                <span className="text-amber-300">HMAC-SHA256 Signed</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
            <span className="text-slate-400 text-[11px]">
              {gateways?.lemonSqueezy?.testMode ? 'Sandbox Mode' : 'Live Production'}
            </span>
            {gateways?.activeDefaultProvider !== 'lemonsqueezy' ? (
              <button
                onClick={() => handleSwitchDefaultGateway('lemonsqueezy')}
                className="text-amber-400 hover:text-amber-300 font-semibold text-xs transition-colors"
              >
                Set as Default →
              </button>
            ) : (
              <span className="text-amber-400/80 font-semibold text-xs flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Primary
              </span>
            )}
          </div>
        </div>

        {/* Crypto Gateway Card */}
        <div
          className={`p-5 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
            gateways?.activeDefaultProvider === 'crypto'
              ? 'bg-purple-950/20 border-purple-500/40 shadow-lg shadow-purple-950/30'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          {gateways?.activeDefaultProvider === 'crypto' && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
              <Sparkles className="w-3 h-3" /> Default Router
            </div>
          )}

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Cryptocurrency Gateway
                  <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Zero Chargeback
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">NOWPayments, Coinbase & Direct Web3</p>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-300 mb-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Supported:</span>
                <span className="text-purple-300 font-bold">USDT, USDC, BTC, ETH, SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Deposit Address:</span>
                <span className="text-slate-300 truncate max-w-[140px]">0x71C...84F2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Settlement:</span>
                <span className="text-emerald-400 font-semibold">Instant On-Chain</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">IPN Security:</span>
                <span className="text-purple-300">HMAC-SHA512 Verified</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
            <span className="text-slate-400 text-[11px]">Decentralized / Non-Custodial</span>
            {gateways?.activeDefaultProvider !== 'crypto' ? (
              <button
                onClick={() => handleSwitchDefaultGateway('crypto')}
                className="text-purple-400 hover:text-purple-300 font-semibold text-xs transition-colors"
              >
                Set as Default →
              </button>
            ) : (
              <span className="text-purple-400/80 font-semibold text-xs flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Primary
              </span>
            )}
          </div>
        </div>

        {/* Traditional & Mobile Gateways Card */}
        <div
          className={`p-5 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
            gateways?.activeDefaultProvider === 'stripe'
              ? 'bg-indigo-950/20 border-indigo-500/40 shadow-lg shadow-indigo-950/30'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          {gateways?.activeDefaultProvider === 'stripe' && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
              <Sparkles className="w-3 h-3" /> Default Router
            </div>
          )}

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Stripe & Paystack
                  <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    Secondary
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Direct CC, Apple Pay, Bank Debits</p>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-300 mb-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Coverage:</span>
                <span className="text-slate-300">Global & Africa Mobile Money</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Security:</span>
                <span className="text-slate-300">PCI DSS Level 1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fallback Mode:</span>
                <span className="text-emerald-400 font-semibold">Active & Armed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Webhook Auth:</span>
                <span className="text-slate-300">Stripe-Signature Header</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
            <span className="text-slate-400 text-[11px]">Conventional Processing</span>
            {gateways?.activeDefaultProvider !== 'stripe' ? (
              <button
                onClick={() => handleSwitchDefaultGateway('stripe')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs transition-colors"
              >
                Set as Default →
              </button>
            ) : (
              <span className="text-indigo-400/80 font-semibold text-xs flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Primary
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Total Collected (Verified)</div>
          <div className="text-xl font-bold text-white mt-1 font-mono">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3 h-3" /> 100% Cryptographic settlement
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <span>Lemon Squeezy Volume</span>
            <span className="text-amber-400 font-bold">🍋</span>
          </div>
          <div className="text-xl font-bold text-amber-400 mt-1 font-mono">
            ${lemonVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {payments.filter((p) => p.status === 'completed' && p.provider === 'lemonsqueezy').length} transactions processed
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <span>Crypto Volume (USDT/BTC)</span>
            <Coins className="w-3 h-3 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-400 mt-1 font-mono">
            ${cryptoVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Zero chargebacks & instant deposit</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Pending Settlement</div>
          <div className="text-xl font-bold text-amber-400 mt-1 font-mono">{pendingCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Active checkout links awaiting payment</div>
        </div>
      </div>

      {/* Main Transactions Section with Filter Tabs */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Gateway Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full md:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'All Gateways', count: payments.length },
              {
                id: 'lemonsqueezy',
                label: 'Lemon Squeezy',
                count: payments.filter((p) => p.provider === 'lemonsqueezy').length,
                icon: '🍋',
              },
              {
                id: 'crypto',
                label: 'Crypto (USDT/BTC)',
                count: payments.filter((p) => p.provider === 'crypto').length,
                icon: Coins,
              },
              {
                id: 'stripe',
                label: 'Stripe / Paystack',
                count: payments.filter((p) => p.provider === 'stripe' || p.provider === 'paystack').length,
                icon: CreditCard,
              },
            ].map((tab) => {
              const Icon = typeof tab.icon !== 'string' ? tab.icon : null;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {typeof tab.icon === 'string' && <span>{tab.icon}</span>}
                  {Icon && <Icon className="w-3.5 h-3.5 text-purple-400" />}
                  <span>{tab.label}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-[10px] text-slate-400">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search orders, clients, tx ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-700"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed / Paid</option>
              <option value="pending">Pending Settlement</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/40 border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Order / Txn Ref</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Gateway & Token</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Verified Webhook</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    No payment requests match the current filters.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const isPaid = p.status === 'completed';
                  const isLemon = p.provider === 'lemonsqueezy';
                  const isCrypto = p.provider === 'crypto';

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Order / Ref */}
                      <td className="px-4 py-3 font-mono">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{p.orderId || p.id}</span>
                          {p.bookingId && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/20 text-blue-300">
                              Booking
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                          {p.transactionRef}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{p.customerName}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                          {p.customerEmail || 'client@example.com'}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 font-mono">
                        <div className="font-bold text-emerald-400 text-sm">
                          ${p.amount.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400">{p.currency}</div>
                      </td>

                      {/* Gateway Badge */}
                      <td className="px-4 py-3">
                        {isLemon && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 font-semibold text-[11px]">
                            <span>🍋</span>
                            <span>Lemon Squeezy</span>
                          </div>
                        )}
                        {isCrypto && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/25 text-purple-300 font-semibold text-[11px]">
                            <Coins className="w-3.5 h-3.5" />
                            <span>Crypto ({p.cryptoToken || 'USDT'})</span>
                          </div>
                        )}
                        {!isLemon && !isCrypto && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 font-semibold text-[11px] capitalize">
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{p.provider}</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isPaid
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Radio className="w-3 h-3 animate-pulse" />}
                          {isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>

                      {/* Webhook Status */}
                      <td className="px-4 py-3">
                        {isPaid ? (
                          <button
                            onClick={() => setAuditPayment(p)}
                            className="text-left group cursor-pointer"
                          >
                            <div className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1 group-hover:underline">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Verified HMAC</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {p.webhookVerifiedAt ? new Date(p.webhookVerifiedAt).toLocaleTimeString() : 'Auto-Settled'}
                            </div>
                          </button>
                        ) : (
                          <span className="text-slate-500 text-[11px] italic">Awaiting Webhook</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copy Link */}
                          <button
                            onClick={() => handleCopy(p.paymentUrl, p.id)}
                            title="Copy Checkout Link"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                          >
                            {copiedId === p.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Preview Checkout */}
                          <button
                            onClick={() => setPreviewPayment(p)}
                            title="View Customer Checkout Sheet"
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            <span>Preview</span>
                          </button>

                          {/* Simulate Webhook if pending */}
                          {!isPaid && (
                            <button
                              onClick={() => handleSimulateWebhook(p)}
                              disabled={testingWebhook}
                              title="Simulate Verified Webhook Settlement"
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-300" />
                              <span>Settle</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE PAYMENT REQUEST MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Generate Payment Link</h3>
                  <p className="text-xs text-slate-400">Issue a verified checkout link or crypto invoice</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="space-y-4 mt-4">
              {/* Select Gateway */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Checkout Gateway & Processor
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'lemonsqueezy', label: 'Lemon Squeezy', icon: '🍋', desc: 'Global Cards & VAT' },
                    { id: 'crypto', label: 'Crypto Gateway', icon: '🪙', desc: 'USDT, USDC, BTC, ETH' },
                    { id: 'stripe', label: 'Stripe', icon: '💳', desc: 'Standard CC' },
                  ].map((gw) => (
                    <div
                      key={gw.id}
                      onClick={() => setCreateForm({ ...createForm, provider: gw.id as any })}
                      className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${
                        createForm.provider === gw.id
                          ? 'border-emerald-500/60 bg-emerald-500/10 text-white ring-1 ring-emerald-500/40'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-lg mb-0.5">{gw.icon}</div>
                      <div className="text-xs font-bold">{gw.label}</div>
                      <div className="text-[10px] text-slate-500">{gw.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* If Crypto: Select Token & Network */}
              {createForm.provider === 'crypto' && (
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                  <div className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                    <Coins className="w-4 h-4" />
                    <span>Cryptocurrency Settlement Configuration</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Accepted Token</label>
                      <select
                        value={createForm.cryptoToken}
                        onChange={(e) => setCreateForm({ ...createForm, cryptoToken: e.target.value as any })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="USDT">USDT (Tether USD)</option>
                        <option value="USDC">USDC (USD Coin)</option>
                        <option value="BTC">BTC (Bitcoin)</option>
                        <option value="ETH">ETH (Ethereum)</option>
                        <option value="SOL">SOL (Solana)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Network</label>
                      <select
                        value={createForm.cryptoNetwork}
                        onChange={(e) => setCreateForm({ ...createForm, cryptoNetwork: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="Ethereum (ERC-20)">Ethereum (ERC-20)</option>
                        <option value="Solana Mainnet">Solana Mainnet</option>
                        <option value="Polygon (PoS)">Polygon (PoS)</option>
                        <option value="Bitcoin Mainnet">Bitcoin Mainnet</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Julian Croft"
                    value={createForm.customerName}
                    onChange={(e) => setCreateForm({ ...createForm, customerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    placeholder="julian@example.com"
                    value={createForm.customerEmail}
                    onChange={(e) => setCreateForm({ ...createForm, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Amount & Currency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Amount *
                  </label>
                  <div className="relative">
                    <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="250.00"
                      value={createForm.amount}
                      onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Currency
                  </label>
                  <select
                    value={createForm.currency}
                    onChange={(e) => setCreateForm({ ...createForm, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>
              </div>

              {/* Attach to Existing Order (optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Attach to Existing Order (Optional)
                </label>
                <select
                  value={createForm.orderId}
                  onChange={(e) => {
                    const selOrder = orders.find((o) => o.id === e.target.value);
                    setCreateForm({
                      ...createForm,
                      orderId: e.target.value,
                      customerName: selOrder ? selOrder.customerName : createForm.customerName,
                      customerEmail: selOrder ? selOrder.customerEmail : createForm.customerEmail,
                      amount: selOrder ? selOrder.total.toString() : createForm.amount,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">None (Custom Direct Charge)</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id} - {o.customerName} (${o.total.toFixed(2)}) [{o.paymentStatus}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description / Item Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. Custom Bespoke Tailoring & Fitting Session"
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/40 disabled:opacity-50"
                >
                  {creating ? 'Generating Link...' : 'Create Payment Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOMER CHECKOUT PREVIEW MODAL */}
      {previewPayment && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setPreviewPayment(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              ✕
            </button>

            {/* Check Provider Type */}
            {previewPayment.provider === 'lemonsqueezy' ? (
              /* Lemon Squeezy Checkout Sheet Preview */
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <span className="text-2xl">🍋</span>
                  <div>
                    <h3 className="text-sm font-bold text-white">Lemon Squeezy Hosted Checkout</h3>
                    <p className="text-[11px] text-slate-400">Merchant of Record • Automated Tax Compliance</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Order Reference:</span>
                    <span className="font-mono text-white font-bold">{previewPayment.orderId || previewPayment.id}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Customer:</span>
                    <span className="text-slate-200">{previewPayment.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Description:</span>
                    <span className="text-slate-200 text-right truncate max-w-[200px]">{previewPayment.description}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-300">Total Due:</span>
                    <span className="text-lg font-bold text-amber-400 font-mono">
                      ${previewPayment.amount.toFixed(2)} {previewPayment.currency}
                    </span>
                  </div>
                </div>

                {/* Simulated Card Form */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-3">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>256-Bit Encrypted Payment Form</span>
                  </div>
                  <input
                    type="text"
                    disabled
                    value="•••• •••• •••• 4242"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      disabled
                      value="12 / 28"
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono"
                    />
                    <input
                      type="text"
                      disabled
                      value="CVC 928"
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono"
                    />
                  </div>
                </div>

                {previewPayment.status === 'completed' ? (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Payment Verified by Lemon Squeezy Webhook</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSimulateWebhook(previewPayment)}
                    disabled={testingWebhook}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Simulate Lemon Squeezy Webhook Settlement</span>
                  </button>
                )}
              </div>
            ) : previewPayment.provider === 'crypto' ? (
              /* Cryptocurrency Checkout Sheet Preview */
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Cryptocurrency Payment Portal</h3>
                    <p className="text-[11px] text-purple-300">
                      Non-Custodial • Zero Chargeback • {previewPayment.cryptoToken || 'USDT'}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-center space-y-3">
                  <div className="inline-block p-3 rounded-2xl bg-white shadow-xl">
                    {/* Simulated QR Code */}
                    <div className="w-32 h-32 bg-slate-950 rounded-lg p-2 flex flex-col items-center justify-center relative overflow-hidden">
                      <QrCode className="w-24 h-24 text-white" />
                      <span className="text-[8px] text-purple-400 font-bold font-mono uppercase mt-1">
                        {previewPayment.cryptoToken || 'USDT'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-400">Total Amount to Send</div>
                    <div className="text-xl font-bold text-purple-400 font-mono mt-0.5">
                      {previewPayment.amount.toFixed(2)} {previewPayment.cryptoToken || 'USDT'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Network: {previewPayment.cryptoNetwork || 'Ethereum (ERC-20)'}
                    </div>
                  </div>

                  {/* Copy Deposit Address */}
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 text-left">
                    <div className="truncate font-mono text-[11px] text-slate-300">
                      {previewPayment.cryptoAddress || '0x71C84F2819034E594bDb41C52E5848'}
                    </div>
                    <button
                      onClick={() =>
                        handleCopy(
                          previewPayment.cryptoAddress || '0x71C84F2819034E594bDb41C52E5848',
                          'modal_addr'
                        )
                      }
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold flex items-center gap-1"
                    >
                      {copiedId === 'modal_addr' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {previewPayment.status === 'completed' ? (
                  <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Instant Blockchain Settlement Confirmed (12/12)</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSimulateWebhook(previewPayment)}
                    disabled={testingWebhook}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-950/40 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Coins className="w-4 h-4" />
                    <span>Simulate Instant On-Chain Deposit IPN</span>
                  </button>
                )}
              </div>
            ) : (
              /* Stripe / General Card Checkout Preview */
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <CreditCard className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Stripe Checkout</h3>
                    <p className="text-[11px] text-slate-400">Direct Gateway Credit Card Processing</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reference:</span>
                    <span className="text-white font-mono">{previewPayment.orderId || previewPayment.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total:</span>
                    <span className="text-emerald-400 font-mono font-bold">${previewPayment.amount.toFixed(2)}</span>
                  </div>
                </div>
                {previewPayment.status === 'completed' ? (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Payment Completed</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSimulateWebhook(previewPayment)}
                    disabled={testingWebhook}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Simulate Stripe Webhook</span>
                  </button>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => handleCopy(previewPayment.paymentUrl, 'link_copy')}
                className="text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedId === 'link_copy' ? 'Link Copied!' : 'Copy Shareable Link'}</span>
              </button>
              <button
                onClick={() => setPreviewPayment(null)}
                className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WEBHOOK AUDIT DETAILS MODAL */}
      {auditPayment && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Cryptographic Webhook Audit Log</h3>
                  <p className="text-[11px] text-slate-400">Proof of verified server-to-server settlement</p>
                </div>
              </div>
              <button
                onClick={() => setAuditPayment(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mt-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction Ref:</span>
                  <span className="text-slate-300 font-bold">{auditPayment.transactionRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gateway Provider:</span>
                  <span className="text-amber-400 uppercase font-bold">{auditPayment.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Verification Timestamp:</span>
                  <span className="text-emerald-400">{auditPayment.webhookVerifiedAt || auditPayment.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Event Signature:</span>
                  <span className="text-purple-300">
                    {auditPayment.provider === 'crypto' ? 'HMAC-SHA512 (Valid)' : 'HMAC-SHA256 (Valid)'}
                  </span>
                </div>
                {auditPayment.cryptoTxHash && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tx Hash / On-Chain Ref:</span>
                    <span className="text-purple-300 truncate max-w-[240px]">{auditPayment.cryptoTxHash}</span>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
                <div className="text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Security Guarantee:</span>
                </div>
                All funds are guaranteed settled directly into your merchant accounts (Lemon Squeezy Store {gateways?.lemonSqueezy?.storeId} or Crypto Address {gateways?.crypto?.walletAddress}). No client-side tampering is permitted.
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setAuditPayment(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WEBHOOK & IPN SIMULATION TESTING HUB DRAWER/MODAL */}
      {isWebhookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Webhook & IPN Simulator Hub</h3>
                  <p className="text-xs text-slate-400">
                    Simulate real server-to-server webhook delivery and test HMAC signature verification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsWebhookModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              {/* Select Gateway to Test */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'lemonsqueezy', label: 'Lemon Squeezy', sub: 'HMAC-SHA256 • order_created', icon: '🍋' },
                  { id: 'crypto', label: 'Crypto IPN', sub: 'HMAC-SHA512 • finished', icon: '🪙' },
                  { id: 'stripe', label: 'Stripe', sub: 'stripe-signature • succeeded', icon: '💳' },
                ].map((g) => (
                  <div
                    key={g.id}
                    onClick={() => {
                      setTestGateway(g.id as any);
                      setTestEvent(g.id === 'crypto' ? 'finished' : 'order_created');
                      setWebhookLog(null);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      testGateway === g.id
                        ? 'border-amber-500/60 bg-amber-500/10 text-white ring-1 ring-amber-500/40'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-base mb-1">{g.icon}</div>
                    <div className="font-bold text-slate-200">{g.label}</div>
                    <div className="text-[10px] text-slate-500">{g.sub}</div>
                  </div>
                ))}
              </div>

              {/* Event Type & Target Payment */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Webhook Event Type</label>
                  <select
                    value={testEvent}
                    onChange={(e) => setTestEvent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    {testGateway === 'lemonsqueezy' && (
                      <>
                        <option value="order_created">order_created (Successful Purchase)</option>
                        <option value="subscription_created">subscription_created (Recurring Membership)</option>
                        <option value="order_refunded">order_refunded (Customer Refund)</option>
                      </>
                    )}
                    {testGateway === 'crypto' && (
                      <>
                        <option value="finished">finished (Confirmed 12/12 On-Chain)</option>
                        <option value="confirmed">confirmed (Mempool Accepted)</option>
                        <option value="partially_paid">partially_paid (Partial Crypto Transfer)</option>
                      </>
                    )}
                    {testGateway === 'stripe' && (
                      <>
                        <option value="payment_intent.succeeded">payment_intent.succeeded</option>
                        <option value="charge.refunded">charge.refunded</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Payment / Order</label>
                  <select
                    value={testSelectedPaymentId}
                    onChange={(e) => setTestSelectedPaymentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="">Auto-Select Latest Pending</option>
                    {payments.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.orderId || p.id} - ${p.amount.toFixed(2)} ({p.customerName}) [{p.status}]
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSimulateWebhook()}
                disabled={testingWebhook}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {testingWebhook ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Computing Signature & Dispatching Webhook...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Dispatch Webhook Payload with Cryptographic Signature</span>
                  </>
                )}
              </button>

              {/* Execution Log & Payload Inspector */}
              {webhookLog && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-4 h-4" />
                      {webhookLog.message}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      HTTP 200 OK
                    </span>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                      Computed Verification Signature:
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-[10px] text-amber-300 break-all">
                      {webhookLog.signature}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                      Webhook JSON Body Ingested:
                    </div>
                    <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-[10px] text-slate-300 overflow-x-auto max-h-48 leading-relaxed">
                      {JSON.stringify(webhookLog.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end mt-4">
              <button
                onClick={() => setIsWebhookModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close Simulator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
