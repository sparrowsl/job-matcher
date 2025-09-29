import { extractSkillsFromCV } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { PDFParse } from 'pdf-parse';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';
    try {
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      extractedText = result.text;
    } catch (error) {
      console.error('Error parsing PDF:', error);
      return NextResponse.json(
        { error: 'Failed to parse PDF file' },
        { status: 500 }
      );
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF' },
        { status: 400 }
      );
    }

    // Extract skills using AI
    const skillsData = await extractSkillsFromCV(extractedText);

    // Create CV record
    const cv = await prisma.cV.create({
      data: {
        userId: userId || undefined,
        fullName: '', // Will be filled through conversation
        email: '', // Will be filled through conversation
        fileName: file.name,
        extractedText,
        skills: JSON.stringify(skillsData.skills || []),
        keywords: JSON.stringify(skillsData.keywords || []),
        aiSuggestions: JSON.stringify(skillsData.suggestedSkills || []),
        isComplete: false,
      },
    });

    return NextResponse.json({
      id: cv.id,
      fileName: cv.fileName,
      extractedText: cv.extractedText,
      skills: skillsData.skills,
      keywords: skillsData.keywords,
      suggestedSkills: skillsData.suggestedSkills,
    });
  } catch (error) {
    console.error('Error uploading CV:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
