import fs from 'fs';
import path from 'path';

export interface ServiceBreakdownItem {
  label: string;
  amount: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  shortDescription: string;
  amount: number;
  currency: string;
  pricingType: 'fixed' | 'custom';
  billingCycle: 'one-time' | 'monthly' | 'custom';
  breakdown?: ServiceBreakdownItem[];
  enabled: boolean;
  minAmount?: number;
  badge?: string;
  iconName?: string;
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
  projectDescription: string;
  amount: number; // in INR
  currency: string;
  breakdown?: ServiceBreakdownItem[];
  gateway: 'razorpay';
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  status: 'pending' | 'successful' | 'failed' | 'cancelled';
  statusReason?: string;
  paymentTimestamp?: string;
  createdAt: string;
  updatedAt: string;
}

const PRICING_FILE = path.join(process.cwd(), 'data', 'service_pricing.json');
const PAYMENTS_FILE = path.join(process.cwd(), 'data', 'payments.json');

// Default verified service categories matching digital agency offerings
export const DEFAULT_SERVICES: ServiceCategory[] = [
  {
    id: 'token_money',
    name: 'Token Money',
    shortDescription: 'Project initiation and kickoff deposit to lock your strategy calendar and start architecture design.',
    amount: 5000,
    currency: 'INR',
    pricingType: 'fixed',
    billingCycle: 'one-time',
    enabled: true,
    badge: 'Kickoff',
    iconName: 'BadgeCheck',
  },
  {
    id: 'token_domain_hosting',
    name: 'Token Money + Domain & Hosting',
    shortDescription: 'Advance deposit plus enterprise cloud hosting setup and primary commercial domain registration.',
    amount: 8500,
    currency: 'INR',
    pricingType: 'fixed',
    billingCycle: 'one-time',
    breakdown: [
      { label: 'Project Kickoff Advance', amount: 5000 },
      { label: 'Domain & Cloud Server Setup (1 Year)', amount: 3500 },
    ],
    enabled: true,
    badge: 'Popular',
    iconName: 'Server',
  },
  {
    id: 'seo_services',
    name: 'SEO Services',
    shortDescription: 'Full-spectrum organic search optimization, technical auditing, keyword ranking, and local growth.',
    amount: 15000,
    currency: 'INR',
    pricingType: 'fixed',
    billingCycle: 'monthly',
    enabled: true,
    iconName: 'Search',
  },
  {
    id: 'meta_ads',
    name: 'Meta Ads Setup',
    shortDescription: 'High-converting Facebook & Instagram campaign structuring, pixel tracking, and creative ad copy setup.',
    amount: 12000,
    currency: 'INR',
    pricingType: 'fixed',
    billingCycle: 'one-time',
    enabled: true,
    iconName: 'Target',
  },
  {
    id: 'google_ads',
    name: 'Google Ads Setup',
    shortDescription: 'Intent-driven Google PPC search, call campaigns, negative keyword sculpting, and conversion API.',
    amount: 12000,
    currency: 'INR',
    pricingType: 'fixed',
    billingCycle: 'one-time',
    enabled: true,
    iconName: 'TrendingUp',
  },
  {
    id: 'smm',
    name: 'Social Media Management',
    shortDescription: 'Brand narrative curation, aesthetic post graphics, reel syndication, and community engagement.',
    amount: 10000,
    currency: 'INR',
    pricingType: 'fixed',
    billingCycle: 'monthly',
    enabled: true,
    iconName: 'Share2',
  },
  {
    id: 'web_dev',
    name: 'Website Development',
    shortDescription: 'Ultra-fast Next.js engineering, custom animations, responsive layouts, and conversion-focused pages.',
    amount: 25000,
    currency: 'INR',
    pricingType: 'fixed',
    billingCycle: 'one-time',
    enabled: true,
    badge: 'Full Solution',
    iconName: 'Code',
  },
  {
    id: 'web_maintenance',
    name: 'Website Maintenance',
    shortDescription: 'Monthly core updates, SSL security monitoring, CDN cache optimization, and routine content patches.',
    amount: 6000,
    currency: 'INR',
    pricingType: 'fixed',
    billingCycle: 'monthly',
    enabled: true,
    iconName: 'ShieldCheck',
  },
  {
    id: 'graphic_design',
    name: 'Graphic Design',
    shortDescription: 'Vector brand assets, marketing collaterals, social graphics, and pitch deck visual systems.',
    amount: 8000,
    currency: 'INR',
    pricingType: 'fixed',
    billingCycle: 'one-time',
    enabled: true,
    iconName: 'Palette',
  },
  {
    id: 'custom_payment',
    name: 'Other Services / Custom Payment',
    shortDescription: 'Milestone disbursements, custom scopes, enterprise retainer top-ups, or bespoke add-on services.',
    amount: 0,
    currency: 'INR',
    pricingType: 'custom',
    billingCycle: 'custom',
    minAmount: 500,
    enabled: true,
    badge: 'Flexible',
    iconName: 'CreditCard',
  },
];

// Seeded verified payment records for initial audit/dashboard demonstration
export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'NGD-PAY-1001',
    receiptNumber: 'NGD-2026-0891',
    customerName: 'Rahul Verma',
    customerMobile: '+91 98350 11223',
    customerEmail: 'rahul@vermasafaris.com',
    businessName: 'Verma Luxury Safaris',
    serviceId: 'token_domain_hosting',
    serviceName: 'Token Money + Domain & Hosting',
    projectDescription: 'Kickoff advance and fast cloud server setup for luxury safari booking portal.',
    amount: 8500,
    currency: 'INR',
    breakdown: [
      { label: 'Project Kickoff Advance', amount: 5000 },
      { label: 'Domain & Cloud Server Setup (1 Year)', amount: 3500 },
    ],
    gateway: 'razorpay',
    gatewayOrderId: 'order_PnK9X2026Rzp01',
    gatewayPaymentId: 'pay_PnK9X89201LveA',
    gatewaySignature: 'sig_verified_prod_01928374',
    status: 'successful',
    paymentTimestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
  {
    id: 'NGD-PAY-1002',
    receiptNumber: 'NGD-2026-0892',
    customerName: 'Dr. Ananya Sen',
    customerMobile: '+91 97712 44556',
    customerEmail: 'ananya.sen@apexclinics.in',
    businessName: 'Apex Super Speciality Clinic',
    serviceId: 'google_ads',
    serviceName: 'Google Ads Setup',
    projectDescription: 'High-intent PPC lead campaign setup for dental and cosmetic surgery consultations.',
    amount: 12000,
    currency: 'INR',
    gateway: 'razorpay',
    gatewayOrderId: 'order_QmL4B2026Rzp02',
    gatewayPaymentId: 'pay_QmL4B99182LveB',
    gatewaySignature: 'sig_verified_prod_02837465',
    status: 'successful',
    paymentTimestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
  },
  {
    id: 'NGD-PAY-1003',
    receiptNumber: 'NGD-2026-0893',
    customerName: 'Amit Patel',
    customerMobile: '+91 94311 88990',
    customerEmail: 'amit@skylinerealty.com',
    businessName: 'Skyline Realty Projects',
    serviceId: 'meta_ads',
    serviceName: 'Meta Ads Setup',
    projectDescription: 'Pre-launch campaign for luxury 3BHK residential inventory in NCR.',
    amount: 12000,
    currency: 'INR',
    gateway: 'razorpay',
    gatewayOrderId: 'order_RmN7C2026Rzp03',
    status: 'pending',
    statusReason: 'Checkout opened, awaiting authorization',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
];

let inMemoryServices: ServiceCategory[] = [...DEFAULT_SERVICES];
let inMemoryPayments: PaymentRecord[] = [...INITIAL_PAYMENTS];

function ensurePricingFile(): void {
  try {
    const dir = path.dirname(PRICING_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(PRICING_FILE)) {
      fs.writeFileSync(PRICING_FILE, JSON.stringify(DEFAULT_SERVICES, null, 2), 'utf8');
    }
  } catch (e) {}
}

function ensurePaymentsFile(): void {
  try {
    const dir = path.dirname(PAYMENTS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(PAYMENTS_FILE)) {
      fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(INITIAL_PAYMENTS, null, 2), 'utf8');
    }
  } catch (e) {}
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
    console.warn('Using in-memory services fallback:', e);
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

export function updateServicePricing(
  id: string,
  updates: Partial<Omit<ServiceCategory, 'id'>>
): ServiceCategory | null {
  const services = getServiceCatalog(true);
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) return null;

  services[index] = {
    ...services[index],
    ...updates,
  };

  inMemoryServices = services;
  try {
    ensurePricingFile();
    fs.writeFileSync(PRICING_FILE, JSON.stringify(services, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not persist updated service pricing to disk:', e);
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
  projectDescription: string;
  amount: number;
  currency?: string;
  breakdown?: ServiceBreakdownItem[];
  gatewayOrderId: string;
}): PaymentRecord {
  const payments = getPayments();
  const timestamp = Date.now();
  const count = payments.length + 1;
  const newRecord: PaymentRecord = {
    id: `NGD-PAY-${timestamp.toString().slice(-6)}`,
    receiptNumber: `NGD-${new Date().getFullYear()}-${String(count).padStart(4, '0')}`,
    customerName: data.customerName.trim(),
    customerMobile: data.customerMobile.trim(),
    customerEmail: data.customerEmail.trim().toLowerCase(),
    businessName: data.businessName?.trim() || undefined,
    serviceId: data.serviceId,
    serviceName: data.serviceName,
    projectDescription: data.projectDescription.trim(),
    amount: data.amount,
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
    byService: {} as Record<string, { count: number; revenue: number }>,
    recentTransactions: payments.slice(0, 10),
  };

  payments.forEach((p) => {
    if (p.status === 'successful') {
      stats.totalRevenue += p.amount;
      stats.successfulCount++;
    } else if (p.status === 'pending') {
      stats.pendingCount++;
    } else if (p.status === 'failed') {
      stats.failedCount++;
    } else if (p.status === 'cancelled') {
      stats.cancelledCount++;
    }

    if (!stats.byService[p.serviceName]) {
      stats.byService[p.serviceName] = { count: 0, revenue: 0 };
    }
    stats.byService[p.serviceName].count++;
    if (p.status === 'successful') {
      stats.byService[p.serviceName].revenue += p.amount;
    }
  });

  return stats;
}
