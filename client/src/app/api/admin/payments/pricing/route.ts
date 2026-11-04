import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import {
  getServiceCatalog,
  updateServicePricing,
  addService,
  deleteService,
  getPaymentSettings,
  getPricingAuditLogs,
} from '@/lib/paymentsDb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const services = getServiceCatalog(true); // include disabled
    const settings = getPaymentSettings();
    const auditLogs = getPricingAuditLogs();

    return NextResponse.json({
      success: true,
      services,
      settings,
      auditLogs,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Update existing service
export async function PUT(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      name,
      category,
      amount,
      enabled,
      shortDescription,
      paymentType,
      billingCycle,
      minAmount,
      maxAmount,
      badge,
      breakdown,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Service ID is required' }, { status: 400 });
    }

    const updates: any = {};
    if (typeof name === 'string' && name.trim()) updates.name = name.trim();
    if (typeof category === 'string' && category.trim()) updates.category = category.trim();
    if (typeof amount === 'number' && amount >= 0) updates.amount = Math.round(amount);
    if (typeof enabled === 'boolean') updates.enabled = enabled;
    if (typeof shortDescription === 'string' && shortDescription.trim()) updates.shortDescription = shortDescription.trim();
    if (typeof paymentType === 'string') updates.paymentType = paymentType;
    if (typeof billingCycle === 'string') updates.billingCycle = billingCycle;
    if (typeof minAmount === 'number' && minAmount >= 0) updates.minAmount = Math.round(minAmount);
    if (typeof maxAmount === 'number' && maxAmount >= 0) updates.maxAmount = Math.round(maxAmount);
    if (typeof badge === 'string') updates.badge = badge.trim();
    if (Array.isArray(breakdown)) updates.breakdown = breakdown;

    const updated = updateServicePricing(id, updates, true, admin.email);
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

// Add brand new service
export async function POST(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      name,
      category,
      shortDescription,
      amount,
      pricingType,
      paymentType,
      billingCycle,
      enabled,
      badge,
      breakdown,
      minAmount,
      maxAmount,
      iconName,
    } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ success: false, message: 'Service name is required' }, { status: 400 });
    }

    if (!shortDescription || typeof shortDescription !== 'string') {
      return NextResponse.json({ success: false, message: 'Service description is required' }, { status: 400 });
    }

    const created = addService(
      {
        id,
        name: name.trim(),
        category: category || 'development',
        shortDescription: shortDescription.trim(),
        amount: typeof amount === 'number' && amount >= 0 ? Math.round(amount) : 0,
        currency: 'INR',
        pricingType: pricingType || (amount === 0 ? 'custom' : 'fixed'),
        paymentType: paymentType || 'full',
        billingCycle: billingCycle || 'one-time',
        enabled: typeof enabled === 'boolean' ? enabled : true,
        badge: badge?.trim() || undefined,
        iconName: iconName || 'Code',
        breakdown: Array.isArray(breakdown) ? breakdown : undefined,
        minAmount: typeof minAmount === 'number' ? minAmount : undefined,
        maxAmount: typeof maxAmount === 'number' ? maxAmount : undefined,
      },
      admin.email
    );

    return NextResponse.json({
      success: true,
      message: `New service "${created.name}" created and added to live catalog.`,
      service: created,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Delete service
export async function DELETE(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Service ID is required' }, { status: 400 });
    }

    const success = deleteService(id, admin.email);
    if (!success) {
      return NextResponse.json({ success: false, message: 'Service not found or could not be removed' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Service ID "${id}" has been removed from catalog.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
