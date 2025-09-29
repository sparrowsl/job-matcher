import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSavedJobSchema = z.object({
  applied: z.boolean().optional(),
  appliedAt: z.string().datetime().nullable().optional(),
  notes: z.string().nullable().optional(),
});

// PATCH - Update saved job (mark as applied, add notes)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = updateSavedJobSchema.safeParse(body);

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

    const { applied, appliedAt, notes } = validation.data;
    const savedJobId = params.id;

    // Check if saved job exists
    const savedJob = await prisma.savedJob.findUnique({
      where: { id: savedJobId },
    });

    if (!savedJob) {
      return NextResponse.json(
        { success: false, error: "Saved job not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (applied !== undefined) {
      updateData.applied = applied;
      // If marking as applied and no appliedAt provided, set it to now
      if (applied && !appliedAt) {
        updateData.appliedAt = new Date();
      } else if (!applied) {
        // If unmarking as applied, clear appliedAt
        updateData.appliedAt = null;
      }
    }
    if (appliedAt !== undefined) {
      updateData.appliedAt = appliedAt ? new Date(appliedAt) : null;
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    // Update saved job
    const updatedSavedJob = await prisma.savedJob.update({
      where: { id: savedJobId },
      data: updateData,
      include: {
        job: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedSavedJob,
      message: "Saved job updated successfully",
    });
  } catch (error) {
    console.error("Error updating saved job:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update saved job",
      },
      { status: 500 }
    );
  }
}
