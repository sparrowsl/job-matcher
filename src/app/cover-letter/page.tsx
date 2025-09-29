"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Download, Copy, FileText } from "lucide-react";
import { toast } from "sonner";

export default function CoverLetterPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState<"professional" | "enthusiastic" | "formal" | "creative">(
    "professional"
  );
  const [generating, setGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [cvData, setCvData] = useState<any>(null);
  const [loadingCV, setLoadingCV] = useState(true);

  // Load CV data from localStorage or API
  useEffect(() => {
    const loadCV = async () => {
      try {
        // Try to get the latest CV from localStorage first
        const storedCV = localStorage.getItem("latest-cv-data");
        if (storedCV) {
          setCvData(JSON.parse(storedCV));
        } else {
          // Could fetch from API if we have user authentication
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
      const response = await fetch("/api/cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle,
          company,
          jobDescription,
          cvData,
          tone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCoverLetter(data.data.coverLetter);
        toast.success("Cover letter generated successfully!");
      } else {
        toast.error(data.error || "Failed to generate cover letter");
      }
    } catch (error) {
      console.error("Error generating cover letter:", error);
      toast.error("An error occurred while generating the cover letter");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    toast.success("Cover letter copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${company}-${jobTitle}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Cover letter downloaded!");
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cover Letter Generator</h1>
          <p className="text-gray-600">
            Create a personalized, AI-powered cover letter for your job application
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
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
                    className="min-h-[200px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) =>
                      setTone(
                        e.target.value as "professional" | "enthusiastic" | "formal" | "creative"
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="professional">Professional</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="formal">Formal</option>
                    <option value="creative">Creative</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {tone === "professional" && "Balanced and competent"}
                    {tone === "enthusiastic" && "Energetic and passionate"}
                    {tone === "formal" && "Highly traditional and formal"}
                    {tone === "creative" && "Engaging with personality"}
                  </p>
                </div>

                {!cvData && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <p className="text-sm text-yellow-800">
                      No CV data found. Please{" "}
                      <a href="/upload-cv" className="font-medium underline">
                        upload your CV
                      </a>{" "}
                      first to generate a personalized cover letter.
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
                    "Generate Cover Letter"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Generated Cover Letter */}
          <div>
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Generated Cover Letter</CardTitle>
                  {coverLetter && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!coverLetter ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Your generated cover letter will appear here</p>
                    <p className="text-sm mt-2">
                      Fill in the job details and click "Generate Cover Letter"
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-md border border-gray-200 p-6">
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
                        {coverLetter}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tips Section */}
        <Card className="shadow-md mt-8">
          <CardHeader>
            <CardTitle>Tips for a Great Cover Letter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Before Generating:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Read the job description carefully</li>
                  <li>• Research the company and its culture</li>
                  <li>• Have your updated CV ready</li>
                  <li>• Note specific requirements and qualifications</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">After Generating:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Review and personalize the content</li>
                  <li>• Check for any factual errors</li>
                  <li>• Adjust the tone if needed</li>
                  <li>• Proofread for grammar and spelling</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
