import { describe, it, expect } from "vitest";
import { MockAIGateway } from "./mock-ai-gateway";

describe("MockAIGateway", () => {
  const mockAI = new MockAIGateway();

  it("should generate a summary with prefix", async () => {
    const text = "Hello world";
    const summary = await mockAI.generateSummary(text);
    
    expect(summary).toBe("Summary: Hello world");
  });

  it("should truncate long text with ellipsis", async () => {
    const longText = "This is a very long text that exceeds thirty characters";
    const summary = await mockAI.generateSummary(longText);
    
    expect(summary).toBe("Summary: This is a very long text that ...");
  });
}); 