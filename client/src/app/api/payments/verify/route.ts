import { NextResponse } from 'next/server';
import {
  getPaymentByOrderId,
  markPaymentSuccessful,
  markPaymentFailed,
} from '@/lib/paymentsDb';
import {
  verifyRazorpaySignature,
  fetchRazorpayPayment,
} from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      isCancelled,
      cancelReason,
    } = body;

    if (!razorpay_order_id) {
      return NextResponse.json(
        { success: false, error: 'Missing gateway order ID.' },
        { status: 400 }
      );
    }

    const existingRecord = getPaymentByOrderId(razorpay_order_id);
    if (!existingRecord) {
      return NextResponse.json(
        { success: false, error: 'Payment transaction record not found.' },
        { status: 404 }
      );
    }

    // 1. Handle explicit checkout cancellation
    if (isCancelled) {
      const reason = cancelReason || 'Payment modal dismissed by user before completion';
      const updated = markPaymentFailed(razorpay_order_id, reason);
      return NextResponse.json({
        success: false,
        cancelled: true,
        payment: updated,
        message: 'Transaction cancelled by customer.',
      });
    }

    // 2. Validate mandatory signature parameters
    if (!razorpay_payment_id || !razorpay_signature) {
      markPaymentFailed(razorpay_order_id, 'Missing payment ID or signature during verification');
      return NextResponse.json(
        { success: false, error: 'Incomplete verification credentials from checkout gateway.' },
        { status: 400 }
      );
    }

    // 3. Prevent duplicate payment processing (Idempotency)
    if (
      existingRecord.status === 'successful' &&
      existingRecord.gatewayPaymentId === razorpay_payment_id
    ) {
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        payment: existingRecord,
        message: 'Payment has already been successfully verified and confirmed.',
      });
    }

    // 4. Verify Cryptographic HMAC SHA256 Signature
    const isSignatureValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isSignatureValid) {
      console.error(
        `[CRITICAL] Signature mismatch for Order: ${razorpay_order_id}, Payment: ${razorpay_payment_id}`
      );
      const failedRecord = markPaymentFailed(
        razorpay_order_id,
        'Cryptographic HMAC SHA256 signature verification mismatch',
        razorpay_payment_id
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Payment verification failed. Invalid gateway signature detected.',
          payment: failedRecord,
        },
        { status: 400 }
      );
    }

    // 5. Dual Verification: Verify with Razorpay Server API if network allows
    const gatewayPayment = await fetchRazorpayPayment(razorpay_payment_id);
    if (gatewayPayment.success && gatewayPayment.payment) {
      const { status: gatewayStatus, order_id: gatewayOrderId } = gatewayPayment.payment;

      if (gatewayOrderId !== razorpay_order_id) {
        console.error('[CRITICAL] Order ID mismatch between payload and gateway API response');
        markPaymentFailed(razorpay_order_id, 'Gateway Order ID cross-reference mismatch', razorpay_payment_id);
        return NextResponse.json(
          { success: false, error: 'Payment integrity check failed.' },
          { status: 400 }
        );
      }

      if (gatewayStatus !== 'captured' && gatewayStatus !== 'authorized') {
        markPaymentFailed(
          razorpay_order_id,
          `Gateway reported non-success payment state: ${gatewayStatus}`,
          razorpay_payment_id
        );
        return NextResponse.json(
          {
            success: false,
            error: `Gateway payment status is ${gatewayStatus}. Payment is not confirmed.`,
          },
          { status: 400 }
        );
      }
    }

    // 6. Signature & Gateway Verification passed: Mark record Successful
    const confirmedRecord = markPaymentSuccessful(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    return NextResponse.json({
      success: true,
      payment: confirmedRecord,
      message: 'Payment authenticated and confirmed successfully.',
    });
  } catch (err: any) {
    console.error('Payment verification error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server error verifying payment status.' },
      { status: 500 }
    );
  }
}
