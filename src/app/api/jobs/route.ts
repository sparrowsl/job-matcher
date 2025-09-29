import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const remote = searchParams.get('remote');
    const location = searchParams.get('location');
    const skills = searchParams.get('skills');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {
      isActive: true,
    };

    // Search in title, company, or description
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by job type
    if (type) {
      where.type = type;
    }

    // Filter by remote
    if (remote !== null) {
      where.remote = remote === 'true';
    }

    // Filter by location
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    // Fetch jobs
    const jobs = await prisma.job.findMany({
      where,
      orderBy: { postedDate: 'desc' },
      take: limit,
      skip: offset,
    });

    // Filter by skills if provided (done in-memory for SQLite)
    let filteredJobs = jobs;
    if (skills) {
      const skillsArray = skills.split(',').map((s) => s.trim().toLowerCase());
      filteredJobs = jobs.filter((job) => {
        const jobSkills = job.skills ? JSON.parse(job.skills) : [];
        return skillsArray.some((skill) =>
          jobSkills.some((jSkill: string) =>
            jSkill.toLowerCase().includes(skill)
          )
        );
      });
    }

    // Parse JSON fields
    const parsedJobs = filteredJobs.map((job) => ({
      ...job,
      skills: job.skills ? JSON.parse(job.skills) : [],
      requirements: job.requirements ? JSON.parse(job.requirements) : [],
      responsibilities: job.responsibilities
        ? JSON.parse(job.responsibilities)
        : [],
      keywords: job.keywords ? JSON.parse(job.keywords) : [],
    }));

    // Get total count
    const total = await prisma.job.count({ where });

    return NextResponse.json({
      success: true,
      data: {
        jobs: parsedJobs,
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const job = await prisma.job.create({
      data: {
        title: data.title,
        company: data.company,
        location: data.location,
        description: data.description,
        requirements: JSON.stringify(data.requirements || []),
        responsibilities: JSON.stringify(data.responsibilities || []),
        skills: JSON.stringify(data.skills || []),
        keywords: JSON.stringify(data.keywords || []),
        type: data.type || 'full-time',
        remote: data.remote || false,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        salaryCurrency: data.salaryCurrency || 'USD',
        applicationUrl: data.applicationUrl,
        source: data.source || 'manual',
        externalId: data.externalId,
        postedDate: data.postedDate ? new Date(data.postedDate) : new Date(),
      },
    });

    return NextResponse.json({
      ...job,
      skills: job.skills ? JSON.parse(job.skills) : [],
      requirements: job.requirements ? JSON.parse(job.requirements) : [],
      responsibilities: job.responsibilities
        ? JSON.parse(job.responsibilities)
        : [],
      keywords: job.keywords ? JSON.parse(job.keywords) : [],
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
