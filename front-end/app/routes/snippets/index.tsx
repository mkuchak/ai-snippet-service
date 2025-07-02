import { useState } from "react";
import { redirect } from "react-router";
import { SnippetForm } from "../../components/snippets/snippet-form";
import { SnippetList } from "../../components/snippets/snippet-list";
import { Button } from "../../components/ui/button";
import { api } from "../../lib/api";
import type { Snippet } from "../../lib/types";
import type { Route } from "./+types/index";

export async function loader(): Promise<{ snippets: Snippet[] }> {
  try {
    const snippets = await api.getAllSnippets();
    return { snippets };
  } catch (error) {
    console.error("Failed to load snippets:", error);
    return { snippets: [] };
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const text = formData.get("text") as string;

  if (!text || !text.trim()) {
    return { error: "Content text is required" };
  }

  try {
    const snippet = await api.createSnippet({ text: text.trim() });
    return redirect(`/snippets/${snippet.id}`);
  } catch (error) {
    console.error("Failed to create summary:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to create summary",
    };
  }
}
export function meta(): Route.MetaDescriptors {
  return [
    { title: "AI Content Summarizer - Transform Your Text" },
    {
      name: "description",
      content:
        "Paste your raw content and get instant AI-generated summaries for blog drafts, transcripts, and more.",
    },
  ];
}

export default function SnippetsIndex({ loaderData }: Route.ComponentProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { snippets } = loaderData;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Content Summarizer
            </h1>
            <p className="text-slate-600 mt-1">
              Transform your raw content into actionable AI-powered summaries
            </p>
          </div>

          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            variant={showCreateForm ? "outline" : "primary"}
          >
            {showCreateForm ? "Cancel" : "Summarize New Content"}
          </Button>
        </div>

        {snippets.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 13.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p className="text-yellow-800 text-sm">
                No content found yet. This could mean the API connection is
                having issues or you haven't created any summaries yet.
              </p>
            </div>
          </div>
        )}

        {!showCreateForm && snippets.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-blue-600 mt-1 mr-4 flex-shrink-0"
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
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  How to Get Started
                </h3>
                <div className="text-blue-800 space-y-2">
                  <p>
                    📝 <strong>Step 1:</strong> Click "Summarize New Content"
                    above
                  </p>
                  <p>
                    📋 <strong>Step 2:</strong> Paste your raw text (blog draft,
                    transcript, notes, etc.)
                  </p>
                  <p>
                    ✨ <strong>Step 3:</strong> Get an instant AI-generated
                    summary you can reuse anywhere
                  </p>
                </div>
                <p className="text-sm text-blue-700 mt-3">
                  Perfect for content teams working with blog drafts, meeting
                  transcripts, research notes, and any text that needs
                  summarizing.
                </p>
              </div>
            </div>
          </div>
        )}

        {showCreateForm && (
          <div className="mb-8">
            <SnippetForm onCancel={() => setShowCreateForm(false)} />
          </div>
        )}

        <SnippetList snippets={snippets} />
      </div>
    </div>
  );
}
