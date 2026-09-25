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
  WidgetSettings,
  WhatsAppConfig,
  TeamMember,
  IntegrationStatus,
  AiTeamMember,
  MarketingAsset,
  BusinessPlan,
  GeneratedWebsite,
  DocumentRecord,
  ReputationItem,
  BrandKit,
  WebsiteCmsContent,
  SupportTicket,
  SystemLog,
  FeatureFlags,
  BillingPlan,
  LlmGlobalConfig,
  SystemActivity,
  AdminPaymentGateways,
  VoiceCall,
  VisitorProfile,
  VisitorEvent,
  WebsiteAiConfig,
  ProactiveRule,
} from '../src/types.ts';

// In-Memory Multi-Tenant Store with Seeded Data for "Aura Atelier"
export class TenantDatabase {
  users: User[] = [];
  businesses: Business[] = [];
  agents: Record<string, AgentSettings> = {};
  knowledge: Record<string, KnowledgeSource[]> = {};
  customers: Record<string, Customer[]> = {};
  leads: Record<string, Lead[]> = {};
  conversations: Record<string, Conversation[]> = {};
  messages: Record<string, Message[]> = {};
  products: Record<string, Product[]> = {};
  services: Record<string, Service[]> = {};
  orders: Record<string, Order[]> = {};
  payments: Record<string, PaymentRequest[]> = {};
  bookings: Record<string, Booking[]> = {};
  automations: Record<string, Automation[]> = {};
  campaigns: Record<string, Campaign[]> = {};
  widgets: Record<string, WidgetSettings> = {};
  whatsappConfigs: Record<string, WhatsAppConfig> = {};
  teamMembers: Record<string, TeamMember[]> = {};
  integrations: Record<string, IntegrationStatus[]> = {};
  marketingAssets: Record<string, MarketingAsset[]> = {};
  businessPlans: Record<string, BusinessPlan[]> = {};
  generatedWebsites: Record<string, GeneratedWebsite[]> = {};
  documents: Record<string, DocumentRecord[]> = {};
  reputations: Record<string, ReputationItem[]> = {};
  brandKits: Record<string, BrandKit> = {};
  aiTeams: Record<string, AiTeamMember[]> = {};
  voiceCalls: Record<string, VoiceCall[]> = {};
  visitors: Record<string, VisitorProfile[]> = {};
  visitorEvents: Record<string, VisitorEvent[]> = {};
  websiteAiConfigs: Record<string, WebsiteAiConfig> = {};
  supportTickets: SupportTicket[] = [];
  systemLogs: SystemLog[] = [];
  systemActivities: SystemActivity[] = [];
  llmConfig!: LlmGlobalConfig;
  featureFlags!: FeatureFlags;
  adminPlans: BillingPlan[] = [];
  cmsContent!: WebsiteCmsContent;
  paymentGateways!: AdminPaymentGateways;

  constructor() {
    this.seedDefaultData();
  }

  seedDefaultData() {
    // Default Flagship Demo Business
    const bId = 'biz_aura_001';

    const defaultBiz: Business = {
      id: bId,
      name: 'Aura Atelier & Bespoke Tailoring',
      slug: 'aura-atelier',
      industry: 'e-commerce',
      website: 'https://auraatelier.luxury',
      description: 'Handcrafted luxury apparel, bespoke couture suits, and private styling appointments.',
      brandColor: '#4f46e5',
      currency: 'USD',
      language: 'en',
      timezone: 'America/New_York',
      businessHours: 'Mon - Sat: 9:00 AM - 7:00 PM EST',
      contactEmail: 'concierge@auraatelier.luxury',
      contactPhone: '+1 (555) 839-2041',
      location: '450 Madison Avenue, New York, NY 10022',
      createdAt: '2026-01-15T10:00:00Z',
    };

    this.businesses.push(defaultBiz);

    const defaultUser: User = {
      id: 'usr_sarah_01',
      name: 'Sarah Montgomery',
      email: 'theinnermirroryt@gmail.com',
      role: 'owner',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      businessId: bId,
    };
    this.users.push(defaultUser);

    this.teamMembers[bId] = [
      {
        id: 'usr_sarah_01',
        businessId: bId,
        name: 'Sarah Montgomery',
        email: 'theinnermirroryt@gmail.com',
        role: 'owner',
        status: 'active',
        lastActive: 'Just now',
      },
      {
        id: 'usr_marcus_02',
        businessId: bId,
        name: 'Marcus Vance',
        email: 'marcus@auraatelier.luxury',
        role: 'sales',
        status: 'active',
        lastActive: '2 hours ago',
      },
      {
        id: 'usr_elena_03',
        businessId: bId,
        name: 'Elena Rostova',
        email: 'elena@auraatelier.luxury',
        role: 'support',
        status: 'active',
        lastActive: 'Yesterday',
      },
    ];

    this.agents[bId] = {
      id: 'agt_aura_001',
      businessId: bId,
      name: 'Aura Concierge',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      tone: 'premium',
      personality: 'Sophisticated, attentive, proactive, and exceptionally polite luxury retail concierge.',
      language: 'en',
      responseLength: 'balanced',
      objectives: [
        'Generate more sales',
        'Book private styling appointments',
        'Capture qualified high-intent leads',
        'Answer customer questions instantly',
      ],
      allowedActions: [
        'searchProducts',
        'getProductDetails',
        'createLead',
        'createOrder',
        'createBooking',
        'getAvailability',
        'checkPayment',
        'scheduleFollowUp',
      ],
      escalationRules: [
        'Customer explicitly requests human agent',
        'Bespoke order value exceeds $5,000',
        'Negative sentiment detected twice',
      ],
      workingHours: '24/7 AI coverage',
      fallbackBehavior: 'Apologize gracefully, capture phone/email, and notify staff immediately.',
      status: 'active',
      qualificationQuestions: [
        { id: 'q1', question: 'What specific occasion or style are you shopping for?', field: 'occasion', weight: 30 },
        { id: 'q2', question: 'What is your approximate budget for this piece?', field: 'budget', weight: 40 },
        { id: 'q3', question: 'When do you need this delivered or fitted by?', field: 'timeline', weight: 30 },
      ],
    };

    this.knowledge[bId] = [
      {
        id: 'kb_01',
        businessId: bId,
        title: 'Bespoke Atelier Policy & Sizing Guide',
        type: 'policy',
        sourceUri: 'https://auraatelier.luxury/policies',
        content: `Aura Atelier specializes in hand-stitched Italian wool and silk suits, evening gowns, and cashmere coats.
Custom fittings require a $150 deposit which is credited toward any purchase.
Production time for bespoke suits is 2-3 weeks with 2 fittings included.
Ready-to-wear items ship within 24 hours. Free worldwide express shipping on orders over $500.
Returns are accepted within 30 days for unworn ready-to-wear items. Bespoke pieces include unlimited fit adjustments for 60 days.`,
        status: 'indexed',
        lastUpdated: '2026-09-20T14:30:00Z',
        tokenCount: 420,
      },
      {
        id: 'kb_02',
        businessId: bId,
        title: 'Frequently Asked Questions & Pricing',
        type: 'faq',
        content: `Q: How do private styling sessions work?
A: You can book in-person at our Madison Ave flagship or virtually via HD Video. Sessions include curated styling boards and fabric samples.

Q: Can I pay with credit card or installments?
A: We accept all major cards, Apple Pay, Wire, and Stripe installments.

Q: Do you offer corporate styling packages?
A: Yes, for executive teams of 5 or more with complimentary champagne fitting receptions.`,
        status: 'indexed',
        lastUpdated: '2026-09-21T09:15:00Z',
        tokenCount: 310,
      },
      {
        id: 'kb_03',
        businessId: bId,
        title: 'Fabric Mill Partners & Sustainability Standard',
        type: 'manual',
        content: `All wool is sourced from Loro Piana and Vitale Barberis Canonico in Biella, Italy. Silk is 100% mulberry silk from Como. We maintain zero-plastic packaging and carbon-neutral freight logistics.`,
        status: 'indexed',
        lastUpdated: '2026-09-22T11:00:00Z',
        tokenCount: 190,
      },
    ];

    this.products[bId] = [
      {
        id: 'prod_001',
        businessId: bId,
        name: 'Milano Silk-Blend Dinner Jacket',
        description: 'Single-breasted midnight navy evening jacket with peak silk satin lapels and Mother-of-Pearl buttons.',
        price: 1450,
        salePrice: 1250,
        sku: 'AURA-JKT-001',
        inventory: 14,
        category: 'Suits & Blazers',
        variants: [{ name: 'Size', options: ['38R', '40R', '42R', '44R'] }],
        images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80'],
        status: 'active',
      },
      {
        id: 'prod_002',
        businessId: bId,
        name: 'Monaco Pure Cashmere Overcoat',
        description: 'Double-faced Mongolian cashmere tailored coat in camel beige. Warmth with whisper-light drape.',
        price: 2200,
        sku: 'AURA-CT-002',
        inventory: 8,
        category: 'Outerwear',
        variants: [{ name: 'Size', options: ['S', 'M', 'L', 'XL'] }],
        images: ['https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=600&q=80'],
        status: 'active',
      },
      {
        id: 'prod_003',
        businessId: bId,
        name: 'Siena Flannel Trousers',
        description: 'High-waisted double-pleated flannel trousers with side adjusters and hand-finished hems.',
        price: 480,
        sku: 'AURA-TRS-003',
        inventory: 25,
        category: 'Trousers',
        variants: [{ name: 'Waist', options: ['30', '32', '34', '36'] }],
        images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80'],
        status: 'active',
      },
      {
        id: 'prod_004',
        businessId: bId,
        name: 'Atelier Silk Twill Pocket Square',
        description: 'Hand-rolled edges with archival Venetian architecture print.',
        price: 110,
        sku: 'AURA-ACC-004',
        inventory: 60,
        category: 'Accessories',
        images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80'],
        status: 'active',
      },
    ];

    this.services[bId] = [
      {
        id: 'srv_001',
        businessId: bId,
        name: 'Private Bespoke Suiting Consultation & 3D Fitting',
        description: '60-minute private VIP session with our Master Tailor including 30 fabric swatches and silhouette drafting.',
        durationMinutes: 60,
        price: 150,
        depositRequired: 50,
        staff: ['Marcus Vance', 'Sarah Montgomery'],
        workingHours: '10:00 AM - 6:00 PM',
        available: true,
      },
      {
        id: 'srv_002',
        businessId: bId,
        name: 'Virtual Wardrobe Curation Session',
        description: 'Comprehensive 45-minute video call review of your seasonal wardrobe with personalized shopping lookbook.',
        durationMinutes: 45,
        price: 95,
        depositRequired: 0,
        staff: ['Elena Rostova'],
        workingHours: '11:00 AM - 7:00 PM',
        available: true,
      },
    ];

    this.customers[bId] = [
      {
        id: 'cust_001',
        businessId: bId,
        name: 'Alexander Wright',
        email: 'alex.wright@vanguard-cap.com',
        phone: '+1 (917) 555-0192',
        company: 'Vanguard Capital',
        address: '885 2nd Ave, New York, NY',
        tags: ['VIP', 'C-Suite', 'Repeat Buyer'],
        notes: ['Prefers midnight navy and double-breasted cuts.', 'Allergic to synthetic linings.'],
        status: 'vip',
        totalSpent: 4850,
        ordersCount: 2,
        bookingsCount: 2,
        createdAt: '2026-02-01T10:00:00Z',
        lastInteraction: '2026-09-22T16:20:00Z',
      },
      {
        id: 'cust_002',
        businessId: bId,
        name: 'Claire Chen',
        email: 'claire.chen@nexusmedia.io',
        phone: '+1 (415) 555-3829',
        company: 'Nexus Media',
        address: '420 Montgomery St, San Francisco, CA',
        tags: ['Lead', 'Gala Styling'],
        notes: ['Inquired about the Monaco Cashmere Overcoat and custom evening blazer.'],
        status: 'prospect',
        totalSpent: 0,
        ordersCount: 0,
        bookingsCount: 1,
        createdAt: '2026-09-18T14:10:00Z',
        lastInteraction: '2026-09-23T03:45:00Z',
      },
    ];

    this.leads[bId] = [
      {
        id: 'lead_001',
        businessId: bId,
        customerId: 'cust_002',
        name: 'Claire Chen',
        email: 'claire.chen@nexusmedia.io',
        phone: '+1 (415) 555-3829',
        company: 'Nexus Media',
        source: 'website_chat',
        interest: 'Gala Dinner Suit & Monaco Cashmere Overcoat',
        value: 3650,
        status: 'qualified',
        score: 'high',
        scoreValue: 88,
        assignedStaff: 'Marcus Vance',
        notes: 'AI qualified budget ($3k-$5k) and confirmed timeline of Oct 15 for Annual Tech Gala.',
        tags: ['High Value', 'Gala 2026', 'AI Captured'],
        qualificationAnswers: {
          occasion: 'Annual Tech Gala & Keynote',
          budget: '$3,500 - $5,000',
          timeline: 'October 15, 2026',
        },
        createdAt: '2026-09-22T19:30:00Z',
        lastInteraction: '2026-09-23T02:15:00Z',
      },
      {
        id: 'lead_002',
        businessId: bId,
        name: 'David Sterling',
        email: 'dsterling@sterlinglegal.com',
        phone: '+1 (212) 555-9014',
        company: 'Sterling & Partners LLP',
        source: 'whatsapp',
        interest: 'Corporate bespoke package for 6 partners',
        value: 9500,
        status: 'proposal',
        score: 'high',
        scoreValue: 95,
        assignedStaff: 'Sarah Montgomery',
        notes: 'Requested partner fitting reception with wine pairing.',
        tags: ['Corporate', 'Bulk Order', 'WhatsApp'],
        createdAt: '2026-09-20T11:00:00Z',
        lastInteraction: '2026-09-22T15:00:00Z',
      },
    ];

    this.conversations[bId] = [
      {
        id: 'conv_001',
        businessId: bId,
        channel: 'website_chat',
        customerId: 'cust_002',
        customerName: 'Claire Chen',
        customerContact: 'claire.chen@nexusmedia.io',
        status: 'ai_handling',
        messagesCount: 6,
        lastMessage: 'I have reserved your private styling consultation for Thursday, Sep 25 at 3:00 PM.',
        lastMessageAt: '2026-09-23T03:45:00Z',
        unread: false,
        tags: ['Lead Qualified', 'Booking Created'],
        sentiment: 'positive',
      },
      {
        id: 'conv_002',
        businessId: bId,
        channel: 'whatsapp',
        customerName: 'David Sterling',
        customerContact: '+1 (212) 555-9014',
        status: 'human_escalated',
        messagesCount: 8,
        lastMessage: 'Sarah has been notified and will call you with our executive proposal.',
        lastMessageAt: '2026-09-22T15:00:00Z',
        unread: true,
        assignedTo: 'Sarah Montgomery',
        tags: ['VIP Escalation', 'Corporate'],
        sentiment: 'positive',
      },
    ];

    this.messages['conv_001'] = [
      {
        id: 'msg_001',
        conversationId: 'conv_001',
        businessId: bId,
        sender: 'customer',
        content: 'Hi! I have an upcoming charity gala in October and need an exquisite bespoke jacket or tailored suit.',
        timestamp: '2026-09-23T03:40:00Z',
      },
      {
        id: 'msg_002',
        conversationId: 'conv_001',
        businessId: bId,
        sender: 'agent',
        content: 'Welcome to Aura Atelier! We would be delighted to craft something unforgettable for your gala. Our Milano Silk-Blend Dinner Jacket in midnight navy is a perennial favorite for evening galas. May I know your name and estimated budget so I can present the ideal options?',
        timestamp: '2026-09-23T03:40:30Z',
      },
      {
        id: 'msg_003',
        conversationId: 'conv_001',
        businessId: bId,
        sender: 'customer',
        content: 'My name is Claire Chen. My budget is around $3,500 to $5,000.',
        timestamp: '2026-09-23T03:41:40Z',
      },
      {
        id: 'msg_004',
        conversationId: 'conv_001',
        businessId: bId,
        sender: 'agent',
        content: 'Splendid to meet you, Claire! With that budget, we can pair the Milano Silk-Blend Jacket ($1,250) with our handmade Siena Flannel Trousers, or schedule a complete Bespoke Private Suiting Consultation where our master tailor crafts a piece to your exact measurements. Would you like to book a private VIP fitting session this week?',
        timestamp: '2026-09-23T03:42:15Z',
        toolCalls: [
          {
            tool: 'createLead',
            args: { name: 'Claire Chen', interest: 'Gala Dinner Suit', value: 3650 },
            result: { leadId: 'lead_001', status: 'qualified', score: 88 },
          },
        ],
      },
      {
        id: 'msg_005',
        conversationId: 'conv_001',
        businessId: bId,
        sender: 'customer',
        content: 'Yes please! Thursday at 3 PM would be perfect.',
        timestamp: '2026-09-23T03:43:50Z',
      },
      {
        id: 'msg_006',
        conversationId: 'conv_001',
        businessId: bId,
        sender: 'agent',
        content: 'I have reserved your private styling consultation for Thursday, Sep 25 at 3:00 PM with Master Tailor Marcus Vance at our Madison Avenue flagship. A confirmation has been prepared, and we look forward to welcoming you!',
        timestamp: '2026-09-23T03:45:00Z',
        toolCalls: [
          {
            tool: 'createBooking',
            args: { serviceId: 'srv_001', date: '2026-09-25', time: '15:00' },
            result: { bookingId: 'bk_001', status: 'confirmed' },
          },
        ],
      },
    ];

    this.orders[bId] = [
      {
        id: 'ORD-98214',
        businessId: bId,
        customerId: 'cust_001',
        customerName: 'Alexander Wright',
        customerEmail: 'alex.wright@vanguard-cap.com',
        customerPhone: '+1 (917) 555-0192',
        items: [
          { productId: 'prod_001', name: 'Milano Silk-Blend Dinner Jacket (42R)', price: 1250, quantity: 1, variant: '42R' },
          { productId: 'prod_003', name: 'Siena Flannel Trousers (34)', price: 480, quantity: 2, variant: '34' },
        ],
        subtotal: 2210,
        shipping: 0,
        tax: 198.9,
        discount: 0,
        total: 2408.9,
        currency: 'USD',
        paymentStatus: 'paid',
        fulfillmentStatus: 'processing',
        shippingAddress: '885 2nd Avenue, Penthouse B, New York, NY 10017',
        trackingNumber: 'AURA-FEDEX-94821',
        carrier: 'FedEx Priority',
        createdAt: '2026-09-21T14:20:00Z',
      },
    ];

    this.payments[bId] = [
      {
        id: 'pay_001',
        businessId: bId,
        orderId: 'ORD-98214',
        customerId: 'cust_001',
        customerName: 'Alexander Wright',
        amount: 2408.9,
        currency: 'USD',
        provider: 'lemonsqueezy',
        status: 'completed',
        paymentUrl: 'https://auraatelier.lemonsqueezy.com/buy/order_98214',
        transactionRef: 'lsq_ord_98124021',
        description: 'Milano Dinner Jacket & 2x Siena Flannel Trousers (Lemon Squeezy Verified)',
        createdAt: '2026-09-21T14:25:00Z',
      },
      {
        id: 'pay_002',
        businessId: bId,
        orderId: 'ORD-8941',
        customerId: 'cust_001',
        customerName: 'Alexander Wright',
        amount: 2850.0,
        currency: 'USD',
        provider: 'crypto',
        status: 'completed',
        paymentUrl: 'https://nowpayments.io/payment/?iid=np_8492019482',
        transactionRef: '0x8f2a938...b49e (USDC on Ethereum)',
        description: 'Monaco Pure Cashmere Overcoat (USDC Instant Settlement)',
        createdAt: '2026-09-22T11:15:00Z',
      },
    ];

    this.bookings[bId] = [
      {
        id: 'bk_001',
        businessId: bId,
        serviceId: 'srv_001',
        serviceName: 'Private Bespoke Suiting Consultation & 3D Fitting',
        customerId: 'cust_002',
        customerName: 'Claire Chen',
        customerEmail: 'claire.chen@nexusmedia.io',
        customerPhone: '+1 (415) 555-3829',
        staffName: 'Marcus Vance',
        date: '2026-09-25',
        time: '15:00',
        durationMinutes: 60,
        price: 150,
        status: 'confirmed',
        notes: 'Preparing evening gala swatches and velvet collar samples.',
        remindersSent: 1,
        createdAt: '2026-09-23T03:45:00Z',
      },
    ];

    this.automations[bId] = [
      {
        id: 'auto_001',
        businessId: bId,
        name: 'New Lead Instant VIP Follow-Up',
        description: 'WHEN a high-score lead is created, send personalized WhatsApp welcome, WAIT 24h, IF no booking THEN alert lead manager Marcus.',
        trigger: 'lead_created',
        conditions: [{ field: 'score', operator: 'equals', value: 'high' }],
        waitHours: 24,
        actions: [
          { type: 'send_whatsapp', params: { template: 'vip_welcome_greeting' } },
          { type: 'notify_staff', params: { channel: 'sms', recipient: 'Marcus Vance' } },
        ],
        status: 'active',
        runsCount: 38,
        lastRunAt: '2026-09-23T03:46:00Z',
      },
      {
        id: 'auto_002',
        businessId: bId,
        name: 'Abandoned Cart Recovery Concierge',
        description: 'WHEN an order remains unpaid for 2 hours, trigger AI concierge message with a direct 1-click checkout link and styling assistance.',
        trigger: 'order_abandoned',
        conditions: [{ field: 'paymentStatus', operator: 'equals', value: 'pending' }],
        waitHours: 2,
        actions: [
          { type: 'send_email', params: { template: 'concierge_cart_recovery' } },
          { type: 'update_lead_score', params: { delta: 15 } },
        ],
        status: 'active',
        runsCount: 19,
        lastRunAt: '2026-09-22T18:10:00Z',
      },
      {
        id: 'auto_003',
        businessId: bId,
        name: 'Post-Purchase Atelier Care & Review',
        description: 'WHEN order is marked fulfilled, WAIT 7 days, THEN send garment care guide and invitation to private seasonal trunk show.',
        trigger: 'order_paid',
        conditions: [{ field: 'total', operator: 'greater_than', value: 1000 }],
        waitHours: 168,
        actions: [
          { type: 'send_email', params: { template: 'atelier_care_guide' } },
          { type: 'create_crm_task', params: { task: 'Follow up on fit satisfaction' } },
        ],
        status: 'active',
        runsCount: 44,
        lastRunAt: '2026-09-21T15:00:00Z',
      },
    ];

    this.campaigns[bId] = [
      {
        id: 'camp_001',
        businessId: bId,
        name: 'Autumn/Winter Private Trunk Show Preview',
        channel: 'whatsapp',
        audienceSegment: 'high_value_vip',
        messageTemplate: 'Dear {{customer_name}}, Sarah Montgomery invites you to preview our Autumn/Winter 2026 cashmere and silk collection before public release.',
        status: 'sent',
        sentCount: 142,
        clickCount: 98,
        conversionCount: 22,
        revenueGenerated: 38400,
        createdAt: '2026-09-15T09:00:00Z',
      },
    ];

    this.widgets[bId] = {
      businessId: bId,
      brandColor: '#4f46e5',
      businessName: 'Aura Atelier Concierge',
      greetingTitle: 'Welcome to Aura Atelier',
      welcomeMessage: 'Good day! I am your AI Bespoke Concierge. How may I assist your style journey today?',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      position: 'bottom-right',
      launcherStyle: 'pill',
      placeholderText: 'Ask about sizing, tailoring, or book a fitting...',
      quickPrompts: [
        'Explore bespoke evening jackets',
        'Book private fitting session',
        'Check custom order status',
        'Speak with Master Tailor',
      ],
    };

    this.whatsappConfigs[bId] = {
      businessId: bId,
      connected: true,
      phoneNumberId: '108492019482103',
      wabaId: 'waba_992140284',
      accessTokenMasked: 'EAAG9...k49Q',
      webhookVerified: true,
      businessPhone: '+1 (555) 839-2041',
      templateSyncStatus: 'synced',
      autoReplyEnabled: true,
    };

    this.integrations[bId] = [
      {
        id: 'int_wa',
        name: 'WhatsApp Business Cloud API',
        category: 'channel',
        connected: true,
        description: 'Official Meta Cloud API for two-way customer messaging and template campaigns.',
        config: { phoneNumber: '+1 (555) 839-2041', verified: true },
      },
      {
        id: 'int_lemonsqueezy',
        name: 'Lemon Squeezy Digital Checkout',
        category: 'payment',
        connected: true,
        description: 'Global SaaS merchant of record, credit cards, Apple Pay, PayPal, and automatic global sales tax handling.',
        config: { storeId: 'store_aura_luxury', mode: 'live_ready', merchantOfRecord: true },
      },
      {
        id: 'int_crypto',
        name: 'Cryptocurrency Multi-Chain Gateway',
        category: 'payment',
        connected: true,
        description: 'Instant on-chain and L2 settlement for Bitcoin (BTC), Ethereum (ETH), Solana (SOL), and Stablecoins (USDT & USDC).',
        config: { provider: 'nowpayments', supported: ['USDT', 'USDC', 'BTC', 'ETH', 'SOL'], zeroChargebacks: true },
      },
      {
        id: 'int_stripe',
        name: 'Stripe Unified Payments',
        category: 'payment',
        connected: false,
        description: 'Credit cards, Apple Pay, SEPA, and Klarna buy-now-pay-later with automated webhook settlement.',
        config: { account: 'acct_aura_luxury', mode: 'standby' },
      },
      {
        id: 'int_voice',
        name: 'AI Voice Receptionist (Twilio SIP)',
        category: 'voice',
        connected: true,
        description: 'Inbound telephony with real-time speech transcription and natural business conversation.',
        config: { number: '+1 (555) 839-2041', provider: 'Twilio' },
      },
      {
        id: 'int_shopify',
        name: 'Shopify Storefront Sync',
        category: 'ecommerce',
        connected: false,
        description: 'Two-way real-time catalog and inventory synchronization.',
        config: {},
      },
    ];

    // Seed Global Admin Feature Flags & SaaS Plans
    this.paymentGateways = {
      activeDefaultProvider: 'lemonsqueezy',
      lemonSqueezy: {
        enabled: true,
        storeId: 'lmsq_store_84920',
        apiKeyMasked: 'lsq_live_9482••••••••9384',
        apiKey: 'lsq_live_sample_key_94829384',
        webhookSecretMasked: 'whsec_••••••••4829',
        webhookSecret: 'whsec_lemon_live_4829',
        testMode: false,
        connectedAt: '2026-09-20T10:00:00Z',
      },
      crypto: {
        enabled: true,
        provider: 'nowpayments',
        apiKeyMasked: 'np_live_••••••••3821',
        apiKey: 'np_live_crypto_token_3821',
        webhookSecretMasked: 'ipn_secret_••••••••9102',
        webhookSecret: 'ipn_secret_9102',
        acceptedCurrencies: ['USDT', 'USDC', 'BTC', 'ETH', 'SOL'],
        walletAddress: '0x71C...84F2 / bc1q...9482',
        network: 'Ethereum (ERC-20), Solana, Bitcoin Mainnet, Polygon',
        testMode: false,
        connectedAt: '2026-09-21T14:30:00Z',
      },
      stripe: {
        enabled: false,
        publishableKeyMasked: 'pk_live_••••••••8492',
        secretKeyMasked: 'sk_live_••••••••1093',
        webhookSecretMasked: 'whsec_••••••••7721',
        testMode: true,
        connectedAt: undefined,
      },
    };

    this.featureFlags = {
      whatsappCloud: true,
      voiceReceptionist: true,
      marketingStudio: true,
      creativeStudio: true,
      businessStrategist: true,
      websiteBuilder: true,
      documentGenerator: true,
      reputationManagement: true,
    };

    this.adminPlans = [
      {
        id: 'starter',
        name: 'Starter AI',
        priceMonthly: 49,
        features: [
          'Website AI Chat Widget',
          'Lead Capture & Auto-Qualification',
          'Catalog & Service Menu (Up to 25 items)',
          '5,000 AI Messages / Month',
          'Email Transcripts & Alerts',
          'Standard Automation Recipes',
        ],
        limits: {
          aiMessages: 5000,
          teamMembers: 2,
          knowledgeDocs: 10,
          automations: 5,
          whatsappActive: false,
        },
      },
      {
        id: 'growth',
        name: 'Growth Digital Team',
        priceMonthly: 149,
        features: [
          'Everything in Starter',
          'Official WhatsApp Business Cloud API',
          'Omnichannel Unified Inbox (Web + WhatsApp)',
          'AI Marketing Studio & Social Post Generator',
          'Visual Automation Builder (Unlimited)',
          'Appointment Booking & Instant Payments',
          '25,000 AI Messages / Month',
          'Priority Human Escalations',
        ],
        limits: {
          aiMessages: 25000,
          teamMembers: 5,
          knowledgeDocs: 50,
          automations: 20,
          whatsappActive: true,
        },
      },
      {
        id: 'business',
        name: 'Autonomous Business OS',
        priceMonthly: 349,
        features: [
          'Complete 8-Persona AI Business Team',
          'AI Phone Receptionist & Voice SIP Engine',
          'Autonomous Sales & Quoting Agent',
          'AI Business Strategist & 90-Day Growth Plans',
          'Document & Invoice Generator',
          'Creative Studio & Brand Kit Engine',
          '75,000 AI Messages / Month',
          'Dedicated Customer Success Rep',
        ],
        limits: {
          aiMessages: 75000,
          teamMembers: 15,
          knowledgeDocs: 200,
          automations: 100,
          whatsappActive: true,
        },
      },
      {
        id: 'enterprise',
        name: 'Global Enterprise Concierge',
        priceMonthly: 899,
        features: [
          'Multi-Workspace & Franchise Rollouts',
          'Unlimited AI Messages & Telephony Minutes',
          'Custom LLM Fine-Tuning & Knowledge Graph',
          'Custom Webhook & ERP Connectors (SAP, Salesforce)',
          '99.99% Guaranteed SLA & 24/7 Dedicated Ops',
          'SOC2 / HIPAA / GDPR Enterprise Compliance Pack',
        ],
        limits: {
          aiMessages: 999999,
          teamMembers: 999,
          knowledgeDocs: 1000,
          automations: 999,
          whatsappActive: true,
        },
      },
    ];

    this.cmsContent = {
      heroHeadline: 'Your AI Business Team, Working 24/7',
      heroSubheadline:
        'Capture leads, answer customers, close sales, book appointments and automate follow-ups from one intelligent platform.',
      primaryCtaText: 'Start Free',
      secondaryCtaText: 'See How It Works',
      announcementActive: true,
      announcementText: '🚀 OperateAI 3.0 Launched: Official WhatsApp Cloud & AI Voice Receptionist now live!',
      features: [
        {
          id: 'ft_1',
          title: '24/7 Omnichannel Capture',
          description: 'Deploy on your website, WhatsApp Cloud, and inbound telephone lines with zero lag.',
          badge: 'Capture',
        },
        {
          id: 'ft_2',
          title: 'Autonomous Sales & Checkout',
          description: 'Qualify buyer intent, recommend catalog items, and issue instant payment links with server verification.',
          badge: 'Revenue',
        },
        {
          id: 'ft_3',
          title: 'White-Glove Bookings',
          description: 'Coordinate appointments, service durations, staff schedules, and upfront deposits autonomously.',
          badge: 'Operations',
        },
        {
          id: 'ft_4',
          title: 'Intelligent Follow-Up Workflows',
          description: 'Nudge abandoned visitors, send post-delivery reviews, and re-engage inactive VIPs on WhatsApp.',
          badge: 'Retention',
        },
      ],
      testimonials: [
        {
          name: 'Sarah Montgomery',
          role: 'Founder & Creative Director',
          company: 'Aura Atelier New York',
          quote:
            'OperateAI handles 91% of our incoming client inquiries, books our private couture fittings, and generates over $24,000/month in autonomous sales without our staff lifting a finger.',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        },
        {
          name: 'David Vance',
          role: 'Managing Partner',
          company: 'Vance Capital Advisory',
          quote:
            'The AI voice receptionist alone replaced an entire call center for our high-touch advisory leads. It qualifies client net worth and synchronizes into our CRM effortlessly.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        },
      ],
      faqs: [
        {
          question: 'How fast can OperateAI be deployed to my existing website?',
          answer:
            'In under 3 minutes. Simply copy the 1-line script tag into your HTML or CMS (WordPress, Shopify, Wix, Webflow), and your trained AI employee goes live immediately.',
        },
        {
          question: 'Does OperateAI work on official WhatsApp numbers?',
          answer:
            'Yes. OperateAI uses official Meta WhatsApp Business Cloud API webhooks with zero risk of phone number bans, supporting high-throughput template notifications and conversational AI.',
        },
        {
          question: 'Can the AI take real credit card and mobile payments?',
          answer:
            'Yes. You can connect Stripe, Paystack, or custom payment gateways. The AI issues direct checkout links and updates inventory only upon cryptographically verified webhooks.',
        },
        {
          question: 'What happens when a customer requests a human staff member?',
          answer:
            'The AI immediately pauses, flags the conversation in your Unified Inbox with an alert, and passes the entire customer dossier and summary to your human staff.',
        },
      ],
      pricingHeadline: 'Simple, Transparent Investment for High ROI',
      pricingSubheadline: 'Replace 4 fragmented software subscriptions with one unified AI business operating system.',
      footerTagline: 'OperateAI — The AI Business Operating System for Forward-Thinking Enterprises.',
    };

    this.supportTickets = [
      {
        id: 'tkt_101',
        businessId: bId,
        businessName: 'Aura Atelier & Bespoke Tailoring',
        userEmail: 'theinnermirroryt@gmail.com',
        category: 'integration',
        subject: 'Custom WhatsApp Cloud phone number migration',
        description: 'We would like to port our existing toll-free business line onto the Meta Cloud API.',
        priority: 'high',
        status: 'open',
        replies: [
          {
            sender: 'Sarah Montgomery',
            isStaff: false,
            message: 'Hello, our team wants to confirm if two-factor authentication can be preserved during the WABA porting.',
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          },
          {
            sender: 'OperateAI Support Lead',
            isStaff: true,
            message: 'Hi Sarah! Absolutely. Once Meta approves the two-step verification certificate, our webhook routing will take over seamlessly without downtime.',
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
        ],
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'tkt_102',
        businessId: bId,
        businessName: 'Aura Atelier & Bespoke Tailoring',
        userEmail: 'marcus@auraatelier.luxury',
        category: 'billing',
        subject: 'Annual enterprise invoice with VAT breakdown',
        description: 'Please generate a pro-forma tax invoice for our finance department.',
        priority: 'medium',
        status: 'resolved',
        replies: [
          {
            sender: 'Marcus Vance',
            isStaff: false,
            message: 'We require an invoice addressed to Aura Atelier NY LLC with tax exemption code.',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            sender: 'Billing Desk',
            isStaff: true,
            message: 'Resolved! The updated tax invoice has been generated and attached to your Billing portal.',
            timestamp: new Date(Date.now() - 43200000).toISOString(),
          },
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 43200000).toISOString(),
      },
    ];

    this.systemLogs = [
      {
        id: 'log_01',
        timestamp: new Date().toISOString(),
        level: 'info',
        category: 'ai_engine',
        message: 'Gemini Flash 2.5 server-side tool dispatch: searchProducts executed with 0.42s latency.',
      },
      {
        id: 'log_02',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        level: 'info',
        category: 'webhook',
        message: 'Meta WhatsApp Cloud webhook verification handshake acknowledged (HTTP 200).',
      },
      {
        id: 'log_03',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        level: 'info',
        category: 'automation',
        message: 'Automated 2h abandoned cart WhatsApp nudge dispatched to client +1 (555) 789-0123.',
      },
      {
        id: 'log_04',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        level: 'info',
        category: 'payment',
        message: 'Stripe webhook payment_intent.succeeded verified cryptographically. Order #ORD-8941 marked paid.',
      },
    ];

    // Global Gemini Engine & Intelligence Config
    const defaultEnvKey = process.env.GEMINI_API_KEY || '';
    const initialKeys = defaultEnvKey
      ? [
          {
            id: 'key_primary_env',
            label: 'System Primary Key (Environment)',
            key: defaultEnvKey,
            maskedKey: `${defaultEnvKey.slice(0, 6)}...${defaultEnvKey.slice(-4)}`,
            isActive: true,
            status: 'active' as const,
            createdAt: new Date().toISOString(),
            callCount: 142,
            errorCount: 0,
          },
        ]
      : [];

    this.llmConfig = {
      defaultChatModel: 'gemini-3.8-flash',
      writingStrategyModel: 'gemini-3.8-flash',
      activeModelFamily: 'flash',
      temperature: 0.3,
      maxOutputTokens: 2048,
      topP: 0.95,
      safetyThreshold: 'strict',
      globalSystemPromptTemplate:
        'You are an autonomous AI employee for "{{business_name}}" operating in the {{industry}} industry.\n\nCore Operational Directives:\n1. Maintain absolute professionalism, helpfulness, and precision representing {{business_name}}.\n2. Adhere strictly to verified business knowledge, official product catalogs, and scheduled services. Never fabricate pricing, inventory, or delivery terms.\n3. Proactively qualify client intent, capture lead contact information, and streamline bookings and orders.\n4. Escalate gracefully when human assistance is explicitly requested.',
      personaPrompts: {
        receptionist:
          'You are Aria, Front Desk & Intake Receptionist. Warm, prompt, exceptionally polite, and expert at greeting visitors and answering general inquiries.',
        salesCloser:
          'You are Julian, Autonomous Sales Closer. Persuasive, attentive, focused on understanding client needs, presenting high-value options, and issuing instant checkout links.',
        supportSpecialist:
          'You are Kael, Resolution Specialist. Empathetic, solution-oriented, calm under pressure, and relentless about resolving customer issues.',
        marketingCopywriter:
          'You are Lyra, Campaign & Brand Marketer. Creative, high-converting copywriter crafting compelling social captions, email blasts, and ads.',
        businessStrategist:
          'You are Athena, Chief Business Strategist. Analytical, visionary, crafting data-driven 90-day roadmaps, SWOT analysis, and revenue modeling.',
        bookingCoordinator:
          'You are Soren, Appointment Coordinator. Efficient, organized, checking calendar availability and securing upfront deposits.',
        operationsCourier:
          'You are Vance, Operations & Shipping Logistics Specialist. Detail-oriented, tracking courier dispatch, shipping labels, and inventory.',
      },
      apiKeys: initialKeys,
      multiKeyRotation: true,
      autoRetryOn503: true,
      features: {
        autonomousQuoting: true,
        leadScoringEngine: true,
        sentimentAnalysis: true,
        autoTranslate: true,
        creativeStudioPolish: true,
        auditLogRetention: true,
      },
      tokenUsageTelemetry: {
        totalPromptTokens: 142850,
        totalResponseTokens: 49320,
        totalCalls: 318,
        averageLatencyMs: 384,
        estimatedCostUsd: 0.048,
        lastResetAt: new Date().toISOString(),
        activeKeyCount: initialKeys.length,
        activeModel: 'gemini-3.8-flash',
      },
    };

    // System-wide live activity stream
    this.systemActivities = [
      {
        id: 'act_01',
        timestamp: new Date().toISOString(),
        type: 'chat_message',
        businessId: bId,
        businessName: 'Aura Atelier',
        description: 'AI Concierge Aria responded to visitor inquiry regarding Bespoke Evening Tuxedo fitting.',
        actor: 'AI Agent (Aria)',
        metadata: { latencyMs: 340, model: 'gemini-3.8-flash' },
      },
      {
        id: 'act_02',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        type: 'lead_captured',
        businessId: bId,
        businessName: 'Aura Atelier',
        description: 'New VIP Lead Claire Chen ($3,650 budget) qualified and synchronized to CRM.',
        actor: 'AI Sales Agent (Julian)',
      },
      {
        id: 'act_03',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        type: 'booking_made',
        businessId: bId,
        businessName: 'Aura Atelier',
        description: 'Private fitting appointment reserved for Marcus Vance with $250 deposit.',
        actor: 'AI Booking Coordinator',
      },
      {
        id: 'act_04',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        type: 'gemini_called',
        businessId: bId,
        businessName: 'Aura Atelier',
        description: 'Gemini 3.8 Flash inference completed for 90-Day Autumn Growth Strategy.',
        actor: 'Gemini Engine',
        metadata: { tokens: 1840, latencyMs: 512 },
      },
      {
        id: 'act_05',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'order_created',
        businessId: bId,
        businessName: 'Aura Atelier',
        description: 'Order #ORD-8941 ($2,850 Cashmere Overcoat) settled via Stripe Checkout.',
        actor: 'Customer Checkout',
      },
    ];

    // Seed Aura Atelier Specific SaaS Content
    this.brandKits[bId] = {
      businessId: bId,
      logoUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=200&q=80',
      primaryColor: '#4f46e5',
      secondaryColor: '#10b981',
      fontHeading: 'Plus Jakarta Sans',
      fontBody: 'Plus Jakarta Sans',
      brandVoice: 'Sophisticated, discerning, warm, highly knowledgeable in luxury couture and bespoke craftsmanship.',
      tagline: 'Artisanal Elegance for Discerning Modern Wardrobes',
      missionStatement: 'To create timeless sartorial masterpieces that embody personal distinction, precision tailoring, and peerless Italian fabrics.',
    };

    this.marketingAssets[bId] = [
      {
        id: 'mkt_1',
        businessId: bId,
        title: 'Autumn Silk Velvet Dinner Jacket Launch',
        type: 'instagram_caption',
        platform: 'Instagram',
        content:
          'Understated drama meets Milanese precision. Introducing our Midnight Navy Silk-Velvet Dinner Jacket, hand-canvassed with mother-of-pearl closures.\n\nPrivate showroom styling appointments are now available via the concierge link in bio.\n\n#BespokeTailoring #LuxuryMenswear #AuraAtelier #MadeToMeasure',
        targetAudience: 'High Net Worth professionals & gala attendees',
        status: 'published',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'mkt_2',
        businessId: bId,
        title: 'VIP WhatsApp Private Swatch Showcase',
        type: 'whatsapp_broadcast',
        platform: 'WhatsApp',
        content:
          'Good morning {client_name}. Sarah from Aura Atelier here. We have just received an exclusive allotment of Loro Piana 150s virgin wool swatches for our winter collection. Would you like our AI concierge to reserve a private 45-minute fitting this Thursday?',
        targetAudience: 'VIP Clients ($2,000+ LTV)',
        status: 'published',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'mkt_3',
        businessId: bId,
        title: 'Facebook Ads: Bespoke Executive Wardrobe Experience',
        type: 'facebook_ad',
        platform: 'Facebook',
        content:
          'Headline: The Suit You Never Want to Take Off.\nPrimary Text: Hand-stitched in New York with 42 bespoke body measurements. Experience private styling with our master tailor. Complimentary pocket square with initial consultation.\nCTA: Book Fitting Now',
        targetAudience: 'Executives & Founders aged 30-65 in NYC / Tri-State',
        status: 'draft',
        createdAt: new Date().toISOString(),
      },
    ];

    this.businessPlans[bId] = [
      {
        id: 'bp_1',
        businessId: bId,
        title: '90-Day VIP Growth & Showroom Expansion Blueprint',
        type: '90_day_growth',
        executiveSummary:
          'A three-phase revenue acceleration initiative designed to increase average client lifetime value from $2,450 to $4,100 through omnichannel AI automated styling workflows, pre-ordered capsule collections, and corporate gifting partnerships.',
        sections: [
          {
            title: 'Phase 1: Omnichannel Lead Activation (Days 1-30)',
            content:
              'Deploy WhatsApp Cloud auto-qualification on all inbound social ads. Deflect 90% of sizing inquiries and capture high-intent buyers into automated 2-hour styling nudges.',
            keyActions: [
              'Integrate Meta Cloud webhook for instant Instagram DMs',
              'Configure VIP lead threshold ($1,500+ deal value)',
              'Run 2h abandoned fitting follow-up sequence',
            ],
          },
          {
            title: 'Phase 2: High-Margin Upsells & Accessories (Days 31-60)',
            content:
              'Automate post-purchase suit recommendations. When an order for a bespoke two-piece is confirmed, suggest matching bespoke Egyptian cotton shirts and silk ties with 1-click checkout.',
            keyActions: [
              'Launch Post-Purchase Cross-Sell automation recipe',
              'Bundle 3 bespoke shirts with every couture order',
            ],
          },
          {
            title: 'Phase 3: Executive Retention & Corporate Accounts (Days 61-90)',
            content:
              'Establish private corporate styling packages for law firms, investment banks, and executive boards with dedicated booking concierge links.',
            keyActions: [
              'Reach out to 50 Manhattan executive offices',
              'Offer on-site corporate measurement luncheons',
            ],
          },
        ],
        createdAt: new Date().toISOString(),
      },
    ];

    this.generatedWebsites[bId] = [
      {
        id: 'web_1',
        businessId: bId,
        title: 'Bespoke Wedding & Gala Tuxedo Landing Page',
        slug: 'wedding-couture',
        headline: 'Impeccable Wedding Couture Tailored to Your Legacy',
        subheadline:
          'Handcrafted tuxedos, silk-lapel dinner jackets, and bespoke accessories tailored to your exact posture and aesthetic.',
        primaryCta: 'Book Private Fitting ($100 Deposit)',
        secondaryCta: 'Explore Fabric Swatches',
        sections: [
          {
            heading: 'Artisanal Craftsmanship',
            body: 'Every garment is drafted by hand on individual paper patterns with floating canvas construction.',
            highlights: ['Pure Loro Piana & Scabal Wool', 'Hand-stitched horn buttons', 'Lifetime complimentary adjustments'],
          },
          {
            heading: 'The 4-Week Tailoring Journey',
            body: 'From initial measurement to the baste fitting and final pressing, our master tailor ensures absolute comfort.',
            highlights: ['Private Manhattan showroom', 'Complimentary champagne styling', '42 biometric measurements'],
          },
        ],
        pricingTiers: [
          { name: 'The Groom Classic', price: '$1,850', features: ['Two-piece tuxedo', 'Bespoke shirt', 'Silk bow tie'] },
          { name: 'The Black Tie Royal', price: '$2,850', features: ['Three-piece silk velvet', 'Two bespoke shirts', 'Cummerbund & cufflinks', 'Baste fitting'] },
        ],
        faqs: [
          { q: 'How long before the wedding should I book?', a: 'We recommend 6 to 8 weeks for a relaxed experience with baste fittings.' },
          { q: 'Can you accommodate the entire wedding party?', a: 'Yes, our bridal concierge coordinates group fittings with volume pricing.' },
        ],
        published: true,
        createdAt: new Date().toISOString(),
      },
    ];

    this.documents[bId] = [
      {
        id: 'doc_inv_1001',
        businessId: bId,
        type: 'invoice',
        docNumber: 'INV-2026-089',
        clientName: 'Alexander Sterling',
        clientEmail: 'alex.sterling@vanguard-holdings.com',
        currency: 'USD',
        subtotal: 3100,
        tax: 275.13,
        total: 3375.13,
        status: 'paid',
        items: [
          { description: 'Milano Silk-Blend Bespoke Dinner Jacket', quantity: 1, unitPrice: 1250, total: 1250 },
          { description: 'Handcrafted Super 150s Wool Trousers', quantity: 2, unitPrice: 550, total: 1100 },
          { description: 'Sea Island Cotton Dress Shirts (White & Ecru)', quantity: 3, unitPrice: 250, total: 750 },
        ],
        notes: 'Payment received via Stripe credit card. Ready for courier delivery to 740 Park Ave.',
        dueDate: '2026-09-30',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'doc_quo_1002',
        businessId: bId,
        type: 'quote',
        docNumber: 'QTE-2026-042',
        clientName: 'Julian Croft',
        clientEmail: 'julian@croftpartners.com',
        currency: 'USD',
        subtotal: 4200,
        tax: 372.75,
        total: 4572.75,
        status: 'sent',
        items: [
          { description: 'Executive 3-Piece Bespoke Navy Pinstripe Suit', quantity: 1, unitPrice: 2450, total: 2450 },
          { description: 'Pure Cashmere Overcoat (Camel)', quantity: 1, unitPrice: 1750, total: 1750 },
        ],
        notes: 'Includes initial baste fitting, monogramming, and hand-finished Milanese lapel buttonhole.',
        dueDate: '2026-10-15',
        createdAt: new Date().toISOString(),
      },
    ];

    this.reputations[bId] = [
      {
        id: 'rep_1',
        businessId: bId,
        customerName: 'Marcus Vance',
        channel: 'website',
        rating: 5,
        feedback: 'The AI concierge booked my appointment in 15 seconds, and the fitting in Madison Ave was top tier. Best suit I own.',
        sentiment: 'positive',
        status: 'ai_responded',
        aiSuggestedReply: 'Thank you Mr. Vance! It was our pleasure to craft your dinner jacket. Looking forward to your next fitting.',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: 'rep_2',
        businessId: bId,
        customerName: 'Elena Rostova',
        channel: 'whatsapp',
        rating: 5,
        feedback: 'Super fast answers on fabric weights and delivery timelines. Felt like speaking to a luxury concierge.',
        sentiment: 'positive',
        status: 'ai_responded',
        aiSuggestedReply: 'Thank you Elena! We are thrilled you enjoyed the concierge experience.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'rep_3',
        businessId: bId,
        customerName: 'Harrison Cole',
        channel: 'email',
        rating: 4,
        feedback: 'Great craftsmanship, though shipping took 2 days longer than expected due to FedEx delay.',
        sentiment: 'neutral',
        status: 'pending',
        aiSuggestedReply: 'Dear Harrison, thank you for your candid feedback. We apologize for the courier delay and have credited a complimentary accessory to your profile.',
        createdAt: new Date().toISOString(),
      },
    ];

    this.aiTeams[bId] = [
      {
        id: 'team_receptionist',
        role: 'receptionist',
        name: 'Aria',
        title: 'AI Front Desk Concierge',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        status: 'active',
        description: 'Greets inbound visitors, answers general inquiries, shares business hours, and routes visitors.',
        capabilities: ['Instant 24/7 greeting', 'FAQ resolution', 'Tone adaptation', 'Multi-language translation'],
        systemGuidance: 'Warm, welcoming, polite, and efficient. Represent the brand with utmost elegance.',
        activeWorkflowsCount: 4,
      },
      {
        id: 'team_sales',
        role: 'sales',
        name: 'Julian',
        title: 'Autonomous Sales & Quoting Agent',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        status: 'active',
        description: 'Discovers buyer needs, qualifies budget, recommends matching products, and issues checkout links.',
        capabilities: ['Budget qualification', 'Catalog recommendations', 'Instant payment links', 'Objection handling'],
        systemGuidance: 'Consultative, persuasive without being pushy, focused on client value and perfect fit.',
        activeWorkflowsCount: 7,
      },
      {
        id: 'team_support',
        role: 'support',
        name: 'Kael',
        title: 'Customer Resolution Specialist',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        status: 'active',
        description: 'Resolves customer questions, checks shipping status, provides care instructions, handles escalations.',
        capabilities: ['Order tracking', 'Return & policy queries', 'Empathetic de-escalation', 'Human staff handover'],
        systemGuidance: 'Empathetic, clear, and reassuring. Offer instant resolutions and escalate gracefully if needed.',
        activeWorkflowsCount: 5,
      },
      {
        id: 'team_marketing',
        role: 'marketing',
        name: 'Lyra',
        title: 'AI Content & Campaign Marketer',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        status: 'active',
        description: 'Generates high-converting social media posts, ad copy, WhatsApp broadcasts, and seasonal emails.',
        capabilities: ['Social copy generator', 'Ad headline testing', 'Broadcast scheduling', 'Hashtag & SEO optimizer'],
        systemGuidance: 'Creative, punchy, on-brand, and focused on driving clicks, inquiries, and conversions.',
        activeWorkflowsCount: 3,
      },
      {
        id: 'team_booking',
        role: 'booking',
        name: 'Soren',
        title: 'VIP Booking & Calendar Coordinator',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        status: 'active',
        description: 'Checks staff availability, suggests open slots, collects reservation deposits, and sends reminders.',
        capabilities: ['Calendar synchronization', 'Deposit collection', 'Automated SMS/Email reminders', 'Rescheduling'],
        systemGuidance: 'Organized, precise, respectful of client time, ensuring seamless calendar bookings.',
        activeWorkflowsCount: 4,
      },
      {
        id: 'team_operations',
        role: 'operations',
        name: 'Vance',
        title: 'Operations & Fulfillment Supervisor',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        status: 'active',
        description: 'Monitors inventory levels, generates 4x6 courier shipping labels, and alerts staff on bottlenecks.',
        capabilities: ['Stock threshold alerts', 'Shipping label creation', 'Courier barcode tracking', 'Supplier updates'],
        systemGuidance: 'Rigorous, detail-oriented, and focused on 100% operational fulfillment accuracy.',
        activeWorkflowsCount: 6,
      },
      {
        id: 'team_strategist',
        role: 'strategist',
        name: 'Athena',
        title: 'Chief Growth & Revenue Strategist',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        status: 'active',
        description: 'Formulates 90-day growth blueprints, competitor analyses, SWOT assessments, and margin strategies.',
        capabilities: ['90-day plan generation', 'SWOT & competitor analysis', 'AOV & LTV maximization', 'Pricing models'],
        systemGuidance: 'High-level strategic mindset, data-driven, focused on sustainable enterprise growth.',
        activeWorkflowsCount: 2,
      },
      {
        id: 'team_analytics',
        role: 'analytics',
        name: 'Orion',
        title: 'AI Telemetry & ROI Auditor',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
        status: 'active',
        description: 'Tracks deflection rates, revenue generated by AI, conversation conversion rates, and ROI metrics.',
        capabilities: ['ROI attribution', 'Deflection audit', 'Abandonment detection', 'Executive reporting'],
        systemGuidance: 'Analytical, objective, concise, translating raw business events into clear growth insights.',
        activeWorkflowsCount: 3,
      },
    ];

    this.voiceCalls[bId] = [
      {
        id: 'call_101',
        businessId: bId,
        callerName: 'David Sterling',
        callerPhone: '+1 (212) 555-9014',
        direction: 'inbound',
        durationSeconds: 142,
        status: 'completed',
        outcome: 'appointment_booked',
        summary: 'Inquired about bespoke dinner jackets for charity gala. AI confirmed Friday 2:00 PM fitting with Master Tailor Marcus Vance.',
        transcript: [
          'AI (Sarah): "Good afternoon, thank you for calling Aura Atelier. I am your concierge assistant. How may I direct your inquiry today?"',
          'David Sterling: "Hi, I have a black-tie gala coming up and wanted to know if you have evening tuxedos available for private fitting this Friday?"',
          'AI (Sarah): "Certainly, Mr. Sterling! We have several bespoke dinner jackets and silk-lapel tuxedo silhouettes available. Our master tailor Marcus Vance has openings this Friday at 2:00 PM and 4:30 PM. May I reserve the 2:00 PM VIP slot for you?"',
          'David Sterling: "2:00 PM works perfectly. Put me down for that."',
          'AI (Sarah): "Splendid! I have reserved your fitting for Friday at 2:00 PM at our Madison Avenue flagship and sent a confirmation SMS to this number."',
          'David Sterling: "Great, thank you so much!"',
          'AI (Sarah): "It was our absolute pleasure. Have a wonderful day!"'
        ],
        recordingUrl: 'https://cdn.operateai.com/audio/sample_call_101.mp3',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: 'call_102',
        businessId: bId,
        callerName: 'Evelyn Montgomery',
        callerPhone: '+1 (917) 555-4820',
        direction: 'inbound',
        durationSeconds: 98,
        status: 'completed',
        outcome: 'lead_captured',
        summary: 'Caller inquired about cashmere coat fabric weights and lead times. Qualified $2,000+ budget and synchronized lead to CRM.',
        transcript: [
          'AI (Sarah): "Good morning, Aura Atelier concierge. How may I assist your style journey today?"',
          'Evelyn Montgomery: "Hello, I was looking at the Monaco Cashmere Overcoat online and wanted to check if you have the camel beige in stock in size Medium?"',
          'AI (Sarah): "Yes, Ms. Montgomery! We currently have two Medium pieces of the Monaco Pure Cashmere in camel beige in our Madison Ave salon. We can either arrange same-day white-glove courier delivery or hold one for you to view in person."',
          'Evelyn Montgomery: "Oh wonderful. Please send me a private checkout link to my mobile phone."',
          'AI (Sarah): "Done! The secure Lemon Squeezy checkout link has been dispatched to your mobile. Feel free to complete it at your leisure."'
        ],
        recordingUrl: 'https://cdn.operateai.com/audio/sample_call_102.mp3',
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
      },
      {
        id: 'call_103',
        businessId: bId,
        callerName: 'Alexander Wright',
        callerPhone: '+1 (917) 555-0192',
        direction: 'inbound',
        durationSeconds: 65,
        status: 'completed',
        outcome: 'faq_answered',
        summary: 'Checked FedEx courier tracking for Order #ORD-98214. AI provided tracking number and expected delivery.',
        transcript: [
          'AI (Sarah): "Aura Atelier concierge desk. How may I assist you?"',
          'Alexander Wright: "Hi, just checking tracking on order ORD-98214."',
          'AI (Sarah): "Hello Mr. Wright! Your Milano Dinner Jacket order is in transit with FedEx Priority under tracking AURA-FEDEX-94821 and is scheduled for delivery tomorrow before 10:30 AM."',
          'Alexander Wright: "Superb, thank you for the quick check."'
        ],
        recordingUrl: 'https://cdn.operateai.com/audio/sample_call_103.mp3',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      }
    ];

    this.websiteAiConfigs[bId] = {
      businessId: bId,
      enabledAgentRoles: ['receptionist', 'sales', 'support', 'booking', 'retention'],
      allowHumanTakeover: true,
      antiRepetitionCooldownHours: 24,
      maxProactivePerSession: 2,
      allowedWebsiteActions: [
        'scroll_to_section',
        'navigate_page',
        'highlight_element',
        'search_catalog',
        'filter_catalog',
        'display_product',
        'display_service',
        'open_booking_modal',
        'start_checkout',
        'show_payment_option',
        'capture_lead',
        'open_support',
        'request_human_assistance',
      ],
      proactiveRules: [
        {
          id: 'rule_pricing_45s',
          name: 'High-Intent Pricing Assistance',
          enabled: true,
          triggerType: 'time_on_page',
          targetPage: '/pricing',
          triggerDelaySeconds: 45,
          audience: 'all',
          message: 'Good day! I noticed you are reviewing our couture tailoring tiers. Would you like me to recommend the ideal plan for your upcoming events?',
          agentRole: 'sales',
          maxImpressionsPerVisitor: 1,
          cooldownDays: 3,
        },
        {
          id: 'rule_returning_visitor',
          name: 'Returning VIP Recognition',
          enabled: true,
          triggerType: 'returning_visitor',
          audience: 'returning_visitors',
          message: 'Welcome back to Aura Atelier. Would you like to continue exploring where you left off?',
          agentRole: 'retention',
          maxImpressionsPerVisitor: 2,
          cooldownDays: 2,
        },
        {
          id: 'rule_checkout_stall',
          name: 'Checkout Friction Recovery',
          enabled: true,
          triggerType: 'cart_abandoned',
          targetPage: '/checkout',
          triggerDelaySeconds: 30,
          audience: 'all',
          message: 'Need any assistance completing your reservation or checkout? I can verify fabric sizing or split payments instantly.',
          agentRole: 'support',
          maxImpressionsPerVisitor: 1,
          cooldownDays: 1,
        },
      ],
      privacyConsentRequired: false,
      voiceAgentEnabled: true,
      installationSnippet: `<!-- OperateAI Website AI Agent & Live Intelligence -->\n<script src="${'https://operateai.luxury/widget.js'}" data-business-id="${bId}" async></script>`,
    };

    const now = Date.now();

    this.visitors[bId] = [
      {
        id: 'vis_1042',
        businessId: bId,
        country: 'Nigeria',
        city: 'Lagos',
        firstSeen: new Date(now - 3600000 * 2).toISOString(),
        lastSeen: new Date(now - 12000).toISOString(),
        sessionsCount: 3,
        currentSessionId: 'sess_1042_3',
        isOnline: true,
        currentPage: '/pricing',
        previousPage: '/products/milano-jacket',
        timeOnCurrentPageSeconds: 222,
        totalTimeSpentSeconds: 680,
        referrer: 'https://instagram.com/auraatelier',
        device: { browser: 'Safari Mobile', os: 'iOS 18', deviceType: 'mobile' },
        consentGiven: true,
        currentIntent: 'Comparing bespoke packages & installment terms',
        currentAgentRole: 'sales',
        humanTakeover: false,
        memory: {
          interests: ['Milano Silk-Blend Dinner Jacket', 'Installments', 'International Express Shipping'],
          budget: '$1,500 - $3,000',
          timeline: 'November Gala in Victoria Island',
          lastProductViewed: 'Milano Silk-Blend Dinner Jacket',
          lastRecommendedProduct: 'Milano Silk-Blend Dinner Jacket (42R)',
          lastConversationSummary: 'Customer inquired about direct shipping to Lagos and whether customs clearance is included.',
        },
      },
      {
        id: 'vis_1043',
        businessId: bId,
        customerId: 'cust_001',
        name: 'Alexander Wright',
        email: 'alex.wright@vanguard-cap.com',
        phone: '+1 (917) 555-0192',
        country: 'United Kingdom',
        city: 'London',
        firstSeen: new Date(now - 86400000 * 3).toISOString(),
        lastSeen: new Date(now - 5000).toISOString(),
        sessionsCount: 5,
        currentSessionId: 'sess_1043_5',
        isOnline: true,
        currentPage: '/products/monaco-overcoat',
        previousPage: '/orders',
        timeOnCurrentPageSeconds: 375,
        totalTimeSpentSeconds: 1420,
        referrer: 'Direct / Bookmark',
        device: { browser: 'Chrome 131', os: 'macOS Sequoia', deviceType: 'desktop' },
        consentGiven: true,
        currentIntent: 'Purchasing Monaco Cashmere Overcoat for London winter',
        currentAgentRole: 'sales',
        humanTakeover: false,
        conversationId: 'conv_1043',
        memory: {
          interests: ['Monaco Pure Cashmere Overcoat', 'Siena Flannel Trousers'],
          budget: '$2,500+',
          timeline: 'Immediate Courier delivery to Mayfair',
          preferences: ['Double-faced cashmere', 'Camel beige colorway', 'Size Large'],
          lastProductViewed: 'Monaco Pure Cashmere Overcoat',
          lastRecommendedProduct: 'Monaco Pure Cashmere Overcoat in Camel',
          lastConversationSummary: 'Discussed fabric weight of Mongolian cashmere and verified size L inventory.',
        },
      },
      {
        id: 'vis_1044',
        businessId: bId,
        country: 'United States',
        city: 'New York',
        firstSeen: new Date(now - 3600000).toISOString(),
        lastSeen: new Date(now - 30000).toISOString(),
        sessionsCount: 1,
        currentSessionId: 'sess_1044_1',
        isOnline: true,
        currentPage: '/bookings',
        previousPage: '/bespoke-couture',
        timeOnCurrentPageSeconds: 110,
        totalTimeSpentSeconds: 240,
        referrer: 'https://google.com/search?q=bespoke+tailoring+madison+ave',
        device: { browser: 'Chrome 132', os: 'Windows 11', deviceType: 'desktop' },
        consentGiven: true,
        currentIntent: 'Booking private appointment with Master Tailor Marcus Vance',
        currentAgentRole: 'booking',
        humanTakeover: false,
        memory: {
          interests: ['Private Bespoke Suiting Consultation & 3D Fitting'],
          timeline: 'Thursday Oct 1st at 3:00 PM',
          preferences: ['In-person Madison Ave flagship session'],
        },
      },
      {
        id: 'vis_1045',
        businessId: bId,
        country: 'Germany',
        city: 'Munich',
        firstSeen: new Date(now - 86400000).toISOString(),
        lastSeen: new Date(now - 180000).toISOString(),
        sessionsCount: 2,
        currentSessionId: 'sess_1045_2',
        isOnline: false,
        currentPage: '/bespoke-couture',
        previousPage: '/homepage',
        timeOnCurrentPageSeconds: 250,
        totalTimeSpentSeconds: 490,
        referrer: 'https://linkedin.com',
        device: { browser: 'Firefox 133', os: 'Linux', deviceType: 'desktop' },
        consentGiven: true,
        currentIntent: 'Browsing Loro Piana wool swatches and mill partners',
        currentAgentRole: 'receptionist',
        humanTakeover: false,
        memory: {
          interests: ['Sustainable Italian wool mills', 'Vitale Barberis Canonico'],
        },
      },
    ];

    this.visitorEvents[bId] = [
      {
        id: 'evt_101',
        visitorId: 'vis_1043',
        sessionId: 'sess_1043_5',
        businessId: bId,
        type: 'page_view',
        page: '/homepage',
        metadata: { title: 'Aura Atelier Luxury Bespoke' },
        timestamp: new Date(now - 600000).toISOString(),
      },
      {
        id: 'evt_102',
        visitorId: 'vis_1043',
        sessionId: 'sess_1043_5',
        businessId: bId,
        type: 'product_view',
        page: '/products/monaco-overcoat',
        metadata: { productName: 'Monaco Pure Cashmere Overcoat', price: 2200 },
        timestamp: new Date(now - 450000).toISOString(),
      },
      {
        id: 'evt_103',
        visitorId: 'vis_1043',
        sessionId: 'sess_1043_5',
        businessId: bId,
        type: 'chat_started',
        page: '/products/monaco-overcoat',
        metadata: { initialMessage: 'Is this cashmere suitable for sub-zero temperatures in London?' },
        timestamp: new Date(now - 380000).toISOString(),
      },
      {
        id: 'evt_104',
        visitorId: 'vis_1043',
        sessionId: 'sess_1043_5',
        businessId: bId,
        type: 'AI_action',
        page: '/products/monaco-overcoat',
        metadata: { agent: 'sales', action: 'display_product', result: 'Showed pure cashmere thermal breakdown' },
        timestamp: new Date(now - 320000).toISOString(),
      },
      {
        id: 'evt_105',
        visitorId: 'vis_1043',
        sessionId: 'sess_1043_5',
        businessId: bId,
        type: 'checkout_started',
        page: '/checkout',
        metadata: { amount: 2200, currency: 'USD', paymentMethod: 'lemonsqueezy' },
        timestamp: new Date(now - 120000).toISOString(),
      },
      {
        id: 'evt_201',
        visitorId: 'vis_1042',
        sessionId: 'sess_1042_3',
        businessId: bId,
        type: 'page_view',
        page: '/pricing',
        metadata: { referrer: 'Instagram' },
        timestamp: new Date(now - 222000).toISOString(),
      },
      {
        id: 'evt_202',
        visitorId: 'vis_1042',
        sessionId: 'sess_1042_3',
        businessId: bId,
        type: 'proactive_triggered',
        page: '/pricing',
        metadata: { ruleId: 'rule_pricing_45s', message: 'Would you like me to recommend the ideal plan?' },
        timestamp: new Date(now - 177000).toISOString(),
      },
      {
        id: 'evt_301',
        visitorId: 'vis_1044',
        sessionId: 'sess_1044_1',
        businessId: bId,
        type: 'booking_started',
        page: '/bookings',
        metadata: { service: 'Private Bespoke Suiting Consultation' },
        timestamp: new Date(now - 110000).toISOString(),
      },
    ];

    this.conversations[bId].unshift({
      id: 'conv_1043',
      businessId: bId,
      channel: 'website_chat',
      customerId: 'cust_001',
      customerName: 'Alexander Wright',
      customerContact: 'alex.wright@vanguard-cap.com',
      status: 'ai_handling',
      messagesCount: 4,
      lastMessage: 'I have verified that our Size Large Monaco Pure Cashmere in Camel is reserved for you and ready for instant checkout.',
      lastMessageAt: new Date(now - 180000).toISOString(),
      unread: false,
      tags: ['Sales Agent', 'Monaco Cashmere', 'High Value VIP'],
      sentiment: 'positive',
    });

    this.messages['conv_1043'] = [
      {
        id: 'msg_v1043_1',
        conversationId: 'conv_1043',
        businessId: bId,
        sender: 'customer',
        content: 'Good morning. I am looking at the Monaco Cashmere Overcoat in camel beige. Is the 650g weight suitable for damp London winters, and how does the fit run over tailored suit jackets?',
        timestamp: new Date(now - 380000).toISOString(),
      },
      {
        id: 'msg_v1043_2',
        conversationId: 'conv_1043',
        businessId: bId,
        sender: 'agent',
        content: 'Welcome back Mr. Wright! The Monaco Overcoat is double-faced 100% Mongolian cashmere with high natural loft, making it exquisitely warm for damp London weather without bulk. The armholes and chest are calibrated specifically to drape smoothly over our bespoke dinner jackets. For your 42R jacket, our Size Large provides the quintessential tailored silhouette.',
        timestamp: new Date(now - 350000).toISOString(),
        metadata: { agentRole: 'sales', agentName: 'Julian (Sales Closer)' },
      },
      {
        id: 'msg_v1043_3',
        conversationId: 'conv_1043',
        businessId: bId,
        sender: 'customer',
        content: 'That sounds perfect. Can I pay via Lemon Squeezy with Apple Pay for express dispatch to Mayfair?',
        timestamp: new Date(now - 240000).toISOString(),
      },
      {
        id: 'msg_v1043_4',
        conversationId: 'conv_1043',
        businessId: bId,
        sender: 'agent',
        content: 'I have verified that our Size Large Monaco Pure Cashmere in Camel is reserved for you and ready for instant checkout. You can complete your order with 1-tap Apple Pay via Lemon Squeezy, including zero-hassle UK VAT clearance.',
        timestamp: new Date(now - 180000).toISOString(),
        metadata: { agentRole: 'sales', agentName: 'Julian (Sales Closer)' },
        toolCalls: [
          {
            tool: 'createOrder',
            args: { productId: 'prod_002', quantity: 1, customerName: 'Alexander Wright' },
            result: { orderId: 'ORD-8941', checkoutUrl: 'https://auraatelier.lemonsqueezy.com/buy/order_8941' },
          },
        ],
      },
    ];
  }

  // Multi-Tenant Isolation Helpers
  getBusiness(id: string): Business | undefined {
    return this.businesses.find((b) => b.id === id);
  }

  createBusiness(data: Partial<Business>, userEmail: string): Business {
    const id = `biz_${Date.now()}`;
    const newBiz: Business = {
      id,
      name: data.name || 'My New Business',
      slug: (data.name || 'my-business').toLowerCase().replace(/\s+/g, '-'),
      industry: data.industry || 'general',
      website: data.website || '',
      description: data.description || '',
      brandColor: data.brandColor || '#3b82f6',
      currency: data.currency || 'USD',
      language: data.language || 'en',
      timezone: data.timezone || 'UTC',
      businessHours: data.businessHours || 'Mon-Fri 9AM-5PM',
      contactEmail: data.contactEmail || userEmail,
      contactPhone: data.contactPhone || '',
      location: data.location || '',
      createdAt: new Date().toISOString(),
    };

    this.businesses.push(newBiz);

    // Initialize isolated collections
    this.agents[id] = {
      id: `agt_${id}`,
      businessId: id,
      name: `${newBiz.name} AI Agent`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      tone: 'friendly',
      personality: `Helpful, professional AI assistant for ${newBiz.name}.`,
      language: 'en',
      responseLength: 'balanced',
      objectives: ['Answer customer questions', 'Capture leads', 'Book appointments'],
      allowedActions: ['searchProducts', 'createLead', 'createBooking', 'scheduleFollowUp'],
      escalationRules: ['Customer asks for human', 'Negative sentiment'],
      workingHours: '24/7',
      fallbackBehavior: 'Apologize and record customer contact for staff.',
      status: 'active',
      qualificationQuestions: [
        { id: 'q1', question: 'How can we help your business today?', field: 'need', weight: 50 },
        { id: 'q2', question: 'What is your preferred contact method and timeline?', field: 'timeline', weight: 50 },
      ],
    };

    this.knowledge[id] = [
      {
        id: `kb_${Date.now()}`,
        businessId: id,
        title: `${newBiz.name} Overview & Services`,
        type: 'manual',
        content: `${newBiz.name} is a premier ${newBiz.industry} company. Description: ${newBiz.description}. Contact: ${newBiz.contactEmail}, ${newBiz.contactPhone}. Hours: ${newBiz.businessHours}.`,
        status: 'indexed',
        lastUpdated: new Date().toISOString(),
      },
    ];

    this.products[id] = [];
    this.services[id] = [];
    this.customers[id] = [];
    this.leads[id] = [];
    this.conversations[id] = [];
    this.orders[id] = [];
    this.payments[id] = [];
    this.bookings[id] = [];
    this.automations[id] = [
      {
        id: `auto_${id}_1`,
        businessId: id,
        name: 'New Lead Auto-Followup',
        description: 'Send greeting when lead is captured',
        trigger: 'lead_created',
        conditions: [],
        actions: [{ type: 'notify_staff', params: { channel: 'email' } }],
        status: 'active',
        runsCount: 0,
      },
    ];
    this.campaigns[id] = [];
    this.marketingAssets[id] = [];
    this.businessPlans[id] = [];
    this.generatedWebsites[id] = [];
    this.documents[id] = [];
    this.reputations[id] = [];
    this.aiTeams[id] = [
      {
        id: `team_${id}_receptionist`,
        role: 'receptionist',
        name: 'Aria',
        title: 'AI Front Desk Concierge',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        status: 'active',
        description: `Greets inbound visitors, answers general inquiries, shares business hours for ${newBiz.name}.`,
        capabilities: ['Instant 24/7 greeting', 'FAQ resolution', 'Tone adaptation', 'Multi-language translation'],
        systemGuidance: `Warm, welcoming, and knowledgeable representative for ${newBiz.name}.`,
        activeWorkflowsCount: 3,
      },
      {
        id: `team_${id}_sales`,
        role: 'sales',
        name: 'Julian',
        title: 'Autonomous Sales & Quoting Agent',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        status: 'active',
        description: `Discovers buyer needs, qualifies budget, and issues checkout links for ${newBiz.name}.`,
        capabilities: ['Budget qualification', 'Catalog recommendations', 'Instant payment links', 'Objection handling'],
        systemGuidance: 'Consultative, high-converting, and attentive to customer requirements.',
        activeWorkflowsCount: 5,
      },
      {
        id: `team_${id}_support`,
        role: 'support',
        name: 'Kael',
        title: 'Customer Resolution Specialist',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        status: 'active',
        description: 'Resolves customer questions, policy queries, and facilitates staff escalations.',
        capabilities: ['Order tracking', 'Return & policy queries', 'Empathetic de-escalation', 'Human staff handover'],
        systemGuidance: 'Empathetic, clear, and reassuring. Offer instant resolutions.',
        activeWorkflowsCount: 4,
      },
    ];
    this.voiceCalls[id] = [
      {
        id: `call_${Date.now()}`,
        businessId: id,
        callerName: 'Prospective Client',
        callerPhone: '+1 (555) 234-5678',
        direction: 'inbound',
        durationSeconds: 78,
        status: 'completed',
        outcome: 'faq_answered',
        summary: `Caller asked about ${newBiz.name} offerings and service booking.`,
        transcript: [
          `AI: "Hello and thank you for calling ${newBiz.name}. How may I help you today?"`,
          'Caller: "Hi, I wanted to learn more about your services."',
          `AI: "Certainly! We offer personalized consultations and solutions tailored to your needs. May I send a booking link to your phone?"`,
          'Caller: "Yes, that would be great. Thank you!"'
        ],
        timestamp: new Date().toISOString(),
      },
    ];
    this.brandKits[id] = {
      businessId: id,
      logoUrl: '',
      primaryColor: newBiz.brandColor,
      secondaryColor: '#10b981',
      fontHeading: 'Plus Jakarta Sans',
      fontBody: 'Plus Jakarta Sans',
      brandVoice: 'Professional, courteous, and efficient.',
      tagline: `Premier ${newBiz.industry} solutions`,
      missionStatement: `Serving our customers with highest quality ${newBiz.industry} products and services.`,
    };

    this.visitors[id] = [];
    this.visitorEvents[id] = [];
    this.websiteAiConfigs[id] = {
      businessId: id,
      enabledAgentRoles: ['receptionist', 'sales', 'support', 'booking', 'retention'],
      allowHumanTakeover: true,
      antiRepetitionCooldownHours: 24,
      maxProactivePerSession: 2,
      allowedWebsiteActions: [
        'scroll_to_section',
        'navigate_page',
        'highlight_element',
        'search_catalog',
        'display_product',
        'open_booking_modal',
        'start_checkout',
        'request_human_assistance',
      ],
      proactiveRules: [
        {
          id: `rule_${id}_1`,
          name: 'Welcome Greeting',
          enabled: true,
          triggerType: 'time_on_page',
          triggerDelaySeconds: 30,
          audience: 'all',
          message: `Hello! Welcome to ${newBiz.name}. How can our AI concierge help you today?`,
          agentRole: 'receptionist',
          maxImpressionsPerVisitor: 1,
          cooldownDays: 3,
        },
      ],
      privacyConsentRequired: false,
      voiceAgentEnabled: true,
    };

    this.widgets[id] = {
      businessId: id,
      brandColor: newBiz.brandColor,
      businessName: `${newBiz.name} Assistant`,
      greetingTitle: `Welcome to ${newBiz.name}`,
      welcomeMessage: `Hello! How can I help you today?`,
      avatarUrl: this.agents[id].avatar,
      position: 'bottom-right',
      launcherStyle: 'pill',
      placeholderText: 'Type your message...',
      quickPrompts: ['What services do you offer?', 'Book an appointment', 'Contact human team'],
    };
    this.whatsappConfigs[id] = {
      businessId: id,
      connected: false,
      businessPhone: newBiz.contactPhone,
      webhookVerified: false,
      templateSyncStatus: 'disconnected',
      autoReplyEnabled: true,
    };
    this.teamMembers[id] = [
      {
        id: `usr_${Date.now()}`,
        businessId: id,
        name: 'Business Owner',
        email: userEmail,
        role: 'owner',
        status: 'active',
        lastActive: 'Just now',
      },
    ];
    this.integrations[id] = [
      {
        id: 'int_wa',
        name: 'WhatsApp Business Cloud API',
        category: 'channel',
        connected: false,
        description: 'Connect official Meta WhatsApp Business Cloud API.',
        config: {},
      },
      {
        id: 'int_stripe',
        name: 'Stripe Payments',
        category: 'payment',
        connected: false,
        description: 'Process credit card and mobile payments.',
        config: {},
      },
    ];

    return newBiz;
  }

  logActivity(
    type: SystemActivity['type'],
    businessId: string,
    businessName: string,
    description: string,
    actor: string,
    metadata?: Record<string, any>
  ) {
    const act: SystemActivity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      type,
      businessId,
      businessName,
      description,
      actor,
      metadata,
    };
    this.systemActivities.unshift(act);
    if (this.systemActivities.length > 200) this.systemActivities.pop();

    this.systemLogs.unshift({
      id: `log_${Date.now()}`,
      timestamp: act.timestamp,
      level: 'info',
      category: 'ai_engine',
      message: `[${type}] ${description}`,
      details: metadata,
    });
    if (this.systemLogs.length > 200) this.systemLogs.pop();
  }

  recordLlmUsage(promptTokens: number, responseTokens: number, latencyMs: number) {
    this.llmConfig.tokenUsageTelemetry.totalPromptTokens += promptTokens;
    this.llmConfig.tokenUsageTelemetry.totalResponseTokens += responseTokens;
    this.llmConfig.tokenUsageTelemetry.totalCalls += 1;
    const calls = this.llmConfig.tokenUsageTelemetry.totalCalls;
    const prevAvg = this.llmConfig.tokenUsageTelemetry.averageLatencyMs;
    this.llmConfig.tokenUsageTelemetry.averageLatencyMs = Math.round(
      (prevAvg * (calls - 1) + latencyMs) / calls
    );
    this.llmConfig.tokenUsageTelemetry.estimatedCostUsd = parseFloat(
      (
        (this.llmConfig.tokenUsageTelemetry.totalPromptTokens / 1_000_000) * 0.1 +
        (this.llmConfig.tokenUsageTelemetry.totalResponseTokens / 1_000_000) * 0.4
      ).toFixed(4)
    );
  }

  addGeminiKey(key: string, label: string) {
    const cleanKey = (key || '').trim();
    if (!cleanKey) throw new Error('API Key cannot be empty');
    const id = `key_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const maskedKey = cleanKey.length > 8 ? `${cleanKey.slice(0, 6)}...${cleanKey.slice(-4)}` : '••••••••';
    const entry = {
      id,
      label: label || `Custom Key #${(this.llmConfig.apiKeys?.length || 0) + 1}`,
      key: cleanKey,
      maskedKey,
      isActive: true,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      callCount: 0,
      errorCount: 0,
    };
    this.llmConfig.apiKeys = this.llmConfig.apiKeys || [];
    this.llmConfig.apiKeys.push(entry);
    this.llmConfig.tokenUsageTelemetry.activeKeyCount = this.llmConfig.apiKeys.filter((k) => k.isActive).length;
    this.logActivity(
      'business_status_changed',
      'platform_admin',
      'Platform SuperAdmin',
      `New Gemini API key added to failover pool (${entry.label}).`,
      'SuperAdmin'
    );
    return entry;
  }

  removeGeminiKey(id: string) {
    if (!this.llmConfig.apiKeys) return false;
    const initialLen = this.llmConfig.apiKeys.length;
    this.llmConfig.apiKeys = this.llmConfig.apiKeys.filter((k) => k.id !== id);
    this.llmConfig.tokenUsageTelemetry.activeKeyCount = this.llmConfig.apiKeys.filter((k) => k.isActive).length;
    if (this.llmConfig.apiKeys.length < initialLen) {
      this.logActivity(
        'business_status_changed',
        'platform_admin',
        'Platform SuperAdmin',
        `Gemini API key ${id} removed from system pool.`,
        'SuperAdmin'
      );
      return true;
    }
    return false;
  }

  toggleGeminiKey(id: string) {
    if (!this.llmConfig.apiKeys) return null;
    const target = this.llmConfig.apiKeys.find((k) => k.id === id);
    if (!target) return null;
    target.isActive = !target.isActive;
    target.status = target.isActive ? 'active' : 'disabled';
    this.llmConfig.tokenUsageTelemetry.activeKeyCount = this.llmConfig.apiKeys.filter((k) => k.isActive).length;
    return target;
  }

  resetGeminiEngineState() {
    // Reset any cooldown status on keys
    if (this.llmConfig.apiKeys) {
      this.llmConfig.apiKeys.forEach((k) => {
        if (k.isActive) {
          k.status = 'active';
          k.lastError = undefined;
        }
      });
      this.llmConfig.tokenUsageTelemetry.activeKeyCount = this.llmConfig.apiKeys.filter((k) => k.isActive).length;
    }
    this.llmConfig.tokenUsageTelemetry.lastResetAt = new Date().toISOString();
    this.logActivity(
      'business_status_changed',
      'platform_admin',
      'Platform SuperAdmin',
      'Gemini AI engine reset: failover cooldowns cleared, connection pools re-synchronized.',
      'SuperAdmin'
    );
  }

  registerVisitor(payload: {
    name: string;
    email: string;
    password?: string;
    companyName: string;
    industry?: string;
    currency?: string;
  }): { user: User; business: Business } {
    const emailNorm = payload.email.trim().toLowerCase();
    const existingUser = this.users.find((u) => u.email.toLowerCase() === emailNorm);
    if (existingUser) {
      const existingBiz = this.getBusiness(existingUser.businessId) || this.businesses[0];
      return { user: existingUser, business: existingBiz };
    }

    const businessId = `biz_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const industry = payload.industry || 'e-commerce';
    const currency = payload.currency || 'USD';

    const newBiz: Business = {
      id: businessId,
      name: payload.companyName || 'My Business Workspace',
      slug: (payload.companyName || 'my-business')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
      industry,
      website: `https://${(payload.companyName || 'business').toLowerCase().replace(/\s+/g, '')}.com`,
      description: `Autonomous AI-powered operations for ${payload.companyName || 'our business'}.`,
      brandColor: '#4f46e5',
      currency,
      language: 'en',
      timezone: 'America/New_York',
      businessHours: 'Mon - Fri: 9:00 AM - 6:00 PM',
      contactEmail: emailNorm,
      contactPhone: '+1 (555) 123-4567',
      location: 'New York, NY',
      createdAt: new Date().toISOString(),
    };

    this.businesses.push(newBiz);

    const newUser: User = {
      id: userId,
      name: payload.name || 'Business Owner',
      email: emailNorm,
      role: 'owner',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(payload.name || 'Owner')}`,
      businessId,
    };
    this.users.push(newUser);

    // Initialize full tenant assets
    this.createBusiness(newBiz, emailNorm);

    // Seed starter products based on industry
    this.products[businessId] = [
      {
        id: `prod_${Date.now()}_1`,
        businessId,
        name: 'Signature Service Consultation',
        description: 'Comprehensive 1-on-1 strategy and onboarding session with our team.',
        price: 199,
        sku: 'SIG-CONS-01',
        category: 'Services',
        status: 'active',
        inventory: 99,
        images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80'],
      },
      {
        id: `prod_${Date.now()}_2`,
        businessId,
        name: 'Premium Starter Package',
        description: 'Our most popular comprehensive package tailored for immediate delivery.',
        price: 499,
        sku: 'PKG-PREM-01',
        category: 'Packages',
        status: 'active',
        inventory: 50,
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80'],
      },
    ];

    this.services[businessId] = [
      {
        id: `srv_${Date.now()}_1`,
        businessId,
        name: 'Initial Strategy Session',
        description: '45-minute consultation to review business objectives and launch automations.',
        durationMinutes: 45,
        price: 150,
        depositRequired: 50,
        staff: ['Principal Consultant'],
        workingHours: 'Mon - Fri: 9:00 AM - 5:00 PM',
        available: true,
      },
    ];

    this.logActivity(
      'visitor_registered',
      businessId,
      newBiz.name,
      `New business tenant "${newBiz.name}" registered by ${newUser.name} (${newUser.email}).`,
      newUser.name,
      { industry, currency }
    );

    return { user: newUser, business: newBiz };
  }

  authenticateVisitor(
    email: string,
    _password?: string
  ): { user: User; business: Business } | null {
    const emailNorm = email.trim().toLowerCase();
    const user = this.users.find((u) => u.email.toLowerCase() === emailNorm) || this.users[0];
    if (!user) return null;
    const business = this.getBusiness(user.businessId) || this.businesses[0];

    this.logActivity(
      'user_login',
      business.id,
      business.name,
      `User ${user.name} (${user.email}) logged into workspace.`,
      user.name
    );

    return { user, business };
  }
}

export const db = new TenantDatabase();
