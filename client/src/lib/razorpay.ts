import crypto from 'crypto';

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number; // in paise
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export interface RazorpayPaymentDetails {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string; // 'captured', 'authorized', 'failed'
  order_id: string;
  method: string;
  email: string;
  contact: string;
  error_code?: string;
  error_description?: string;
  created_at: number;
}

export function getRazorpayCredentials() {
  const rawKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || '';
  const rawKeySecret = process.env.RAZORPAY_KEY_SECRET || '';

  const keyId = rawKeyId.replace(/^["']|["']$/g, '').trim();
  const keySecret = rawKeySecret.replace(/^["']|["']$/g, '').trim();

  return {
    keyId: keyId || 'rzp_live_ThU0UZyphwy6r6',
    keySecret: keySecret || '3IRrlIR2in6I2GKxbI5yk6fc',
    isLive: (keyId || 'rzp_live_').startsWith('rzp_live_'),
  };
}

/**
 * Creates a Razorpay Order via Razorpay REST API
 */
export async function createRazorpayOrder(options: {
  amount: number; // in Rupees
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<{ success: boolean; order?: RazorpayOrderResponse; error?: string }> {
  const { keyId, keySecret } = getRazorpayCredentials();

  if (!keyId || !keySecret) {
    return { success: false, error: 'Razorpay credentials not configured.' };
  }

  const amountInPaise = Math.round(options.amount * 100);
  const payload = {
    amount: amountInPaise,
    currency: options.currency || 'INR',
    receipt: options.receipt,
    notes: options.notes || {},
    payment_capture: 1, // automatic capture
  };

  const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  try {
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.warn('[Razorpay API Error]:', data);
      return {
        success: false,
        error: data.error?.description || data.message || 'Failed to create Razorpay order',
      };
    }

    return {
      success: true,
      order: data as RazorpayOrderResponse,
    };
  } catch (err: any) {
    console.error('[Razorpay Network Error]:', err);
    return {
      success: false,
      error: err.message || 'Network error communicating with payment gateway.',
    };
  }
}

/**
 * Verifies Razorpay HMAC SHA256 Signature
 * signature = HMAC_SHA256(order_id + "|" + payment_id, secret)
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const { keySecret } = getRazorpayCredentials();
  if (!keySecret) return false;

  try {
    const text = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    return expectedSignature === signature;
  } catch (e) {
    console.error('Error verifying signature:', e);
    return false;
  }
}

/**
 * Fetches Payment verification status from Razorpay API
 */
export async function fetchRazorpayPayment(
  paymentId: string
): Promise<{ success: boolean; payment?: RazorpayPaymentDetails; error?: string }> {
  const { keyId, keySecret } = getRazorpayCredentials();
  const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  try {
    const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error?.description || 'Could not fetch payment details from gateway',
      };
    }

    return {
      success: true,
      payment: data as RazorpayPaymentDetails,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Gateway communication failure',
    };
  }
}

/**
 * Verifies Razorpay Webhook Signature
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'nextgen_rzp_webhook_secret_2026'
): boolean {
  if (!webhookSecret || !signature) return false;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    return expectedSignature === signature;
  } catch (e) {
    console.error('Error verifying webhook signature:', e);
    return false;
  }
}

