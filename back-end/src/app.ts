import cors from "cors";
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import { InMemorySnippetDAO } from "./adapters/database/in-memory-snippet-dao";
import { SnippetService } from "./core/services/snippet-service";
import { createSnippetRoutes } from "./adapters/http/snippet-routes";
import { env } from "./config/env";
import { MockAIGateway } from "./adapters/ai/mock-ai-gateway";

dotenv.config();

/*
 * Setup dependencies
 * Note: We could use a DI container like 'inversify' or 'awilix'
 * for better testability and loose coupling in production apps.
 */
const dao = new InMemorySnippetDAO();
const aiService = new MockAIGateway();
const snippetService = new SnippetService(dao, aiService);

function startApp() {
  const app = express(); // Express could be a complete adapter, supporting different RESTful API routing frameworks

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(createSnippetRoutes(snippetService));

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "healthy",
      database: "not connected yet",
      timestamp: new Date().toISOString(),
    });
  });

  app.listen(env.PORT, () => {
    console.log(`🚀 Server is running on port ${env.PORT}`);
    console.log(`📊 MongoDB URI: ${env.MONGODB_URI}`);
  });
}

startApp();
