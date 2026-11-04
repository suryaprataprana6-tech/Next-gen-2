import { NextResponse } from 'next/server';
import { getServiceCatalog } from '@/lib/paymentsDb';
import { getRazorpayCredentials } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const services = getServiceCatalog(false);
    const { keyId, isLive } = getRazorpayCredentials();

    return NextResponse.json({
      success: true,
      services,
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
