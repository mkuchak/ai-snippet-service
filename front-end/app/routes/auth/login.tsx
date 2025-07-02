import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import type { Route } from "./+types/login";

export function meta(): Route.MetaDescriptors {
  return [
    { title: "Login - AI Snippets" },
    {
      name: "description",
      content: "Sign in to your AI Snippets account.",
    },
  ];
}

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-600 mt-2">Sign in to your AI Snippets account</p>
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
                <h3 className="text-sm font-medium text-blue-900 mb-1">Authentication Coming Soon</h3>
                <p className="text-sm text-blue-700">
                  This is a reserved route for authentication. Login functionality will be implemented in a future
                  version.
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-4">
            <Input type="email" label="Email" placeholder="Enter your email" disabled />

            <Input type="password" label="Password" placeholder="Enter your password" disabled />

            <Button className="w-full" disabled>
              Sign In (Coming Soon)
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <a href="/auth/register" className="text-slate-900 font-medium hover:underline">
                Sign up
              </a>
            </p>
            <a href="/snippets" className="text-sm text-slate-600 hover:text-slate-900 underline">
              Continue without signing in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
