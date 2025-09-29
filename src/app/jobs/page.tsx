"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import type { Job, JobSearchFilters } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobSearchFilters>({});
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [savingJobId, setSavingJobId] = useState<string | null>(null);

  const fetchJobs = async (searchFilters?: JobSearchFilters) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchFilters?.location) params.set("location", searchFilters.location);
      if (searchFilters?.type) params.set("type", searchFilters.type);
      if (searchFilters?.remote !== undefined) params.set("remote", String(searchFilters.remote));
      if (searchFilters?.skills && searchFilters.skills.length > 0) {
        params.set("skills", searchFilters.skills.join(","));
      }
      if (searchFilters?.salaryMin) params.set("salaryMin", String(searchFilters.salaryMin));
      if (searchFilters?.salaryMax) params.set("salaryMax", String(searchFilters.salaryMax));

      const response = await fetch(`/api/jobs?${params.toString()}`);
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

  // Fetch saved jobs
  const fetchSavedJobs = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/saved-jobs?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        const savedIds = new Set<string>(data.data.map((item: any) => item.job.id));
        setSavedJobIds(savedIds);
      }
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchSavedJobs();
    }
  }, [user]);

  const handleFilterChange = (newFilters: JobSearchFilters) => {
    setFilters(newFilters);
    fetchJobs(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    fetchJobs();
  };

  const handleSaveJob = async (jobId: string) => {
    if (!user?.id) {
      toast.error("Please sign in to save jobs");
      return;
    }

    setSavingJobId(jobId);
    try {
      const isSaved = savedJobIds.has(jobId);

      if (isSaved) {
        // Unsave job
        const response = await fetch(`/api/saved-jobs?userId=${user.id}&jobId=${jobId}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (data.success) {
          setSavedJobIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(jobId);
            return newSet;
          });
          toast.success("Job removed from saved list");
        }
      } else {
        // Save job
        const response = await fetch("/api/saved-jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id, jobId }),
        });
        const data = await response.json();

        if (data.success) {
          setSavedJobIds((prev) => new Set([...prev, jobId]));
          toast.success("Job saved successfully");
        }
      }
    } catch (err) {
      console.error("Error saving/unsaving job:", err);
      toast.error("Failed to save/unsave job");
    } finally {
      setSavingJobId(null);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600 font-medium">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Jobs</h1>
          <p className="text-gray-600">Find your next opportunity from our curated job listings</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  {Object.keys(filters).length > 0 && (
                    <Button
                      onClick={clearFilters}
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Clear all
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>

                <div className="space-y-6">
                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. London, Remote"
                      value={filters.location || ""}
                      onChange={(e) =>
                        handleFilterChange({ ...filters, location: e.target.value })
                      }
                    />
                  </div>

                {/* Job Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={filters.type || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        ...filters,
                        type: e.target.value as Job["type"] | undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Style
                  </label>
                  <select
                    value={filters.remote === undefined ? "" : String(filters.remote)}
                    onChange={(e) =>
                      handleFilterChange({
                        ...filters,
                        remote: e.target.value === "" ? undefined : e.target.value === "true",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="true">Remote</option>
                    <option value="false">On-site</option>
                  </select>
                </div>

                  {/* Skills Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills (comma-separated)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. React, Python, AWS"
                      value={filters.skills?.join(", ") || ""}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                    />
                  </div>

                  {/* Salary Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Range (GBP)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.salaryMin || ""}
                        onChange={(e) =>
                          handleFilterChange({
                            ...filters,
                            salaryMin: e.target.value ? parseInt(e.target.value) : undefined,
                          })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.salaryMax || ""}
                        onChange={(e) =>
                          handleFilterChange({
                            ...filters,
                            salaryMax: e.target.value ? parseInt(e.target.value) : undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            {error && (
              <Card className="border-red-200 bg-red-50 mb-6">
                <CardContent className="p-4 text-red-700">
                  {error}
                </CardContent>
              </Card>
            )}

            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {jobs.length === 0 && !error ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-400 text-6xl mb-4">📄</div>
                  <CardTitle className="text-lg mb-2">No jobs found</CardTitle>
                  <p className="text-gray-600">Try adjusting your filters to see more results.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <Card key={job.id} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                              <p className="text-lg text-gray-700">{job.company}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveJob(job.id)}
                              disabled={savingJobId === job.id}
                              className="ml-2"
                            >
                              {savedJobIds.has(job.id) ? (
                                <BookmarkCheck className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Bookmark className="h-5 w-5" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              📍 {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              💼 {job.type}
                            </span>
                            {job.remote && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Remote
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-lg font-semibold text-green-600">
                            {formatSalary(job.salary)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Posted {formatDate(job.postedDate)}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 6).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 6 && (
                            <span className="text-sm text-gray-500">
                              +{job.skills.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Source: {job.source}</span>
                        <Button asChild className="bg-blue-600 hover:bg-blue-700">
                          <a
                            href={job.applicationUrl}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
