import type { Request, Response } from "express";
import type { SnippetService } from "../../core/services/snippet-service";

export class SnippetControllers {
  constructor(private snippetService: SnippetService) {}

  createSnippet = async (req: Request, res: Response) => {
    try {
      const { text } = req.body;
      if (!text) {
        res.status(400).json({ error: "text is required" });
        return;
      }
      const snippet = await this.snippetService.createSnippet(text);
      res.status(201).json({
        id: snippet.id,
        text: snippet.text,
        summary: snippet.summary,
      });
    } catch (error) {
      console.error("Failed to create snippet", error);
      res.status(500).json({ error: "Failed to create snippet" });
    }
  };

  createSnippetWithoutSummarize = async (req: Request, res: Response) => {
    try {
      const { text } = req.body;
      if (!text) {
        res.status(400).json({ error: "text is required" });
        return;
      }
      const snippet =
        await this.snippetService.createSnippetWithoutSummary(text);
      res.status(201).json({
        id: snippet.id,
        text: snippet.text,
        summary: snippet.summary,
      });
    } catch (error) {
      console.error("Failed to create snippet", error);
      res.status(500).json({ error: "Failed to create snippet" });
    }
  };

  generateSummaryWithStreaming = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const snippet = await this.snippetService.getSnippet(id);
      if (!snippet) {
        res.status(404).json({ error: "Snippet not found" });
        return;
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      await this.snippetService.generateAndSaveSummaryWithStreaming(id, {
        onChunk: (chunk) => {
          res.write(`data: ${chunk}\n\n`);
        },
        onComplete: () => {
          res.write("event: complete\ndata: \n\n");
          res.end();
        },
        onError: (error) => {
          res.write(`event: error\ndata: ${error.message}\n\n`);
          res.end();
        },
      });
    } catch (error) {
      console.error("Failed to generate summary with streaming", error);
      if (!res.headersSent) {
        res
          .status(500)
          .json({ error: "Failed to generate summary with streaming" });
      }
    }
  };

  getSnippet = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const snippet = await this.snippetService.getSnippet(id);
      if (!snippet) {
        res.status(404).json({ error: "Snippet not found" });
        return;
      }
      res.json({
        id: snippet.id,
        text: snippet.text,
        summary: snippet.summary,
      });
    } catch (error) {
      console.error("Failed to get snippet", error);
      res.status(500).json({ error: "Failed to get snippet" });
    }
  };

  getAllSnippets = async (_req: Request, res: Response) => {
    try {
      const snippets = await this.snippetService.getAllSnippets();
      res.json(
        snippets.map((snippet) => ({
          id: snippet.id,
          text: snippet.text,
          summary: snippet.summary,
        })),
      );
    } catch (error) {
      console.error("Failed to get snippets", error);
      res.status(500).json({ error: "Failed to get snippets" });
    }
  };
}
