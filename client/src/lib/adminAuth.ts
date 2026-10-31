import crypto from 'crypto';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin';
}

const JWT_SECRET = process.env.JWT_SECRET || 'd4ddc0eabab15b9ffe82ca2e8fb2b939118b3a26376d5fa6d25981c890170afc';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@nextgendigital.com').toLowerCase();
const ADMIN_SECONDARY_EMAIL = 'suryaprataprana6@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'NextGen#Surya_Jarvis$2026';

// Base64Url encoding/decoding
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

// Sign JWT token using HMAC-SHA256
export function createAdminToken(user: AdminUser, expiresInSeconds = 7 * 24 * 3600): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    ...user,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${data}.${signature}`;
}

// Verify JWT token
export function verifyAdminTokenString(token: string): AdminUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const data = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(data)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
  } catch (e) {
    return null;
  }
}

// Extract and verify token from Request (headers or cookies)
export function verifyAdminToken(request: Request): AdminUser | null {
  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const user = verifyAdminTokenString(token);
    if (user) return user;
  }

  // 2. Check Cookie header
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map((c) => c.trim());
    for (const c of cookies) {
      if (c.startsWith('nextgen_admin_token=')) {
        const token = c.substring('nextgen_admin_token='.length);
        const user = verifyAdminTokenString(token);
        if (user) return user;
      }
    }
  }

  return null;
}

// Validate credentials
export function validateAdminCredentials(email: string, password: string): AdminUser | null {
  const normalizedEmail = email.trim().toLowerCase();
  
  const isMatch =
    (normalizedEmail === ADMIN_EMAIL || normalizedEmail === ADMIN_SECONDARY_EMAIL) &&
    (password === ADMIN_PASSWORD || password === 'NextGen#Surya_Jarvis$2026' || password === 'NextGen#Surya_Jarvis');

  if (isMatch) {
    return {
      id: 'admin-001',
      name: 'Surya Pratap Rana',
      email: normalizedEmail,
      role: 'Super Admin',
    };
  }

  return null;
}

