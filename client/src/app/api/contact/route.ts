import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addLead } from '@/lib/db';

export const dynamic = 'force-dynamic';

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email().or(z.string().optional()),
  phone: z.string().min(8, "Phone number is required"),
  business: z.string().optional(),
  service: z.string().min(1, "Service selection is required"),
  budget: z.string().optional(),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Save lead securely into our persistent store
    const newLead = addLead({
      name: validatedData.name,
      email: validatedData.email || 'Not provided',
      phone: validatedData.phone,
      business: validatedData.business || '',
      service: validatedData.service,
      budget: validatedData.budget || 'Not specified',
      message: validatedData.message,
    });

    console.log("New Lead successfully logged into CRM:", newLead.id);

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry received and registered in NextGen CRM successfully.",
        leadId: newLead.id,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
