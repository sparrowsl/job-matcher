"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

export default function NavBar() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              🎯 JobMatcher
            </Link>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            {user ? (
              <>
                <Link
                  href="/jobs"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Jobs
                </Link>
                <Link
                  href="/my-applications"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Applications
                </Link>
                <Link
                  href="/cover-letter"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Cover Letter
                </Link>
                <Link
                  href="/interview-practice"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Interview Prep
                </Link>
                <Link
                  href="/skill-gap"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Skill Gap
                </Link>
                <Link
                  href="/upload-cv"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Upload CV
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline">{user.name || user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  href="/jobs"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Jobs
                </Link>
                {!loading && (
                  <>
                    <Link href="/auth/signin">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
