export type UserRole = 'owner' | 'admin' | 'manager' | 'sales' | 'support' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  businessId: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  industry: string;
  website: string;
  description: string;
  logo?: string;
  brandColor: string;
  currency: string;
  language: string;
  timezone: string;
  businessHours: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
  createdAt: string;
}

export interface AgentSettings {
  id: string;
  businessId: string;
  name: string;
  avatar: string;
  tone: 'professional' | 'friendly' | 'premium' | 'casual' | 'concise' | 'custom';
  personality: string;
  language: string;
  responseLength: 'short' | 'balanced' | 'thorough';
  objectives: string[];
  allowedActions: string[];
  escalationRules: string[];
  workingHours: string;
  fallbackBehavior: string;
  systemPromptOverride?: string;
  status: 'active' | 'paused';
  qualificationQuestions: {
    id: string;
    question: string;
    field: string;
    weight: number;
  }[];
}

export interface KnowledgeSource {
  id: string;
  businessId: string;
  title: string;
  type: 'website_url' | 'pdf' | 'txt' | 'docx' | 'faq' | 'catalog' | 'manual' | 'policy';
  sourceUri?: string;
  content: string;
  status: 'indexed' | 'indexing' | 'failed';
  lastUpdated: string;
  tokenCount?: number;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  tags: string[];
  notes: string[];
  status: 'lead' | 'prospect' | 'customer' | 'vip' | 'inactive';
  totalSpent: number;
  ordersCount: number;
  bookingsCount: number;
  createdAt: string;
  lastInteraction: string;
}

export interface Lead {
  id: string;
  businessId: string;
  customerId?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  source: 'website_chat' | 'whatsapp' | 'email' | 'manual' | 'call';
  interest: string;
  value: number;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  score: 'low' | 'medium' | 'high';
  scoreValue: number;
  assignedStaff?: string;
  notes: string;
  tags: string[];
  qualificationAnswers?: Record<string, string>;
  createdAt: string;
  lastInteraction: string;
}

export interface Conversation {
  id: string;
  businessId: string;
  channel: 'website_chat' | 'whatsapp' | 'email' | 'phone_voice';
  customerId?: string;
  customerName: string;
  customerContact: string;
  status: 'ai_handling' | 'human_escalated' | 'closed';
  messagesCount: number;
  lastMessage: string;
  lastMessageAt: string;
  unread: boolean;
  assignedTo?: string;
  tags: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface Message {
  id: string;
  conversationId: string;
  businessId: string;
  sender: 'customer' | 'agent' | 'human_staff';
  content: string;
  timestamp: string;
  toolCalls?: {
    tool: string;
    args: Record<string, any>;
    result?: Record<string, any>;
  }[];
  attachments?: {
    type: 'product' | 'order' | 'booking' | 'payment_link';
    data: any;
  }[];
  metadata?: Record<string, any>;
}

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  sku: string;
  inventory: number;
  category: string;
  variants?: ProductVariant[];
  images: string[];
  status: 'active' | 'draft' | 'archived';
}

export interface Service {
  id: string;
  businessId: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  depositRequired: number;
  staff: string[];
  workingHours: string;
  available: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface Order {
  id: string;
  businessId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  paymentStatus: 'pending' | 'payment_pending' | 'paid' | 'failed' | 'refunded';
  fulfillmentStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  notes?: string;
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
}

export interface PaymentRequest {
  id: string;
  businessId: string;
  orderId?: string;
  bookingId?: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  provider: 'lemonsqueezy' | 'crypto' | 'stripe' | 'paystack' | 'paypal' | 'sandbox';
  status: 'initiated' | 'pending' | 'completed' | 'failed' | 'refunded';
  paymentUrl: string;
  transactionRef: string;
  description: string;
  createdAt: string;
}

export interface LemonSqueezyConfig {
  enabled: boolean;
  storeId: string;
  apiKeyMasked?: string;
  apiKey?: string;
  webhookSecretMasked?: string;
  webhookSecret?: string;
  testMode: boolean;
  connectedAt?: string;
}

export interface CryptoPaymentConfig {
  enabled: boolean;
  provider: 'coinbase_commerce' | 'nowpayments' | 'btcpayserver' | 'web3_direct';
  apiKeyMasked?: string;
  apiKey?: string;
  webhookSecretMasked?: string;
  webhookSecret?: string;
  acceptedCurrencies: ('USDT' | 'USDC' | 'BTC' | 'ETH' | 'SOL')[];
  walletAddress?: string;
  network?: string;
  testMode: boolean;
  connectedAt?: string;
}

export interface AdminPaymentGateways {
  activeDefaultProvider: 'lemonsqueezy' | 'crypto' | 'stripe';
  lemonSqueezy: LemonSqueezyConfig;
  crypto: CryptoPaymentConfig;
  stripe: {
    enabled: boolean;
    publishableKeyMasked?: string;
    secretKeyMasked?: string;
    webhookSecretMasked?: string;
    testMode: boolean;
    connectedAt?: string;
  };
}

export interface Booking {
  id: string;
  businessId: string;
  serviceId: string;
  serviceName: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  staffName: string;
  date: string;
  time: string;
  durationMinutes: number;
  price: number;
  status: 'confirmed' | 'pending_payment' | 'completed' | 'cancelled';
  notes?: string;
  remindersSent: number;
  createdAt: string;
}

export interface Automation {
  id: string;
  businessId: string;
  name: string;
  description: string;
  trigger: 'lead_created' | 'order_abandoned' | 'order_paid' | 'booking_created' | 'customer_inactive' | 'conversation_escalated' | 'tag_added';
  conditions: {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
    value: string | number;
  }[];
  waitHours?: number;
  actions: {
    type: 'send_whatsapp' | 'send_email' | 'notify_staff' | 'create_crm_task' | 'update_lead_score';
    params: Record<string, any>;
  }[];
  status: 'active' | 'paused';
  runsCount: number;
  lastRunAt?: string;
}

export interface Campaign {
  id: string;
  businessId: string;
  name: string;
  channel: 'whatsapp' | 'email' | 'website_notification';
  audienceSegment: 'all_customers' | 'new_leads' | 'past_buyers' | 'inactive_30d' | 'high_value_vip';
  messageTemplate: string;
  status: 'draft' | 'scheduled' | 'sent';
  scheduledAt?: string;
  sentCount: number;
  clickCount: number;
  conversionCount: number;
  revenueGenerated: number;
  createdAt: string;
}

export interface AnalyticsData {
  visitors: number;
  conversations: number;
  leads: number;
  qualifiedLeads: number;
  orders: number;
  revenue: number;
  bookings: number;
  conversionRate: number;
  aiDeflectionRate: number;
  aiInfluenceRevenue: number;
  humanHandoffs: number;
  followUpsSent: number;
  recoveredLeads: number;
  avgResponseTimeSeconds?: number;
  revenueByDay: { date: string; revenue: number; orders: number }[];
  leadsByDay: { date: string; leads: number; qualified: number }[];
  conversationsByChannel: { channel: string; count: number }[];
}

export interface WidgetSettings {
  businessId: string;
  brandColor: string;
  businessName: string;
  greetingTitle: string;
  welcomeMessage: string;
  avatarUrl: string;
  position: 'bottom-right' | 'bottom-left';
  launcherStyle: 'pill' | 'round' | 'icon_only';
  placeholderText: string;
  quickPrompts: string[];
}

export interface WhatsAppConfig {
  businessId: string;
  connected: boolean;
  phoneNumberId?: string;
  wabaId?: string;
  accessTokenMasked?: string;
  webhookVerified: boolean;
  businessPhone: string;
  templateSyncStatus: 'synced' | 'pending' | 'disconnected';
  autoReplyEnabled: boolean;
}

export interface TeamMember {
  id: string;
  businessId: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'invited';
  lastActive: string;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  category: 'channel' | 'payment' | 'voice' | 'crm' | 'ecommerce';
  connected: boolean;
  description: string;
  config: Record<string, any>;
}

export interface BillingPlan {
  id: 'starter' | 'growth' | 'business' | 'enterprise';
  name: string;
  priceMonthly: number;
  features: string[];
  limits: {
    aiMessages: number;
    teamMembers: number;
    knowledgeDocs: number;
    automations: number;
    whatsappActive: boolean;
  };
}

// ==========================================
// SAAS UPGRADE TYPES
// ==========================================

export interface AiTeamMember {
  id: string;
  role: 'receptionist' | 'sales' | 'support' | 'marketing' | 'booking' | 'operations' | 'strategist' | 'analytics';
  name: string;
  title: string;
  avatar: string;
  status: 'active' | 'standby';
  description: string;
  capabilities: string[];
  systemGuidance: string;
  activeWorkflowsCount: number;
}

export interface MarketingAsset {
  id: string;
  businessId: string;
  title: string;
  type:
    | 'social_post'
    | 'facebook_ad'
    | 'instagram_caption'
    | 'tiktok_script'
    | 'youtube_script'
    | 'linkedin_post'
    | 'email_blast'
    | 'whatsapp_broadcast'
    | 'blog_post'
    | 'seo_article'
    | 'product_description'
    | 'ad_copy'
    | 'promotion';
  platform: 'Instagram' | 'Facebook' | 'LinkedIn' | 'TikTok' | 'WhatsApp' | 'Email' | 'Blog / Web';
  content: string;
  targetAudience?: string;
  status: 'draft' | 'scheduled' | 'published';
  createdAt: string;
}

export interface BusinessPlan {
  id: string;
  businessId: string;
  title: string;
  type:
    | '90_day_growth'
    | 'marketing_plan'
    | 'sales_strategy'
    | 'swot_analysis'
    | 'competitor_intel'
    | 'pricing_matrix'
    | 'launch_plan';
  executiveSummary: string;
  sections: { title: string; content: string; keyActions?: string[] }[];
  createdAt: string;
}

export interface GeneratedWebsite {
  id: string;
  businessId: string;
  title: string;
  slug: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  sections: { heading: string; body: string; highlights: string[] }[];
  pricingTiers?: { name: string; price: string; features: string[] }[];
  faqs?: { q: string; a: string }[];
  published: boolean;
  createdAt: string;
}

export interface DocumentRecord {
  id: string;
  businessId: string;
  type: 'invoice' | 'receipt' | 'quote' | 'proposal' | 'purchase_order';
  docNumber: string;
  clientName: string;
  clientEmail: string;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'accepted';
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
  notes?: string;
  dueDate?: string;
  createdAt: string;
}

export interface ReputationItem {
  id: string;
  businessId: string;
  customerName: string;
  channel: 'website' | 'whatsapp' | 'email' | 'google';
  rating: number; // 1 to 5
  feedback: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  status: 'pending' | 'ai_responded' | 'escalated';
  aiSuggestedReply?: string;
  createdAt: string;
}

export interface BrandKit {
  businessId: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  fontHeading: string;
  fontBody: string;
  brandVoice: string;
  tagline: string;
  missionStatement: string;
}

export interface WebsiteCmsContent {
  heroHeadline: string;
  heroSubheadline: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  announcementText: string;
  announcementActive: boolean;
  features: { id: string; title: string; description: string; badge?: string }[];
  testimonials: { name: string; role: string; company: string; quote: string; avatar: string }[];
  faqs: { question: string; answer: string }[];
  pricingHeadline: string;
  pricingSubheadline: string;
  footerTagline: string;
}

export interface SupportTicket {
  id: string;
  businessId: string;
  businessName: string;
  userEmail: string;
  category: 'technical' | 'billing' | 'account' | 'integration' | 'feature_request';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  replies: { sender: string; isStaff: boolean; message: string; timestamp: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  category: 'ai_engine' | 'webhook' | 'automation' | 'payment' | 'integration';
  message: string;
  details?: Record<string, any>;
}

export interface FeatureFlags {
  whatsappCloud: boolean;
  voiceReceptionist: boolean;
  marketingStudio: boolean;
  creativeStudio: boolean;
  businessStrategist: boolean;
  websiteBuilder: boolean;
  documentGenerator: boolean;
  reputationManagement: boolean;
}

export interface GeminiApiKeyEntry {
  id: string;
  label: string;
  key: string;
  maskedKey?: string;
  isActive: boolean;
  status: 'active' | 'cooldown' | 'error' | 'disabled';
  createdAt: string;
  lastUsed?: string;
  callCount?: number;
  errorCount?: number;
  lastError?: string;
}

export interface LlmGlobalConfig {
  defaultChatModel: string;
  writingStrategyModel: string;
  activeModelFamily: 'flash' | 'pro' | 'custom';
  temperature: number;
  maxOutputTokens: number;
  topP: number;
  safetyThreshold: 'strict' | 'standard' | 'relaxed';
  globalSystemPromptTemplate: string;
  personaPrompts: {
    receptionist: string;
    salesCloser: string;
    supportSpecialist: string;
    marketingCopywriter: string;
    businessStrategist: string;
    bookingCoordinator: string;
    operationsCourier: string;
    [key: string]: string;
  };
  apiKeys: GeminiApiKeyEntry[];
  multiKeyRotation: boolean;
  autoRetryOn503: boolean;
  features: {
    autonomousQuoting: boolean;
    leadScoringEngine: boolean;
    sentimentAnalysis: boolean;
    autoTranslate: boolean;
    creativeStudioPolish: boolean;
    auditLogRetention: boolean;
  };
  tokenUsageTelemetry: {
    totalPromptTokens: number;
    totalResponseTokens: number;
    totalCalls: number;
    averageLatencyMs: number;
    estimatedCostUsd: number;
    lastResetAt?: string;
    activeKeyCount?: number;
    activeModel?: string;
  };
}

export interface SystemActivity {
  id: string;
  timestamp: string;
  type:
    | 'visitor_registered'
    | 'user_login'
    | 'chat_message'
    | 'lead_captured'
    | 'order_created'
    | 'booking_made'
    | 'gemini_called'
    | 'business_status_changed';
  businessId: string;
  businessName: string;
  description: string;
  actor: string;
  metadata?: Record<string, any>;
}

