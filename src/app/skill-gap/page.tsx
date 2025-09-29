"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Target, TrendingUp, Book, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface SkillGap {
  skill: string;
  importance: "high" | "medium" | "low";
  currentLevel: "none" | "beginner" | "intermediate" | "advanced";
  targetLevel: "beginner" | "intermediate" | "advanced" | "expert";
  learningResources: string[];
  estimatedTime: string;
  priority: number;
}

interface Recommendation {
  category: string;
  suggestion: string;
  impact: "high" | "medium" | "low";
}

interface SkillGapAnalysis {
  currentSkills: string[];
  missingSkills: string[];
  skillGaps: SkillGap[];
  recommendations: Recommendation[];
  careerPath: string;
}

export default function SkillGapPage() {
  const { user } = useAuth();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [cvData, setCvData] = useState<any>(null);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Load CV and saved jobs data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load CV
        const storedCV = localStorage.getItem("latest-cv-data");
        if (storedCV) {
          setCvData(JSON.parse(storedCV));
        }

        // Load saved jobs if user is authenticated
        if (user?.id) {
          const response = await fetch(`/api/saved-jobs?userId=${user.id}`);
          const data = await response.json();

          if (data.success) {
            setSavedJobs(data.data);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [user]);

  const handleAnalyze = async () => {
    if (!cvData) {
      toast.error("No CV data available. Please upload your CV first.");
      return;
    }

    setAnalyzing(true);
    try {
      // Get job IDs from saved jobs
      const targetJobIds = savedJobs.map((sj) => sj.job.id);

      const response = await fetch("/api/skill-gap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvData,
          targetJobIds: targetJobIds.length > 0 ? targetJobIds : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.data.analysis);
        toast.success("Skill gap analysis completed!");
      } else {
        toast.error(data.error || "Failed to analyze skill gap");
      }
    } catch (error) {
      console.error("Error analyzing skill gap:", error);
      toast.error("An error occurred during analysis");
    } finally {
      setAnalyzing(false);
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return "bg-red-100 text-red-800 border-red-200";
    if (priority >= 5) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getImportanceColor = (importance: string) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };
    return colors[importance as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600 font-medium">Loading your data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skill Gap Analysis</h1>
          <p className="text-gray-600">
            Identify skills you need to develop and get personalized learning recommendations
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Action Card */}
        {!analysis && (
          <Card className="shadow-md mb-8">
            <CardContent className="p-8 text-center">
              {!cvData ? (
                <>
                  <AlertCircle className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">No CV Found</h2>
                  <p className="text-gray-600 mb-4">
                    Please upload your CV first to get personalized skill recommendations.
                  </p>
                  <Button asChild>
                    <a href="/upload-cv">Upload CV</a>
                  </Button>
                </>
              ) : (
                <>
                  <Target className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Ready to Analyze Your Skills
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {savedJobs.length > 0
                      ? `We'll analyze your CV against ${savedJobs.length} saved job${
                          savedJobs.length > 1 ? "s" : ""
                        }`
                      : "We'll analyze your CV and provide general skill recommendations"}
                  </p>
                  <Button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Start Analysis"
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Career Path */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Your Career Development Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{analysis.careerPath}</p>
                <div className="mt-4">
                  <Button onClick={handleAnalyze} variant="outline" size="sm">
                    Re-analyze
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Skills */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Your Current Skills ({analysis.currentSkills.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.currentSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Missing Skills */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Skills to Develop ({analysis.missingSkills.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Skill Gaps */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Detailed Skill Development Plan
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {analysis.skillGaps
                  .sort((a, b) => b.priority - a.priority)
                  .map((gap, index) => (
                    <Card
                      key={index}
                      className={`shadow-md border-l-4 ${getPriorityColor(gap.priority)}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {gap.skill}
                            </h3>
                            <div className="flex gap-2 flex-wrap">
                              <Badge
                                variant="secondary"
                                className={getImportanceColor(gap.importance)}
                              >
                                {gap.importance.toUpperCase()} Priority
                              </Badge>
                              <Badge variant="outline">
                                Current: {gap.currentLevel || "None"}
                              </Badge>
                              <Badge variant="outline">Target: {gap.targetLevel}</Badge>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 ml-4">
                            P{gap.priority}/10
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">
                                Estimated Time:
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 ml-6">{gap.estimatedTime}</p>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Book className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">
                                Learning Resources:
                              </span>
                            </div>
                            <ul className="text-sm text-gray-600 ml-6 space-y-1">
                              {gap.learningResources.map((resource, i) => (
                                <li key={i}>• {resource}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>

            {/* Recommendations */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="border-l-4 border-blue-400 pl-4 py-2">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{rec.category}</h4>
                        <Badge variant="secondary" className={getImportanceColor(rec.impact)}>
                          {rec.impact.toUpperCase()} Impact
                        </Badge>
                      </div>
                      <p className="text-gray-700 text-sm">{rec.suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
