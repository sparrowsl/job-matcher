import { extractSkillsFromCV } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { type NextRequest, NextResponse } from "next/server";
import { PDFParse } from 'pdf-parse';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("cv") as File;
		const userId = formData.get('userId') as string | null;

		if (!file) {
			return NextResponse.json(
				{
					success: false,
					error: "No CV file provided",
				},
				{ status: 400 },
			);
		}

		// Validate file type
		if (file.type !== "application/pdf") {
			return NextResponse.json(
				{
					success: false,
					error: "Only PDF files are supported. Please upload a PDF version of your CV.",
				},
				{ status: 400 },
			);
		}

		// Validate file size
		if (file.size > MAX_FILE_SIZE) {
			return NextResponse.json(
				{
					success: false,
					error: "File size must be less than 10MB. Please compress your PDF or reduce the number of pages.",
				},
				{ status: 400 },
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
				{
					success: false,
					error: 'Failed to parse PDF file',
				},
				{ status: 500 },
			);
		}

		if (!extractedText || extractedText.trim().length === 0) {
			return NextResponse.json(
				{
					success: false,
					error: 'Could not extract text from PDF. Ensure it contains selectable text (not only scans).',
				},
				{ status: 400 },
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
			success: true,
			message: "PDF processed successfully",
			data: {
				id: cv.id,
				fileName: cv.fileName,
				extractedText: cv.extractedText,
				skills: skillsData.skills,
				keywords: skillsData.keywords,
				suggestedSkills: skillsData.suggestedSkills,
			},
		});
	} catch (error) {
		console.error("Error processing CV:", error);

		// Handle specific error types
		if (error instanceof Error) {
			if (error.message.includes("Failed to extract text")) {
				return NextResponse.json(
					{
						success: false,
						error: "Unable to extract text from PDF. Please ensure the PDF is not corrupted and contains readable text (not just images).",
					},
					{ status: 400 },
				);
			}

			if (error.message.includes("File too large")) {
				return NextResponse.json(
					{
						success: false,
						error: "File is too large for processing. Please reduce the file size or number of pages.",
					},
					{ status: 400 },
				);
			}

			if (error.message.includes("Network")) {
				return NextResponse.json(
					{
						success: false,
						error: "Network error occurred while processing CV. Please check your internet connection and try again.",
					},
					{ status: 503 },
				);
			}
		}

		// Generic error response
		return NextResponse.json(
			{
				success: false,
				error: "Failed to process CV. Please try again with a different PDF file.",
			},
			{ status: 500 },
		);
	}
}

export async function GET() {
	return NextResponse.json(
		{
			success: false,
			error: "Method not allowed. Use POST to upload CV.",
			info: {
				method: "POST",
				contentType: "multipart/form-data",
				field: "cv",
				allowedTypes: ["application/pdf"],
				maxSize: "10MB",
				features: [
					"AI-powered text extraction using pdf-parse",
					"Automatic skill detection and keyword extraction using OpenAI",
					"Experience and education parsing",
					"Job matching with compatibility scores",
					"Support for multi-page PDFs",
				],
			},
		},
		{ status: 405 },
	);
}
