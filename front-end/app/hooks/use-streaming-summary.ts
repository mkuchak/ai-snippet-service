import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../lib/api";

interface StreamingState {
  content: string;
  error: string | null;
  isComplete: boolean;
  isStreaming: boolean;
}

export function useStreamingSummary(snippetId: string) {
  const [state, setState] = useState<StreamingState>({
    content: "",
    error: null,
    isComplete: false,
    isStreaming: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const startStreaming = useCallback(async () => {
    // Prevent duplicate requests
    if (abortControllerRef.current) {
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setState({
      content: "",
      error: null,
      isComplete: false,
      isStreaming: true,
    });

    try {
      await api.generateSummaryWithStream(
        snippetId,
        (chunk) => {
          setState((prev) => ({
            ...prev,
            content: prev.content + chunk,
          }));
        },
        () => {
          setState((prev) => ({
            ...prev,
            isComplete: true,
            isStreaming: false,
          }));
          abortControllerRef.current = null;
        },
        (error) => {
          setState((prev) => ({
            ...prev,
            error: error.message,
            isStreaming: false,
          }));
          abortControllerRef.current = null;
        },
        abortController.signal
      );
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        isStreaming: false,
      }));
      abortControllerRef.current = null;
    }
  }, [snippetId]);

  const retry = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    startStreaming();
  }, [startStreaming]);

  useEffect(() => {
    startStreaming();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [startStreaming]);

  return {
    ...state,
    retry,
  };
}
