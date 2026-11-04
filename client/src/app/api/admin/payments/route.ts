import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import {
  getPayments,
  getPaymentStats,
  markPaymentSuccessful,
  getPaymentById,
} from '@/lib/paymentsDb';
import { fetchRazorpayPayment } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const serviceFilter = searchParams.get('service') || 'all';
    const statusFilter = searchParams.get('status') || 'all';
    const paymentTypeFilter = searchParams.get('paymentType') || 'all';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    let payments = getPayments();

    if (search) {
      payments = payments.filter(
        (p) =>
          p.customerName.toLowerCase().includes(search) ||
          p.customerMobile.includes(search) ||
          p.customerEmail.toLowerCase().includes(search) ||
          p.id.toLowerCase().includes(search) ||
          p.receiptNumber.toLowerCase().includes(search) ||
          (p.businessName && p.businessName.toLowerCase().includes(search)) ||
          (p.purpose && p.purpose.toLowerCase().includes(search)) ||
          (p.projectReference && p.projectReference.toLowerCase().includes(search)) ||
          (p.gatewayPaymentId && p.gatewayPaymentId.toLowerCase().includes(search)) ||
          (p.gatewayOrderId && p.gatewayOrderId.toLowerCase().includes(search))
      );
    }

    if (serviceFilter !== 'all') {
      payments = payments.filter((p) => p.serviceId === serviceFilter || p.serviceName === serviceFilter);
    }

    if (statusFilter !== 'all') {
      payments = payments.filter((p) => p.status === statusFilter);
    }

    if (paymentTypeFilter !== 'all') {
      payments = payments.filter((p) => p.paymentType === paymentTypeFilter);
    }

    if (startDate) {
      const start = new Date(startDate).getTime();
      payments = payments.filter((p) => new Date(p.createdAt).getTime() >= start);
    }

    if (endDate) {
      const end = new Date(endDate).getTime() + 24 * 3600 * 1000;
      payments = payments.filter((p) => new Date(p.createdAt).getTime() <= end);
    }

    const stats = getPaymentStats();

    return NextResponse.json({
      success: true,
      payments,
      stats,
      totalCount: payments.length,
    });
  } catch (error: any) {
    console.error('Admin payments fetch error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Strict requirement: "Do not allow admins to manually mark a payment successful without verified gateway evidence."
export async function PATCH(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, action, verifiedGatewayPaymentId } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Transaction ID is required' }, { status: 400 });
    }

    const payment = getPaymentById(id);
    if (!payment) {
      return NextResponse.json({ success: false, message: 'Payment record not found' }, { status: 404 });
    }

    if (action === 'verify_with_evidence') {
      if (!verifiedGatewayPaymentId || !verifiedGatewayPaymentId.startsWith('pay_')) {
        return NextResponse.json(
          {
            success: false,
            message:
              'Security policy violation: Cannot manually confirm payment without a verified Razorpay payment ID (e.g. pay_...).',
          },
          { status: 400 }
        );
      }

      // Verify directly with Razorpay API before allowing confirmation
      const gatewayCheck = await fetchRazorpayPayment(verifiedGatewayPaymentId);
      if (!gatewayCheck.success || !gatewayCheck.payment) {
        return NextResponse.json(
          {
            success: false,
            message: `Gateway verification failed: Razorpay did not validate payment ID ${verifiedGatewayPaymentId}.`,
          },
          { status: 400 }
        );
      }

      const rzpPayment = gatewayCheck.payment;
      // Ensure payment is actually captured
      if (rzpPayment.status !== 'captured') {
        return NextResponse.json(
          {
            success: false,
            message: `Gateway status is "${rzpPayment.status}", not "captured". Payment cannot be marked successful.`,
          },
          { status: 400 }
        );
      }

      // Check amount match if possible
      const expectedPaise = Math.round(payment.amount * 100);
      if (rzpPayment.amount !== expectedPaise) {
        return NextResponse.json(
          {
            success: false,
            message: `Amount mismatch: Gateway records ₹${(rzpPayment.amount / 100).toLocaleString('en-IN')} vs order expected ₹${payment.amount.toLocaleString('en-IN')}.`,
          },
          { status: 400 }
        );
      }

      // Successfully verified with Razorpay API evidence
      const updated = markPaymentSuccessful(
        payment.gatewayOrderId,
        verifiedGatewayPaymentId,
        `admin_verified_via_${admin.email}`
      );

      return NextResponse.json({
        success: true,
        message: `Payment verified against live Razorpay gateway (${verifiedGatewayPaymentId}) and marked as successful.`,
        payment: updated,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Invalid administrative action requested.',
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Admin payment PATCH error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
