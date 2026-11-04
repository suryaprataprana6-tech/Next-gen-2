import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import { getPaymentSettings, updatePaymentSettings } from '@/lib/paymentsDb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const settings = getPaymentSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      tokenMoneyAmount,
      tokenOptionEnabled,
      domainRegistrationAmount,
      hostingAmount,
      additionalChargesAmount,
      minCustomAmount,
      maxCustomAmount,
    } = body;

    const updates: any = {};
    if (typeof tokenMoneyAmount === 'number' && tokenMoneyAmount >= 100) {
      updates.tokenMoneyAmount = Math.round(tokenMoneyAmount);
    }
    if (typeof tokenOptionEnabled === 'boolean') {
      updates.tokenOptionEnabled = tokenOptionEnabled;
    }
    if (typeof domainRegistrationAmount === 'number' && domainRegistrationAmount >= 0) {
      updates.domainRegistrationAmount = Math.round(domainRegistrationAmount);
    }
    if (typeof hostingAmount === 'number' && hostingAmount >= 0) {
      updates.hostingAmount = Math.round(hostingAmount);
    }
    if (typeof additionalChargesAmount === 'number' && additionalChargesAmount >= 0) {
      updates.additionalChargesAmount = Math.round(additionalChargesAmount);
    }
    if (typeof minCustomAmount === 'number' && minCustomAmount >= 100) {
      updates.minCustomAmount = Math.round(minCustomAmount);
    }
    if (typeof maxCustomAmount === 'number' && maxCustomAmount >= minCustomAmount) {
      updates.maxCustomAmount = Math.round(maxCustomAmount);
    }

    const updated = updatePaymentSettings(updates, admin.email);

    return NextResponse.json({
      success: true,
      message: 'Global payment and token settings saved successfully.',
      settings: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
