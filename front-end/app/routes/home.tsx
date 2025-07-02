import { Link } from "react-router";
import { Button } from "../components/ui/button";
import type { Route } from "./+types/home";

export function meta() {
  return [
    {
      title:
        "AI Content Summarizer - Transform Your Text into Actionable Summaries",
    },
    {
      name: "description",
      content:
        "Help content teams quickly summarize blog drafts, transcripts, and raw text with AI-powered summaries.",
    },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_EXPRESS };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Turn Raw Content into
            <span className="text-blue-600"> Smart Summaries</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Content teams need quick, actionable summaries. Paste your blog
            drafts, meeting transcripts, or any raw text and get AI-generated
            summaries you can reuse across your content workflow.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <Link to="/snippets">
              <Button size="lg" className="px-8">
                Try It Now
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button variant="outline" size="lg" className="px-8">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Quick Demo */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 max-w-2xl mx-auto text-left">
            <p className="text-sm text-slate-500 mb-2">
              Example: Paste raw content like this...
            </p>
            <div className="bg-slate-50 p-4 rounded text-sm text-slate-700 mb-4 font-mono">
              "Today's team meeting covered three key areas: budget allocation
              for Q2, new product feature requests from customer feedback, and
              upcoming marketing campaign strategies for the summer launch..."
            </div>
            <p className="text-sm text-slate-500 mb-2">
              ...and get an instant AI summary:
            </p>
            <div className="bg-blue-50 p-4 rounded text-sm text-slate-700 border-l-4 border-blue-400">
              <strong>Meeting Summary:</strong> Q2 budget planning,
              customer-driven feature requests, and summer marketing campaign
              development were the primary discussion points.
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-blue-600"
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
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Instant AI Summaries
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Transform lengthy blog drafts, meeting transcripts, and raw
              content into concise, actionable summaries in seconds.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a3 3 0 01-3-3V9a3 3 0 013-3h8a3 3 0 013 3v0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Content Team Focused
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Built specifically for content teams who need to process various
              text formats and create reusable summaries for their workflows.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-purple-600"
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
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Reusable Anywhere
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Copy summaries to use in presentations, emails, reports, or any
              other content where you need clear, concise information.
            </p>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
            Perfect For Content Teams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h4 className="font-semibold text-slate-900 mb-3">
                📝 Blog & Article Drafts
              </h4>
              <p className="text-slate-600 text-sm">
                Quickly summarize long-form content drafts to create social
                media posts, email newsletters, or executive summaries.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h4 className="font-semibold text-slate-900 mb-3">
                🎤 Meeting Transcripts
              </h4>
              <p className="text-slate-600 text-sm">
                Transform lengthy meeting recordings into actionable takeaways
                and key decision points for your team.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h4 className="font-semibold text-slate-900 mb-3">
                📄 Research Notes
              </h4>
              <p className="text-slate-600 text-sm">
                Condense research findings, customer interviews, and market
                analysis into digestible insights for stakeholders.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h4 className="font-semibold text-slate-900 mb-3">
                📊 Reports & Documents
              </h4>
              <p className="text-slate-600 text-sm">
                Create executive summaries from detailed reports, proposals, and
                strategic documents for busy decision-makers.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-lg border border-slate-200 p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Streamline Your Content Workflow?
            </h2>
            <p className="text-slate-600 mb-6">
              Join content teams who are saving hours of work with AI-powered
              text summarization. Paste your content and see the magic happen.
            </p>
            <Link to="/snippets">
              <Button className="px-8">Start Summarizing Content</Button>
            </Link>
          </div>
        </div>

        {/* Development Status */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Server Status: {loaderData.message}
          </p>
        </div>
      </div>
    </div>
  );
}
