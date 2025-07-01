import { describe, it, expect, beforeEach } from "vitest";
import { InMemorySnippetRepository } from "./in-memory-snippet-repository";

describe("InMemorySnippetRepository", () => {
  let repository: InMemorySnippetRepository;

  beforeEach(() => {
    repository = new InMemorySnippetRepository();
    repository.clear(); // Clear the singleton instance for test isolation
  });

  it("should be a singleton", () => {
    const repo1 = new InMemorySnippetRepository();
    const repo2 = new InMemorySnippetRepository();
    expect(repo1).toBe(repo2);
  });

  it("should create and find snippets", async () => {
    const data = { text: "test code", summary: "test summary" };
    const created = await repository.create(data);

    expect(created.id).toBeDefined();
    expect(created.text).toBe(data.text);
    expect(created.summary).toBe(data.summary);

    const found = await repository.findById(created.id);
    expect(found).toEqual(created);
  });

  it("should return all snippets sorted by newest first", async () => {
    await repository.create({ text: "first", summary: "First" });
    await new Promise(resolve => setTimeout(resolve, 1));
    await repository.create({ text: "second", summary: "Second" });

    const all = await repository.findAll();
    expect(all).toHaveLength(2);
    expect(all[0].text).toBe("second");
    expect(all[1].text).toBe("first");
  });

  it("should update existing snippets", async () => {
    const created = await repository.create({ text: "original", summary: "Original" });
    await new Promise(resolve => setTimeout(resolve, 1));
    const updated = await repository.update(created.id, { text: "updated" });

    expect(updated?.text).toBe("updated");
    expect(updated?.summary).toBe("Original");
    expect(updated?.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime());
  });

  it("should delete snippets", async () => {
    const created = await repository.create({ text: "to delete", summary: "Delete me" });
    expect(repository.count()).toBe(1);

    const deleted = await repository.delete(created.id);
    expect(deleted).toBe(true);
    expect(repository.count()).toBe(0);
  });

  it("should handle non-existent operations", async () => {
    expect(await repository.findById("fake-id")).toBeNull();
    expect(await repository.update("fake-id", { text: "new" })).toBeNull();
    expect(await repository.delete("fake-id")).toBe(false);
  });
}); 