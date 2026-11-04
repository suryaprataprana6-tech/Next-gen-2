import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServiceById, createPaymentRecord, getPaymentSettings } from '@/lib/paymentsDb';
import { createRazorpayOrder, getRazorpayCredentials } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

const CreateOrderSchema = z.object({
  serviceId: z.string().min(1, 'Service ID is required'),
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  customerEmail: z.string().email('Invalid email address'),
  customerMobile: z.string().min(10, 'Valid 10-digit mobile number required').max(15),
  businessName: z.string().max(120).optional().or(z.literal('')),
  projectDescription: z.string().min(5, 'Project description or purpose is required').max(1000),
  customAmount: z.number().optional(),
  totalProjectAmount: z.number().positive().optional(),
  purpose: z.string().max(250).optional(),
  projectReference: z.string().max(100).optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = CreateOrderSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      serviceId,
      customerName,
      customerEmail,
      customerMobile,
      businessName,
      projectDescription,
      customAmount,
      totalProjectAmount,
      purpose,
      projectReference,
    } = result.data;

    const settings = getPaymentSettings();

    // 1. Validate service from database catalog
    const service = getServiceById(serviceId);
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Selected service does not exist in our catalog.' },
        { status: 404 }
      );
    }

    if (!service.enabled) {
      return NextResponse.json(
        { success: false, error: 'This service is currently unavailable for online booking.' },
        { status: 400 }
      );
    }

    // 2. Determine and validate amount on SERVER (DO NOT TRUST CLIENT)
    let finalAmount = 0;
    if (service.pricingType === 'fixed') {
      finalAmount = service.amount;
    } else if (service.pricingType === 'custom') {
      const minAllowed = service.minAmount || settings.minCustomAmount || 500;
      const maxAllowed = service.maxAmount || settings.maxCustomAmount || 500000;

      if (!customAmount || typeof customAmount !== 'number' || isNaN(customAmount)) {
        return NextResponse.json(
          { success: false, error: 'Please enter a valid numeric payment amount.' },
          { status: 400 }
        );
      }

      if (customAmount < minAllowed) {
        return NextResponse.json(
          {
            success: false,
            error: `Custom payment amount must be at least ₹${minAllowed.toLocaleString('en-IN')}`,
          },
          { status: 400 }
        );
      }

      if (customAmount > maxAllowed) {
        return NextResponse.json(
          {
            success: false,
            error: `Payment amount exceeds the maximum allowable threshold of ₹${maxAllowed.toLocaleString('en-IN')}. For larger enterprise contracts, please request an approved invoice link.`,
          },
          { status: 400 }
        );
      }

      finalAmount = Math.round(customAmount);
    }

    if (finalAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Calculated payment amount must be greater than zero.' },
        { status: 400 }
      );
    }

    const receiptPrefix = `ngd_${Date.now().toString().slice(-6)}`;

    // 3. Create Order on Razorpay
    const orderResult = await createRazorpayOrder({
      amount: finalAmount,
      currency: 'INR',
      receipt: receiptPrefix,
      notes: {
        service_id: service.id,
        service_name: service.name,
        payment_type: service.paymentType,
        customer_name: customerName,
        customer_mobile: customerMobile,
        customer_email: customerEmail,
        business_name: businessName || 'N/A',
        purpose: purpose || projectDescription.slice(0, 100),
        project_reference: projectReference || 'N/A',
      },
    });

    if (!orderResult.success || !orderResult.order) {
      console.error('[Razorpay Order Creation Failed]:', orderResult.error);
      return NextResponse.json(
        {
          success: false,
          error: orderResult.error || 'Unable to initiate order with payment gateway.',
        },
        { status: 502 }
      );
    }

    // 4. Create pending transaction in database
    const paymentRecord = createPaymentRecord({
      customerName,
      customerMobile,
      customerEmail,
      businessName,
      serviceId: service.id,
      serviceName: service.name,
      paymentType: service.paymentType,
      projectDescription,
      purpose: purpose || (service.pricingType === 'custom' ? projectDescription : undefined),
      projectReference,
      totalProjectAmount,
      amount: finalAmount,
      currency: 'INR',
      breakdown: service.breakdown,
      gatewayOrderId: orderResult.order.id,
    });

    const { keyId } = getRazorpayCredentials();

    return NextResponse.json({
      success: true,
      orderId: orderResult.order.id,
      amount: finalAmount,
      amountInPaise: orderResult.order.amount,
      currency: 'INR',
      keyId,
      paymentRecordId: paymentRecord.id,
      receiptNumber: paymentRecord.receiptNumber,
      service: {
        id: service.id,
        name: service.name,
        category: service.category,
        paymentType: service.paymentType,
        breakdown: service.breakdown,
      },
      customer: {
        name: customerName,
        email: customerEmail,
        mobile: customerMobile,
      },
      totalProjectAmount: paymentRecord.totalProjectAmount,
      remainingBalance: paymentRecord.remainingBalance,
    });
  } catch (err: any) {
    console.error('Create order unhandled error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error while processing order.' },
      { status: 500 }
    );
  }
}
