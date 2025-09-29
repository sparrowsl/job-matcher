export interface Job {
	id: string;
	title: string;
	company: string;
	location: string;
	description: string;
	requirements: string[];
	skills: string[];
	salary?: {
		min?: number;
		max?: number;
		currency: string;
	};
	type: "full-time" | "part-time" | "contract" | "internship";
	remote: boolean;
	postedDate: Date;
	applicationUrl: string;
	source: string;
}

export interface CVData {
	id?: string;
	fileName: string;
	extractedText: string;
	keywords: string[];
	skills: string[];
	experience: string[];
	education: string[];
	uploadDate: Date;
}

export interface MatchResult {
	job: Job;
	score: number;
	matchingSkills: string[];
	missingSkills: string[];
	explanation: string;
}

export interface UploadResponse {
	success: boolean;
	message: string;
	data?: {
		cvData: CVData;
		matches: MatchResult[];
	};
	error?: string;
}

export interface JobSearchFilters {
	location?: string;
	type?: Job["type"];
	remote?: boolean;
	skills?: string[];
	salaryMin?: number;
	salaryMax?: number;
}

// Enhanced PDF processing types
export interface ExtractedPDFData {
	text: string;
	metadata: {
		pages: number;
		info: any;
		version: string;
	};
	wordCount: number;
	confidence: number;
}

export interface AIProcessedData {
	summary: string;
	keyPoints: string[];
	skills: string[];
	experience: string[];
	education: string[];
	keywords: string[];
	sentiment: string;
	confidence: number;
}

export interface EnhancedCVData {
	extractedData: ExtractedPDFData;
	aiProcessedData: AIProcessedData;
	processingTime: number;
	timestamp: Date;
}

// Hugging Face OCR types
// (Removed HF OCR path in favor of pdf-parse only)

// Saved Job types
export interface SavedJob {
	savedJobId: string;
	job: Job;
	applied: boolean;
	appliedAt: Date | null;
	notes: string | null;
	savedAt: Date;
}

export interface SaveJobRequest {
	userId: string;
	jobId: string;
}

export interface UpdateSavedJobRequest {
	applied?: boolean;
	appliedAt?: Date | null;
	notes?: string | null;
}
