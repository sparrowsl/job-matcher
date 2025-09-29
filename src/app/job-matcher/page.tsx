"use client";

import { useEffect, useState } from "react";
import { Upload, FileText, Search, Filter, X, Star, MapPin, Clock, DollarSign, Briefcase } from "lucide-react";
import type { Job, CVData, MatchResult, JobSearchFilters } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function JobMatcherPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<JobSearchFilters>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs when search query, filters, or CV data changes
  useEffect(() => {
    filterJobs();
  }, [jobs, searchQuery, filters, cvData]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/jobs");
      const data = await response.json();

      if (data.success) {
        setJobs(data.data.jobs);
      } else {
        setError(data.error || "Failed to fetch jobs");
      }
    } catch (err) {
      setError("Failed to fetch jobs. Please try again.");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    // Apply text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(job => job.type === filters.type);
    }

    if (filters.remote !== undefined) {
      filtered = filtered.filter(job => job.remote === filters.remote);
    }

    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter(job =>
        filters.skills!.some(skill =>
          job.skills.some(jobSkill =>
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    if (filters.salaryMin || filters.salaryMax) {
      filtered = filtered.filter(job => {
        if (!job.salary) return false;
        const min = job.salary.min || 0;
        const max = job.salary.max || Infinity;

        if (filters.salaryMin && max < filters.salaryMin) return false;
        if (filters.salaryMax && min > filters.salaryMax) return false;

        return true;
      });
    }

    // If CV is uploaded, sort by skill match
    if (cvData && cvData.skills.length > 0) {
      filtered = filtered.map(job => {
        const matchingSkills = job.skills.filter(skill =>
          cvData.skills.some(cvSkill =>
            cvSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(cvSkill.toLowerCase())
          )
        );
        const matchScore = matchingSkills.length / job.skills.length;
        return { ...job, matchScore, matchingSkills };
      }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    setFilteredJobs(filtered);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    setUploadLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("cv", file);

      const response = await fetch("/api/upload-cv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setCvData(data.data.cvData);
        setMatchResults(data.data.matches || []);
      } else {
        setError(data.error || "Failed to process CV");
      }
    } catch (err) {
      setError("Failed to upload CV. Please try again.");
      console.error("Error uploading CV:", err);
    } finally {
      setUploadLoading(false);
    }
  };

  const clearCv = () => {
    setCvData(null);
    setMatchResults([]);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  const getMatchScore = (job: Job) => {
    if (!cvData || cvData.skills.length === 0) return null;
    const matchingSkills = job.skills.filter(skill =>
      cvData.skills.some(cvSkill =>
        cvSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(cvSkill.toLowerCase())
      )
    );
    return Math.round((matchingSkills.length / job.skills.length) * 100);
  };

  const formatSalary = (salary?: { min?: number; max?: number; currency: string }) => {
    if (!salary) return "Salary not specified";
    const { min, max, currency } = salary;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `${currency} ${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return "Salary not specified";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Matcher</h1>
              <p className="text-lg text-gray-600">Upload your CV and discover perfectly matched opportunities</p>
            </div>

            {/* CV Upload Section */}
            <div className="flex flex-col sm:flex-row gap-4">
              {!cvData ? (
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadLoading}
                  />
                  <Button
                    size="lg"
                    disabled={uploadLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  >
                    {uploadLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Processing CV...
                      </>
                    ) : (
                      <>
                        <Upload size={20} className="mr-2" />
                        Upload CV (PDF only)
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="flex items-center gap-3 p-4">
                    <FileText className="text-green-600" size={20} />
                    <span className="font-medium text-green-800">{cvData.fileName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCv}
                      className="text-green-600 hover:text-green-800 h-6 w-6 p-0"
                    >
                      <X size={16} />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* CV Skills Display */}
          {cvData && cvData.skills.length > 0 && (
            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Star className="text-blue-600" size={20} />
                  Skills Detected from Your CV
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.slice(0, 12).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {skill}
                    </Badge>
                  ))}
                  {cvData.skills.length > 12 && (
                    <Badge variant="outline" className="text-blue-600 border-blue-300">
                      +{cvData.skills.length - 12} more skills
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 h-12 px-6"
            >
              <Filter size={20} />
              Filters
              {Object.keys(filters).length > 0 && (
                <Badge variant="default" className="ml-2">
                  {Object.keys(filters).length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <Input
                  type="text"
                  placeholder="e.g. London, Remote"
                  value={filters.location || ""}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>

              {/* Job Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  value={filters.type || ""}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value as Job["type"] | undefined })}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Remote Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Style</label>
                <select
                  value={filters.remote === undefined ? "" : String(filters.remote)}
                  onChange={(e) => setFilters({
                    ...filters,
                    remote: e.target.value === "" ? undefined : e.target.value === "true",
                  })}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="true">Remote</option>
                  <option value="false">On-site</option>
                </select>
              </div>

              {/* Skills Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <Input
                  type="text"
                  placeholder="e.g. React, Python"
                  value={filters.skills?.join(", ") || ""}
                  onChange={(e) => setFilters({
                    ...filters,
                    skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean),
                  })}
                />
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="flex items-center justify-between p-4">
              <span className="text-red-700">{error}</span>
              <Button variant="ghost" size="sm" onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                <X size={20} />
              </Button>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Jobs</h3>
            <p className="text-gray-600">Finding the best opportunities for you...</p>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredJobs.length} Job{filteredJobs.length !== 1 ? "s" : ""} Found
                </h2>
                <p className="text-gray-600 mt-1">
                  {cvData ? (
                    <>Showing AI-matched results based on your CV skills</>
                  ) : (
                    <>Upload your CV for personalized matches</>
                  )}
                </p>
              </div>
            </div>

            {/* Jobs Grid */}
            {filteredJobs.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <div className="text-gray-400 text-6xl mb-6">
                    <Briefcase className="mx-auto" size={80} />
                  </div>
                  <CardTitle className="text-2xl mb-4">No Jobs Found</CardTitle>
                  <CardDescription className="text-lg">
                    Try adjusting your search terms or filters to see more results.
                  </CardDescription>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredJobs.map((job) => {
                  const matchScore = getMatchScore(job);
                  const matchingSkills = cvData ? job.skills.filter(skill =>
                    cvData.skills.some(cvSkill =>
                      cvSkill.toLowerCase().includes(skill.toLowerCase()) ||
                      skill.toLowerCase().includes(cvSkill.toLowerCase())
                    )
                  ) : [];

                  return (
                    <Card key={job.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                      {/* Job Header */}
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2 text-gray-900">{job.title}</CardTitle>
                            <p className="text-lg font-medium text-gray-700">{job.company}</p>
                          </div>
                          {matchScore !== null && (
                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1">
                              <Star size={14} fill="currentColor" className="mr-1" />
                              {matchScore}% match
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            {job.type}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign size={16} />
                            {formatSalary(job.salary)}
                          </div>
                          {job.remote && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Remote
                            </Badge>
                          )}
                        </div>
                      </CardHeader>

                      {/* Job Description */}
                      <CardContent className="py-4">
                        <p className="text-gray-700 line-clamp-3 leading-relaxed">{job.description}</p>
                      </CardContent>

                      {/* Skills Section */}
                      <CardContent className="py-4 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Required Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 8).map((skill, index) => {
                            const isMatching = matchingSkills.includes(skill);
                            return (
                              <Badge
                                key={index}
                                variant={isMatching ? "default" : "secondary"}
                                className={isMatching
                                  ? "bg-green-100 text-green-800 border-2 border-green-300"
                                  : "bg-gray-100 text-gray-700"
                                }
                              >
                                {skill}
                                {isMatching && " ✓"}
                              </Badge>
                            );
                          })}
                          {job.skills.length > 8 && (
                            <Badge variant="outline" className="text-gray-500">
                              +{job.skills.length - 8} more
                            </Badge>
                          )}
                        </div>
                        {matchingSkills.length > 0 && (
                          <p className="text-green-600 text-sm mt-3 font-medium">
                            ✓ {matchingSkills.length} of {job.skills.length} skills match your CV
                          </p>
                        )}
                      </CardContent>

                      {/* Job Footer */}
                      <CardFooter className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                          Posted {formatDate(job.postedDate)} • {job.source}
                        </div>
                        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                          <a
                            href={job.applicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Apply Now
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Help Tooltip */}
      {!cvData && filteredJobs.length > 0 && (
        <Card className="fixed bottom-6 right-6 max-w-sm shadow-lg border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 p-2 rounded-full">
                <Upload size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">Get Better Matches!</h4>
                <p className="text-sm text-blue-700">
                  Upload your CV to see personalized job matches with AI-powered skill analysis.
                </p>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-600 h-6 w-6 p-0">
                <X size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
