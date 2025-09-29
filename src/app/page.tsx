import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Build Your CV, Find Your{" "}
              <span className="text-blue-600">Dream Job</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create a professional CV through AI-powered conversation, then get matched
              with the most relevant job opportunities tailored to your skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg shadow-lg">
                <Link href="/cv-builder">
                  Build My CV
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                <Link href="/job-matcher">
                  Find Jobs
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg">
                <Link href="/jobs">
                  Browse Jobs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform makes job searching smarter and more efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <CardTitle className="text-xl">Conversational CV Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Build your professional CV through a simple chat conversation with our AI assistant - no formatting hassle.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <CardTitle className="text-xl">AI-Powered Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Get instant suggestions to improve your CV, enhance your skills presentation, and stand out to recruiters.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <CardTitle className="text-xl">Smart Job Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Receive personalized job recommendations with match scores and skill gap analysis based on your CV.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
                <div className="text-gray-600">Job Listings</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <div className="text-gray-600">Match Accuracy</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-600">Skills Detected</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-gray-600">Available</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose JobMatcher?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex items-start space-x-4 pt-6">
                  <Badge className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                    ✓
                  </Badge>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Smart Skill Detection
                    </h3>
                    <p className="text-gray-600">
                      Our AI identifies both technical and soft skills from your CV automatically.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex items-start space-x-4 pt-6">
                  <Badge className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 flex items-center justify-center rounded-full">
                    ✓
                  </Badge>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Personalized Matches
                    </h3>
                    <p className="text-gray-600">
                      Get job recommendations tailored specifically to your skills and experience.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex items-start space-x-4 pt-6">
                  <Badge className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 flex items-center justify-center rounded-full">
                    ✓
                  </Badge>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Skill Gap Analysis
                    </h3>
                    <p className="text-gray-600">
                      Identify skills you need to develop for your dream job.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex items-start space-x-4 pt-6">
                  <Badge className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 flex items-center justify-center rounded-full">
                    ✓
                  </Badge>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Real-time Updates
                    </h3>
                    <p className="text-gray-600">
                      Access fresh job listings from multiple sources updated regularly.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Dream Job?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have found their perfect career match with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg">
              <Link href="/cv-builder">
                Build My CV Now
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-blue-500 text-white hover:bg-blue-400 px-8 py-6 text-lg">
              <Link href="/job-matcher">
                Find Jobs
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
