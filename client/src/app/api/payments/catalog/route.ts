import { NextResponse } from 'next/server';
import { getServiceCatalog, getPaymentSettings } from '@/lib/paymentsDb';
import { getRazorpayCredentials } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const services = getServiceCatalog(false);
    const settings = getPaymentSettings();
    const { keyId, isLive } = getRazorpayCredentials();

    return NextResponse.json({
      success: true,
      services,
      settings: {
        tokenMoneyAmount: settings.tokenMoneyAmount,
        tokenOptionEnabled: settings.tokenOptionEnabled,
        domainRegistrationAmount: settings.domainRegistrationAmount,
        hostingAmount: settings.hostingAmount,
        additionalChargesAmount: settings.additionalChargesAmount,
        minCustomAmount: settings.minCustomAmount,
        maxCustomAmount: settings.maxCustomAmount,
        currency: settings.currency,
      },
      razorpayKeyId: keyId,
      isLive,
    });
  } catch (error: any) {
    console.error('Catalog fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Could not load service catalog' },
      { status: 500 }
    );
  }
}
