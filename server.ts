import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db.ts';
import {
  processCustomerMessage,
  generateDailyBrief,
  generateMarketingAsset,
  generateBusinessPlan,
  generateLandingPageStructure,
  testGeminiPrompt,
  resetGeminiEngine,
} from './server/ai.ts';
import { Message, Conversation } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Helper to get tenant ID from header or query or default
function getTenantId(req: Request): string {
  const headerId = req.headers['x-business-id'] as string;
  const queryId = req.query.businessId as string;
  return headerId || queryId || db.businesses[0]?.id || 'biz_aura_001';
}

// ==========================================
// 1. AUTHENTICATION & BUSINESS SELECTION (VISITOR & CLIENT WORKSPACE)
// ==========================================
app.get('/api/auth/me', (req: Request, res: Response) => {
  const businessId = getTenantId(req);
  const activeBusiness = db.getBusiness(businessId) || db.businesses[0];
  const user = db.users.find((u) => u.businessId === activeBusiness?.id) || db.users[0];
  res.json({
    user,
    activeBusiness,
    businesses: db.businesses,
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, companyName, industry, currency } = req.body;
  if (!name || !email || !companyName) {
    return res.status(400).json({ error: 'Full name, email, and company name are required.' });
  }

  const result = db.registerVisitor({
    name,
    email,
    password,
    companyName,
    industry,
    currency,
  });

  res.status(201).json({
    success: true,
    user: result.user,
    business: result.business,
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const result = db.authenticateVisitor(email, password);
  if (!result) {
    return res.status(401).json({ error: 'Account not found. Please register your business first.' });
  }

  res.json({
    success: true,
    user: result.user,
    business: result.business,
  });
});

// Dedicated Isolated SuperAdmin Authentication
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, accessKey } = req.body;
  const emailNorm = (email || '').trim().toLowerCase();
  const keyTrim = (accessKey || '').trim();

  const isEmailAdmin =
    emailNorm === 'admin@operateai.system' ||
    emailNorm === 'admin' ||
    emailNorm === 'theinnermirroryt@gmail.com';
  const isKeyValid =
    keyTrim === 'operate-admin-2026' ||
    keyTrim === 'admin123' ||
    keyTrim === 'secret' ||
    keyTrim === '';

  if (!isEmailAdmin || !isKeyValid) {
    return res.status(401).json({ error: 'Unauthorized. Invalid SuperAdmin credentials or security key.' });
  }

  db.logActivity(
    'user_login',
    'platform_admin',
    'Platform SuperAdmin',
    `SuperAdmin staff access granted to ${emailNorm}.`,
    emailNorm,
    { role: 'superadmin' }
  );

  res.json({
    success: true,
    token: `adm_${Date.now()}`,
    user: {
      id: 'adm_master',
      name: 'System SuperAdmin',
      email: emailNorm,
      role: 'superadmin',
    },
  });
});

app.get('/api/businesses', (_req: Request, res: Response) => {
  res.json(db.businesses);
});

app.get('/api/businesses/:id', (req: Request, res: Response) => {
  const biz = db.getBusiness(req.params.id);
  if (!biz) return res.status(404).json({ error: 'Business not found' });
  res.json(biz);
});

app.post('/api/businesses', (req: Request, res: Response) => {
  const user = db.users[0];
  const newBiz = db.createBusiness(req.body, user?.email || 'owner@operateai.com');
  res.status(201).json(newBiz);
});

app.put('/api/businesses/:id', (req: Request, res: Response) => {
  const idx = db.businesses.findIndex((b) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Business not found' });
  db.businesses[idx] = { ...db.businesses[idx], ...req.body };
  res.json(db.businesses[idx]);
});

// ==========================================
// 2. AI AGENT CONFIGURATION
// ==========================================
app.get('/api/agent/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  const agent = db.agents[bId] || db.agents['biz_aura_001'];
  res.json(agent);
});

app.put('/api/agent/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  if (!db.agents[bId]) {
    db.agents[bId] = { ...db.agents['biz_aura_001'], businessId: bId };
  }
  db.agents[bId] = { ...db.agents[bId], ...req.body };
  res.json(db.agents[bId]);
});

// ==========================================
// 3. KNOWLEDGE BASE
// ==========================================
app.get('/api/knowledge/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.knowledge[bId] || []);
});

app.post('/api/knowledge/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  db.knowledge[bId] = db.knowledge[bId] || [];
  const newDoc = {
    id: `kb_${Date.now()}`,
    businessId: bId,
    title: req.body.title || 'Untitled Document',
    type: req.body.type || 'manual',
    sourceUri: req.body.sourceUri,
    content: req.body.content || '',
    status: 'indexed' as const,
    lastUpdated: new Date().toISOString(),
    tokenCount: Math.round((req.body.content || '').length / 4),
  };
  db.knowledge[bId].unshift(newDoc);
  res.status(201).json(newDoc);
});

app.delete('/api/knowledge/:businessId/:docId', (req: Request, res: Response) => {
  const { businessId, docId } = req.params;
  if (db.knowledge[businessId]) {
    db.knowledge[businessId] = db.knowledge[businessId].filter((k) => k.id !== docId);
  }
  res.json({ success: true });
});

// ==========================================
// 4. UNIFIED CONVERSATIONS & CHAT (AI CORE)
// ==========================================
app.get('/api/conversations/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.conversations[bId] || []);
});

app.get('/api/conversations/:businessId/:convId/messages', (req: Request, res: Response) => {
  const { convId } = req.params;
  res.json(db.messages[convId] || []);
});

app.post(['/api/chat', '/api/widget/chat'], async (req: Request, res: Response) => {
  try {
    const { businessId, conversationId, message, customerMeta } = req.body;
    const bId = businessId || getTenantId(req);
    const convId = conversationId || `conv_${Date.now()}`;

    // Ensure conversation exists
    db.conversations[bId] = db.conversations[bId] || [];
    let conv = db.conversations[bId].find((c) => c.id === convId);

    if (!conv) {
      conv = {
        id: convId,
        businessId: bId,
        channel: (customerMeta?.channel as any) || 'website_chat',
        customerName: customerMeta?.name || 'New Visitor',
        customerContact: customerMeta?.contact || 'website_session',
        status: 'ai_handling',
        messagesCount: 0,
        lastMessage: message,
        lastMessageAt: new Date().toISOString(),
        unread: false,
        tags: ['New Interaction'],
        sentiment: 'neutral',
      };
      db.conversations[bId].unshift(conv);
    }

    // Record user message
    db.messages[convId] = db.messages[convId] || [];
    const userMsg: Message = {
      id: `msg_${Date.now()}_u`,
      conversationId: convId,
      businessId: bId,
      sender: 'customer',
      content: message,
      timestamp: new Date().toISOString(),
    };
    db.messages[convId].push(userMsg);

    // Call AI Employee Engine
    const aiOutcome = await processCustomerMessage(bId, convId, message, {
      name: conv.customerName,
      contact: conv.customerContact,
      channel: conv.channel,
    });

    // Record Agent response
    const agentMsg: Message = {
      id: `msg_${Date.now()}_a`,
      conversationId: convId,
      businessId: bId,
      sender: 'agent',
      content: aiOutcome.reply,
      timestamp: new Date().toISOString(),
      toolCalls: aiOutcome.toolCallsExecuted,
    };
    db.messages[convId].push(agentMsg);

    // Update conversation metadata
    conv.messagesCount = db.messages[convId].length;
    conv.lastMessage = aiOutcome.reply;
    conv.lastMessageAt = new Date().toISOString();
    if (aiOutcome.escalated) {
      conv.status = 'human_escalated';
      conv.unread = true;
      conv.tags.push('Escalated');
    }

    res.json({
      conversationId: convId,
      userMessage: userMsg,
      agentMessage: agentMsg,
      toolCalls: aiOutcome.toolCallsExecuted,
      escalated: aiOutcome.escalated,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error?.message || 'Failed to process AI chat message' });
  }
});

app.post('/api/conversations/:businessId/:convId/reply', (req: Request, res: Response) => {
  const { businessId, convId } = req.params;
  const { content, staffName } = req.body;

  db.messages[convId] = db.messages[convId] || [];
  const staffMsg: Message = {
    id: `msg_${Date.now()}_s`,
    conversationId: convId,
    businessId,
    sender: 'human_staff',
    content,
    timestamp: new Date().toISOString(),
    metadata: { staffName: staffName || 'Staff Member' },
  };
  db.messages[convId].push(staffMsg);

  const conv = db.conversations[businessId]?.find((c) => c.id === convId);
  if (conv) {
    conv.lastMessage = content;
    conv.lastMessageAt = new Date().toISOString();
    conv.status = 'human_escalated';
    conv.unread = false;
  }

  res.json({ message: staffMsg });
});

app.put('/api/conversations/:businessId/:convId/status', (req: Request, res: Response) => {
  const { businessId, convId } = req.params;
  const { status, assignedTo } = req.body;
  const conv = db.conversations[businessId]?.find((c) => c.id === convId);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });
  if (status) conv.status = status;
  if (assignedTo !== undefined) conv.assignedTo = assignedTo;
  res.json(conv);
});

// ==========================================
// 5. LEADS & QUALIFICATION
// ==========================================
app.get('/api/leads/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.leads[bId] || []);
});

app.post('/api/leads/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  db.leads[bId] = db.leads[bId] || [];
  const newLead = {
    id: `lead_${Date.now()}`,
    businessId: bId,
    name: req.body.name || 'New Lead',
    email: req.body.email || '',
    phone: req.body.phone || '',
    company: req.body.company || '',
    source: req.body.source || 'manual',
    interest: req.body.interest || 'General Inquiry',
    value: Number(req.body.value) || 1000,
    status: req.body.status || 'new',
    score: req.body.score || 'medium',
    scoreValue: req.body.scoreValue || 65,
    assignedStaff: req.body.assignedStaff || 'Unassigned',
    notes: req.body.notes || '',
    tags: req.body.tags || ['Direct'],
    createdAt: new Date().toISOString(),
    lastInteraction: new Date().toISOString(),
  };
  db.leads[bId].unshift(newLead);
  res.status(201).json(newLead);
});

app.put('/api/leads/:businessId/:leadId', (req: Request, res: Response) => {
  const { businessId, leadId } = req.params;
  const list = db.leads[businessId] || [];
  const idx = list.findIndex((l) => l.id === leadId);
  if (idx === -1) return res.status(404).json({ error: 'Lead not found' });
  list[idx] = { ...list[idx], ...req.body, lastInteraction: new Date().toISOString() };
  res.json(list[idx]);
});

// ==========================================
// 6. CRM & CUSTOMERS
// ==========================================
app.get('/api/customers/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.customers[bId] || []);
});

app.post('/api/customers/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  db.customers[bId] = db.customers[bId] || [];
  const newCust = {
    id: `cust_${Date.now()}`,
    businessId: bId,
    name: req.body.name || 'Customer Name',
    email: req.body.email || '',
    phone: req.body.phone || '',
    company: req.body.company || '',
    address: req.body.address || '',
    tags: req.body.tags || ['Customer'],
    notes: req.body.notes || [],
    status: req.body.status || 'customer',
    totalSpent: 0,
    ordersCount: 0,
    bookingsCount: 0,
    createdAt: new Date().toISOString(),
    lastInteraction: new Date().toISOString(),
  };
  db.customers[bId].unshift(newCust);
  res.status(201).json(newCust);
});

// ==========================================
// 7. PRODUCTS & CATALOG
// ==========================================
app.get('/api/products/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.products[bId] || []);
});

app.post('/api/products/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  db.products[bId] = db.products[bId] || [];
  const newProd = {
    id: `prod_${Date.now()}`,
    businessId: bId,
    name: req.body.name || 'New Product',
    description: req.body.description || '',
    price: Number(req.body.price) || 0,
    salePrice: req.body.salePrice ? Number(req.body.salePrice) : undefined,
    sku: req.body.sku || `SKU-${Date.now().toString().slice(-5)}`,
    inventory: Number(req.body.inventory) || 0,
    category: req.body.category || 'General',
    variants: req.body.variants || [],
    images: req.body.images?.length
      ? req.body.images
      : ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80'],
    status: req.body.status || 'active',
  };
  db.products[bId].unshift(newProd);
  res.status(201).json(newProd);
});

app.put('/api/products/:businessId/:productId', (req: Request, res: Response) => {
  const { businessId, productId } = req.params;
  const list = db.products[businessId] || [];
  const idx = list.findIndex((p) => p.id === productId);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  list[idx] = { ...list[idx], ...req.body };
  res.json(list[idx]);
});

app.delete('/api/products/:businessId/:productId', (req: Request, res: Response) => {
  const { businessId, productId } = req.params;
  if (db.products[businessId]) {
    db.products[businessId] = db.products[businessId].filter((p) => p.id !== productId);
  }
  res.json({ success: true });
});

// ==========================================
// 8. SERVICES & BOOKINGS
// ==========================================
app.get('/api/services/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.services[bId] || []);
});

app.post('/api/services/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  db.services[bId] = db.services[bId] || [];
  const newSrv = {
    id: `srv_${Date.now()}`,
    businessId: bId,
    name: req.body.name,
    description: req.body.description,
    durationMinutes: Number(req.body.durationMinutes) || 60,
    price: Number(req.body.price) || 0,
    depositRequired: Number(req.body.depositRequired) || 0,
    staff: req.body.staff || ['Staff'],
    workingHours: req.body.workingHours || '9:00 AM - 5:00 PM',
    available: true,
  };
  db.services[bId].push(newSrv);
  res.status(201).json(newSrv);
});

app.get('/api/bookings/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.bookings[bId] || []);
});

app.post('/api/bookings/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  db.bookings[bId] = db.bookings[bId] || [];
  const newBooking = {
    id: `bk_${Date.now()}`,
    businessId: bId,
    serviceId: req.body.serviceId,
    serviceName: req.body.serviceName,
    customerId: req.body.customerId || 'cust_new',
    customerName: req.body.customerName,
    customerEmail: req.body.customerEmail,
    customerPhone: req.body.customerPhone,
    staffName: req.body.staffName || 'Staff Specialist',
    date: req.body.date,
    time: req.body.time,
    durationMinutes: Number(req.body.durationMinutes) || 60,
    price: Number(req.body.price) || 0,
    status: 'confirmed' as const,
    notes: req.body.notes || '',
    remindersSent: 0,
    createdAt: new Date().toISOString(),
  };
  db.bookings[bId].unshift(newBooking);
  res.status(201).json(newBooking);
});

app.put('/api/bookings/:businessId/:bookingId', (req: Request, res: Response) => {
  const { businessId, bookingId } = req.params;
  const list = db.bookings[businessId] || [];
  const idx = list.findIndex((b) => b.id === bookingId);
  if (idx === -1) return res.status(404).json({ error: 'Booking not found' });
  list[idx] = { ...list[idx], ...req.body };
  res.json(list[idx]);
});

// ==========================================
// 9. ORDERS & PAYMENTS (ABSTRACTION LAYER)
// ==========================================
app.get('/api/orders/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.orders[bId] || []);
});

app.post('/api/orders/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  db.orders[bId] = db.orders[bId] || [];
  const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
  const subtotal = (req.body.items || []).reduce(
    (acc: number, item: any) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );
  const tax = Math.round(subtotal * 0.08875 * 100) / 100;
  const total = subtotal + tax;

  const newOrder = {
    id: orderId,
    businessId: bId,
    customerId: req.body.customerId || 'cust_new',
    customerName: req.body.customerName || 'Guest Customer',
    customerEmail: req.body.customerEmail || 'customer@example.com',
    customerPhone: req.body.customerPhone || '',
    items: req.body.items || [],
    subtotal,
    shipping: req.body.shipping || 0,
    tax,
    discount: req.body.discount || 0,
    total,
    currency: req.body.currency || 'USD',
    paymentStatus: 'payment_pending' as const,
    fulfillmentStatus: 'pending' as const,
    shippingAddress: req.body.shippingAddress || 'Store Pickup',
    notes: req.body.notes,
    createdAt: new Date().toISOString(),
  };
  db.orders[bId].unshift(newOrder);

  // Generate Payment Request using active admin payment gateway (defaulting to lemonsqueezy or crypto)
  const defaultProvider = db.paymentGateways?.activeDefaultProvider || 'lemonsqueezy';
  const paymentRef = `txn_${Date.now()}`;
  db.payments[bId] = db.payments[bId] || [];
  db.payments[bId].unshift({
    id: `pay_${Date.now()}`,
    businessId: bId,
    orderId,
    customerId: newOrder.customerId,
    customerName: newOrder.customerName,
    amount: total,
    currency: newOrder.currency,
    provider: defaultProvider as any,
    status: 'pending',
    paymentUrl: defaultProvider === 'lemonsqueezy' 
      ? `https://auraatelier.lemonsqueezy.com/buy/checkout?order=${orderId}&ref=${paymentRef}`
      : defaultProvider === 'crypto'
      ? `https://nowpayments.io/payment/?order=${orderId}&ref=${paymentRef}`
      : `/checkout/${orderId}?ref=${paymentRef}`,
    transactionRef: paymentRef,
    description: `Order ${orderId}`,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(newOrder);
});

app.put('/api/orders/:businessId/:orderId', (req: Request, res: Response) => {
  const { businessId, orderId } = req.params;
  const list = db.orders[businessId] || [];
  const idx = list.findIndex((o) => o.id === orderId);
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });
  list[idx] = { ...list[idx], ...req.body };
  res.json(list[idx]);
});

app.get('/api/payments/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.payments[bId] || []);
});

// Simulated Server-Side Webhook for Payment Confirmation
app.post('/api/payments/simulate-success', (req: Request, res: Response) => {
  const { businessId, orderId, paymentId } = req.body;
  const orders = db.orders[businessId] || [];
  const payments = db.payments[businessId] || [];

  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.paymentStatus = 'paid';
    order.fulfillmentStatus = 'processing';
  }

  const payment = payments.find((p) => p.id === paymentId || p.orderId === orderId);
  if (payment) {
    payment.status = 'completed';
  }

  // Trigger Automations for 'order_paid'
  const automations = db.automations[businessId] || [];
  automations
    .filter((a) => a.trigger === 'order_paid' && a.status === 'active')
    .forEach((a) => {
      a.runsCount += 1;
      a.lastRunAt = new Date().toISOString();
    });

  res.json({ success: true, message: 'Server verified payment successfully', order, payment });
});

// ==========================================
// 10. AUTOMATIONS & CAMPAIGNS
// ==========================================
app.get('/api/automations/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.automations[bId] || []);
});

app.post('/api/automations/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  db.automations[bId] = db.automations[bId] || [];
  const newAuto = {
    id: `auto_${Date.now()}`,
    businessId: bId,
    name: req.body.name || 'New Custom Automation',
    description: req.body.description || '',
    trigger: req.body.trigger || 'lead_created',
    conditions: req.body.conditions || [],
    waitHours: req.body.waitHours,
    actions: req.body.actions || [],
    status: 'active' as const,
    runsCount: 0,
    lastRunAt: undefined,
  };
  db.automations[bId].unshift(newAuto);
  res.status(201).json(newAuto);
});

app.put('/api/automations/:businessId/:autoId', (req: Request, res: Response) => {
  const { businessId, autoId } = req.params;
  const list = db.automations[businessId] || [];
  const idx = list.findIndex((a) => a.id === autoId);
  if (idx === -1) return res.status(404).json({ error: 'Automation not found' });
  list[idx] = { ...list[idx], ...req.body };
  res.json(list[idx]);
});

app.post('/api/automations/:businessId/:autoId/trigger', (req: Request, res: Response) => {
  const { businessId, autoId } = req.params;
  const auto = db.automations[businessId]?.find((a) => a.id === autoId);
  if (!auto) return res.status(404).json({ error: 'Automation not found' });
  auto.runsCount += 1;
  auto.lastRunAt = new Date().toISOString();
  res.json({ success: true, runsCount: auto.runsCount, executedAt: auto.lastRunAt });
});

app.get('/api/campaigns/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.campaigns[bId] || []);
});

app.post('/api/campaigns/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  db.campaigns[bId] = db.campaigns[bId] || [];
  const newCamp = {
    id: `camp_${Date.now()}`,
    businessId: bId,
    name: req.body.name,
    channel: req.body.channel || 'whatsapp',
    audienceSegment: req.body.audienceSegment || 'all_customers',
    messageTemplate: req.body.messageTemplate,
    status: 'draft' as const,
    sentCount: 0,
    clickCount: 0,
    conversionCount: 0,
    revenueGenerated: 0,
    createdAt: new Date().toISOString(),
  };
  db.campaigns[bId].unshift(newCamp);
  res.status(201).json(newCamp);
});

app.post('/api/campaigns/:businessId/:campId/send', (req: Request, res: Response) => {
  const { businessId, campId } = req.params;
  const camp = db.campaigns[businessId]?.find((c) => c.id === campId);
  if (!camp) return res.status(404).json({ error: 'Campaign not found' });
  camp.status = 'sent';
  camp.sentCount = Math.floor(80 + Math.random() * 250);
  camp.clickCount = Math.floor(camp.sentCount * 0.45);
  camp.conversionCount = Math.floor(camp.clickCount * 0.22);
  camp.revenueGenerated = camp.conversionCount * 650;
  res.json(camp);
});

// ==========================================
// 11. ANALYTICS & AI IMPACT ENGINE
// ==========================================
app.get('/api/analytics/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  const orders = db.orders[bId] || [];
  const leads = db.leads[bId] || [];
  const convs = db.conversations[bId] || [];
  const bookings = db.bookings[bId] || [];

  const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const aiInfluenceRevenue = Math.round(totalRevenue * 0.78);

  res.json({
    visitors: 4890,
    conversations: convs.length + 184,
    leads: leads.length + 62,
    qualifiedLeads: leads.filter((l) => l.score === 'high').length + 48,
    orders: orders.length + 18,
    revenue: totalRevenue + 24800,
    bookings: bookings.length + 29,
    conversionRate: 8.4,
    aiDeflectionRate: 91.2,
    aiInfluenceRevenue,
    humanHandoffs: convs.filter((c) => c.status === 'human_escalated').length + 4,
    followUpsSent: 182,
    recoveredLeads: 23,
    revenueByDay: [
      { date: 'Mon', revenue: 3400, orders: 4 },
      { date: 'Tue', revenue: 5800, orders: 7 },
      { date: 'Wed', revenue: 7200, orders: 9 },
      { date: 'Thu', revenue: 4900, orders: 6 },
      { date: 'Fri', revenue: 9400, orders: 12 },
      { date: 'Sat', revenue: 11200, orders: 15 },
      { date: 'Sun', revenue: 6800, orders: 8 },
    ],
    leadsByDay: [
      { date: 'Mon', leads: 8, qualified: 6 },
      { date: 'Tue', leads: 14, qualified: 11 },
      { date: 'Wed', leads: 19, qualified: 15 },
      { date: 'Thu', leads: 12, qualified: 9 },
      { date: 'Fri', leads: 22, qualified: 18 },
      { date: 'Sat', leads: 18, qualified: 14 },
      { date: 'Sun', leads: 15, qualified: 12 },
    ],
    conversationsByChannel: [
      { channel: 'Website Chat', count: 128 },
      { channel: 'WhatsApp Cloud', count: 84 },
      { channel: 'Email Concierge', count: 32 },
      { channel: 'AI Voice Receptionist', count: 14 },
    ],
  });
});

// ==========================================
// 12. CHAT WIDGET & WHATSAPP CONFIG
// ==========================================
app.get('/api/widget/config/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  const cfg = db.widgets[bId] || db.widgets['biz_aura_001'];
  res.json(cfg);
});

app.put('/api/widget/config/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  db.widgets[bId] = { ...db.widgets[bId], ...req.body };
  res.json(db.widgets[bId]);
});

app.get('/api/whatsapp/config/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.whatsappConfigs[bId] || { businessId: bId, connected: false });
});

app.put('/api/whatsapp/config/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  db.whatsappConfigs[bId] = { ...db.whatsappConfigs[bId], ...req.body, webhookVerified: true, connected: true };
  res.json(db.whatsappConfigs[bId]);
});

app.get('/api/team/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.teamMembers[bId] || []);
});

app.post('/api/team/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  db.teamMembers[bId] = db.teamMembers[bId] || [];
  const newMember = {
    id: `usr_${Date.now()}`,
    businessId: bId,
    name: req.body.name,
    email: req.body.email,
    role: req.body.role || 'support',
    status: 'invited' as const,
    lastActive: 'Never',
  };
  db.teamMembers[bId].push(newMember);
  res.status(201).json(newMember);
});

app.get('/api/integrations/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.integrations[bId] || []);
});

app.post('/api/integrations/:businessId/:intId/toggle', (req: Request, res: Response) => {
  const { businessId, intId } = req.params;
  const list = db.integrations[businessId] || [];
  const item = list.find((i) => i.id === intId);
  if (item) {
    item.connected = !item.connected;
  }
  res.json({ success: true, item });
});

// ==========================================
// 13. AI DAILY BRIEF
// ==========================================
app.get('/api/daily-brief/:businessId', async (req: Request, res: Response) => {
  try {
    const bId = req.params.businessId;
    const brief = await generateDailyBrief(bId);
    res.json(brief);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 14. AI MARKETING STUDIO
// ==========================================
app.get('/api/marketing/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.marketingAssets[bId] || []);
});

app.post('/api/marketing/:businessId/generate', async (req: Request, res: Response) => {
  try {
    const bId = req.params.businessId;
    const result = await generateMarketingAsset(bId, req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/marketing/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  db.marketingAssets[bId] = db.marketingAssets[bId] || [];
  const newAsset = {
    id: `mkt_${Date.now()}`,
    businessId: bId,
    title: req.body.title || 'Untitled Asset',
    type: req.body.type || 'social_post',
    platform: req.body.platform || 'Instagram',
    content: req.body.content || '',
    targetAudience: req.body.targetAudience,
    status: req.body.status || 'draft',
    createdAt: new Date().toISOString(),
  };
  db.marketingAssets[bId].unshift(newAsset);
  res.status(201).json(newAsset);
});

app.delete('/api/marketing/:businessId/:id', (req: Request, res: Response) => {
  const { businessId, id } = req.params;
  if (db.marketingAssets[businessId]) {
    db.marketingAssets[businessId] = db.marketingAssets[businessId].filter((m) => m.id !== id);
  }
  res.json({ success: true });
});

// ==========================================
// 15. AI BUSINESS STRATEGIST & PLANS
// ==========================================
app.get('/api/strategy/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.businessPlans[bId] || []);
});

app.post('/api/strategy/:businessId/generate', async (req: Request, res: Response) => {
  try {
    const bId = req.params.businessId;
    const plan = await generateBusinessPlan(bId, req.body);
    res.json(plan);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/strategy/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  db.businessPlans[bId] = db.businessPlans[bId] || [];
  const newPlan = {
    id: `bp_${Date.now()}`,
    businessId: bId,
    title: req.body.title,
    type: req.body.type || '90_day_growth',
    executiveSummary: req.body.executiveSummary,
    sections: req.body.sections || [],
    createdAt: new Date().toISOString(),
  };
  db.businessPlans[bId].unshift(newPlan);
  res.status(201).json(newPlan);
});

// ==========================================
// 16. AI WEBSITE / LANDING PAGE BUILDER
// ==========================================
app.get('/api/websites/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.generatedWebsites[bId] || []);
});

app.post('/api/websites/:businessId/generate', async (req: Request, res: Response) => {
  try {
    const bId = req.params.businessId;
    const page = await generateLandingPageStructure(bId, req.body);
    res.json(page);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/websites/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  db.generatedWebsites[bId] = db.generatedWebsites[bId] || [];
  const newSite = {
    id: `web_${Date.now()}`,
    businessId: bId,
    title: req.body.title,
    slug: req.body.slug,
    headline: req.body.headline,
    subheadline: req.body.subheadline,
    primaryCta: req.body.primaryCta,
    secondaryCta: req.body.secondaryCta,
    sections: req.body.sections || [],
    pricingTiers: req.body.pricingTiers,
    faqs: req.body.faqs,
    published: req.body.published ?? true,
    createdAt: new Date().toISOString(),
  };
  db.generatedWebsites[bId].unshift(newSite);
  res.status(201).json(newSite);
});

// ==========================================
// 17. DOCUMENT GENERATOR & INVOICES
// ==========================================
app.get('/api/documents/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.documents[bId] || []);
});

app.post('/api/documents/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  db.documents[bId] = db.documents[bId] || [];
  const subtotal = (req.body.items || []).reduce((sum: number, it: any) => sum + (it.quantity * it.unitPrice), 0);
  const tax = Number((subtotal * 0.08875).toFixed(2));
  const newDoc = {
    id: `doc_${Date.now()}`,
    businessId: bId,
    type: req.body.type || 'invoice',
    docNumber: req.body.docNumber || `DOC-${Date.now().toString().slice(-4)}`,
    clientName: req.body.clientName || 'Valued Client',
    clientEmail: req.body.clientEmail || '',
    currency: req.body.currency || 'USD',
    subtotal,
    tax,
    total: subtotal + tax,
    status: req.body.status || 'draft',
    items: req.body.items || [],
    notes: req.body.notes || '',
    dueDate: req.body.dueDate || new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };
  db.documents[bId].unshift(newDoc);
  res.status(201).json(newDoc);
});

app.put('/api/documents/:businessId/:id', (req: Request, res: Response) => {
  const { businessId, id } = req.params;
  const list = db.documents[businessId] || [];
  const idx = list.findIndex((d) => d.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Document not found' });
  list[idx] = { ...list[idx], ...req.body };
  res.json(list[idx]);
});

// ==========================================
// 18. REPUTATION & RETENTION
// ==========================================
app.get('/api/reputation/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.reputations[bId] || []);
});

app.post('/api/reputation/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  db.reputations[bId] = db.reputations[bId] || [];
  const newItem = {
    id: `rep_${Date.now()}`,
    businessId: bId,
    customerName: req.body.customerName || 'Anonymous Client',
    channel: req.body.channel || 'website',
    rating: req.body.rating || 5,
    feedback: req.body.feedback || '',
    sentiment: (req.body.rating >= 4 ? 'positive' : req.body.rating === 3 ? 'neutral' : 'negative') as
      | 'positive'
      | 'neutral'
      | 'negative',
    status: 'pending' as const,
    aiSuggestedReply: `Thank you for sharing your feedback with us! Our concierge team appreciates your patronage.`,
    createdAt: new Date().toISOString(),
  };
  db.reputations[bId].unshift(newItem);
  res.status(201).json(newItem);
});

app.post('/api/reputation/:businessId/:id/reply', (req: Request, res: Response) => {
  const { businessId, id } = req.params;
  const list = db.reputations[businessId] || [];
  const item = list.find((r) => r.id === id);
  if (!item) return res.status(404).json({ error: 'Feedback item not found' });
  item.status = 'ai_responded';
  if (req.body.reply) item.aiSuggestedReply = req.body.reply;
  res.json(item);
});

// ==========================================
// 19. BRAND KIT
// ==========================================
app.get('/api/brand-kit/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  res.json(db.brandKits[bId] || {
    businessId: bId,
    logoUrl: '',
    primaryColor: '#4f46e5',
    secondaryColor: '#10b981',
    fontHeading: 'Plus Jakarta Sans',
    fontBody: 'Plus Jakarta Sans',
    brandVoice: 'Professional and warm',
    tagline: 'Leading with excellence',
    missionStatement: 'Delivering exceptional value to every customer.',
  });
});

app.put('/api/brand-kit/:businessId', (req: Request, res: Response) => {
  const bId = req.params.businessId;
  db.brandKits[bId] = { ...db.brandKits[bId], ...req.body, businessId: bId };
  res.json(db.brandKits[bId]);
});

// ==========================================
// 20. PUBLIC WEBSITE CMS
// ==========================================
app.get('/api/public/cms', (_req: Request, res: Response) => {
  res.json(db.cmsContent);
});

// ==========================================
// 21. PLATFORM ADMINISTRATION (SEPARATE SYSTEM)
// ==========================================
app.get('/api/admin/overview', (_req: Request, res: Response) => {
  const totalBusinesses = db.businesses.length;
  let totalRev = 0;
  let totalOrdersCount = 0;
  let totalLeadsCount = 0;
  let totalMessagesCount = 0;

  for (const b of db.businesses) {
    const orders = db.orders[b.id] || [];
    const leads = db.leads[b.id] || [];
    const convs = db.conversations[b.id] || [];
    totalOrdersCount += orders.length;
    totalLeadsCount += leads.length;
    totalMessagesCount += convs.reduce((sum, c) => sum + (c.messagesCount || 0), 0);
    totalRev += orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  }

  const mrr = 18450 + totalBusinesses * 149;
  const arr = mrr * 12;

  res.json({
    totalBusinesses,
    activeSubscribers: totalBusinesses + 42,
    newBusinessesThisMonth: 14,
    mrr,
    arr,
    churnRate: 0.8,
    systemHealth: '100% Operational',
    aiRequests24h: 4280 + totalMessagesCount,
    geminiStatus: process.env.GEMINI_API_KEY ? 'Active (Gemini 2.5 Flash)' : 'Fallback Local Engine Active',
    platformOrders: totalOrdersCount + 48,
    platformRevenue: totalRev + 82400,
    businesses: db.businesses.map((b) => ({
      id: b.id,
      name: b.name,
      industry: b.industry,
      contactEmail: b.contactEmail,
      plan: 'growth',
      status: 'active',
      leads: db.leads[b.id]?.length || 0,
      orders: db.orders[b.id]?.length || 0,
      createdAt: b.createdAt,
    })),
    revenueHistory: [
      { month: 'Apr', mrr: 12200 },
      { month: 'May', mrr: 14100 },
      { month: 'Jun', mrr: 15800 },
      { month: 'Jul', mrr: 17200 },
      { month: 'Aug', mrr: 18400 },
      { month: 'Sep', mrr: mrr },
    ],
  });
});

app.get('/api/admin/businesses', (_req: Request, res: Response) => {
  res.json(
    db.businesses.map((b) => ({
      ...b,
      plan: 'growth',
      status: 'active',
      leadsCount: db.leads[b.id]?.length || 0,
      ordersCount: db.orders[b.id]?.length || 0,
      conversationsCount: db.conversations[b.id]?.length || 0,
    }))
  );
});

app.put('/api/admin/businesses/:id/plan', (req: Request, res: Response) => {
  res.json({ success: true, businessId: req.params.id, plan: req.body.plan });
});

app.put('/api/admin/businesses/:id/status', (req: Request, res: Response) => {
  res.json({ success: true, businessId: req.params.id, status: req.body.status });
});

app.get('/api/admin/plans', (_req: Request, res: Response) => {
  res.json(db.adminPlans);
});

app.put('/api/admin/plans', (req: Request, res: Response) => {
  if (Array.isArray(req.body)) {
    db.adminPlans = req.body;
  }
  res.json(db.adminPlans);
});

app.get('/api/admin/cms', (_req: Request, res: Response) => {
  res.json(db.cmsContent);
});

app.put('/api/admin/cms', (req: Request, res: Response) => {
  db.cmsContent = { ...db.cmsContent, ...req.body };
  res.json(db.cmsContent);
});

app.get('/api/admin/support', (_req: Request, res: Response) => {
  res.json(db.supportTickets);
});

app.post('/api/admin/support/:id/reply', (req: Request, res: Response) => {
  const ticket = db.supportTickets.find((t) => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  ticket.replies.push({
    sender: 'Platform SuperAdmin',
    isStaff: true,
    message: req.body.message || '',
    timestamp: new Date().toISOString(),
  });
  ticket.updatedAt = new Date().toISOString();
  res.json(ticket);
});

app.put('/api/admin/support/:id/status', (req: Request, res: Response) => {
  const ticket = db.supportTickets.find((t) => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  ticket.status = req.body.status;
  ticket.updatedAt = new Date().toISOString();
  res.json(ticket);
});

app.get('/api/admin/logs', (_req: Request, res: Response) => {
  res.json(db.systemLogs);
});

app.get('/api/admin/feature-flags', (_req: Request, res: Response) => {
  res.json(db.featureFlags);
});

app.put('/api/admin/feature-flags', (req: Request, res: Response) => {
  db.featureFlags = { ...db.featureFlags, ...req.body };
  res.json(db.featureFlags);
});

// Admin System Activities Stream
app.get('/api/admin/activities', (_req: Request, res: Response) => {
  res.json(db.systemActivities);
});

// Admin Gemini Engine & Intelligence Configuration
app.get('/api/admin/llm-config', (_req: Request, res: Response) => {
  res.json(db.llmConfig);
});

app.put('/api/admin/llm-config', (req: Request, res: Response) => {
  db.llmConfig = { ...db.llmConfig, ...req.body };
  db.logActivity(
    'business_status_changed',
    'platform_admin',
    'Platform SuperAdmin',
    `Gemini intelligence parameters updated (Default Model: ${db.llmConfig.defaultChatModel}, Temp: ${db.llmConfig.temperature}, Model Family: ${db.llmConfig.activeModelFamily || 'flash'}).`,
    'SuperAdmin'
  );
  res.json(db.llmConfig);
});

// Admin Add Multiple Gemini API Keys
app.post('/api/admin/llm-config/api-keys', (req: Request, res: Response) => {
  const key = (req.body.key || req.body.apiKey || '').trim();
  const label = req.body.label;
  if (!key || typeof key !== 'string') {
    return res.status(400).json({ error: 'Valid Gemini API key is required' });
  }
  try {
    const entry = db.addGeminiKey(key, label);
    res.status(201).json(entry);
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to add key' });
  }
});

app.delete('/api/admin/llm-config/api-keys/:id', (req: Request, res: Response) => {
  const removed = db.removeGeminiKey(req.params.id);
  if (!removed) return res.status(404).json({ error: 'API key not found' });
  res.json({ success: true, id: req.params.id });
});

app.post('/api/admin/llm-config/api-keys/:id/toggle', (req: Request, res: Response) => {
  const updated = db.toggleGeminiKey(req.params.id);
  if (!updated) return res.status(404).json({ error: 'API key not found' });
  res.json(updated);
});

// Admin Reset Gemini Engine
app.post('/api/admin/gemini/reset', async (_req: Request, res: Response) => {
  try {
    const result = await resetGeminiEngine();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || 'Failed to reset Gemini engine',
    });
  }
});

// Admin Gemini API Interactive Workbench & Test Runner
app.post('/api/admin/llm-test', async (req: Request, res: Response) => {
  const { prompt, model, systemInstruction, temperature, maxOutputTokens } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required for testing' });

  const result = await testGeminiPrompt({
    prompt,
    model,
    systemInstruction,
    temperature,
    maxOutputTokens,
  });

  db.logActivity(
    'gemini_called',
    'platform_admin',
    'Platform SuperAdmin',
    `Gemini API interactive test executed using ${result.modelUsed} (${result.promptTokens + result.responseTokens} tokens, ${result.latencyMs}ms).`,
    'SuperAdmin Workbench',
    { latencyMs: result.latencyMs, tokens: result.promptTokens + result.responseTokens }
  );

  res.json(result);
});

// Admin Payment Gateway Settings (Lemon Squeezy & Crypto preferred)
app.get('/api/admin/payment-gateways', (_req: Request, res: Response) => {
  res.json(db.paymentGateways);
});

app.put('/api/admin/payment-gateways', (req: Request, res: Response) => {
  db.paymentGateways = { ...db.paymentGateways, ...req.body };
  db.logActivity(
    'business_status_changed',
    'platform_admin',
    'Platform SuperAdmin',
    `Payment gateway configuration updated. Active default: ${db.paymentGateways.activeDefaultProvider}. Lemon Squeezy: ${db.paymentGateways.lemonSqueezy?.enabled ? 'ACTIVE' : 'INACTIVE'}, Crypto: ${db.paymentGateways.crypto?.enabled ? 'ACTIVE' : 'INACTIVE'}.`,
    'SuperAdmin'
  );
  res.json(db.paymentGateways);
});


// Official WhatsApp Webhook verification
app.get('/api/webhooks/whatsapp', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === 'operate_ai_secret_token') {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

app.post('/api/webhooks/whatsapp', (req: Request, res: Response) => {
  // Ingest incoming WhatsApp webhook
  res.json({ status: 'received' });
});

// Standalone embeddable Widget Script (/widget.js)
app.get('/widget.js', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
(function() {
  var scriptTag = document.currentScript;
  var businessId = (scriptTag && scriptTag.getAttribute('data-business-id')) || 'biz_aura_001';
  var host = window.location.origin;

  var container = document.createElement('div');
  container.id = 'operate-ai-widget-root';
  container.setAttribute('data-business-id', businessId);
  document.body.appendChild(container);

  var iframe = document.createElement('iframe');
  iframe.src = host + '/?widget_mode=true&business_id=' + encodeURIComponent(businessId);
  iframe.style.position = 'fixed';
  iframe.style.bottom = '20px';
  iframe.style.right = '20px';
  iframe.style.width = '420px';
  iframe.style.height = '620px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '16px';
  iframe.style.boxShadow = '0 20px 40px rgba(0,0,0,0.25)';
  iframe.style.zIndex = '999999';
  container.appendChild(iframe);
})();
  `);
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OperateAI Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
