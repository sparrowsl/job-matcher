import { analyzeCVQuality } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { cvId } = await req.json();

    if (!cvId) {
      return NextResponse.json({ error: 'CV ID is required' }, { status: 400 });
    }

    // Fetch CV with all relations
    const cv = await prisma.cV.findUnique({
      where: { id: cvId },
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

    // Prepare CV data for analysis
    const cvData = {
      fullName: cv.fullName,
      email: cv.email,
      phone: cv.phone || undefined,
      summary: cv.summary || undefined,
      experience: cv.experience.map((exp) => ({
        company: exp.company,
        position: exp.position,
        description: exp.description,
        achievements: exp.achievements ? JSON.parse(exp.achievements) : [],
      })),
      education: cv.education.map((edu) => ({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
      })),
      skills: cv.skills ? JSON.parse(cv.skills) : [],
      projects: cv.projects.map((proj) => ({
        name: proj.name,
        description: proj.description,
        technologies: proj.technologies ? JSON.parse(proj.technologies) : [],
      })),
    };

    // Analyze CV quality
    const analysis = await analyzeCVQuality(cvData);

    // Update CV with AI summary
    await prisma.cV.update({
      where: { id: cvId },
      data: {
        aiSummary: JSON.stringify(analysis),
      },
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing CV:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
