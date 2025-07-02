import { beforeEach, describe, expect, it } from "vitest";
import { MockAIGateway } from "../../adapters/ai/mock-ai-gateway";
import { InMemorySnippetDAO } from "../../adapters/database/in-memory-snippet-dao";
import { SnippetService } from "./snippet-service";

describe("SnippetService Integration Test", () => {
  let snippetService: SnippetService;
  let dao: InMemorySnippetDAO;
  let aiGateway: MockAIGateway;

  beforeEach(() => {
    dao = new InMemorySnippetDAO();
    dao.clear();
    aiGateway = new MockAIGateway();
    snippetService = new SnippetService(dao, aiGateway);
  });

  it("should create a snippet with AI-generated summary", async () => {
    const text = "This is a sample code snippet for testing purposes";
    const snippet = await snippetService.createSnippet(text);

    expect(snippet.id).toBeDefined();
    expect(snippet.text).toBe(text);
    expect(snippet.summary).toBe("Summary: This is a sample code snippet ...");
    expect(snippet.createdAt).toBeInstanceOf(Date);
  });

  it("should retrieve a snippet by id", async () => {
    const text = "Another test snippet";
    const created = await snippetService.createSnippet(text);

    const retrieved = await snippetService.getSnippet(created.id);

    expect(retrieved).toEqual(created);
  });

  it("should get all snippets", async () => {
    await snippetService.createSnippet("First snippet");
    await new Promise((resolve) => setTimeout(resolve, 10)); // Ensure different timestamps
    await snippetService.createSnippet("Second snippet");

    const allSnippets = await snippetService.getAllSnippets();

    expect(allSnippets).toHaveLength(2);
    expect(allSnippets[0].text).toBe("Second snippet");
    expect(allSnippets[1].text).toBe("First snippet");
  });
});
