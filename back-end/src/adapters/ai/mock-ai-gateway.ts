import type {
  AIService,
  StreamingCallbacks,
} from "../../core/ports/ai-service";

export class MockAIGateway implements AIService {
  async generateSummary(text: string): Promise<string> {
    return `Summary: ${text.substring(0, 30)}${text.length > 30 ? "..." : ""}`;
  }

  async generateSummaryWithStream(
    text: string,
    callbacks: StreamingCallbacks,
  ): Promise<void> {
    try {
      const summary = `Summary: ${text.substring(0, 30)}${text.length > 30 ? "..." : ""}`;

      for (let i = 0; i < summary.length; i += 5) {
        const chunk = summary.substring(i, i + 5);
        callbacks.onChunk(chunk);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      callbacks.onComplete?.();
    } catch (error) {
      if (callbacks.onError) {
        callbacks.onError(error as Error);
      } else {
        throw error;
      }
    }
  }
}
