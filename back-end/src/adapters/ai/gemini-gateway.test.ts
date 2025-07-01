import { describe, it, expect, vi, beforeEach } from "vitest";
import { GeminiGateway } from "./gemini-gateway";
import { LLMFactory } from "llm-factory";

vi.mock("llm-factory", () => ({
  LLMFactory: vi.fn(),
}));

describe("GeminiGateway", () => {
  let gateway: GeminiGateway;
  let mockGenerate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockGenerate = vi.fn();

    const MockedLLMFactory = vi.mocked(LLMFactory);
    MockedLLMFactory.mockImplementation(
      () =>
        ({
          generate: mockGenerate,
        } as unknown as LLMFactory)
    );

    gateway = new GeminiGateway();
  });

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
