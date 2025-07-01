import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import { createSnippetRoutes } from "./adapters/http/snippet-routes";
import { SnippetService } from "./core/services/snippet-service";
import { InMemorySnippetDAO } from "./adapters/database/in-memory-snippet-dao";
import { MockAIGateway } from "./adapters/ai/mock-ai-gateway";

const dao = new InMemorySnippetDAO();
const aiService = new MockAIGateway();
const snippetService = new SnippetService(dao, aiService);

const app = express();
app.use(express.json());
app.use("/api", createSnippetRoutes(snippetService));

describe("Snippet API", () => {
  it("should create, get, and list snippets", async () => {
    // Create a snippet
    const createResponse = await request(app)
      .post("/api/snippets")
      .send({ text: "Hello world" })
      .expect(201);

    expect(createResponse.body).toHaveProperty("id");
    expect(createResponse.body.text).toBe("Hello world");
    expect(createResponse.body).toHaveProperty("summary");

    const snippetId = createResponse.body.id;

    // Get the snippet by ID
    const getResponse = await request(app)
      .get(`/api/snippets/${snippetId}`)
      .expect(200);

    expect(getResponse.body.id).toBe(snippetId);
    expect(getResponse.body.text).toBe("Hello world");

    // Get all snippets
    const listResponse = await request(app)
      .get("/api/snippets")
      .expect(200);

    expect(Array.isArray(listResponse.body)).toBe(true);
    expect(listResponse.body.length).toBe(1);
    expect(listResponse.body[0].id).toBe(snippetId);
  });

  it("should return 400 for missing text", async () => {
    await request(app)
      .post("/api/snippets")
      .send({})
      .expect(400);
  });

  it("should return 404 for non-existent snippet", async () => {
    await request(app)
      .get("/api/snippets/non-existent")
      .expect(404);
  });
}); 