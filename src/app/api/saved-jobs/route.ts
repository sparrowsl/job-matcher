import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const getSavedJobsSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

const saveJobSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  jobId: z.string().min(1, "Job ID is required"),
});

const unsaveJobSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  jobId: z.string().min(1, "Job ID is required"),
});

// GET - Get all saved jobs for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    // Validate query params
    const validation = getSavedJobsSchema.safeParse({ userId });

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

    const { userId: validatedUserId } = validation.data;

    const savedJobs = await prisma.savedJob.findMany({
      where: { userId: validatedUserId },
      include: {
        job: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }) as Array<Prisma.SavedJobGetPayload<{ include: { job: true } }>>;

    // Transform the data to include job details and saved job metadata
    const transformedJobs = savedJobs.map((savedJob) => ({
      savedJobId: savedJob.id,
      job: {
        id: savedJob.job.id,
        title: savedJob.job.title,
        company: savedJob.job.company,
        location: savedJob.job.location,
        description: savedJob.job.description,
        requirements: JSON.parse(savedJob.job.requirements),
        skills: JSON.parse(savedJob.job.skills),
        salary: savedJob.job.salaryMin || savedJob.job.salaryMax
          ? {
              min: savedJob.job.salaryMin || undefined,
              max: savedJob.job.salaryMax || undefined,
              currency: savedJob.job.salaryCurrency,
            }
          : undefined,
        type: savedJob.job.type as "full-time" | "part-time" | "contract" | "internship",
        remote: savedJob.job.remote,
        postedDate: savedJob.job.postedDate,
        applicationUrl: savedJob.job.applicationUrl,
        source: savedJob.job.source,
      },
      applied: savedJob.applied,
      appliedAt: savedJob.appliedAt,
      notes: savedJob.notes,
      savedAt: savedJob.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: transformedJobs,
    });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch saved jobs",
      },
      { status: 500 }
    );
  }
}

// POST - Save a job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = saveJobSchema.safeParse(body);

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

    const { userId, jobId } = validation.data;

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    // Check if already saved
    const existingSave = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    if (existingSave) {
      return NextResponse.json(
        { success: false, error: "Job already saved" },
        { status: 409 }
      );
    }

    // Create saved job
    const savedJob = await prisma.savedJob.create({
      data: {
        userId,
        jobId,
      },
      include: {
        job: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: savedJob,
      message: "Job saved successfully",
    });
  } catch (error) {
    console.error("Error saving job:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save job",
      },
      { status: 500 }
    );
  }
}

// DELETE - Unsave a job
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const jobId = searchParams.get("jobId");

    // Validate query params
    const validation = unsaveJobSchema.safeParse({ userId, jobId });

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

    const { userId: validatedUserId, jobId: validatedJobId } = validation.data;

    // Check if saved job exists
    const savedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: validatedUserId,
          jobId: validatedJobId,
        },
      },
    });

    if (!savedJob) {
      return NextResponse.json(
        { success: false, error: "Saved job not found" },
        { status: 404 }
      );
    }

    // Delete saved job
    await prisma.savedJob.delete({
      where: {
        userId_jobId: {
          userId: validatedUserId,
          jobId: validatedJobId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Job unsaved successfully",
    });
  } catch (error) {
    console.error("Error unsaving job:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to unsave job",
      },
      { status: 500 }
    );
  }
}
