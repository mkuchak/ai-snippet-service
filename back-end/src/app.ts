import cors from "cors";
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import { MongoClient } from "mongodb";
import { GeminiGateway } from "./adapters/ai/gemini-gateway";
import { MongoDBSnippetDAO } from "./adapters/database/mongodb-snippet-dao";
import { createSnippetRoutes } from "./adapters/http/snippet-routes";
import { env } from "./config/env";
import { SnippetService } from "./core/services/snippet-service";

dotenv.config();

const API_PREFIX = "/api/v1";

async function startApp() {
  try {
    const client = new MongoClient(env.MONGODB_URI);
    await client.connect();

    /*
     * Setup dependencies
     * Note: We could use a DI container like 'inversify' or 'awilix'
     * for better testability and loose coupling in production apps.
     */
    const dao = new MongoDBSnippetDAO(client, env.MONGODB_DATABASE);
    const aiService = new GeminiGateway();
    const snippetService = new SnippetService(dao, aiService);

    /*
     * Express could be a complete adapter, creating a port adapter
     * supporting different RESTful API routing frameworks
     */
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(API_PREFIX, createSnippetRoutes(snippetService));

    app.get("/api/health", (_req: Request, res: Response) => {
      res.json({ status: "healthy", timestamp: new Date().toISOString() });
    });

    app.listen(env.PORT, () =>
      console.log(`🚀 Server is running on port ${env.PORT}`),
    );
  } catch (error) {
    console.error("❌ Failed to start application:", error);
    process.exit(1);
  }
}

startApp();
