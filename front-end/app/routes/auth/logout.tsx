import { useEffect } from "react";
import { Navigate } from "react-router";
import type { Route } from "./+types/logout";

export function meta(): Route.MetaDescriptors {
  return [
    { title: "Logout - AI Snippets" },
    {
      name: "description",
      content: "You have been logged out of AI Snippets.",
    },
  ];
}

export default function Logout() {
  useEffect(() => {
    // In the future, this would handle actual logout logic
    // For now, it's just a placeholder that redirects
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Logged Out</h1>
            <p className="text-slate-600 mt-2">You have been successfully logged out</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">Logout Placeholder</h3>
                <p className="text-sm text-blue-700">
                  This is a reserved route for logout functionality. Actual session management will be implemented
                  later.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href="/auth/login"
              className="w-full bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 inline-flex items-center justify-center rounded-md font-medium transition-colors"
            >
              Sign In Again
            </a>
            <a
              href="/snippets"
              className="w-full border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2 inline-flex items-center justify-center rounded-md font-medium transition-colors"
            >
              Continue to Snippets
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
