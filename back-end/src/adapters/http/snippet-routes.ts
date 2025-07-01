import { Router } from "express";
import { SnippetService } from "../../core/services/snippet-service";
import { SnippetControllers } from "./snippet-controllers";

export function createSnippetRoutes(snippetService: SnippetService): Router {
  const router = Router();
  const controllers = new SnippetControllers(snippetService);
  router.post("/snippets", (req, res) => controllers.createSnippet(req, res));
  router.get("/snippets/:id", (req, res) => controllers.getSnippet(req, res));
  router.get("/snippets", (req, res) => controllers.getAllSnippets(req, res));
  return router;
}
