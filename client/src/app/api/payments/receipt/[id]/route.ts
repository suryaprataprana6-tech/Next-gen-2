import { NextResponse } from 'next/server';
import { getPaymentById, getPaymentByOrderId } from '@/lib/paymentsDb';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Transaction ID required' }, { status: 400 });
    }

    let payment = getPaymentById(id);
    if (!payment) {
      payment = getPaymentByOrderId(id);
    }

    if (!payment) {
      return NextResponse.json({ success: false, error: 'Payment receipt not found' }, { status: 404 });
    }

    // Return sanitized public receipt
    return NextResponse.json({
      success: true,
      receipt: {
        id: payment.id,
        receiptNumber: payment.receiptNumber,
        customerName: payment.customerName,
        customerEmail: payment.customerEmail,
        customerMobile: payment.customerMobile,
        businessName: payment.businessName,
        serviceId: payment.serviceId,
        serviceName: payment.serviceName,
        projectDescription: payment.projectDescription,
        amount: payment.amount,
        currency: payment.currency,
        breakdown: payment.breakdown,
        gatewayPaymentId: payment.gatewayPaymentId,
        gatewayOrderId: payment.gatewayOrderId,
        status: payment.status,
        statusReason: payment.statusReason,
        paymentTimestamp: payment.paymentTimestamp,
        createdAt: payment.createdAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
