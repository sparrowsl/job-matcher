import { prisma } from '@/lib/prisma';
import { CVPDFTemplate } from '@/lib/cv-pdf-template';
import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch CV with all relations
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

    // Prepare CV data for PDF
    const cvData = {
      fullName: cv.fullName,
      email: cv.email,
      phone: cv.phone || undefined,
      location: cv.location || undefined,
      title: cv.title || undefined,
      summary: cv.summary || undefined,
      skills: cv.skills ? JSON.parse(cv.skills) : [],
      experience: cv.experience,
      education: cv.education,
      projects: cv.projects,
      certifications: cv.certifications,
    };

    // Generate PDF
    const stream = await renderToStream(<CVPDFTemplate data={cvData} />);

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    // Return PDF as download
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cv.fullName.replace(/\s+/g, '_')}_CV.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
