import { useEffect } from "react";
import { useStreamingSummary } from "../../hooks/use-streaming-summary";

interface StreamingSummaryProps {
  snippetId: string;
  onSummaryComplete: (summary: string) => void;
  onStreamingStateChange?: (isStreaming: boolean) => void;
}

export function StreamingSummary({
  snippetId,
  onSummaryComplete,
  onStreamingStateChange,
}: StreamingSummaryProps) {
  const { content, error, isComplete, isStreaming, retry } =
    useStreamingSummary(snippetId);

  // Handle completion callback
  useEffect(() => {
    if (isComplete && content) {
      onSummaryComplete(content);
    }
  }, [isComplete, content, onSummaryComplete]);

  // Handle streaming state change callback
  useEffect(() => {
    onStreamingStateChange?.(isStreaming);
  }, [isStreaming, onStreamingStateChange]);

  if (error) {
    return (
      <div className="text-sm sm:text-base text-slate-700 leading-relaxed">
        <span className="text-red-600">Error generating summary: {error}</span>
        <br />
        <button
          onClick={retry}
          className="text-blue-600 hover:text-blue-800 underline mt-2 text-sm"
          disabled={isStreaming}
          type="button"
        >
          {isStreaming ? "Generating..." : "Try again"}
        </button>
      </div>
    );
  }

  return (
    <div className="text-sm sm:text-base text-slate-700 leading-relaxed">
      {content || (
        <span className="text-slate-400 italic">Generating summary...</span>
      )}
      {!isComplete && content && (
        <span className="inline-block w-2 h-4 bg-slate-400 animate-pulse ml-1" />
      )}
    </div>
  );
}
