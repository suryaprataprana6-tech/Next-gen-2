import { NextResponse } from 'next/server';
import {
  getPaymentByOrderId,
  markPaymentSuccessful,
  markPaymentFailed,
} from '@/lib/paymentsDb';
import { verifyWebhookSignature } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing webhook signature header' },
        { status: 400 }
      );
    }

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn('[Razorpay Webhook] Signature verification failed');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    console.log(`[Razorpay Webhook Event Received]: ${eventType}`);

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentPayload = event.payload?.payment?.entity;
      const orderId = paymentPayload?.order_id;
      const paymentId = paymentPayload?.id;

      if (orderId && paymentId) {
        const existing = getPaymentByOrderId(orderId);
        if (existing && existing.status !== 'successful') {
          markPaymentSuccessful(orderId, paymentId, `webhook_${signature.slice(0, 16)}`);
          console.log(`[Razorpay Webhook] Marked payment ${paymentId} as successful via webhook`);
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentPayload = event.payload?.payment?.entity;
      const orderId = paymentPayload?.order_id;
      const paymentId = paymentPayload?.id;
      const errorDesc = paymentPayload?.error_description || 'Payment failed at gateway';

      if (orderId) {
        markPaymentFailed(orderId, `Webhook reported failure: ${errorDesc}`, paymentId);
        console.log(`[Razorpay Webhook] Marked payment for order ${orderId} as failed`);
      }
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (err: any) {
    console.error('Webhook processing exception:', err);
    return NextResponse.json(
      { error: err.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

