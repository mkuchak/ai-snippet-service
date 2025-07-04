import { beforeEach, describe, expect, it } from "vitest";
import { InMemorySnippetDAO } from "./in-memory-snippet-dao";

describe("InMemorySnippetDAO", () => {
  let dao: InMemorySnippetDAO;

  beforeEach(() => {
    dao = new InMemorySnippetDAO();
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
    const first = await dao.create({ text: "first", summary: "First" });
    const second = await dao.create({ text: "second", summary: "Second" });

    const all = await dao.findAll();
    expect(all).toHaveLength(2);

    const firstInList = all.find((s) => s.id === first.id);
    const secondInList = all.find((s) => s.id === second.id);

    expect(firstInList).toBeDefined();
    expect(secondInList).toBeDefined();
    expect(all).toContain(firstInList);
    expect(all).toContain(secondInList);
  });

  it("should update existing snippets", async () => {
    const created = await dao.create({ text: "original", summary: "Original" });
    const updated = await dao.update(created.id, { text: "updated" });

    expect(updated?.text).toBe("updated");
    expect(updated?.summary).toBe("Original");
    expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(
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
