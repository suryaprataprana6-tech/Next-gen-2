import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Mock AI Assistant Response generator
    const reply = `Thank you for asking about "${message}". Surya specializes in Next.js 15 App Router applications, custom CRMs, technical SEO, and AI automation. Feel free to book a 1-on-1 consultation or submit a direct proposal!`;

    return NextResponse.json({ success: true, reply }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error processing AI chat request" },
      { status: 500 }
    );
  }
}
