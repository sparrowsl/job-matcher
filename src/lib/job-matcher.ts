import type { CVData, Job, MatchResult } from "@/types";

export function matchJobsToCV(cvData: CVData, jobs: Job[]): MatchResult[] {
	const matches = jobs.map((job) => {
		const score = calculateJobMatchScore(cvData, job);
		const matchingSkills = findMatchingSkills(cvData.skills, job.skills);
		const missingSkills = findMissingSkills(cvData.skills, job.skills);
		const explanation = generateMatchExplanation(
			score,
			matchingSkills,
			missingSkills,
		);

		return {
			job,
			score,
			matchingSkills,
			missingSkills,
			explanation,
		};
	});

	// Sort by match score (highest first)
	return matches.sort((a, b) => b.score - a.score);
}

function calculateJobMatchScore(cvData: CVData, job: Job): number {
	let totalScore = 0;
	let weightSum = 0;

	// Skills matching (40% weight)
	const skillsWeight = 0.4;
	const skillsScore = calculateSkillsMatch(cvData.skills, job.skills);
	totalScore += skillsScore * skillsWeight;
	weightSum += skillsWeight;

	// Keywords matching (30% weight)
	const keywordsWeight = 0.3;
	const keywordsScore = calculateKeywordsMatch(
		cvData.keywords,
		job.description + " " + job.requirements.join(" "),
	);
	totalScore += keywordsScore * keywordsWeight;
	weightSum += keywordsWeight;

	// Experience relevance (20% weight)
	const experienceWeight = 0.2;
	const experienceScore = calculateExperienceMatch(
		cvData.experience,
		job.description,
	);
	totalScore += experienceScore * experienceWeight;
	weightSum += experienceWeight;

	// Education relevance (10% weight)
	const educationWeight = 0.1;
	const educationScore = calculateEducationMatch(
		cvData.education,
		job.requirements.join(" "),
	);
	totalScore += educationScore * educationWeight;
	weightSum += educationWeight;

	return Math.round((totalScore / weightSum) * 100) / 100;
}

function calculateSkillsMatch(cvSkills: string[], jobSkills: string[]): number {
	if (jobSkills.length === 0) return 50; // Neutral score if no specific skills listed

	const matchingSkills = findMatchingSkills(cvSkills, jobSkills);
	return (matchingSkills.length / jobSkills.length) * 100;
}

function calculateKeywordsMatch(cvKeywords: string[], jobText: string): number {
	const jobTextLower = jobText.toLowerCase();
	const matchingKeywords = cvKeywords.filter((keyword) =>
		jobTextLower.includes(keyword.toLowerCase()),
	);

	if (cvKeywords.length === 0) return 0;
	return (matchingKeywords.length / cvKeywords.length) * 100;
}

function calculateExperienceMatch(
	cvExperience: string[],
	jobDescription: string,
): number {
	if (cvExperience.length === 0) return 30; // Low but not zero score

	const jobDescLower = jobDescription.toLowerCase();
	const matchingExperience = cvExperience.filter((exp) =>
		jobDescLower.includes(exp.toLowerCase()),
	);

	return Math.min((matchingExperience.length / cvExperience.length) * 100, 100);
}

function calculateEducationMatch(
	cvEducation: string[],
	jobRequirements: string,
): number {
	if (cvEducation.length === 0) return 40; // Neutral-low score

	const reqLower = jobRequirements.toLowerCase();
	const matchingEducation = cvEducation.filter((edu) =>
		reqLower.includes(edu.toLowerCase()),
	);

	return Math.min((matchingEducation.length / cvEducation.length) * 100, 100);
}

function findMatchingSkills(cvSkills: string[], jobSkills: string[]): string[] {
	return cvSkills.filter((cvSkill) =>
		jobSkills.some((jobSkill) => skillsMatch(cvSkill, jobSkill)),
	);
}

function findMissingSkills(cvSkills: string[], jobSkills: string[]): string[] {
	return jobSkills.filter(
		(jobSkill) => !cvSkills.some((cvSkill) => skillsMatch(cvSkill, jobSkill)),
	);
}

function skillsMatch(skill1: string, skill2: string): boolean {
	const s1 = skill1.toLowerCase();
	const s2 = skill2.toLowerCase();

	// Exact match
	if (s1 === s2) return true;

	// Partial match (one contains the other)
	if (s1.includes(s2) || s2.includes(s1)) return true;

	// Handle common variations
	const variations: { [key: string]: string[] } = {
		javascript: ["js", "node.js", "nodejs"],
		typescript: ["ts"],
		python: ["py"],
		react: ["reactjs", "react.js"],
		angular: ["angularjs"],
		vue: ["vuejs", "vue.js"],
		"c++": ["cpp", "c plus plus"],
		"c#": ["csharp", "c sharp"],
		postgresql: ["postgres", "psql"],
		mongodb: ["mongo"],
		"amazon web services": ["aws"],
		"google cloud platform": ["gcp"],
		"microsoft azure": ["azure"],
	};

	// Check variations
	for (const [base, vars] of Object.entries(variations)) {
		if (
			(s1 === base && vars.includes(s2)) ||
			(s2 === base && vars.includes(s1))
		) {
			return true;
		}
	}

	return false;
}

function generateMatchExplanation(
	score: number,
	matchingSkills: string[],
	missingSkills: string[],
): string {
	let explanation = "";

	if (score >= 80) {
		explanation = "Excellent match! ";
	} else if (score >= 60) {
		explanation = "Good match. ";
	} else if (score >= 40) {
		explanation = "Fair match. ";
	} else {
		explanation = "Limited match. ";
	}

	if (matchingSkills.length > 0) {
		explanation += `You have ${matchingSkills.length} matching skill${matchingSkills.length === 1 ? "" : "s"}: ${matchingSkills.slice(0, 3).join(", ")}${matchingSkills.length > 3 ? ` and ${matchingSkills.length - 3} more` : ""}. `;
	}

	if (missingSkills.length > 0) {
		const topMissing = missingSkills.slice(0, 3);
		explanation += `Consider developing: ${topMissing.join(", ")}${missingSkills.length > 3 ? ` and ${missingSkills.length - 3} more` : ""}.`;
	}

	return explanation.trim();
}

export function filterJobs(
	jobs: Job[],
	filters: {
		location?: string;
		type?: Job["type"];
		remote?: boolean;
		skills?: string[];
		salaryMin?: number;
		salaryMax?: number;
	},
): Job[] {
	return jobs.filter((job) => {
		if (
			filters.location &&
			!job.location.toLowerCase().includes(filters.location.toLowerCase())
		) {
			return false;
		}

		if (filters.type && job.type !== filters.type) {
			return false;
		}

		if (filters.remote !== undefined && job.remote !== filters.remote) {
			return false;
		}

		if (filters.skills && filters.skills.length > 0) {
			const hasRequiredSkills = filters.skills.some((skill) =>
				job.skills.some((jobSkill) => skillsMatch(skill, jobSkill)),
			);
			if (!hasRequiredSkills) return false;
		}

		if (
			filters.salaryMin &&
			job.salary?.min &&
			job.salary.min < filters.salaryMin
		) {
			return false;
		}

		if (
			filters.salaryMax &&
			job.salary?.max &&
			job.salary.max > filters.salaryMax
		) {
			return false;
		}

		return true;
	});
}
