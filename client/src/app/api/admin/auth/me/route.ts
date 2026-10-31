import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin credentials required.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: admin,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to authenticate session.' },
      { status: 500 }
    );
  }
}

