import { Link, useLocation } from "react-router";
import { cn } from "../lib/utils";

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-slate-900">
            <span className="text-blue-600">AI</span> Content Summarizer
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-slate-900",
                isActive("/") && location.pathname === "/" ? "text-slate-900" : "text-slate-600"
              )}
            >
              Home
            </Link>
            <Link
              to="/snippets"
              className={cn(
                "text-sm font-medium transition-colors hover:text-slate-900",
                isActive("/snippets") ? "text-slate-900" : "text-slate-600"
              )}
            >
              Summarize
            </Link>
            <Link
              to="/auth/login"
              className={cn(
                "text-sm font-medium transition-colors hover:text-slate-900",
                isActive("/auth") ? "text-slate-900" : "text-slate-600"
              )}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
