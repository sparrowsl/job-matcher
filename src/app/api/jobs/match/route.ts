import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

function calculateMatchScore(cv: any, job: any) {
  const cvSkills = cv.skills ? JSON.parse(cv.skills) : [];
  const jobSkills = job.skills ? JSON.parse(job.skills) : [];
  const jobRequirements = job.requirements ? JSON.parse(job.requirements) : [];

  // Calculate skills match
  const matchingSkills = cvSkills.filter((skill: string) =>
    jobSkills.some((jSkill: string) =>
      jSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(jSkill.toLowerCase())
    )
  );

  const missingSkills = jobSkills.filter((jSkill: string) =>
    !cvSkills.some((skill: string) =>
      skill.toLowerCase().includes(jSkill.toLowerCase()) ||
      jSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );

  // Scoring weights
  const skillsWeight = 0.4;
  const experienceWeight = 0.3;
  const keywordsWeight = 0.2;
  const educationWeight = 0.1;

  // Skills score
  const skillsScore =
    jobSkills.length > 0
      ? (matchingSkills.length / jobSkills.length) * 100
      : 50;

  // Experience score (simple heuristic based on years)
  let experienceScore = 50;
  const requiredExperience = jobRequirements.some((req: string) =>
    req.toLowerCase().includes('year')
  );
  if (cv.yearsExperience >= 5) {
    experienceScore = 90;
  } else if (cv.yearsExperience >= 3) {
    experienceScore = 75;
  } else if (cv.yearsExperience >= 1) {
    experienceScore = 60;
  }

  // Keywords score
  const cvKeywords = cv.keywords ? JSON.parse(cv.keywords) : [];
  const jobKeywords = job.keywords ? JSON.parse(job.keywords) : [];
  const matchingKeywords = cvKeywords.filter((kw: string) =>
    jobKeywords.some((jKw: string) =>
      jKw.toLowerCase().includes(kw.toLowerCase())
    )
  );
  const keywordsScore =
    jobKeywords.length > 0
      ? (matchingKeywords.length / jobKeywords.length) * 100
      : 50;

  // Education score (simplified)
  const educationScore = cv.education && cv.education.length > 0 ? 80 : 50;

  // Calculate overall score
  const overallScore =
    skillsScore * skillsWeight +
    experienceScore * experienceWeight +
    keywordsScore * keywordsWeight +
    educationScore * educationWeight;

  return {
    overallScore: Math.round(overallScore),
    skillsScore: Math.round(skillsScore),
    experienceScore: Math.round(experienceScore),
    keywordsScore: Math.round(keywordsScore),
    educationScore: Math.round(educationScore),
    matchingSkills,
    missingSkills,
  };
}

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
      },
    });

    if (!cv) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    // Fetch all active jobs
    const jobs = await prisma.job.findMany({
      where: { isActive: true },
    });

    // Calculate matches for each job
    const matches = [];
    for (const job of jobs) {
      const matchData = calculateMatchScore(cv, job);

      // Only save matches with score > 30
      if (matchData.overallScore > 30) {
        // Save to database
        const match = await prisma.jobMatch.upsert({
          where: {
            cvId_jobId: {
              cvId: cv.id,
              jobId: job.id,
            },
          },
          update: {
            overallScore: matchData.overallScore,
            skillsScore: matchData.skillsScore,
            experienceScore: matchData.experienceScore,
            keywordsScore: matchData.keywordsScore,
            educationScore: matchData.educationScore,
            matchingSkills: JSON.stringify(matchData.matchingSkills),
            missingSkills: JSON.stringify(matchData.missingSkills),
            explanation: `${matchData.matchingSkills.length} matching skills out of ${JSON.parse(job.skills).length} required`,
          },
          create: {
            cvId: cv.id,
            jobId: job.id,
            overallScore: matchData.overallScore,
            skillsScore: matchData.skillsScore,
            experienceScore: matchData.experienceScore,
            keywordsScore: matchData.keywordsScore,
            educationScore: matchData.educationScore,
            matchingSkills: JSON.stringify(matchData.matchingSkills),
            missingSkills: JSON.stringify(matchData.missingSkills),
            explanation: `${matchData.matchingSkills.length} matching skills out of ${JSON.parse(job.skills).length} required`,
          },
          include: {
            job: true,
          },
        });

        matches.push({
          ...match,
          matchingSkills: matchData.matchingSkills,
          missingSkills: matchData.missingSkills,
        });
      }
    }

    // Sort by score
    matches.sort((a, b) => b.overallScore - a.overallScore);

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error matching jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
