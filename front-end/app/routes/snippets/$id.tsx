import { Link } from "react-router";
import { Button } from "../../components/ui/button";
import { api } from "../../lib/api";
import type { Snippet } from "../../lib/types";
import type { Route } from "./+types/$id";

export async function loader({
  params,
}: Route.LoaderArgs): Promise<{ snippet: Snippet }> {
  const { id } = params;

  if (!id) {
    throw new Response("Snippet ID is required", { status: 400 });
  }

  try {
    const snippet = await api.getSnippet(id);
    return { snippet };
  } catch (error) {
    console.error("Failed to load snippet:", error);
    throw new Response("Snippet not found", { status: 404 });
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/snippets">
            <Button variant="outline" size="sm">
              <svg
                className="w-4 h-4 mr-2"
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
              Back to Snippets
            </Button>
          </Link>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">
              Snippet Details
            </h1>
            <p className="text-slate-600 text-sm mt-1">ID: {snippet.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Snippet Text
              </h2>
              <div className="bg-slate-50 rounded-md p-4 border border-slate-200">
                <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed">
                  {snippet.text}
                </pre>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
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
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {snippet.summary}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigator.clipboard.writeText(snippet.text)}
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Copy to Clipboard
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigator.clipboard.writeText(snippet.summary)}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
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
