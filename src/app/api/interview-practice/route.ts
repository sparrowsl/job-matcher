import { NextRequest, NextResponse } from "next/server";
import { generateInterviewQuestions } from "@/lib/ai";
import { z } from "zod";

const interviewPracticeSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  jobDescription: z.string().min(10, "Job description must be at least 10 characters"),
  cvData: z.any(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod
    const validation = interviewPracticeSchema.safeParse(body);

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

    const { jobTitle, company, jobDescription, cvData, difficulty } = validation.data;

    // Generate interview questions using AI
    const questions = await generateInterviewQuestions({
      jobTitle,
      company,
      jobDescription,
      cvData,
      difficulty,
    });

    return NextResponse.json({
      success: true,
      data: {
        questions,
        metadata: {
          jobTitle,
          company,
          difficulty,
          generatedAt: new Date().toISOString(),
          totalQuestions: questions.length,
        },
      },
    });
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate interview questions. Please try again.",
      },
      { status: 500 }
    );
  }
}
