"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Trash2, CheckCircle, Bookmark, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SavedJobData {
  savedJobId: string;
  job: {
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
  };
  applied: boolean;
  appliedAt: Date | null;
  notes: string | null;
  savedAt: Date;
}

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<SavedJobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingJobId, setUpdatingJobId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({});

  const fetchSavedJobs = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/saved-jobs?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setSavedJobs(data.data);
        // Initialize notes state
        const notesMap: { [key: string]: string } = {};
        data.data.forEach((item: SavedJobData) => {
          notesMap[item.savedJobId] = item.notes || "";
        });
        setEditingNotes(notesMap);
      } else {
        setError(data.error || "Failed to fetch saved jobs");
      }
    } catch (err) {
      setError("Failed to fetch saved jobs. Please try again.");
      console.error("Error fetching saved jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchSavedJobs();
    } else if (user === null) {
      setLoading(false);
    }
  }, [user]);

  const handleMarkAsApplied = async (savedJobId: string, currentStatus: boolean) => {
    setUpdatingJobId(savedJobId);
    try {
      const response = await fetch(`/api/saved-jobs/${savedJobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applied: !currentStatus,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh saved jobs
        await fetchSavedJobs();
      }
    } catch (err) {
      console.error("Error updating job status:", err);
    } finally {
      setUpdatingJobId(null);
    }
  };

  const handleUpdateNotes = async (savedJobId: string) => {
    setUpdatingJobId(savedJobId);
    try {
      const response = await fetch(`/api/saved-jobs/${savedJobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: editingNotes[savedJobId],
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchSavedJobs();
      }
    } catch (err) {
      console.error("Error updating notes:", err);
    } finally {
      setUpdatingJobId(null);
    }
  };

  const handleDeleteSavedJob = async (jobId: string) => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/saved-jobs?userId=${user.id}&jobId=${jobId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        await fetchSavedJobs();
      }
    } catch (err) {
      console.error("Error deleting saved job:", err);
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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const savedOnlyJobs = savedJobs.filter((item) => !item.applied);
  const appliedJobs = savedJobs.filter((item) => item.applied);

  const JobCard = ({ item }: { item: SavedJobData }) => (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.job.title}</h3>
            <p className="text-lg text-gray-700">{item.job.company}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">📍 {item.job.location}</span>
              <span className="flex items-center gap-1">💼 {item.job.type}</span>
              {item.job.remote && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Remote
                </Badge>
              )}
              {item.applied && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Applied
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right ml-4">
            <div className="text-lg font-semibold text-green-600">
              {formatSalary(item.job.salary)}
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-2">{item.job.description}</p>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {item.job.skills.slice(0, 6).map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                {skill}
              </Badge>
            ))}
            {item.job.skills.length > 6 && (
              <span className="text-sm text-gray-500">+{item.job.skills.length - 6} more</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900">Notes:</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdateNotes(item.savedJobId)}
              disabled={updatingJobId === item.savedJobId}
            >
              Save Notes
            </Button>
          </div>
          <Textarea
            placeholder="Add notes about this application..."
            value={editingNotes[item.savedJobId] || ""}
            onChange={(e) =>
              setEditingNotes({ ...editingNotes, [item.savedJobId]: e.target.value })
            }
            className="min-h-[80px]"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Bookmark className="h-3 w-3" />
            Saved: {formatDate(item.savedAt)}
          </span>
          {item.appliedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Applied: {formatDate(item.appliedAt)}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-2">
            <Button
              variant={item.applied ? "outline" : "default"}
              size="sm"
              onClick={() => handleMarkAsApplied(item.savedJobId, item.applied)}
              disabled={updatingJobId === item.savedJobId}
            >
              {item.applied ? "Mark as Not Applied" : "Mark as Applied"}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Remove saved job?</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to remove this job from your saved list? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteSavedJob(item.job.id)}
                  >
                    Remove
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700" size="sm">
            <a href={item.job.applicationUrl} target="_blank" rel="noopener noreferrer">
              View Job
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600 font-medium">Loading your applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <p className="text-red-700 mb-4">{error}</p>
              <Button asChild>
                <a href="/jobs">Browse Jobs</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track your saved jobs and application progress</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">All ({savedJobs.length})</TabsTrigger>
            <TabsTrigger value="saved">Saved ({savedOnlyJobs.length})</TabsTrigger>
            <TabsTrigger value="applied">Applied ({appliedJobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {savedJobs.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <CardTitle className="text-lg mb-2">No saved jobs yet</CardTitle>
                  <p className="text-gray-600 mb-4">
                    Start saving jobs to track your applications
                  </p>
                  <Button asChild>
                    <a href="/jobs">Browse Jobs</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {savedJobs.map((item) => (
                  <JobCard key={item.savedJobId} item={item} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            {savedOnlyJobs.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-400 text-6xl mb-4">🔖</div>
                  <CardTitle className="text-lg mb-2">No saved jobs</CardTitle>
                  <p className="text-gray-600">All your saved jobs have been marked as applied</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {savedOnlyJobs.map((item) => (
                  <JobCard key={item.savedJobId} item={item} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="applied" className="mt-6">
            {appliedJobs.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-400 text-6xl mb-4">✉️</div>
                  <CardTitle className="text-lg mb-2">No applications yet</CardTitle>
                  <p className="text-gray-600">
                    Mark jobs as applied to track your application progress
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {appliedJobs.map((item) => (
                  <JobCard key={item.savedJobId} item={item} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
