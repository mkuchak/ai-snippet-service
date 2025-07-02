export interface StreamingCallbacks {
  onChunk: (chunk: string) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export interface AIGateway {
  generateSummary(text: string): Promise<string>;
  generateSummaryWithStream(
    text: string,
    callbacks: StreamingCallbacks,
  ): Promise<void>;
}
