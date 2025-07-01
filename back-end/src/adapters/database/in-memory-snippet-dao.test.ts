import { beforeEach, describe, expect, it } from "vitest";
import { InMemorySnippetDAO } from "./in-memory-snippet-dao";

describe("InMemorySnippetDAO", () => {
  let dao: InMemorySnippetDAO;

  beforeEach(() => {
    dao = new InMemorySnippetDAO();
    dao.clear(); // Clear the singleton instance for test isolation
  });

  it("should be a singleton", () => {
    const dao1 = new InMemorySnippetDAO();
    const dao2 = new InMemorySnippetDAO();
    expect(dao1).toBe(dao2);
  });

  it("should create and find snippets", async () => {
    const data = { text: "test code", summary: "test summary" };
    const created = await dao.create(data);

    expect(created.id).toBeDefined();
    expect(created.text).toBe(data.text);
    expect(created.summary).toBe(data.summary);

    const found = await dao.findById(created.id);
    expect(found).toEqual(created);
  });

  it("should return all snippets sorted by newest first", async () => {
    await dao.create({ text: "first", summary: "First" });
    await new Promise((resolve) => setTimeout(resolve, 1));
    await dao.create({ text: "second", summary: "Second" });

    const all = await dao.findAll();
    expect(all).toHaveLength(2);
    expect(all[0].text).toBe("second");
    expect(all[1].text).toBe("first");
  });

  it("should update existing snippets", async () => {
    const created = await dao.create({ text: "original", summary: "Original" });
    await new Promise((resolve) => setTimeout(resolve, 1));
    const updated = await dao.update(created.id, { text: "updated" });

    expect(updated?.text).toBe("updated");
    expect(updated?.summary).toBe("Original");
    expect(updated?.updatedAt.getTime()).toBeGreaterThan(
      created.updatedAt.getTime(),
    );
  });

  it("should delete snippets", async () => {
    const created = await dao.create({
      text: "to delete",
      summary: "Delete me",
    });
    expect(dao.count()).toBe(1);

    const deleted = await dao.delete(created.id);
    expect(deleted).toBe(true);
    expect(dao.count()).toBe(0);
  });

  it("should handle non-existent operations", async () => {
    expect(await dao.findById("fake-id")).toBeNull();
    expect(await dao.update("fake-id", { text: "new" })).toBeNull();
    expect(await dao.delete("fake-id")).toBe(false);
  });
});
