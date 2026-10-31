import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import { getLeads, getLeadStats, updateLeadStatus, deleteLead } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const leads = getLeads();
  const stats = getLeadStats();

  return NextResponse.json({
    success: true,
    leads,
    stats,
  });
}

export async function PATCH(request: Request) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();
    if (!id || !['pending', 'contacted', 'closed'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid lead ID or status' }, { status: 400 });
    }

    const updated = updateLeadStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Lead status updated to ${status}` });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error updating lead' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, confirm } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, message: 'Lead ID is required' }, { status: 400 });
    }

    if (!confirm) {
      return NextResponse.json({
        success: false,
        message: 'Destructive action blocked. Confirmation required.',
      }, { status: 400 });
    }

    const deleted = deleteLead(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Lead ${id} has been permanently deleted` });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error deleting lead' }, { status: 500 });
  }
}

