import { NextResponse } from 'next/server';
import { validateAdminCredentials, createAdminToken } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const admin = validateAdminCredentials(email, password);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. Access restricted to authorized personnel.' },
        { status: 401 }
      );
    }

    // Create 7-day JWT token
    const token = createAdminToken(admin);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Authentication successful. Welcome, Surya.',
        user: admin,
        token,
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set('nextgen_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal authentication error.' },
      { status: 500 }
    );
  }
}

