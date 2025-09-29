import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "sonner";
import SessionProvider from "@/components/providers/SessionProvider";
import NavBar from "@/components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Job Matcher - Find Your Perfect Job",
  description: "Upload your CV and get matched with relevant job opportunities using AI-powered analysis",
  keywords: "job matching, CV analysis, career search, AI recruitment, job finder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
      >
        <SessionProvider>
          <NavBar />
          <main>{children}</main>
          <Toaster position="top-right" richColors />

        <footer className="bg-gray-900 text-white mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">🎯 JobMatcher</h3>
                <p className="text-gray-400">
                  AI-powered CV analysis and job matching platform to help you find your perfect career opportunity.
                </p>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-4">Job Search</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/jobs" className="text-blue-400 hover:text-blue-300">
                      Browse Jobs
                    </Link>
                  </li>
                  <li>
                    <Link href="/my-applications" className="text-blue-400 hover:text-blue-300">
                      My Applications
                    </Link>
                  </li>
                  <li>
                    <Link href="/job-matcher" className="text-blue-400 hover:text-blue-300">
                      Job Matcher
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-4">Career Tools</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/upload-cv" className="text-blue-400 hover:text-blue-300">
                      Upload CV
                    </Link>
                  </li>
                  <li>
                    <Link href="/cover-letter" className="text-blue-400 hover:text-blue-300">
                      Cover Letter Generator
                    </Link>
                  </li>
                  <li>
                    <Link href="/interview-practice" className="text-blue-400 hover:text-blue-300">
                      Interview Practice
                    </Link>
                  </li>
                  <li>
                    <Link href="/skill-gap" className="text-blue-400 hover:text-blue-300">
                      Skill Gap Analysis
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-4">Features</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>CV Analysis & Skills Extraction</li>
                  <li>AI-Powered Job Matching</li>
                  <li>Application Tracking</li>
                  <li>Career Development Tools</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 JobMatcher. Helping job seekers find their perfect match.</p>
            </div>
          </div>
        </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
