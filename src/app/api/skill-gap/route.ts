import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { model } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const skillGapSchema = z.object({
  cvData: z.any(),
  targetJobIds: z.array(z.string()).optional(),
  targetSkills: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = skillGapSchema.safeParse(body);

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

    const { cvData, targetJobIds, targetSkills } = validation.data;

    // Get target jobs if job IDs provided
    let jobSkills: string[] = [];
    if (targetJobIds && targetJobIds.length > 0) {
      const jobs = await prisma.job.findMany({
        where: {
          id: {
            in: targetJobIds,
          },
        },
        select: {
          skills: true,
        },
      });

      jobSkills = jobs.flatMap((job) => JSON.parse(job.skills));
    }

    // Combine target skills
    const allTargetSkills = [...new Set([...jobSkills, ...(targetSkills || [])])];

    // Analyze skill gap using AI
    const { text } = await generateText({
      model,
      messages: [
        {
          role: "system",
          content: `You are an expert career coach and skills development advisor. Analyze the candidate's CV and provide a comprehensive skill gap analysis.

          Your response should be a JSON object with the following structure:
          {
            "currentSkills": ["list of skills the candidate currently has"],
            "missingSkills": ["list of skills they need to develop"],
            "skillGaps": [
              {
                "skill": "skill name",
                "importance": "high/medium/low",
                "currentLevel": "none/beginner/intermediate/advanced",
                "targetLevel": "beginner/intermediate/advanced/expert",
                "learningResources": ["suggested resources"],
                "estimatedTime": "time to learn",
                "priority": number (1-10)
              }
            ],
            "recommendations": [
              {
                "category": "category name",
                "suggestion": "specific recommendation",
                "impact": "high/medium/low"
              }
            ],
            "careerPath": "suggested career development path"
          }`,
        },
        {
          role: "user",
          content: `Analyze the skill gap for this candidate:

          CV Data:
          ${JSON.stringify(cvData, null, 2)}

          Target Skills Needed:
          ${allTargetSkills.join(", ")}

          Provide a detailed skill gap analysis with actionable recommendations.`,
        },
      ],
    });

    const analysis = JSON.parse(text);

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        targetSkills: allTargetSkills,
        analyzedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error analyzing skill gap:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze skill gap. Please try again.",
      },
      { status: 500 }
    );
  }
}
