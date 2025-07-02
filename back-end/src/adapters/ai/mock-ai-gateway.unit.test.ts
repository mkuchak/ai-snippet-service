import { describe, expect, it, vi } from "vitest";
import type { StreamingCallbacks } from "../../core/ports/ai-service";
import { MockAIGateway } from "./mock-ai-gateway";

describe("MockAIGateway", () => {
  const mockAI = new MockAIGateway();

  describe("generateSummary", () => {
    it("should generate a summary with prefix", async () => {
      const text = "Hello world";
      const summary = await mockAI.generateSummary(text);

      expect(summary).toBe("Summary: Hello world");
    });

    it("should truncate long text with ellipsis", async () => {
      const longText =
        "This is a very long text that exceeds thirty characters";
      const summary = await mockAI.generateSummary(longText);

      expect(summary).toBe("Summary: This is a very long text that ...");
    });
  });

  describe("generateSummaryWithStream", () => {
    it("should stream summary in chunks", async () => {
      const text = "Hello world";

      const callbacks: StreamingCallbacks = {
        onChunk: vi.fn(),
        onComplete: vi.fn(),
        onError: vi.fn(),
      };

      await mockAI.generateSummaryWithStream(text, callbacks);

      expect(callbacks.onChunk).toHaveBeenCalled();
      expect(callbacks.onComplete).toHaveBeenCalledTimes(1);
      expect(callbacks.onError).not.toHaveBeenCalled();
    });
  });
});
