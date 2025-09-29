import { openai } from '@ai-sdk/openai';
import { generateText, generateObject, streamText } from 'ai';
import { z } from 'zod';

// Initialize OpenAI model
export const model = openai('gpt-4o-mini');

// Schema for structured CV data extraction
export const cvDataSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()).optional(),
  yearsExperience: z.number().optional(),
});

export const educationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional(),
  startYear: z.number().optional(),
  endYear: z.number().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
});

export const experienceSchema = z.object({
  company: z.string(),
  position: z.string(),
  location: z.string().optional(),
  startYear: z.number().optional(),
  endYear: z.number().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).optional(),
});

export const skillExtractionSchema = z.object({
  skills: z.array(z.string()).describe('List of technical and professional skills'),
  keywords: z.array(z.string()).describe('Important keywords and phrases from the CV'),
  suggestedSkills: z.array(z.string()).describe('Additional relevant skills the user might have based on their experience'),
});

export const cvAnalysisSchema = z.object({
  overallQuality: z.number().min(0).max(100).describe('Overall quality score of the CV (0-100)'),
  strengths: z.array(z.string()).describe('Strong points in the CV'),
  improvements: z.array(z.string()).describe('Areas for improvement'),
  missingSections: z.array(z.string()).describe('Important sections that are missing'),
  suggestions: z.array(z.string()).describe('Specific actionable suggestions'),
});

/**
 * Extract skills and keywords from CV text
 */
export async function extractSkillsFromCV(cvText: string) {
  try {
    const { object } = await generateObject({
      model,
      schema: skillExtractionSchema,
      prompt: `You are an expert CV analyzer. Extract all technical skills, soft skills, and important keywords from the provided CV text.
Also suggest additional skills the person might have based on their experience but didn't explicitly mention.

Analyze this CV and extract skills, keywords, and suggest additional relevant skills:

${cvText}`,
    });

    return object;
  } catch (error) {
    console.error('Error extracting skills:', error);
    return {
      skills: [],
      keywords: [],
      suggestedSkills: [],
    };
  }
}

/**
 * Analyze CV quality and provide suggestions
 */
export async function analyzeCVQuality(cvData: {
  fullName?: string;
  email?: string;
  phone?: string;
  summary?: string;
  experience?: any[];
  education?: any[];
  skills?: string[];
  projects?: any[];
}) {
  try {
    const { object } = await generateObject({
      model,
      schema: cvAnalysisSchema,
      prompt: `You are an expert recruiter and CV reviewer. Analyze the CV data and provide:
1. An overall quality score (0-100)
2. Key strengths
3. Areas for improvement
4. Missing sections
5. Specific, actionable suggestions to improve the CV

Analyze this CV data:

${JSON.stringify(cvData, null, 2)}`,
    });

    return object;
  } catch (error) {
    console.error('Error analyzing CV:', error);
    return {
      overallQuality: 0,
      strengths: [],
      improvements: [],
      missingSections: [],
      suggestions: [],
    };
  }
}

/**
 * Generate a professional summary based on user information
 */
export async function generateProfessionalSummary(data: {
  title?: string;
  yearsExperience?: number;
  skills?: string[];
  experience?: any[];
  education?: any[];
}) {
  try {
    const { text } = await generateText({
      model,
      messages: [
        {
          role: 'system',
          content: `You are a professional CV writer. Generate a compelling professional summary (2-3 sentences) that:
          1. Highlights the person's role and expertise
          2. Mentions years of experience
          3. Emphasizes key skills and achievements
          4. Is written in third person
          5. Is concise but impactful`,
        },
        {
          role: 'user',
          content: `Generate a professional summary for:\n\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    });

    return text;
  } catch (error) {
    console.error('Error generating summary:', error);
    return '';
  }
}

/**
 * Enhance achievement descriptions
 */
export async function enhanceAchievement(achievement: string, role: string) {
  try {
    const { text } = await generateText({
      model,
      messages: [
        {
          role: 'system',
          content: `You are a professional CV writer. Enhance the following achievement by:
          1. Making it more impactful and results-oriented
          2. Using action verbs
          3. Adding metrics if implied
          4. Keeping it concise (1-2 lines)
          5. Maintaining truthfulness - don't add facts`,
        },
        {
          role: 'user',
          content: `Role: ${role}\nAchievement: ${achievement}`,
        },
      ],
    });

    return text;
  } catch (error) {
    console.error('Error enhancing achievement:', error);
    return achievement;
  }
}

/**
 * Stream conversational CV building chat
 */
export function streamCVBuildingChat(messages: Array<{ role: string; content: string }>) {
  return streamText({
    model,
    messages: [
      {
        role: 'system',
        content: `You are a friendly and professional AI career assistant helping users build their CV through conversation.

Your role:
1. Guide users through providing their information step by step
2. Ask one clear question at a time
3. Be encouraging and supportive
4. Extract information from natural language responses
5. Clarify when needed
6. Provide helpful suggestions

Information to gather in order:
1. Basic info (name, email, phone, location)
2. Professional title and summary
3. Work experience (company, role, dates, achievements)
4. Education (institution, degree, field, dates)
5. Skills (technical and soft skills)
6. Projects (optional but recommended)
7. Certifications (if any)

Keep responses conversational, warm, and professional. Use emojis sparingly and appropriately.`,
      },
      ...messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      })),
    ],
    temperature: 0.7,
  });
}

/**
 * Match jobs to CV using AI
 */
export async function aiMatchJobs(cv: any, jobs: any[]) {
  try {
    const { text } = await generateText({
      model,
      messages: [
        {
          role: 'system',
          content: `You are an expert job matching system. Analyze the CV and job listings to:
          1. Score each job (0-100) based on fit
          2. Identify matching skills
          3. Identify missing skills
          4. Provide a brief explanation for each match

          Consider:
          - Skills alignment (most important)
          - Experience level
          - Education requirements
          - Location preferences
          - Job type`,
        },
        {
          role: 'user',
          content: `CV:\n${JSON.stringify(cv, null, 2)}\n\nJobs:\n${JSON.stringify(
            jobs.map((j) => ({
              id: j.id,
              title: j.title,
              company: j.company,
              skills: j.skills,
              requirements: j.requirements,
            })),
            null,
            2
          )}`,
        },
      ],
    });

    return JSON.parse(text);
  } catch (error) {
    console.error('Error matching jobs:', error);
    return [];
  }
}

/**
 * Generate improvement suggestions for specific CV sections
 */
export async function suggestSectionImprovements(section: string, content: any) {
  try {
    const { text } = await generateText({
      model,
      messages: [
        {
          role: 'system',
          content: `You are a professional CV consultant. Provide specific, actionable suggestions to improve the ${section} section of a CV.
          Focus on:
          1. Content quality
          2. Structure and formatting
          3. Impact and clarity
          4. Completeness
          5. Professional presentation`,
        },
        {
          role: 'user',
          content: `${section} section:\n\n${JSON.stringify(content, null, 2)}`,
        },
      ],
    });

    return text;
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return '';
  }
}

/**
 * Generate a cover letter for a job application
 */
export async function generateCoverLetter(params: {
  jobTitle: string;
  company: string;
  jobDescription: string;
  cvData: any;
  tone?: 'professional' | 'enthusiastic' | 'formal' | 'creative';
}) {
  const { jobTitle, company, jobDescription, cvData, tone = 'professional' } = params;

  try {
    const toneGuidelines = {
      professional: 'Professional and balanced, showing competence and interest',
      enthusiastic: 'Energetic and passionate, showing genuine excitement about the opportunity',
      formal: 'Highly formal and traditional, suitable for conservative industries',
      creative: 'Creative and engaging, showing personality while maintaining professionalism',
    };

    const { text } = await generateText({
      model,
      messages: [
        {
          role: 'system',
          content: `You are an expert cover letter writer. Generate a compelling, personalized cover letter that:
          1. Addresses the specific job and company
          2. Highlights relevant experience and skills from the CV
          3. Shows enthusiasm for the role
          4. Demonstrates understanding of the company and position
          5. Is well-structured with clear paragraphs
          6. Includes a strong opening and closing
          7. Is approximately 300-400 words
          8. Uses a ${tone} tone: ${toneGuidelines[tone]}

          Format the letter properly with:
          - Date
          - Hiring Manager (or "Hiring Team" if not specified)
          - Company name
          - Salutation
          - Body paragraphs
          - Professional closing

          Do not include the applicant's address or company address - just focus on the letter content.`,
        },
        {
          role: 'user',
          content: `Generate a cover letter for:

Job Title: ${jobTitle}
Company: ${company}

Job Description:
${jobDescription}

Candidate's CV Data:
${JSON.stringify(cvData, null, 2)}`,
        },
      ],
    });

    return text;
  } catch (error) {
    console.error('Error generating cover letter:', error);
    throw error;
  }
}

/**
 * Generate interview practice questions
 */
export async function generateInterviewQuestions(params: {
  jobTitle: string;
  company: string;
  jobDescription: string;
  cvData: any;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}) {
  const { jobTitle, company, jobDescription, cvData, difficulty = 'intermediate' } = params;

  try {
    const difficultyGuidelines = {
      beginner: 'Focus on basic, straightforward questions about experience and motivation',
      intermediate: 'Mix of behavioral, technical, and situational questions',
      advanced: 'Complex scenarios, deep technical knowledge, and strategic thinking questions',
    };

    const { text } = await generateText({
      model,
      messages: [
        {
          role: 'system',
          content: `You are an expert interviewer and career coach. Generate a comprehensive set of interview practice questions that:
          1. Are specifically tailored to the job role and company
          2. Cover different categories: behavioral, technical, situational, and company-specific
          3. Are realistic and likely to be asked
          4. Match the ${difficulty} difficulty level: ${difficultyGuidelines[difficulty]}
          5. Include follow-up questions where appropriate
          6. Reference the candidate's experience when relevant

          Format the output as a JSON array with the following structure:
          [
            {
              "category": "Behavioral/Technical/Situational/Company",
              "question": "The question text",
              "followUp": "Optional follow-up question",
              "tip": "Brief tip for answering this question",
              "relatedExperience": "Reference to relevant CV experience if applicable"
            }
          ]

          Generate 10-15 diverse questions covering all categories.`,
        },
        {
          role: 'user',
          content: `Generate interview questions for:

Job Title: ${jobTitle}
Company: ${company}

Job Description:
${jobDescription}

Candidate's CV Data:
${JSON.stringify(cvData, null, 2)}`,
        },
      ],
    });

    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating interview questions:', error);
    throw error;
  }
}
