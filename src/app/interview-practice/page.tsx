"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageCircle, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface InterviewQuestion {
  category: string;
  question: string;
  followUp?: string;
  tip: string;
  relatedExperience?: string;
}

export default function InterviewPracticePage() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">(
    "intermediate"
  );
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [cvData, setCvData] = useState<any>(null);
  const [loadingCV, setLoadingCV] = useState(true);

  // Load CV data from localStorage or API
  useEffect(() => {
    const loadCV = async () => {
      try {
        const storedCV = localStorage.getItem("latest-cv-data");
        if (storedCV) {
          setCvData(JSON.parse(storedCV));
        } else {
          toast.error("No CV found. Please upload your CV first.");
        }
      } catch (error) {
        console.error("Error loading CV:", error);
        toast.error("Failed to load CV data");
      } finally {
        setLoadingCV(false);
      }
    };

    loadCV();
  }, []);

  const handleGenerate = async () => {
    if (!jobTitle || !company || !jobDescription) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!cvData) {
      toast.error("No CV data available. Please upload your CV first.");
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch("/api/interview-practice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle,
          company,
          jobDescription,
          cvData,
          difficulty,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setQuestions(data.data.questions);
        setUserAnswers({});
        toast.success(`Generated ${data.data.metadata.totalQuestions} interview questions!`);
      } else {
        toast.error(data.error || "Failed to generate interview questions");
      }
    } catch (error) {
      console.error("Error generating interview questions:", error);
      toast.error("An error occurred while generating interview questions");
    } finally {
      setGenerating(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Behavioral: "bg-blue-100 text-blue-800",
      Technical: "bg-green-100 text-green-800",
      Situational: "bg-purple-100 text-purple-800",
      Company: "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loadingCV) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600 font-medium">Loading your CV data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Practice</h1>
          <p className="text-gray-600">
            Prepare for your interview with AI-generated, role-specific questions
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-md sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Google"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) =>
                      setDifficulty(e.target.value as "beginner" | "intermediate" | "advanced")
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {difficulty === "beginner" && "Basic questions about experience and motivation"}
                    {difficulty === "intermediate" && "Mix of behavioral, technical, and situational"}
                    {difficulty === "advanced" && "Complex scenarios and strategic thinking"}
                  </p>
                </div>

                {!cvData && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <p className="text-sm text-yellow-800">
                      No CV data found. Please{" "}
                      <a href="/upload-cv" className="font-medium underline">
                        upload your CV
                      </a>{" "}
                      first to get personalized questions.
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={generating || !cvData}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Questions"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Interview Questions */}
          <div className="lg:col-span-2">
            {questions.length === 0 ? (
              <Card className="shadow-md">
                <CardContent className="text-center py-12">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Your interview questions will appear here</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Fill in the job details and click "Generate Questions"
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Interview Questions ({questions.length})
                  </h2>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
                  </Badge>
                </div>

                {questions.map((q, index) => (
                  <Card key={index} className="shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <Badge
                          variant="secondary"
                          className={`${getCategoryColor(q.category)} text-xs`}
                        >
                          {q.category}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setExpandedQuestion(expandedQuestion === index ? null : index)
                          }
                        >
                          {expandedQuestion === index ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Q{index + 1}. {q.question}
                      </h3>

                      {q.followUp && (
                        <p className="text-sm text-gray-600 mb-3 italic">
                          Follow-up: {q.followUp}
                        </p>
                      )}

                      {expandedQuestion === index && (
                        <div className="mt-4 space-y-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 text-blue-600 mt-1" />
                              <div>
                                <p className="text-sm font-medium text-blue-900 mb-1">Tip:</p>
                                <p className="text-sm text-blue-800">{q.tip}</p>
                              </div>
                            </div>
                          </div>

                          {q.relatedExperience && (
                            <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
                              <p className="text-sm font-medium text-purple-900 mb-1">
                                From Your CV:
                              </p>
                              <p className="text-sm text-purple-800">{q.relatedExperience}</p>
                            </div>
                          )}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Practice Your Answer:
                            </label>
                            <Textarea
                              placeholder="Type your answer here to practice..."
                              value={userAnswers[index] || ""}
                              onChange={(e) =>
                                setUserAnswers({ ...userAnswers, [index]: e.target.value })
                              }
                              className="min-h-[120px]"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {userAnswers[index]?.split(" ").filter(Boolean).length || 0} words
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <Card className="shadow-md mt-8">
          <CardHeader>
            <CardTitle>Interview Preparation Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Before the Interview:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Research the company thoroughly</li>
                  <li>• Practice answers out loud</li>
                  <li>• Prepare your own questions</li>
                  <li>• Review your CV and achievements</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">During the Interview:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Use the STAR method for behavioral questions</li>
                  <li>• Take time to think before answering</li>
                  <li>• Be specific and use examples</li>
                  <li>• Show enthusiasm and interest</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">After Practicing:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Record yourself answering questions</li>
                  <li>• Time your responses (aim for 1-3 min)</li>
                  <li>• Get feedback from others</li>
                  <li>• Refine and improve your answers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
