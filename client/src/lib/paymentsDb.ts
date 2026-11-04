import fs from 'fs';
import path from 'path';

export interface ServiceBreakdownItem {
  label: string;
  amount: number;
}

export type PaymentType = 'token' | 'full' | 'recurring' | 'custom';
export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'cancelled' | 'refunded';

export interface ServiceCategory {
  id: string;
  name: string;
  category: 'kickoff' | 'marketing' | 'development' | 'maintenance' | 'creative' | 'custom' | string;
  shortDescription: string;
  amount: number; // in INR
  currency: string;
  pricingType: 'fixed' | 'custom';
  paymentType: PaymentType;
  billingCycle: 'one-time' | 'monthly' | 'custom';
  breakdown?: ServiceBreakdownItem[];
  enabled: boolean;
  minAmount?: number;
  maxAmount?: number;
  badge?: string;
  iconName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentSettings {
  tokenMoneyAmount: number;
  tokenOptionEnabled: boolean;
  domainRegistrationAmount: number;
  hostingAmount: number;
  additionalChargesAmount: number;
  minCustomAmount: number;
  maxCustomAmount: number;
  currency: string;
  requireApprovalAbove?: number;
  updatedAt: string;
  updatedBy?: string;
}

export interface PricingAuditLog {
  id: string;
  timestamp: string;
  action: 'create_service' | 'update_service' | 'delete_service' | 'update_settings';
  serviceId?: string;
  serviceName?: string;
  changes: Record<string, any>;
  adminUser?: string;
}

export interface PaymentRecord {
  id: string; // e.g. NGD-PAY-1001
  receiptNumber: string;
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  businessName?: string;
  serviceId: string;
  serviceName: string;
  paymentType: PaymentType;
  projectDescription: string;
  purpose?: string;
  projectReference?: string;
  totalProjectAmount?: number; // total agreed project amount
  amount: number; // amount paid in this transaction in INR
  remainingBalance?: number; // remaining project balance when total is known
  currency: string;
  breakdown?: ServiceBreakdownItem[];
  gateway: 'razorpay';
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  status: PaymentStatus;
  statusReason?: string;
  paymentTimestamp?: string;
  createdAt: string;
  updatedAt: string;
}

const PRICING_FILE = path.join(process.cwd(), 'data', 'service_pricing.json');
const PAYMENTS_FILE = path.join(process.cwd(), 'data', 'payments.json');
const SETTINGS_FILE = path.join(process.cwd(), 'data', 'payment_settings.json');
const AUDIT_FILE = path.join(process.cwd(), 'data', 'pricing_audit.json');

// Default global payment configuration
export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  tokenMoneyAmount: 5000,
  tokenOptionEnabled: true,
  domainRegistrationAmount: 1500,
  hostingAmount: 2000,
  additionalChargesAmount: 0,
  minCustomAmount: 500,
  maxCustomAmount: 500000,
  currency: 'INR',
  requireApprovalAbove: 200000,
  updatedAt: new Date().toISOString(),
  updatedBy: 'System Default',
};

// Default verified service categories matching digital agency offerings
export const DEFAULT_SERVICES: ServiceCategory[] = [
  {
    id: 'token_money',
    name: 'Token Money',
    category: 'kickoff',
    shortDescription: 'Project initiation and kickoff deposit to lock your strategy calendar and start architecture design.',
    amount: 5000,
    currency: 'INR',
    pricingType: 'fixed',
    paymentType: 'token',
    billingCycle: 'one-time',
    enabled: true,
    badge: 'Kickoff',
    iconName: 'BadgeCheck',
  },
  {
    id: 'token_domain_hosting',
    name: 'Token Money + Domain & Hosting',
    category: 'kickoff',
    shortDescription: 'Advance deposit plus enterprise cloud hosting setup and primary commercial domain registration.',
    amount: 8500,
    currency: 'INR',
    pricingType: 'fixed',
    paymentType: 'token',
    billingCycle: 'one-time',
    breakdown: [
      { label: 'Project Kickoff Advance', amount: 5000 },
      { label: 'Domain Registration (1 Year)', amount: 1500 },
      { label: 'High-Speed Cloud Server Hosting (1 Year)', amount: 2000 },
    ],
    enabled: true,
    badge: 'Popular',
    iconName: 'Server',
  },
  {
    id: 'seo_services',
    name: 'SEO Services',
    category: 'marketing',
    shortDescription: 'Full-spectrum organic search optimization, technical auditing, keyword ranking, and local growth.',
    amount: 15000,
    currency: 'INR',
    pricingType: 'fixed',
    paymentType: 'recurring',
    billingCycle: 'monthly',
    enabled: true,
    iconName: 'Search',
  },
  {
    id: 'meta_ads',
    name: 'Meta Ads Setup',
    category: 'marketing',
    shortDescription: 'High-converting Facebook & Instagram campaign structuring, pixel tracking, and creative ad copy setup.',
    amount: 12000,
    currency: 'INR',
    pricingType: 'fixed',
    paymentType: 'full',
    billingCycle: 'one-time',
    enabled: true,
    iconName: 'Target',
  },
  {
    id: 'google_ads',
    name: 'Google Ads Setup',
    category: 'marketing',
    shortDescription: 'Intent-driven Google PPC search, call campaigns, negative keyword sculpting, and conversion API.',
    amount: 12000,
    currency: 'INR',
    pricingType: 'fixed',
    paymentType: 'full',
    billingCycle: 'one-time',
    enabled: true,
    iconName: 'TrendingUp',
  },
  {
    id: 'smm',
    name: 'Social Media Management',
    category: 'marketing',
    shortDescription: 'Brand narrative curation, aesthetic post graphics, reel syndication, and community engagement.',
    amount: 10000,
    currency: 'INR',
    pricingType: 'fixed',
    paymentType: 'recurring',
    billingCycle: 'monthly',
    enabled: true,
    iconName: 'Share2',
  },
  {
    id: 'web_dev',
    name: 'Website Development',
    category: 'development',
    shortDescription: 'Ultra-fast Next.js engineering, custom animations, responsive layouts, and conversion-focused pages.',
    amount: 25000,
    currency: 'INR',
    pricingType: 'fixed',
    paymentType: 'full',
    billingCycle: 'one-time',
    enabled: true,
    badge: 'Full Solution',
    iconName: 'Code',
  },
  {
    id: 'web_maintenance',
    name: 'Website Maintenance',
    category: 'maintenance',
    shortDescription: 'Monthly core updates, SSL security monitoring, CDN cache optimization, and routine content patches.',
    amount: 6000,
    currency: 'INR',
    pricingType: 'fixed',
    paymentType: 'recurring',
    billingCycle: 'monthly',
    enabled: true,
    iconName: 'ShieldCheck',
  },
  {
    id: 'graphic_design',
    name: 'Graphic Design',
    category: 'creative',
    shortDescription: 'Vector brand assets, marketing collaterals, social graphics, and pitch deck visual systems.',
    amount: 8000,
    currency: 'INR',
    pricingType: 'fixed',
    paymentType: 'full',
    billingCycle: 'one-time',
    enabled: true,
    iconName: 'Palette',
  },
  {
    id: 'custom_payment',
    name: 'Other Services / Custom Payment',
    category: 'custom',
    shortDescription: 'Milestone disbursements, custom scopes, enterprise retainer top-ups, or bespoke add-on services.',
    amount: 0,
    currency: 'INR',
    pricingType: 'custom',
    paymentType: 'custom',
    billingCycle: 'custom',
    minAmount: 500,
    maxAmount: 500000,
    enabled: true,
    badge: 'Flexible',
    iconName: 'CreditCard',
  },
];

// In-memory singletons for resilience across serverless invocations
let inMemoryServices: ServiceCategory[] = [...DEFAULT_SERVICES];
let inMemoryPayments: PaymentRecord[] = [];
let inMemorySettings: PaymentSettings = { ...DEFAULT_PAYMENT_SETTINGS };
let inMemoryAudit: PricingAuditLog[] = [];

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

function ensureSettingsFile() {
  try {
    ensureDirectoryExistence(SETTINGS_FILE);
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_PAYMENT_SETTINGS, null, 2), 'utf8');
      inMemorySettings = { ...DEFAULT_PAYMENT_SETTINGS };
    }
  } catch (e) {
    console.warn('Could not initialize payment_settings.json:', e);
  }
}

function ensurePricingFile() {
  try {
    ensureDirectoryExistence(PRICING_FILE);
    if (!fs.existsSync(PRICING_FILE)) {
      fs.writeFileSync(PRICING_FILE, JSON.stringify(DEFAULT_SERVICES, null, 2), 'utf8');
      inMemoryServices = [...DEFAULT_SERVICES];
    }
  } catch (e) {
    console.warn('Could not initialize service_pricing.json:', e);
  }
}

function ensurePaymentsFile() {
  try {
    ensureDirectoryExistence(PAYMENTS_FILE);
    if (!fs.existsSync(PAYMENTS_FILE)) {
      fs.writeFileSync(PAYMENTS_FILE, JSON.stringify([], null, 2), 'utf8');
    }
  } catch (e) {
    console.warn('Could not initialize payments.json:', e);
  }
}

function ensureAuditFile() {
  try {
    ensureDirectoryExistence(AUDIT_FILE);
    if (!fs.existsSync(AUDIT_FILE)) {
      fs.writeFileSync(AUDIT_FILE, JSON.stringify([], null, 2), 'utf8');
    }
  } catch (e) {
    console.warn('Could not initialize pricing_audit.json:', e);
  }
}

// ----------------------------------------------------
// PAYMENT SETTINGS ACCESSORS
// ----------------------------------------------------

export function getPaymentSettings(): PaymentSettings {
  ensureSettingsFile();
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed.tokenMoneyAmount === 'number') {
        inMemorySettings = { ...DEFAULT_PAYMENT_SETTINGS, ...parsed };
        return inMemorySettings;
      }
    }
  } catch (e) {
    console.warn('Using in-memory payment settings fallback:', e);
  }
  return inMemorySettings;
}

export function updatePaymentSettings(
  updates: Partial<PaymentSettings>,
  adminUser?: string
): PaymentSettings {
  const current = getPaymentSettings();
  const updated: PaymentSettings = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
    updatedBy: adminUser || current.updatedBy,
  };

  // Synchronize Token Money & Token + Domain & Hosting services with updated settings
  if (typeof updates.tokenMoneyAmount === 'number') {
    updateServicePricing('token_money', { amount: updates.tokenMoneyAmount }, false);
  }

  const tokenAmt = updated.tokenMoneyAmount;
  const domainAmt = updated.domainRegistrationAmount;
  const hostAmt = updated.hostingAmount;
  const addlAmt = updated.additionalChargesAmount || 0;
  const totalBundle = tokenAmt + domainAmt + hostAmt + addlAmt;

  const bundleBreakdown: ServiceBreakdownItem[] = [
    { label: 'Project Kickoff Advance', amount: tokenAmt },
    { label: 'Domain Registration (1 Year)', amount: domainAmt },
    { label: 'Cloud Server Hosting (1 Year)', amount: hostAmt },
  ];
  if (addlAmt > 0) {
    bundleBreakdown.push({ label: 'Additional Applicable Charges', amount: addlAmt });
  }

  updateServicePricing('token_domain_hosting', {
    amount: totalBundle,
    breakdown: bundleBreakdown,
  }, false);

  if (typeof updates.minCustomAmount === 'number' || typeof updates.maxCustomAmount === 'number') {
    updateServicePricing('custom_payment', {
      minAmount: updated.minCustomAmount,
      maxAmount: updated.maxCustomAmount,
    }, false);
  }

  inMemorySettings = updated;
  try {
    ensureSettingsFile();
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not persist payment settings to disk:', e);
  }

  logPricingAudit({
    action: 'update_settings',
    changes: updates,
    adminUser,
  });

  return updated;
}

// ----------------------------------------------------
// AUDIT LOGGING
// ----------------------------------------------------

export function logPricingAudit(log: Omit<PricingAuditLog, 'id' | 'timestamp'>): void {
  ensureAuditFile();
  try {
    let logs: PricingAuditLog[] = [];
    if (fs.existsSync(AUDIT_FILE)) {
      const content = fs.readFileSync(AUDIT_FILE, 'utf8');
      logs = JSON.parse(content);
      if (!Array.isArray(logs)) logs = [];
    }
    const newEntry: PricingAuditLog = {
      id: `AUDIT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...log,
    };
    logs.unshift(newEntry);
    if (logs.length > 100) logs = logs.slice(0, 100); // keep last 100 logs
    inMemoryAudit = logs;
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(logs, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not write pricing audit log:', e);
  }
}

export function getPricingAuditLogs(): PricingAuditLog[] {
  ensureAuditFile();
  try {
    if (fs.existsSync(AUDIT_FILE)) {
      const content = fs.readFileSync(AUDIT_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        inMemoryAudit = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Using in-memory audit log fallback:', e);
  }
  return inMemoryAudit;
}

// ----------------------------------------------------
// SERVICE PRICING ACCESSORS
// ----------------------------------------------------

export function getServiceCatalog(includeDisabled = false): ServiceCategory[] {
  ensurePricingFile();
  try {
    if (fs.existsSync(PRICING_FILE)) {
      const content = fs.readFileSync(PRICING_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryServices = parsed;
      }
    }
  } catch (e) {
    console.warn('Using in-memory service pricing fallback:', e);
  }

  if (includeDisabled) {
    return inMemoryServices;
  }
  return inMemoryServices.filter((s) => s.enabled);
}

export function getServiceById(id: string): ServiceCategory | undefined {
  const services = getServiceCatalog(true);
  return services.find((s) => s.id === id);
}

export function addService(
  newService: Omit<ServiceCategory, 'createdAt' | 'updatedAt'>,
  adminUser?: string
): ServiceCategory {
  const services = getServiceCatalog(true);
  
  // Normalize ID slug
  let slug = newService.id?.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_') || '';
  if (!slug) {
    slug = newService.name.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
  }

  // Ensure unique ID
  let finalId = slug;
  let counter = 1;
  while (services.some((s) => s.id === finalId)) {
    finalId = `${slug}_${counter++}`;
  }

  const created: ServiceCategory = {
    ...newService,
    id: finalId,
    currency: newService.currency || 'INR',
    category: newService.category || 'development',
    pricingType: newService.pricingType || 'fixed',
    paymentType: newService.paymentType || 'full',
    billingCycle: newService.billingCycle || 'one-time',
    enabled: typeof newService.enabled === 'boolean' ? newService.enabled : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  services.push(created);
  inMemoryServices = services;

  try {
    ensurePricingFile();
    fs.writeFileSync(PRICING_FILE, JSON.stringify(services, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not persist newly added service to disk:', e);
  }

  logPricingAudit({
    action: 'create_service',
    serviceId: created.id,
    serviceName: created.name,
    changes: created,
    adminUser,
  });

  return created;
}

export function deleteService(id: string, adminUser?: string): boolean {
  const services = getServiceCatalog(true);
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) return false;

  const removed = services.splice(index, 1)[0];
  inMemoryServices = services;

  try {
    ensurePricingFile();
    fs.writeFileSync(PRICING_FILE, JSON.stringify(services, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not persist service deletion to disk:', e);
  }

  logPricingAudit({
    action: 'delete_service',
    serviceId: removed.id,
    serviceName: removed.name,
    changes: { deleted: true },
    adminUser,
  });

  return true;
}

export function updateServicePricing(
  id: string,
  updates: Partial<ServiceCategory>,
  recordAudit = true,
  adminUser?: string
): ServiceCategory | null {
  const services = getServiceCatalog(true);
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) return null;

  services[index] = {
    ...services[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  inMemoryServices = services;
  try {
    ensurePricingFile();
    fs.writeFileSync(PRICING_FILE, JSON.stringify(services, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not persist updated service pricing to disk:', e);
  }

  if (recordAudit) {
    logPricingAudit({
      action: 'update_service',
      serviceId: services[index].id,
      serviceName: services[index].name,
      changes: updates,
      adminUser,
    });
  }

  return services[index];
}

// ----------------------------------------------------
// PAYMENT TRANSACTIONS ACCESSORS
// ----------------------------------------------------

export function getPayments(): PaymentRecord[] {
  ensurePaymentsFile();
  try {
    if (fs.existsSync(PAYMENTS_FILE)) {
      const content = fs.readFileSync(PAYMENTS_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryPayments = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Using in-memory payments fallback:', e);
  }
  return inMemoryPayments;
}

export function getPaymentById(id: string): PaymentRecord | undefined {
  const payments = getPayments();
  return payments.find((p) => p.id === id || p.receiptNumber === id);
}

export function getPaymentByOrderId(orderId: string): PaymentRecord | undefined {
  const payments = getPayments();
  return payments.find((p) => p.gatewayOrderId === orderId);
}

export function getPaymentByPaymentId(paymentId: string): PaymentRecord | undefined {
  const payments = getPayments();
  return payments.find((p) => p.gatewayPaymentId === paymentId);
}

export function createPaymentRecord(data: {
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  businessName?: string;
  serviceId: string;
  serviceName: string;
  paymentType?: PaymentType;
  projectDescription: string;
  purpose?: string;
  projectReference?: string;
  totalProjectAmount?: number;
  amount: number;
  currency?: string;
  breakdown?: ServiceBreakdownItem[];
  gatewayOrderId: string;
}): PaymentRecord {
  const payments = getPayments();
  const timestamp = Date.now();
  const count = payments.length + 1;

  // Calculate remaining balance if total project amount is specified
  let remainingBalance: number | undefined = undefined;
  if (typeof data.totalProjectAmount === 'number' && data.totalProjectAmount > data.amount) {
    remainingBalance = Math.round(data.totalProjectAmount - data.amount);
  }

  const newRecord: PaymentRecord = {
    id: `NGD-PAY-${timestamp.toString().slice(-6)}`,
    receiptNumber: `NGD-${new Date().getFullYear()}-${String(count).padStart(4, '0')}`,
    customerName: data.customerName.trim(),
    customerMobile: data.customerMobile.trim(),
    customerEmail: data.customerEmail.trim().toLowerCase(),
    businessName: data.businessName?.trim() || undefined,
    serviceId: data.serviceId,
    serviceName: data.serviceName,
    paymentType: data.paymentType || (data.serviceId.includes('token') ? 'token' : data.serviceId === 'custom_payment' ? 'custom' : 'full'),
    projectDescription: data.projectDescription.trim(),
    purpose: data.purpose?.trim() || undefined,
    projectReference: data.projectReference?.trim() || undefined,
    totalProjectAmount: data.totalProjectAmount,
    amount: data.amount,
    remainingBalance,
    currency: data.currency || 'INR',
    breakdown: data.breakdown,
    gateway: 'razorpay',
    gatewayOrderId: data.gatewayOrderId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  payments.unshift(newRecord);
  inMemoryPayments = payments;

  try {
    ensurePaymentsFile();
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not persist payment record to disk:', e);
  }

  return newRecord;
}

export function markPaymentSuccessful(
  orderId: string,
  paymentId: string,
  signature: string
): PaymentRecord | null {
  const payments = getPayments();
  const payment = payments.find((p) => p.gatewayOrderId === orderId);
  if (!payment) return null;

  payment.gatewayPaymentId = paymentId;
  payment.gatewaySignature = signature;
  payment.status = 'successful';
  payment.statusReason = 'Verified via Razorpay Cryptographic HMAC Signature';
  payment.paymentTimestamp = new Date().toISOString();
  payment.updatedAt = new Date().toISOString();

  inMemoryPayments = payments;
  try {
    ensurePaymentsFile();
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not persist successful payment update:', e);
  }

  return payment;
}

export function markPaymentFailed(
  orderId: string,
  reason: string,
  paymentId?: string
): PaymentRecord | null {
  const payments = getPayments();
  const payment = payments.find((p) => p.gatewayOrderId === orderId);
  if (!payment) return null;

  if (paymentId) payment.gatewayPaymentId = paymentId;
  payment.status = reason.toLowerCase().includes('cancel') ? 'cancelled' : 'failed';
  payment.statusReason = reason;
  payment.updatedAt = new Date().toISOString();

  inMemoryPayments = payments;
  try {
    ensurePaymentsFile();
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not persist failed payment update:', e);
  }

  return payment;
}

export function getPaymentStats() {
  const payments = getPayments();
  const stats = {
    totalRevenue: 0,
    successfulCount: 0,
    pendingCount: 0,
    failedCount: 0,
    cancelledCount: 0,
    refundedCount: 0,
    customPaymentsCount: 0,
    customPaymentsRevenue: 0,
    tokenPaymentsCount: 0,
    tokenPaymentsRevenue: 0,
    byService: {} as Record<string, { count: number; revenue: number }>,
    serviceWiseList: [] as Array<{ serviceName: string; count: number; revenue: number }>,
    recentTransactions: payments.slice(0, 10),
  };

  payments.forEach((p) => {
    if (p.status === 'successful') {
      stats.totalRevenue += p.amount;
      stats.successfulCount++;
      if (p.paymentType === 'custom' || p.serviceId === 'custom_payment') {
        stats.customPaymentsRevenue += p.amount;
      }
      if (p.paymentType === 'token' || p.serviceId.includes('token')) {
        stats.tokenPaymentsRevenue += p.amount;
      }
    } else if (p.status === 'pending') {
      stats.pendingCount++;
    } else if (p.status === 'failed') {
      stats.failedCount++;
    } else if (p.status === 'cancelled') {
      stats.cancelledCount++;
    } else if (p.status === 'refunded') {
      stats.refundedCount++;
    }

    if (p.paymentType === 'custom' || p.serviceId === 'custom_payment') {
      stats.customPaymentsCount++;
    }
    if (p.paymentType === 'token' || p.serviceId.includes('token')) {
      stats.tokenPaymentsCount++;
    }

    if (!stats.byService[p.serviceName]) {
      stats.byService[p.serviceName] = { count: 0, revenue: 0 };
    }
    stats.byService[p.serviceName].count++;
    if (p.status === 'successful') {
      stats.byService[p.serviceName].revenue += p.amount;
    }
  });

  stats.serviceWiseList = Object.entries(stats.byService).map(([name, data]) => ({
    serviceName: name,
    count: data.count,
    revenue: data.revenue,
  }));

  return stats;
}
