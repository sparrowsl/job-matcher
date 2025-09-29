import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cv = await prisma.cV.findUnique({
      where: { id: params.id },
      include: {
        education: true,
        experience: true,
        projects: true,
        certifications: true,
      },
    });

    if (!cv) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...cv,
      skills: cv.skills ? JSON.parse(cv.skills) : [],
      keywords: cv.keywords ? JSON.parse(cv.keywords) : [],
      aiSuggestions: cv.aiSuggestions ? JSON.parse(cv.aiSuggestions) : [],
      aiSummary: cv.aiSummary ? JSON.parse(cv.aiSummary) : null,
    });
  } catch (error) {
    console.error('Error fetching CV:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    // Prepare update data
    const updateData: any = {};

    // Basic fields
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.summary !== undefined) updateData.summary = data.summary;
    if (data.yearsExperience !== undefined)
      updateData.yearsExperience = data.yearsExperience;
    if (data.isComplete !== undefined) updateData.isComplete = data.isComplete;

    // JSON fields
    if (data.skills !== undefined)
      updateData.skills = JSON.stringify(data.skills);
    if (data.keywords !== undefined)
      updateData.keywords = JSON.stringify(data.keywords);

    const cv = await prisma.cV.update({
      where: { id: params.id },
      data: updateData,
      include: {
        education: true,
        experience: true,
        projects: true,
        certifications: true,
      },
    });

    return NextResponse.json({
      ...cv,
      skills: cv.skills ? JSON.parse(cv.skills) : [],
      keywords: cv.keywords ? JSON.parse(cv.keywords) : [],
    });
  } catch (error) {
    console.error('Error updating CV:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.cV.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting CV:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
