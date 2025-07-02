import { useState } from "react";
import { Link, useRevalidator, redirect } from "react-router";
import { StreamingSummary } from "../../components/snippets/streaming-summary";
import { Button } from "../../components/ui/button";
import { LoadingSpinner } from "../../components/ui/loading";
import { Toast, useToast } from "../../components/ui/toast";
import { api } from "../../lib/api";
import type { Snippet } from "../../lib/types";
import type { Route } from "./+types/$id";

export async function loader({
  params,
}: Route.LoaderArgs): Promise<{ snippet: Snippet } | Response> {
  const { id } = params;

  if (!id) {
    throw new Response("Snippet ID is required", { status: 400 });
  }

  try {
    const snippet = await api.getSnippet(id);
    return { snippet };
  } catch (error) {
    console.error("Failed to load snippet:", error);
    return redirect("/snippets");
  }
}
export function meta({ data }: Route.MetaArgs): Route.MetaDescriptors {
  if (!data?.snippet) {
    return [{ title: "Snippet Not Found" }];
  }

  return [
    { title: `${data.snippet.summary} - AI Snippets` },
    {
      name: "description",
      content: `View and manage your snippet: ${data.snippet.summary}`,
    },
  ];
}

export default function SnippetDetail({ loaderData }: Route.ComponentProps) {
  const { snippet } = loaderData;
  const { toast, showToast, hideToast } = useToast();
  const revalidator = useRevalidator();
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(
    !snippet.summary
  );

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(snippet.text);
      showToast("Snippet copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy snippet:", error);
      showToast("Failed to copy snippet");
    }
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(snippet.summary);
      showToast("Summary copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy summary:", error);
      showToast("Failed to copy summary");
    }
  };

  const handleSummaryComplete = () => {
    setIsGeneratingSummary(false);
    setTimeout(() => {
      revalidator.revalidate();
    }, 1000);
  };

  const handleStreamingStateChange = (isStreaming: boolean) => {
    setIsGeneratingSummary(isStreaming);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="space-y-4 mb-6 sm:mb-8">
          <div className="flex items-center justify-between gap-2">
            <Link to="/snippets" className="flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
              >
                <svg
                  className="w-4 h-4 sm:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline">Back to Snippets</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Snippet Details
            </h1>
            <div className="flex items-start gap-2">
              <span className="text-slate-600 text-xs sm:text-sm flex-shrink-0">
                ID:
              </span>
              <p className="text-slate-600 text-xs sm:text-sm font-mono break-all">
                {snippet.id}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="order-2 lg:order-1 lg:col-span-2">
            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">
                Snippet Text
              </h2>
              <div className="bg-slate-50 rounded-md p-3 sm:p-4 border border-slate-200 overflow-auto">
                <pre className="whitespace-pre-wrap text-xs sm:text-sm text-slate-700 font-mono leading-relaxed">
                  {snippet.text}
                </pre>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                AI Summary
                {isGeneratingSummary && (
                  <LoadingSpinner size="sm" className="ml-2" />
                )}
              </h3>

              {snippet.summary ? (
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {snippet.summary}
                </p>
              ) : (
                <StreamingSummary
                  snippetId={snippet.id}
                  onSummaryComplete={handleSummaryComplete}
                  onStreamingStateChange={handleStreamingStateChange}
                />
              )}
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                  onClick={handleCopySnippet}
                >
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy Snippet
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                  onClick={handleCopySummary}
                >
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy Summary
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
