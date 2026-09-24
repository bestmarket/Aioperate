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
    customerMeta?: { name?: string; contact?: string; channel?: string };
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
  simulatePaymentSuccess: (businessId: string, orderId?: string, paymentId?: string) =>
    request<{ success: boolean; message: string; order: Order; payment: PaymentRequest }>(
      '/payments/simulate-success',
      {
        method: 'POST',
        body: JSON.stringify({ businessId, orderId, paymentId }),
      }
    ),

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

  // Admin
  getAdminOverview: () => request<any>('/admin/overview'),
  getPaymentGateways: () => request<any>('/admin/payment-gateways'),
  updatePaymentGateways: (data: any) =>
    request<any>('/admin/payment-gateways', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
