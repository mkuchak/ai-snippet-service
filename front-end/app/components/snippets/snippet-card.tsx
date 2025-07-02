import { Link } from "react-router";
import type { Snippet } from "../../lib/types";
import { truncateText } from "../../lib/utils";

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  return (
    <Link
      to={`/snippets/${snippet.id}`}
      className="block bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200 hover:border-slate-300"
    >
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
          {snippet.summary}
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed">
          {truncateText(snippet.text, 150)}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            ID: {snippet.id.slice(0, 8)}...
          </span>
          <div className="flex items-center text-slate-400">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-xs">View</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
