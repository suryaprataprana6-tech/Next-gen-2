import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import { getServiceCatalog, updateServicePricing } from '@/lib/paymentsDb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const services = getServiceCatalog(true); // include disabled
    return NextResponse.json({ success: true, services });
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
    const { id, amount, enabled, shortDescription, minAmount, breakdown } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Service ID is required' }, { status: 400 });
    }

    const updates: any = {};
    if (typeof amount === 'number' && amount >= 0) updates.amount = Math.round(amount);
    if (typeof enabled === 'boolean') updates.enabled = enabled;
    if (typeof shortDescription === 'string' && shortDescription.trim()) updates.shortDescription = shortDescription.trim();
    if (typeof minAmount === 'number' && minAmount >= 0) updates.minAmount = Math.round(minAmount);
    if (Array.isArray(breakdown)) updates.breakdown = breakdown;

    const updated = updateServicePricing(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Service category not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Pricing and settings for "${updated.name}" updated successfully.`,
      service: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
