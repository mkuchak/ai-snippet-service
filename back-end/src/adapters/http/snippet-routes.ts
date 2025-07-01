import { Router } from "express";
import { SnippetControllers } from "./snippet-controllers";
import { SnippetService } from "../../core/services/snippet-service";
import { InMemorySnippetDAO } from "../database/in-memory-snippet-dao";
import { GeminiGateway } from "../ai/gemini-gateway";

export function createSnippetRoutes(): Router {
  const dao = new InMemorySnippetDAO();
  const aiService = new GeminiGateway();
  const snippetService = new SnippetService(dao, aiService);
  const controllers = new SnippetControllers(snippetService);

  const router = Router();
  router.post("/snippets", (req, res) => controllers.createSnippet(req, res));
  router.get("/snippets/:id", (req, res) => controllers.getSnippet(req, res));
  router.get("/snippets", (req, res) => controllers.getAllSnippets(req, res));

  return router;
}
