import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { MockAIGateway } from "./adapters/ai/mock-ai-gateway";
import { InMemorySnippetDAO } from "./adapters/database/in-memory-snippet-dao";
import { createSnippetRoutes } from "./adapters/http/snippet-routes";
import { SnippetService } from "./core/services/snippet-service";

function createTestApp() {
  const dao = new InMemorySnippetDAO();
  const aiGateway = new MockAIGateway();
  const snippetService = new SnippetService(dao, aiGateway);
  const app = express();
  app.use(express.json());
  app.use(createSnippetRoutes(snippetService));
  return app;
}

const app = createTestApp();

describe("Snippet API", () => {
  it("should create a snippet", async () => {
    const createResponse = await request(app)
      .post("/snippets")
      .send({ text: "Hello world" })
      .expect(201);

    expect(createResponse.body).toHaveProperty("id");
    expect(createResponse.body.text).toBe("Hello world");
    expect(createResponse.body).toHaveProperty("summary");
  });

  it("should get a snippet by ID", async () => {
    const createResponse = await request(app)
      .post("/snippets")
      .send({ text: "Test snippet" })
      .expect(201);
    const snippetId = createResponse.body.id;

    const getResponse = await request(app)
      .get(`/snippets/${snippetId}`)
      .expect(200);

    expect(getResponse.body.id).toBe(snippetId);
    expect(getResponse.body.text).toBe("Test snippet");
  });

  it("should stream summary generation", async () => {
    const createResponse = await request(app)
      .post("/snippets")
      .send({ text: "Test streaming content" })
      .expect(201);
    const snippetId = createResponse.body.id;

    const streamResponse = await request(app)
      .get(`/snippets/${snippetId}/generate-summary`)
      .expect(200);

    expect(streamResponse.headers["content-type"]).toBe("text/event-stream");
    expect(streamResponse.headers["cache-control"]).toBe("no-cache");
    expect(streamResponse.headers.connection).toBe("keep-alive");
    expect(streamResponse.text).toContain("data:");
    expect(streamResponse.text).toContain("event: complete");
  });

  it("should list all snippets", async () => {
    await request(app)
      .post("/snippets")
      .send({ text: "First snippet" })
      .expect(201);

    const listResponse = await request(app).get("/snippets").expect(200);

    expect(Array.isArray(listResponse.body)).toBe(true);
    expect(listResponse.body.length).toBeGreaterThan(0);
  });

  it("should return 400 for missing text", async () => {
    await request(app).post("/snippets").send({}).expect(400);
  });

  it("should return 404 for non-existent snippet", async () => {
    await request(app).get("/snippets/non-existent").expect(404);
  });
});
