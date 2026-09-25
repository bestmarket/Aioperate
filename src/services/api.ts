import {
  Business,
  User,
  AgentSettings,
  KnowledgeSource,
  Customer,
  Lead,
  Conversation,
  Message,
  Product,
  Service,
  Order,
  PaymentRequest,
  Booking,
  Automation,
  Campaign,
  AnalyticsData,
  WidgetSettings,
  WhatsAppConfig,
  TeamMember,
  IntegrationStatus,
  AdminPaymentGateways,
  AiTeamMember,
  VoiceCall,
  MarketingAsset,
  BusinessPlan,
  GeneratedWebsite,
  DocumentRecord,
  ReputationItem,
  BrandKit,
  VisitorProfile,
  VisitorEvent,
  WebsiteAiConfig,
} from '../types.ts';

const API_BASE = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let errorMsg = `API Error ${res.status}: ${res.statusText}`;
    try {
      const errJson = await res.json();
      if (errJson.error) errorMsg = errJson.error;
    } catch {}
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // Auth & Tenants
  getAuthMe: (businessId?: string) =>
    request<{ user: User; activeBusiness: Business; businesses: Business[] }>(
      '/auth/me',
      businessId ? { headers: { 'x-business-id': businessId } } : undefined
    ),
  login: (email: string) =>
    request<{ success: boolean; user: User; business: Business }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  getBusinesses: () => request<Business[]>('/businesses'),
  getBusiness: (id: string) => request<Business>(`/businesses/${id}`),
  createBusiness: (data: Partial<Business>) =>
    request<Business>('/businesses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateBusiness: (id: string, data: Partial<Business>) =>
    request<Business>(`/businesses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // AI Agent
  getAgent: (businessId: string) => request<AgentSettings>(`/agent/${businessId}`),
  updateAgent: (businessId: string, data: Partial<AgentSettings>) =>
    request<AgentSettings>(`/agent/${businessId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Knowledge Base
  getKnowledge: (businessId: string) => request<KnowledgeSource[]>(`/knowledge/${businessId}`),
  createKnowledge: (businessId: string, data: Partial<KnowledgeSource>) =>
    request<KnowledgeSource>(`/knowledge/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteKnowledge: (businessId: string, docId: string) =>
    request<{ success: boolean }>(`/knowledge/${businessId}/${docId}`, {
      method: 'DELETE',
    }),

  // Chat & AI Engine
  sendChatMessage: (params: {
    businessId: string;
    conversationId?: string;
    message: string;
    customerMeta?: { name?: string; contact?: string; channel?: string; visitorId?: string; page?: string };
  }) =>
    request<{
      conversationId: string;
      userMessage: Message;
      agentMessage: Message;
      toolCalls: any[];
      escalated: boolean;
    }>('/chat', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  // Unified Conversations
  getConversations: (businessId: string) => request<Conversation[]>(`/conversations/${businessId}`),
  getConversationMessages: (businessId: string, convId: string) =>
    request<Message[]>(`/conversations/${businessId}/${convId}/messages`),
  replyConversation: (businessId: string, convId: string, content: string, staffName?: string) =>
    request<{ message: Message }>(`/conversations/${businessId}/${convId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ content, staffName }),
    }),
  updateConversationStatus: (businessId: string, convId: string, status?: string, assignedTo?: string) =>
    request<Conversation>(`/conversations/${businessId}/${convId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, assignedTo }),
    }),

  // Leads
  getLeads: (businessId: string) => request<Lead[]>(`/leads/${businessId}`),
  createLead: (businessId: string, data: Partial<Lead>) =>
    request<Lead>(`/leads/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateLead: (businessId: string, leadId: string, data: Partial<Lead>) =>
    request<Lead>(`/leads/${businessId}/${leadId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Customers & CRM
  getCustomers: (businessId: string) => request<Customer[]>(`/customers/${businessId}`),
  createCustomer: (businessId: string, data: Partial<Customer>) =>
    request<Customer>(`/customers/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Products
  getProducts: (businessId: string) => request<Product[]>(`/products/${businessId}`),
  createProduct: (businessId: string, data: Partial<Product>) =>
    request<Product>(`/products/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProduct: (businessId: string, productId: string, data: Partial<Product>) =>
    request<Product>(`/products/${businessId}/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProduct: (businessId: string, productId: string) =>
    request<{ success: boolean }>(`/products/${businessId}/${productId}`, {
      method: 'DELETE',
    }),

  // Services & Bookings
  getServices: (businessId: string) => request<Service[]>(`/services/${businessId}`),
  createService: (businessId: string, data: Partial<Service>) =>
    request<Service>(`/services/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getBookings: (businessId: string) => request<Booking[]>(`/bookings/${businessId}`),
  createBooking: (businessId: string, data: Partial<Booking>) =>
    request<Booking>(`/bookings/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateBooking: (businessId: string, bookingId: string, data: Partial<Booking>) =>
    request<Booking>(`/bookings/${businessId}/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Orders & Payments
  getOrders: (businessId: string) => request<Order[]>(`/orders/${businessId}`),
  createOrder: (businessId: string, data: Partial<Order>) =>
    request<Order>(`/orders/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateOrder: (businessId: string, orderId: string, data: Partial<Order>) =>
    request<Order>(`/orders/${businessId}/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getPayments: (businessId: string) => request<PaymentRequest[]>(`/payments/${businessId}`),
  createPaymentRequest: (businessId: string, data: Partial<PaymentRequest>) =>
    request<PaymentRequest>(`/payments/${businessId}/create`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  simulatePaymentSuccess: (businessId: string, orderId?: string, paymentId?: string) =>
    request<{ success: boolean; message: string; order: Order; payment: PaymentRequest }>(
      '/payments/simulate-success',
      {
        method: 'POST',
        body: JSON.stringify({ businessId, orderId, paymentId }),
      }
    ),
  simulateWebhookTest: (data: {
    gateway: 'lemonsqueezy' | 'crypto' | 'stripe';
    eventType: string;
    orderId?: string;
    paymentId?: string;
    businessId: string;
    amount?: number;
    currency?: string;
    cryptoToken?: string;
  }) =>
    request<{
      success: boolean;
      message: string;
      signature: string;
      payload: any;
      order?: Order;
      payment?: PaymentRequest;
    }>('/webhooks/test-simulate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Automations & Campaigns
  getAutomations: (businessId: string) => request<Automation[]>(`/automations/${businessId}`),
  createAutomation: (businessId: string, data: Partial<Automation>) =>
    request<Automation>(`/automations/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAutomation: (businessId: string, autoId: string, data: Partial<Automation>) =>
    request<Automation>(`/automations/${businessId}/${autoId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  triggerAutomation: (businessId: string, autoId: string) =>
    request<{ success: boolean; runsCount: number; executedAt: string }>(
      `/automations/${businessId}/${autoId}/trigger`,
      { method: 'POST' }
    ),
  getCampaigns: (businessId: string) => request<Campaign[]>(`/campaigns/${businessId}`),
  createCampaign: (businessId: string, data: Partial<Campaign>) =>
    request<Campaign>(`/campaigns/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  sendCampaign: (businessId: string, campId: string) =>
    request<Campaign>(`/campaigns/${businessId}/${campId}/send`, { method: 'POST' }),

  // Analytics
  getAnalytics: (businessId: string) => request<AnalyticsData>(`/analytics/${businessId}`),

  // Widget & Channels
  getWidgetConfig: (businessId: string) => request<WidgetSettings>(`/widget/config/${businessId}`),
  updateWidgetConfig: (businessId: string, data: Partial<WidgetSettings>) =>
    request<WidgetSettings>(`/widget/config/${businessId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getWhatsAppConfig: (businessId: string) => request<WhatsAppConfig>(`/whatsapp/config/${businessId}`),
  updateWhatsAppConfig: (businessId: string, data: Partial<WhatsAppConfig>) =>
    request<WhatsAppConfig>(`/whatsapp/config/${businessId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Team & Settings
  getTeam: (businessId: string) => request<TeamMember[]>(`/team/${businessId}`),
  inviteTeamMember: (businessId: string, data: { name: string; email: string; role: string }) =>
    request<TeamMember>(`/team/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getIntegrations: (businessId: string) => request<IntegrationStatus[]>(`/integrations/${businessId}`),
  toggleIntegration: (businessId: string, intId: string) =>
    request<{ success: boolean; item: IntegrationStatus }>(`/integrations/${businessId}/${intId}/toggle`, {
      method: 'POST',
    }),

  // AI Team & Voice Engine
  getAiTeam: (businessId: string) => request<AiTeamMember[]>(`/ai-team/${businessId}`),
  updateAiTeamMember: (businessId: string, memberId: string, data: Partial<AiTeamMember>) =>
    request<AiTeamMember>(`/ai-team/${businessId}/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getVoiceCalls: (businessId: string) => request<VoiceCall[]>(`/voice/${businessId}/calls`),
  simulateVoiceCall: (businessId: string, payload: { callerName?: string; callerPhone?: string; topic?: string; voiceTone?: string }) =>
    request<VoiceCall>(`/voice/${businessId}/simulate-call`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // AI Daily Brief
  getDailyBrief: (businessId: string) => request<any>(`/daily-brief/${businessId}`),

  // Marketing Studio
  getMarketingAssets: (businessId: string) => request<MarketingAsset[]>(`/marketing/${businessId}`),
  generateMarketingAsset: (businessId: string, payload: any) =>
    request<any>(`/marketing/${businessId}/generate`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  createMarketingAsset: (businessId: string, data: Partial<MarketingAsset>) =>
    request<MarketingAsset>(`/marketing/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteMarketingAsset: (businessId: string, id: string) =>
    request<{ success: boolean }>(`/marketing/${businessId}/${id}`, {
      method: 'DELETE',
    }),

  // Business Strategy & Plans
  getBusinessPlans: (businessId: string) => request<BusinessPlan[]>(`/strategy/${businessId}`),
  generateBusinessPlan: (businessId: string, payload: any) =>
    request<any>(`/strategy/${businessId}/generate`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  createBusinessPlan: (businessId: string, data: Partial<BusinessPlan>) =>
    request<BusinessPlan>(`/strategy/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // AI Website Builder
  getWebsites: (businessId: string) => request<GeneratedWebsite[]>(`/websites/${businessId}`),
  generateWebsite: (businessId: string, payload: any) =>
    request<any>(`/websites/${businessId}/generate`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  createWebsite: (businessId: string, data: Partial<GeneratedWebsite>) =>
    request<GeneratedWebsite>(`/websites/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Documents & Invoices
  getDocuments: (businessId: string) => request<DocumentRecord[]>(`/documents/${businessId}`),
  createDocument: (businessId: string, data: Partial<DocumentRecord>) =>
    request<DocumentRecord>(`/documents/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateDocument: (businessId: string, id: string, data: Partial<DocumentRecord>) =>
    request<DocumentRecord>(`/documents/${businessId}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Reputation & Reviews
  getReviews: (businessId: string) => request<ReputationItem[]>(`/reputation/${businessId}`),
  addReview: (businessId: string, data: Partial<ReputationItem>) =>
    request<ReputationItem>(`/reputation/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  replyReview: (businessId: string, id: string, reply: string) =>
    request<ReputationItem>(`/reputation/${businessId}/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ reply }),
    }),

  // Brand Kit & Creative Studio
  getBrandKit: (businessId: string) => request<BrandKit>(`/brand-kit/${businessId}`),
  updateBrandKit: (businessId: string, data: Partial<BrandKit>) =>
    request<BrandKit>(`/brand-kit/${businessId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Admin
  getAdminOverview: () => request<any>('/admin/overview'),
  getPaymentGateways: () => request<AdminPaymentGateways>('/admin/payment-gateways'),
  updatePaymentGateways: (data: Partial<AdminPaymentGateways>) =>
    request<AdminPaymentGateways>('/admin/payment-gateways', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Live Visitor Intelligence & Website AI Control Machine
  getVisitors: (businessId: string) => request<VisitorProfile[]>(`/visitors/${businessId}`),
  getVisitor: (businessId: string, id: string) =>
    request<VisitorProfile & { events?: VisitorEvent[] }>(`/visitors/${businessId}/${id}`),
  getVisitorEvents: (businessId: string, id: string) =>
    request<VisitorEvent[]>(`/visitors/${businessId}/${id}/events`),
  trackVisitorEvent: (businessId: string, data: any) =>
    request<any>(`/visitors/${businessId}/track`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  sendMessageToVisitor: (businessId: string, visitorId: string, content: string, staffName?: string) =>
    request<any>(`/visitors/${businessId}/${visitorId}/message`, {
      method: 'POST',
      body: JSON.stringify({ content, staffName }),
    }),
  toggleHumanTakeover: (businessId: string, visitorId: string, humanTakeover: boolean, staffName?: string) =>
    request<any>(`/visitors/${businessId}/${visitorId}/takeover`, {
      method: 'POST',
      body: JSON.stringify({ humanTakeover, staffName }),
    }),
  transferVisitor: (businessId: string, visitorId: string, data: { targetRole?: string; staffName?: string }) =>
    request<any>(`/visitors/${businessId}/${visitorId}/transfer`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  identifyVisitor: (businessId: string, data: { visitorId: string; name?: string; email?: string; phone?: string }) =>
    request<any>(`/visitors/${businessId}/identify`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getWebsiteAiConfig: (businessId: string) => request<WebsiteAiConfig>(`/website-ai/${businessId}/config`),
  updateWebsiteAiConfig: (businessId: string, data: Partial<WebsiteAiConfig>) =>
    request<WebsiteAiConfig>(`/website-ai/${businessId}/config`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
