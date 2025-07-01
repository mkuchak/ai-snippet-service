import { randomUUID } from "node:crypto";
import { MongoClient } from "mongodb";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { env } from "../../config/env";
import type { Snippet } from "../../core/types/snippet";
import { MongoDBSnippetDAO } from "./mongodb-snippet-dao";

const createdTestDatabases: string[] = [];
let globalClient: MongoClient;

const createUniqueDAO = (): { dao: MongoDBSnippetDAO; dbName: string } => {
  const uniqueDbName = `${env.MONGODB_DATABASE_DEV}-${randomUUID()}`;
  createdTestDatabases.push(uniqueDbName);
  const dao = new MongoDBSnippetDAO(globalClient, uniqueDbName);
  return { dao, dbName: uniqueDbName };
};

describe("MongoDBSnippetDAO", () => {
  const mongoUrl = env.MONGODB_URI;

  beforeAll(async () => {
    globalClient = new MongoClient(mongoUrl);
    await globalClient.connect();
  });

  afterAll(async () => {
    if (globalClient && createdTestDatabases.length > 0) {
      for (const dbName of createdTestDatabases) {
        try {
          await globalClient.db(dbName).dropDatabase();
        } catch (error) {
          console.warn(`Failed to drop database ${dbName}:`, error);
        }
      }

      createdTestDatabases.length = 0;
    }

    if (globalClient) {
      await globalClient.close();
    }
  });

  describe("create", () => {
    it("should create a new snippet", async () => {
      const { dao } = createUniqueDAO();

      const data = {
        text: `Artificial intelligence is transforming the way we work and live. From automated customer service to predictive analytics, AI is becoming an integral part of modern business operations.`,
        summary: `AI transformation in business and daily life`,
      };

      const result = await dao.create(data);

      expect(result).toMatchObject({
        text: data.text,
        summary: data.summary,
      });
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("findById", () => {
    it("should find a snippet by id", async () => {
      const { dao } = createUniqueDAO();

      const data = {
        text: "Climate change is one of the most pressing challenges of our time. Rising global temperatures, melting ice caps, and extreme weather events are becoming more frequent.",
        summary: "Climate change challenges and impacts",
      };

      const created = await dao.create(data);
      const found = await dao.findById(created.id);

      expect(found).toEqual(created);
    });

    it("should return null for non-existent id", async () => {
      const { dao } = createUniqueDAO();
      const result = await dao.findById("000000000000000000000000");
      expect(result).toBeNull();
    });

    it("should return null for invalid id format", async () => {
      const { dao } = createUniqueDAO();
      const result = await dao.findById("invalid-id");
      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return all snippets ordered by creation date (newest first)", async () => {
      const { dao } = createUniqueDAO();

      const data1 = {
        text: "The benefits of regular exercise extend far beyond physical fitness. Studies show that consistent physical activity improves mental health, cognitive function, and overall quality of life.",
        summary: "Exercise benefits for physical and mental health",
      };
      const data2 = {
        text: "Sustainable energy sources like solar and wind power are becoming increasingly cost-effective. Many countries are investing heavily in renewable infrastructure to reduce carbon emissions.",
        summary: "Growth of sustainable energy and renewable infrastructure",
      };

      const snippet1 = await dao.create(data1);
      const snippet2 = await dao.create(data2);

      const results = await dao.findAll();

      expect(results).toHaveLength(2);

      // Verify results are sorted by createdAt descending (newest first)
      expect(results[0].createdAt.getTime()).toBeGreaterThanOrEqual(
        results[1].createdAt.getTime(),
      );

      // Verify all expected snippets are present
      const resultIds = results.map((r: Snippet) => r.id).sort();
      const expectedIds = [snippet1.id, snippet2.id].sort();
      expect(resultIds).toEqual(expectedIds);
    });

    it("should return empty array when no snippets exist", async () => {
      const { dao } = createUniqueDAO();
      const results = await dao.findAll();
      expect(results).toEqual([]);
    });
  });

  describe("update", () => {
    it("should update an existing snippet", async () => {
      const { dao } = createUniqueDAO();

      const data = {
        text: "Remote work has become increasingly popular in recent years. Many companies are adopting flexible work arrangements to attract and retain talent.",
        summary: "Rise of remote work trends",
      };

      const created = await dao.create(data);
      const updateData = {
        text: "Remote work has revolutionized the modern workplace. Companies worldwide are embracing hybrid models that combine office and home-based work for maximum flexibility.",
        summary: "Remote work revolutionizing workplace flexibility",
      };

      const updated = await dao.update(created.id, updateData);

      expect(updated).toMatchObject({
        id: created.id,
        text: updateData.text,
        summary: updateData.summary,
        createdAt: created.createdAt,
      });
      expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(
        created.updatedAt.getTime(),
      );
    });

    it("should partially update a snippet", async () => {
      const { dao } = createUniqueDAO();

      const data = {
        text: "Digital marketing strategies are evolving rapidly with new platforms and technologies emerging constantly.",
        summary: "Evolution of digital marketing strategies",
      };

      const created = await dao.create(data);
      const updateData = {
        text: "Digital marketing has transformed completely with social media, AI-powered analytics, and personalized content becoming essential for business success.",
      };

      const updated = await dao.update(created.id, updateData);

      expect(updated).toMatchObject({
        id: created.id,
        text: updateData.text,
        summary: created.summary, // Should remain unchanged
        createdAt: created.createdAt,
      });
    });

    it("should return null for non-existent id", async () => {
      const { dao } = createUniqueDAO();
      const result = await dao.update("000000000000000000000000", {
        text: "updated",
      });
      expect(result).toBeNull();
    });

    it("should return null for invalid id format", async () => {
      const { dao } = createUniqueDAO();
      const result = await dao.update("invalid-id", { text: "updated" });
      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete an existing snippet", async () => {
      const { dao } = createUniqueDAO();

      const data = {
        text: "Space exploration continues to push the boundaries of human knowledge. Recent missions to Mars and the development of reusable rockets are opening new possibilities for interplanetary travel.",
        summary: "Advances in space exploration and Mars missions",
      };

      const created = await dao.create(data);
      const deleted = await dao.delete(created.id);

      expect(deleted).toBe(true);

      const found = await dao.findById(created.id);
      expect(found).toBeNull();
    });

    it("should return false for non-existent id", async () => {
      const { dao } = createUniqueDAO();
      const result = await dao.delete("000000000000000000000000");
      expect(result).toBe(false);
    });

    it("should return false for invalid id format", async () => {
      const { dao } = createUniqueDAO();
      const result = await dao.delete("invalid-id");
      expect(result).toBe(false);
    });
  });
});
