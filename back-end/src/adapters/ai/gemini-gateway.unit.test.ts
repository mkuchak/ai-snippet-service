import { LLMFactory } from "llm-factory";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { StreamingCallbacks } from "../../core/ports/ai-gateway";
import { GeminiGateway } from "./gemini-gateway";

vi.mock("llm-factory", () => ({
  LLMFactory: vi.fn(),
}));

// As it is a mocking test, it is a unit test
describe("GeminiGateway", () => {
  let gateway: GeminiGateway;
  let mockGenerate: ReturnType<typeof vi.fn>;
  let mockGenerateStream: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockGenerate = vi.fn();
    mockGenerateStream = vi.fn();

    const MockedLLMFactory = vi.mocked(LLMFactory);
    MockedLLMFactory.mockImplementation(
      () =>
        ({
          generate: mockGenerate,
          generateStream: mockGenerateStream,
        }) as unknown as LLMFactory,
    );

    gateway = new GeminiGateway();
  });

  describe("generateSummary", () => {
    it("should generate summary from text", async () => {
      const input = "This is a long piece of text that needs to be summarized";
      const expectedSummary = "Text summary example";

      mockGenerate.mockResolvedValue({
        text: expectedSummary,
        metadata: {
          model: "gemini-2.0-flash",
          inputTokens: 10,
          outputTokens: 5,
          cost: 0.001,
        },
      });

      const output = await gateway.generateSummary(input);

      expect(output).toBe(expectedSummary);
      expect(mockGenerate).toHaveBeenCalledWith({
        model: "gemini-2.0-flash",
        prompt: expect.stringContaining(input),
        temperature: 0.3,
      });
    });

    it("should handle empty text", async () => {
      const input = "";
      const expectedSummary = "No content to summarize";

      mockGenerate.mockResolvedValue({
        text: expectedSummary,
        metadata: {
          model: "gemini-2.0-flash",
          inputTokens: 1,
          outputTokens: 3,
          cost: 0.0001,
        },
      });

      const output = await gateway.generateSummary(input);

      expect(output).toBe(expectedSummary);
    });
  });

  describe("generateSummaryWithStream", () => {
    it("should stream summary chunks and call onComplete", async () => {
      const input = "This is a test text for streaming";
      const chunks = ["Hello", " world", " from", " streaming"];

      const mockStream = {
        [Symbol.asyncIterator]: async function* () {
          for (const chunk of chunks) {
            yield chunk;
          }
        },
      };

      mockGenerateStream.mockReturnValue({ stream: mockStream });

      const callbacks: StreamingCallbacks = {
        onChunk: vi.fn(),
        onComplete: vi.fn(),
        onError: vi.fn(),
      };

      await gateway.generateSummaryWithStream(input, callbacks);

      expect(mockGenerateStream).toHaveBeenCalledWith({
        model: "gemini-2.0-flash",
        prompt: expect.stringContaining(input),
        temperature: 0.3,
      });

      expect(callbacks.onChunk).toHaveBeenCalledTimes(4);
      expect(callbacks.onChunk).toHaveBeenNthCalledWith(1, "Hello");
      expect(callbacks.onChunk).toHaveBeenNthCalledWith(2, " world");
      expect(callbacks.onChunk).toHaveBeenNthCalledWith(3, " from");
      expect(callbacks.onChunk).toHaveBeenNthCalledWith(4, " streaming");
      expect(callbacks.onComplete).toHaveBeenCalledTimes(1);
      expect(callbacks.onError).not.toHaveBeenCalled();
    });

    it("should skip empty chunks", async () => {
      const input = "Test text";
      const chunks = ["Hello", "", " world", null, " test"];

      const mockStream = {
        [Symbol.asyncIterator]: async function* () {
          for (const chunk of chunks) {
            yield chunk;
          }
        },
      };

      mockGenerateStream.mockReturnValue({ stream: mockStream });

      const callbacks: StreamingCallbacks = {
        onChunk: vi.fn(),
        onComplete: vi.fn(),
        onError: vi.fn(),
      };

      await gateway.generateSummaryWithStream(input, callbacks);

      expect(callbacks.onChunk).toHaveBeenCalledTimes(3);
      expect(callbacks.onChunk).toHaveBeenNthCalledWith(1, "Hello");
      expect(callbacks.onChunk).toHaveBeenNthCalledWith(2, " world");
      expect(callbacks.onChunk).toHaveBeenNthCalledWith(3, " test");
      expect(callbacks.onComplete).toHaveBeenCalledTimes(1);
    });

    it("should handle streaming errors with onError callback", async () => {
      const input = "Test text";
      const error = new Error("Streaming failed");

      mockGenerateStream.mockImplementation(() => {
        throw error;
      });

      const callbacks: StreamingCallbacks = {
        onChunk: vi.fn(),
        onComplete: vi.fn(),
        onError: vi.fn(),
      };

      await gateway.generateSummaryWithStream(input, callbacks);

      expect(callbacks.onChunk).not.toHaveBeenCalled();
      expect(callbacks.onComplete).not.toHaveBeenCalled();
      expect(callbacks.onError).toHaveBeenCalledWith(error);
    });

    it("should throw error when no onError callback is provided", async () => {
      const input = "Test text";
      const error = new Error("Streaming failed");

      mockGenerateStream.mockImplementation(() => {
        throw error;
      });

      const callbacks: StreamingCallbacks = {
        onChunk: vi.fn(),
        onComplete: vi.fn(),
      };

      await expect(
        gateway.generateSummaryWithStream(input, callbacks),
      ).rejects.toThrow("Streaming failed");
    });

    it("should handle async iteration errors with onError callback", async () => {
      const input = "Test text";
      const error = new Error("Stream iteration failed");

      const mockStream = {
        [Symbol.asyncIterator]: async function* () {
          yield "Hello";
          throw error;
        },
      };

      mockGenerateStream.mockReturnValue({ stream: mockStream });

      const callbacks: StreamingCallbacks = {
        onChunk: vi.fn(),
        onComplete: vi.fn(),
        onError: vi.fn(),
      };

      await gateway.generateSummaryWithStream(input, callbacks);

      expect(callbacks.onChunk).toHaveBeenCalledWith("Hello");
      expect(callbacks.onComplete).not.toHaveBeenCalled();
      expect(callbacks.onError).toHaveBeenCalledWith(error);
    });
  });
});

// This test is skipped because it consumes tokens from the Gemini API
// If applicable, it would be a integration test instead of a unit test
describe.skip("GeminiGateway - Real Integration", () => {
  it("should generate real summary using actual Gemini API", async () => {
    vi.doUnmock("llm-factory");
    vi.resetModules();

    const { GeminiGateway: RealGeminiGateway } = await import(
      "./gemini-gateway"
    );

    const gateway = new RealGeminiGateway();
    const input =
      "Artificial intelligence is transforming the way we work and live. Machine learning algorithms can now process vast amounts of data to identify patterns and make predictions. This technology is being applied in healthcare, finance, transportation, and many other industries to improve efficiency and outcomes.";

    const output = await gateway.generateSummary(input);

    expect(output).toBeDefined();
    expect(typeof output).toBe("string");
    expect(output.length).toBeGreaterThan(0);
    expect(output).not.toBe("No content to summarize");
    console.log("Real Gemini response:", output);
  }, 10000);

  it("should stream real summary using actual Gemini API", async () => {
    vi.doUnmock("llm-factory");
    vi.resetModules();

    const { GeminiGateway: RealGeminiGateway } = await import(
      "./gemini-gateway"
    );

    const gateway = new RealGeminiGateway();
    const input =
      "Machine learning is revolutionizing data analysis across industries.";

    let streamedContent = "";
    let completed = false;

    const callbacks: StreamingCallbacks = {
      onChunk: (chunk) => {
        streamedContent += chunk;
      },
      onComplete: () => {
        completed = true;
      },
      onError: (error) => {
        throw error;
      },
    };

    await gateway.generateSummaryWithStream(input, callbacks);

    expect(streamedContent).toBeDefined();
    expect(typeof streamedContent).toBe("string");
    expect(streamedContent.length).toBeGreaterThan(0);
    expect(completed).toBe(true);
    console.log("Real Gemini streaming response:", streamedContent);
  }, 15000);
});
