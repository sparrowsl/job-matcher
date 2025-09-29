import { NextRequest, NextResponse } from "next/server";
import { generateCoverLetter } from "@/lib/ai";
import { z } from "zod";

const coverLetterSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  jobDescription: z.string().min(10, "Job description must be at least 10 characters"),
  cvData: z.any(),
  tone: z.enum(["professional", "enthusiastic", "formal", "creative"]).default("professional"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod
    const validation = coverLetterSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.errors[0].message,
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { jobTitle, company, jobDescription, cvData, tone } = validation.data;

    // Generate cover letter using AI
    const coverLetter = await generateCoverLetter({
      jobTitle,
      company,
      jobDescription,
      cvData,
      tone,
    });

    return NextResponse.json({
      success: true,
      data: {
        coverLetter,
        metadata: {
          jobTitle,
          company,
          tone,
          generatedAt: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate cover letter. Please try again.",
      },
      { status: 500 }
    );
  }
}
