import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    const education = await prisma.education.create({
      data: {
        cvId: params.id,
        institution: data.institution,
        degree: data.degree,
        field: data.field,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        current: data.current || false,
        description: data.description,
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error('Error creating education:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
