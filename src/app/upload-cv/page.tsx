"use client";

import { useState } from "react";
import type { UploadResponse, MatchResult, CVData } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

export default function UploadCVPage() {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    cvData: CVData;
    matches: MatchResult[];
    summary: {
      totalSkillsFound: number;
      totalKeywords: number;
      topMatchScore: number;
      totalMatches: number;
    };
  } | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("cv", file);

      const response = await fetch("/api/upload-cv", {
        method: "POST",
        body: formData,
      });

      const data: UploadResponse = await response.json();

      if (data.success && data.data) {
        setResults({
          cvData: (data.data as any).cvData ?? { fileName: (data.data as any).fileName ?? "", extractedText: (data.data as any).textPreview ?? "", keywords: [], skills: [], experience: [], education: [], uploadDate: new Date() },
          matches: (data as any).matches ?? (data.data as any).matches ?? [],
          summary: (data as any).summary ?? { totalSkillsFound: 0, totalKeywords: 0, topMatchScore: 0, totalMatches: 0 },
        });
        toast.success("CV uploaded and analyzed successfully!");
      } else {
        toast.error(data.error || "Failed to process CV");
        setError(data.error || "Failed to process CV");
      }
    } catch (err) {
      toast.error("Failed to upload CV. Please try again.");
      setError("Failed to upload CV. Please try again.");
      console.error("Error uploading CV:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    if (score >= 40) return "bg-orange-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your CV</h1>
          <p className="text-gray-600">
            Upload your CV to extract skills and find matching job opportunities
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!results && (
          <div className="max-w-2xl mx-auto">
            <Card
              className={`border-2 border-dashed p-12 text-center transition-all ${dragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
                }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <CardContent>
                {uploading ? (
                  <div className="space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                    <p className="text-gray-600 font-medium">Processing your CV...</p>
                    <p className="text-sm text-gray-500">
                      We're extracting skills and matching you with relevant jobs
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-16 w-16 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-xl font-medium text-gray-900 mb-2">
                        Drop your CV here or click to browse
                      </p>
                      <p className="text-gray-600 mb-4">
                        Supports PDF files up to 5MB
                      </p>
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                        Choose File
                      </Button>
                    </label>
                  </div>
                )}
              </CardContent>
            </Card>

            {error && (
              <Card className="mt-6 border-red-200 bg-red-50">
                <CardContent className="p-4 text-red-700">
                  {error}
                </CardContent>
              </Card>
            )}

            <Card className="mt-8 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">What happens next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Badge className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                    1
                  </Badge>
                  <div>
                    <h3 className="font-medium text-gray-900">Text Extraction</h3>
                    <p className="text-gray-600 text-sm">
                      We extract all readable text from your PDF CV
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                    2
                  </Badge>
                  <div>
                    <h3 className="font-medium text-gray-900">Skills Analysis</h3>
                    <p className="text-gray-600 text-sm">
                      AI identifies your technical and soft skills automatically
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                    3
                  </Badge>
                  <div>
                    <h3 className="font-medium text-gray-900">Job Matching</h3>
                    <p className="text-gray-600 text-sm">
                      We match your profile with relevant job opportunities
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {results && (
          <div className="space-y-8">
            {/* CV Summary */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">CV Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <Card className="border-0 bg-blue-50 text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.summary?.totalSkillsFound||0}
                      </div>
                      <div className="text-sm text-gray-600">Skills Found</div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-green-50 text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">
                        {results.summary?.totalKeywords||0}
                      </div>
                      <div className="text-sm text-gray-600">Keywords Extracted</div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-purple-50 text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-purple-600">
                        {results.summary?.totalMatches||0}
                      </div>
                      <div className="text-sm text-gray-600">Job Matches</div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-orange-50 text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.round(results.summary?.topMatchScore||0)}%
                      </div>
                      <div className="text-sm text-gray-600">Best Match</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Identified Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {(results.cvData?.skills ?? []).slice(0, 12).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                          {skill}
                        </Badge>
                      ))}
                      {(results.cvData?.skills?.length ?? 0) > 12 && (
                        <span className="text-sm text-gray-500">
                          +{(results.cvData?.skills?.length ?? 0) - 12} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Top Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {(results.cvData?.keywords ?? []).slice(0, 10).map((keyword, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-100 text-gray-700">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button
                    onClick={() => {
                      setResults(null);
                      setError(null);
                    }}
                    variant="secondary"
                    size="lg"
                  >
                    Upload Another CV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Job Matches */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Recommended Job Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(results.matches ?? []).map((match, index) => (
                    <Card
                      key={match.job.id}
                      className="border hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {match.job.title}
                              </h3>
                              <Badge variant="outline">
                                #{index + 1}
                              </Badge>
                            </div>
                            <p className="text-lg text-gray-700 mb-2">{match.job.company}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>📍 {match.job.location}</span>
                              <span>💼 {match.job.type}</span>
                              {match.job.remote && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  Remote
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div
                              className={`text-3xl font-bold mb-1 ${getScoreColor(match.score)}`}
                            >
                              {Math.round(match.score)}%
                            </div>
                            <Badge
                              variant="outline"
                              className={`${getScoreBackground(match.score)} ${getScoreColor(match.score)}`}
                            >
                              Match Score
                            </Badge>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {match.explanation}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-green-700 mb-2">
                              ✅ Your Matching Skills ({match.matchingSkills.length})
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {match.matchingSkills.slice(0, 5).map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {match.matchingSkills.length > 5 && (
                                <span className="text-xs text-gray-500">
                                  +{match.matchingSkills.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-orange-700 mb-2">
                              🎯 Skills to Develop ({match.missingSkills.length})
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {match.missingSkills.slice(0, 5).map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {match.missingSkills.length > 5 && (
                                <span className="text-xs text-gray-500">
                                  +{match.missingSkills.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">
                              {match.job.salary?.min && match.job.salary?.max
                                ? `${match.job.salary.currency} ${match.job.salary.min.toLocaleString()} - ${match.job.salary.max.toLocaleString()}`
                                : "Salary negotiable"}
                            </span>
                          </div>
                          <Button asChild className="bg-blue-600 hover:bg-blue-700">
                            <a
                              href={match.job.applicationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Apply Now
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Button asChild size="lg" variant="secondary">
                    <a href="/jobs">
                      View All Jobs
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
